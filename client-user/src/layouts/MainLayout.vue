<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>
<template>
  <Navbar />
  <div class="h-[68px]"></div>
  <div class="flex">
    <Sidebar />
    <RouterView />
  </div>
</template>
