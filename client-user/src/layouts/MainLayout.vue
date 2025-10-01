<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>
<template>
  <Navbar />
  <div class="w-full flex">
    <Sidebar />
    <RouterView />
  </div>
</template>
