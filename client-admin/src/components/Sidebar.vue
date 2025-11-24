<script setup>
import { computed, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { permissions } from '@/config/rbacConfig'
import { usePermission } from '@/composables/usePermission'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
const { chucVu } = toRefs(adminStore.currentActiveAdmin)
const { hasPermission } = usePermission(chucVu?.value)
const route = useRoute()

// const sidebarItemClassess = 'gap-3 text-[16px] text-gray-600'
const sidebarItemClassess = computed(() => {
  return `text-[16px] gap-3 py-3 text-gray-500 flex ${isOpen.value ? 'justify-start' : 'justify-center'}`
})
// const activeItemClasses = 'menu-active'
const activeItemClasses = 'menu-active'
const isOpen = ref(true)
</script>
<template>
  <div :style="{ width: isOpen ? '270px' : '80px', minWidth: isOpen ? '270px' : '80px' }" class="transition-width bg-base-300 duration-300 flex flex-col select-none">
    <div class="py-2 px-4 max-h-[70px] overflow-hidden flex items-center justify-center">
      <div v-if="isOpen">
        <button class="btn text-2xl font-[K2D] font-bold text-primary">BORROWEE</button>
      </div>
      <div v-else="isOpen">
        <button class="btn text-2xl font-[K2D] font-bold text-primary">B</button>
      </div>
    </div>
    <div class="mt-4">
      <ul class="menu gap-1 w-full cursor-pointer">
        <router-link v-if="hasPermission(permissions.VIEW_DASHBOARD) && isOpen" to="/dashboard">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/dashboard' }]">
              <font-awesome-icon icon="fa-solid fa-chart-line" class="text-xl" />
              <p class="whitespace-nowrap">Dashboard</p>
            </span>
          </li>
        </router-link>
        <div v-else-if="hasPermission(permissions.VIEW_DASHBOARD)" data-tip="Dashboard" class="tooltip tooltip-right">
          <router-link to="/dashboard">
            <li>
              <span class="py-3" :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/dashboard' }]">
                <font-awesome-icon icon="fa-solid fa-chart-line" class="text-xl" />
              </span>
            </li>
          </router-link>
        </div>
        <router-link v-if="hasPermission(permissions.VIEW_BOOKS) && isOpen" to="/book-management">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/book-management' }]">
              <font-awesome-icon icon="fa-solid fa-book" class="text-xl" />
              <p class="whitespace-nowrap">Quản lý sách</p>
            </span>
          </li>
        </router-link>
        <div v-else-if="hasPermission(permissions.VIEW_BOOKS)" data-tip="Quản lý sách" class="tooltip tooltip-right">
          <router-link to="/book-management">
            <li>
              <span class="py-3" :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/book-management' }]">
                <font-awesome-icon icon="fa-solid fa-book" class="text-xl" />
              </span>
            </li>
          </router-link>
        </div>
        <router-link v-if="hasPermission(permissions.VIEW_REQUESTS) && isOpen" to="/borrowing-management">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/borrowing-management' }]">
              <font-awesome-icon icon="fa-solid fa-hand" class="text-xl" />
              <p class="whitespace-nowrap">Quản lý mượn sách</p>
            </span>
          </li>
        </router-link>
        <div v-else-if="hasPermission(permissions.VIEW_REQUESTS)" data-tip="Quản lý mượn sách" class="tooltip tooltip-right">
          <router-link to="/borrowing-management">
            <li>
              <span class="py-3" :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/borrowing-management' }]">
                <font-awesome-icon icon="fa-solid fa-hand" class="text-xl" />
              </span>
            </li>
          </router-link>
        </div>
        <router-link v-if="hasPermission(permissions.VIEW_PUBLISHERS) && isOpen" to="/publishers">
          <li>
            <span :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/publishers' }]">
              <font-awesome-icon icon="fa-solid fa-house-user" class="text-xl" />
              <p class="whitespace-nowrap">Nhà xuất bản</p>
            </span>
          </li>
        </router-link>
        <div v-else-if="hasPermission(permissions.VIEW_PUBLISHERS)" data-tip="Nhà xuất bản" class="tooltip tooltip-right">
          <router-link to="/publishers">
            <li>
              <span class="py-3" :class="[sidebarItemClassess, { [activeItemClasses]: route.path === '/publishers' }]">
                <font-awesome-icon icon="fa-solid fa-house-user" class="text-xl" />
              </span>
            </li>
          </router-link>
        </div>
      </ul>
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
