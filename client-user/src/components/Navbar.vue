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
const activeItemClasses = 'font-semibold text-main hover:text-main'
</script>
<template>
  <div class="navbar py-3 min-h-[68px] max-h-[68px] shadow-sm">
    <div class="flex justify-between w-full px-6">
      <div class="flex items-center">
        <div class="flex items-center gap-2">
          <img width="44px" :src="book_icon" alt="Logo">
          <div>
            <h2 class="text-xl font-semibold text-main">BORROWEE</h2>
            <p class="text-sm whitespace-nowrap">Mượn sách dễ dàng</p>
          </div>
        </div>
        <label class="input ml-14">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          <input type="search" required placeholder="Search" />
        </label>
      </div>
      <div class="flex gap-2 items-center">
        <ul class="flex gap-6 ml-6 items-center">
          <RouterLink to="/home">
            <li :class="[navItemClasses, { [activeItemClasses]: route.path === '/home' }]">
              Trang chủ
            </li>
          </RouterLink>
          <RouterLink to="/borrowing-history">
            <li :class="[navItemClasses, { [activeItemClasses]: route.path === '/borrowing-history' }]">
              Lịch sử mượn sách
            </li>
          </RouterLink>
        </ul>
        <div class="dropdown dropdown-end ml-4">
          <div tabindex="0" role="button" class="flex items-center gap-1 select-none cursor-pointer">
            <img class="w-10 h-10 rounded-full"
              alt="User avatar"
              src="https://res.cloudinary.com/dkg5xoyc0/image/upload/v1754622134/users/kyvpixqhyja3pcjq8rll.png" />
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
