<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
<template>
  <Navbar />
  <div style="min-height: calc(100vh - 68px); max-height: calc(100vh - 68px); overflow-y: auto;">
    <RouterView />
  </div>
</template>
