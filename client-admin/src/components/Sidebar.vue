<script setup>
import book_icon from '@/assets/images/book-svgrepo-com.svg'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

// const sidebarItemClassess = 'gap-3 text-[16px] text-gray-600'
const sidebarItemClassess = computed(() => {
  return `text-[16px] gap-3 text-gray-500 flex ${isOpen.value ? 'justify-start' : 'justify-center'}`
})
// const activeItemClasses = 'menu-active'
const activeItemClasses = 'bg-primary text-white'
const isOpen = ref(true)
</script>
<template>
  <div :style="{ width: isOpen ? '270px' : '80px', minWidth: isOpen ? '270px' : '80px' }" class="bg-white transition-all duration-300 flex flex-col select-none">
    <div class="py-2 px-4 max-h-[70px] overflow-hidden flex items-center justify-center gap-3">
      <img width="44px" :src="book_icon" alt="Logo">
      <div v-if="isOpen">
        <h1 class="text-lg font-bold text-primary">BORROWEE</h1>
        <!-- <p>Mượn sách dễ dàng</p> -->
      </div>
    </div>
    <div class="mt-4">
      <ul class="menu gap-1 w-full cursor-pointer">
        <router-link to="/dashboard">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/dashboard' }]">
              <font-awesome-icon icon="fa-solid fa-chart-line" class="text-xl" />
              <p v-if="isOpen" class="whitespace-nowrap">Dashboard</p>
            </span>
          </li>
        </router-link>
        <router-link to="/quan-ly-sach">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/quan-ly-sach' }]">
              <font-awesome-icon icon="fa-solid fa-book" class="text-xl" />
              <p v-if="isOpen" class="whitespace-nowrap">Quản lý sách</p>
            </span>
          </li>
        </router-link>
        <router-link to="/quan-ly-muon-sach">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/quan-ly-muon-sach' }]">
              <font-awesome-icon icon="fa-solid fa-hand" class="text-xl" />
              <p v-if="isOpen" class="whitespace-nowrap">Quản lý mượn sách</p>
            </span>
          </li>
        </router-link>
        <router-link to="/nha-xuat-ban">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/nha-xuat-ban' }]">
              <font-awesome-icon icon="fa-solid fa-house-user" class="text-xl" />
              <p v-if="isOpen" class="whitespace-nowrap">Nhà xuất bản</p>
            </span>
          </li>
        </router-link>
      </ul>
      <!-- <ul class="cursor-pointer">
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
      </ul> -->
    </div>
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
