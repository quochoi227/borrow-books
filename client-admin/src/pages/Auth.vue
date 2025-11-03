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
  <div className="min-h-screen w-full bg-[#020617] relative">
    <div
      className="absolute inset-0 z-0"
      :style="{
        background: '#020617',
        backgroundImage: `
          linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
        `,
        backgroundSize: '32px 32px, 32px 32px, 100% 100%'
      }"
    >
      <div class="w-full h-screen flex items-center justify-center">
        <div class="min-w-lg">
          <Login v-if="route.path.includes('/login')" />
          <Register v-if="route.path.includes('/register')" />
        </div>
      </div>
    </div>
  </div>
</template>
