<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import ModeSwitcher from './ModeSwitcher.vue'

// Background color changing when scrolling window
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10 // cuộn xuống hơn 10px thì đổi màu
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const { currentActiveUser } = storeToRefs(userStore)
const { logoutUserAPI } = userStore

const handleLogout = async () => {
  await logoutUserAPI()
  router.push('/')
}

const navItemClasses = 'px-2 text-gray-500 hover:text-gray-800 transition-color duration-200 min-h-[68px] max-h-[68px] flex items-center justify-center'
const activeItemClasses = 'menu-active'
</script>
<template>
  <div :class="[isScrolled ? 'bg-white shadow-md' : 'bg-transparent', 'fixed left-0 top-0 right-0 z-10']">
    <!-- <svg preserveAspectRatio="none" class="absolute w-full h-full top-0 left-0 z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg> -->
    <div class="navbar px-0 min-h-[68px] max-h-[68px] max-w-[1200px] mx-auto z-10">
      <div class="flex items-center navbar-start">
        <RouterLink to="/home">
          <button class="btn text-2xl font-[K2D] font-bold text-primary">BORROWEE</button>
        </RouterLink>
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
        <ModeSwitcher />
        <RouterLink v-if="!currentActiveUser" to="/login">
          <button class="btn btn-primary ml-2">Đăng nhập</button>
        </RouterLink>
        <div v-else class="dropdown dropdown-end ml-4">
          <div tabindex="0" role="button" class="flex flex-col items-center gap-1 select-none cursor-pointer">
            <!-- <img class="w-10 h-10 rounded-full"
              alt="User avatar"
              src="https://res.cloudinary.com/dkg5xoyc0/image/upload/v1754622134/users/kyvpixqhyja3pcjq8rll.png" /> -->
            <font-awesome-icon icon="fa-regular fa-user" />
            <div class="whitespace-nowrap text-xs">{{ currentActiveUser?.hoLot + ' ' + currentActiveUser?.ten }}</div>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li @click="handleLogout"><a>Đăng xuất</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
