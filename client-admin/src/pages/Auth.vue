<script setup>
import { useRoute, useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import { useAdminStore } from '@/stores/adminStore'
import auth_bg from '@/assets/images/login_register_bg.jpg'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

if (adminStore.currentActiveAdmin) {
  router.replace('/')
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
