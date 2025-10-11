<script setup>
import { useUserStore } from '@/stores/userStore'
import book_icon from '@/assets/images/book-svgrepo-com.svg'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const { currentActiveUser } = storeToRefs(userStore)
const { logoutUserAPI } = userStore

const handleLogout = () => {
  logoutUserAPI()
}

const navItemClasses = 'px-2 text-gray-500 hover:text-gray-800 transition-color duration-200 min-h-[68px] max-h-[68px] flex items-center justify-center'
const activeItemClasses = 'bg-primary text-white'
</script>
<template>
  <div class="border-b w-full border-base-300">
    <!-- <svg preserveAspectRatio="none" class="absolute w-full h-full top-0 left-0 z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg> -->
    <div class="navbar px-0 min-h-[68px] max-h-[68px] max-w-[1200px] mx-auto z-10">
      <div class="flex items-center navbar-start">
        <div class="flex items-center gap-2">
          <img width="44px" :src="book_icon" alt="Logo">
          <button class="btn">
            <h2 class="text-xl font-bold text-main">BORROWEE</h2>
            <!-- <p class="text-sm whitespace-nowrap">Mượn sách dễ dàng</p> -->
          </button>
        </div>
      </div>
      <ul class="menu menu-horizontal gap-2 navbar-center">
        <RouterLink to="/home">
          <li>
            <span :class="[{ [activeItemClasses]: route.path === '/home' }]">
              Trang chủ
            </span>
          </li>
        </RouterLink>
        <RouterLink to="/borrowing-history">
          <li>
            <span :class="[{ [activeItemClasses]: route.path === '/borrowing-history' }]">
              Lịch sử mượn sách
            </span>
          </li>
        </RouterLink>
      </ul>
      <div class="navbar-end">
        <div class="dropdown dropdown-end ml-4">
          <div tabindex="0" role="button" class="flex items-center gap-1 select-none cursor-pointer">
            <!-- <img class="w-10 h-10 rounded-full"
              alt="User avatar"
              src="https://res.cloudinary.com/dkg5xoyc0/image/upload/v1754622134/users/kyvpixqhyja3pcjq8rll.png" /> -->
            <div class="whitespace-nowrap text-sm">{{ currentActiveUser?.hoLot + ' ' + currentActiveUser?.ten }}</div>
            <font-awesome-icon icon="fa-solid fa-chevron-down" />
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li @click="handleLogout"><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
