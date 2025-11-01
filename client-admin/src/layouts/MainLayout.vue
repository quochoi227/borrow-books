<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>
<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Navbar />
      <div style="min-height: calc(100vh - 64px); max-height: calc(100vh - 64px); overflow-y: auto">
        <RouterView />
      </div>
    </div>
  </div>
</template>
