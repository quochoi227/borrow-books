<script setup>
import book_icon from '@/assets/images/book-svgrepo-com.svg'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const sidebarItemClassess = 'flex items-center max-h-[40px] overflow-hidden gap-4 px-2 py-3 text-[#99a1af]  hover:text-white hover:bg-[#1c2433] rounded-lg transition-colors duration-200'
const activeClasses = 'text-white bg-[#1c2433] rounded-lg'

const isOpen = ref(true)
</script>
<template>
  <div :style="{ width: isOpen ? '270px' : '80px', minWidth: isOpen ? '270px' : '80px' }" class=" transition-all duration-300 flex flex-col bg-[#101828] select-none">
    <div class="py-2 px-4 max-h-[70px] bg-[#1c2433] overflow-hidden flex items-center justify-center gap-3">
      <img width="44px" :src="book_icon" alt="Logo">
      <div v-if="isOpen">
        <h1 class="text-lg font-bold text-primary">BORROWEE</h1>
        <!-- <p>Mượn sách dễ dàng</p> -->
      </div>
    </div>
    <ul class="px-4 cursor-pointer text-[#3C3C3CB3] mt-4">
      <router-link to="/dashboard">
        <li :style="{ justifyContent: isOpen ? 'flex-start' : 'center' }" :class="[sidebarItemClassess, { [activeClasses]: route.path === '/dashboard' }]">
          <font-awesome-icon icon="fa-solid fa-chart-line" class="text-xl" />
          <p v-if="isOpen" class="whitespace-nowrap">Dashboard</p>
        </li>
      </router-link>
      <router-link to="/quan-ly-sach">
        <li :style="{ justifyContent: isOpen ? 'flex-start' : 'center' }" :class="[sidebarItemClassess, 'mt-1', { [activeClasses]: route.path === '/quan-ly-sach' }]">
          <font-awesome-icon icon="fa-solid fa-book" class="text-xl" />
          <p v-if="isOpen" class="whitespace-nowrap">Quản lý sách</p>
        </li>
      </router-link>
      <router-link to="/quan-ly-muon-sach">
        <li :style="{ justifyContent: isOpen ? 'flex-start' : 'center' }" :class="[sidebarItemClassess, 'mt-1', { [activeClasses]: route.path === '/quan-ly-muon-sach' }]">
          <font-awesome-icon icon="fa-solid fa-hand" class="text-xl" />
          <p v-if="isOpen" class="whitespace-nowrap">Quản lý mượn sách</p>
        </li>
      </router-link>
      <router-link to="/nha-xuat-ban">
        <li :style="{ justifyContent: isOpen ? 'flex-start' : 'center' }" :class="[sidebarItemClassess, 'mt-1', { [activeClasses]: route.path === '/nha-xuat-ban' }]">
          <font-awesome-icon icon="fa-solid fa-house-user" class="text-xl" />
          <p v-if="isOpen" class="whitespace-nowrap">Nhà xuất bản</p>
        </li>
      </router-link>
    </ul>
    <div @click="isOpen = !isOpen" class="mt-auto w-full py-3 flex justify-center cursor-pointer">
      <button v-if="isOpen" class="btn btn-circle">
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
      </button>
      <button v-else class="btn btn-circle">
        <font-awesome-icon icon="fa-solid fa-arrow-right" />
      </button>
    </div>
  </div>
</template>
