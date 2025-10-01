import { defineStore } from 'pinia'
import { loginAPI, logoutAPI } from '@/apis'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentActiveUser: null
  }),
  getters: {
    getUser: (state) => state.currentActiveUser
  },
  actions: {
    async loginUserAPI(data) {
      try {
        const user = await loginAPI(data)
        this.currentActiveUser = user
        return user
      } catch (error) {
        throw error
      }
    },
    async logoutUserAPI() {
      try {
        const data = await logoutAPI()
        this.currentActiveUser = null
        return data
      } catch (error) {
        throw error
      }
    }
  },
  persist: {
    key: 'my-user',
    paths: ['currentActiveUser'], // chỉ lưu phần này
    storage: localStorage // hoặc sessionStorage
  }
})
