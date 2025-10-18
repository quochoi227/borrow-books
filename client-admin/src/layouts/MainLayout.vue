<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { useBookStore } from '@/stores/bookStore'
import { onMounted } from 'vue'

const bookStore = useBookStore()

onMounted(() => {
  bookStore.fetchBooks()
})
</script>
<template>
  <div class="flex bg-[#f5f5f5]">
    <Sidebar />
    <div class="flex-1">
      <Navbar />
      <div style="min-height: calc(100vh - 64px); max-height: calc(100vh - 64px); overflow-y: auto; background-color: #fff">
        <RouterView />
      </div>
    </div>
  </div>
</template>
