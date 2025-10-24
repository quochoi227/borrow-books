<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>
<template>
  <Navbar />
  <div class="flex">
    <Sidebar />
    <RouterView />
  </div>
</template>
