import axios from 'axios'
// import { toast } from 'vue3-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from '@/apis'
import { useUserStore } from '@/stores/userStore'

import { useToast } from '@/composables/useToast'
const toast = useToast()

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)

    if (error.response?.status === 401) {
      useUserStore().logoutUserAPI()
    }

    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            return data?.accessToken
          })
          .catch((_error) => {
            useUserStore().logoutUserAPI()
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then((accessToken) => {
        return authorizedAxiosInstance(originalRequests)
      })
    }

    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)
export default authorizedAxiosInstance
