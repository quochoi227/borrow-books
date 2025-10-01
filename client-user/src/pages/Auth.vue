<script setup>
import { useRoute, useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

if (userStore.currentActiveUser) {
  router.replace('/home')
}
</script>
<template>
  <div class="w-full h-screen bg-gradient-to-r from-indigo-500 to-indigo-700 p-6">
    <Login v-if="route.path.includes('/login')" />
    <Register v-if="route.path.includes('/register')" />
  </div>
</template>
