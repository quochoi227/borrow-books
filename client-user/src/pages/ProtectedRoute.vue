<script setup>
import { watch } from 'vue';
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

watch(() => userStore.currentActiveUser, (newVal) => {
  if (!newVal) {
    router.push('/login')
  }
}, { immediate: true })
</script>
<template>
  <RouterView />
</template>
