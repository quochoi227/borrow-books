<script setup>
import { useRoute } from 'vue-router'
import book_icon from '@/assets/images/book-svgrepo-com.svg'
const route = useRoute()

const activeClasses = 'text-main border-main border-y-2 border-t-transparent'
</script>
<template>
  <div class="p-2 min-h-[68px] max-h-[68px]">
    <div class="navbar justify-between px-5 py-3 p-0 bg-base-100 shadow-sm text-text-primary text-[13px] font-[500] rounded">
      <!-- <font-awesome-icon icon="fa-solid fa-bell" class="text-lg cursor-pointer" /> -->
      <div class="badge badge-soft badge-primary">Nhân viên</div>
      <button class="btn btn-ghost">Đăng xuất</button>
    </div>
  </div>
</template>
