<script setup>
import { watch } from 'vue';
import { useAdminStore } from '@/stores/adminStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminStore = useAdminStore()

watch(() => adminStore.currentActiveAdmin, (newVal) => {
  if (!newVal) {
    router.push('/login')
  }
}, { immediate: true })
</script>
<template>
  <RouterView />
</template>
