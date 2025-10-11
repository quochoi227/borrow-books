import { defineStore } from 'pinia'
import { adminLoginAPI, adminLogoutAPI } from '@/apis'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    currentActiveAdmin: null
  }),
  getters: {
    getUser: (state) => state.currentActiveAdmin
  },
  actions: {
    async loginAdminAPI(data) {
      try {
        const user = await adminLoginAPI(data)
        this.currentActiveAdmin = user
        return user
      } catch (error) {
        throw error
      }
    },
    async logoutAdminAPI() {
      try {
        const data = await adminLogoutAPI()
        this.currentActiveAdmin = null
        return data
      } catch (error) {
        throw error
      }
    }
  },
  persist: {
    key: 'my-admin',
    paths: ['currentActiveAdmin'], // chỉ lưu phần này
    storage: localStorage // hoặc sessionStorage
  }
})
