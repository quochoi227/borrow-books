<script setup>
import { useAdminStore } from '@/stores/adminStore'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ModalDialog from './ModalDialog.vue'

const adminStore = useAdminStore()
const { logoutAdminAPI } = adminStore

const dialog = createConfirmDialog(ModalDialog)

const confirmLogout = async () => {
  const { isCanceled } = await dialog.reveal({ title: 'Đăng xuất?' })

  if(isCanceled) return
  logoutAdminAPI()
}
</script>
<template>
  <div class="p-2 min-h-[68px] max-h-[68px] w-full">
    <div class="navbar justify-between px-5 py-3 p-0 bg-base-100 shadow-sm text-text-primary text-[13px] font-[500] rounded">
      <!-- <font-awesome-icon icon="fa-solid fa-bell" class="text-lg cursor-pointer" /> -->
      <div class="badge badge-soft badge-primary">Nhân viên</div>
      <button @click="confirmLogout" class="btn btn-ghost">Đăng xuất</button>
    </div>
  </div>
</template>
