<script setup>
import { useAdminStore } from '@/stores/adminStore'
import ModeSwitcher from './ModeSwitcher.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import ModalDialog from './ModalDialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminStore = useAdminStore()
const { logoutAdminAPI } = adminStore

const dialog = createConfirmDialog(ModalDialog)

const confirmLogout = async () => {
  const { isCanceled } = await dialog.reveal({ title: 'Đăng xuất?' })

  if(isCanceled) return
  await logoutAdminAPI()
  router.push('/login')
}
</script>
<template>
  <div class="navbar justify-between px-5 py-3 p-0 bg-base-100 text-text-primary text-[13px] font-[500]">
    <div class="badge badge-soft badge-primary">Nhân viên</div>
    <div>
      <ModeSwitcher />
      <button @click="confirmLogout" class="btn btn-ghost ml-2">Đăng xuất</button>
    </div>
  </div>
</template>
