<script setup>
import { useRoute, useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import { useUserStore } from '@/stores/userStore'
import auth_bg from '@/assets/images/login_register_bg.jpg'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

if (userStore.currentActiveUser) {
  router.replace('/home')
}
</script>
<template>
  <div :style="{ backgroundImage: `url(${auth_bg})`, backgroundSize: 'cover' }" class="w-full h-screen flex items-center justify-center">
    <div class="min-w-lg">
      <Login v-if="route.path.includes('/login')" />
      <Register v-if="route.path.includes('/register')" />
    </div>
  </div>
</template>
