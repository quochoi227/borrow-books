<script setup>
import { useRoute, useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import { useAdminStore } from '@/stores/adminStore'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

if (adminStore.currentActiveAdmin) {
  router.replace('/')
}
</script>
<template>
  <div class="relative min-h-screen w-full bg-[#020617]">
    <div
      class="absolute inset-0 z-0"
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
      <div class="flex h-screen w-full items-center justify-center">
        <div class="min-w-lg">
          <Login v-if="route.path.includes('/login')" />
          <Register v-if="route.path.includes('/register')" />
        </div>
      </div>
    </div>
  </div>
</template>
