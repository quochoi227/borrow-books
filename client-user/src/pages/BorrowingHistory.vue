<script setup>
import { computed, onMounted, ref } from 'vue'
import { getRequestsByIdAPI, deleteRequestAPI } from '@/apis'
import { formatDate } from '../utils/formatters'
import { REQUEST_STATUS } from '@/utils/constants'
import { useUserStore } from '@/stores/userStore'
import Navbar from '@/components/Navbar.vue'
// import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const userStore = useUserStore()
const requests = ref([])

const waiting = ref(true)
const borrowing = ref(true)
const returned = ref(false)
const rejected = ref(false)
const losted = ref(false)

const statusMap = {
  'chờ duyệt': 'badge-warning',
  'đã từ chối': 'badge-error',
  'đã trả': 'badge-success',
  'đang mượn': 'badge-info',
  'quá hạn': 'badge-error',
  'bị mất': 'badge-error'
}
const requestsFiltered = computed(() => {
  return requests.value.filter((req) => {
    return (waiting.value && req.trangThai === 'chờ duyệt')
      || (borrowing.value && req.trangThai === 'đang mượn')
      || (returned.value && (req.trangThai === 'đã trả' || req.trangThai === 'quá hạn'))
      || (rejected.value && req.trangThai === 'đã từ chối')
      || (losted.value && req.trangThai === 'bị mất')
  })
})

const deleteRequest = (requestId) => {
  deleteRequestAPI(requestId).then((data) => {
    requests.value = requests.value.filter((req) => req._id !== data._id)
    toast.success('Thu hồi yêu cầu thành công!')
  })
}

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (requestId) => {
  const { isCanceled } = await dialog.reveal({ title: 'Thu hồi yêu cầu? (không thể hoàn tác)' })

  if(isCanceled) return
  deleteRequest(requestId)
}

onMounted(() => {
  getRequestsByIdAPI(userStore.currentActiveUser.maDocGia).then((data) => {
    requests.value = data
  })
})
</script>
<template>
  <Navbar />
  <div class="px-2 py-6">
    <div class="flex justify-center gap-4">
      <label class="label">
        <input type="checkbox" v-model="waiting" class="checkbox" />
        Chờ duyệt
      </label>
      <label class="label">
        <input type="checkbox" v-model="borrowing" class="checkbox" />
        Đang mượn
      </label>
      <label class="label">
        <input type="checkbox" v-model="returned" class="checkbox" />
        Đã trả
      </label>
      <label class="label">
        <input type="checkbox" v-model="rejected" class="checkbox" />
        Đã bị từ chối
      </label>
      <label class="label">
        <input type="checkbox" v-model="losted" class="checkbox" />
        Đã bị mất
      </label>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>Sách</th>
          <th>Ngày yêu cầu</th>
          <th>Ngày mượn</th>
          <th>Hạn trả</th>
          <th>Ghi chú</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requestsFiltered" :key="req.id" class="hover:bg-base-300">
          <td>
            <RouterLink :to="'/books/' + req.sach._id">
              <span class="hover:underline">
                {{ req.sach.tenSach }}
              </span>
            </RouterLink>
          </td>
          <td>{{ formatDate(req.ngayYeuCau) }}</td>
          <td>{{ req.ngayMuon ? formatDate(req.ngayMuon) : '' }}</td>
          <td>{{ req.hanTra ? formatDate(req.hanTra) : '' }}</td>
          <td>
            <div v-if="req.hanTra && Date.now() > new Date(req.hanTra)" class="badge badge-error">quá hạn</div>
            <div v-else-if="req.hanTra && !req.ngayTra" class="badge badge-error">Còn {{ Math.ceil((new Date(req.hanTra) - new Date(Date.now())) / 86400000) }} ngày</div>
            <span v-else></span>
          </td>
          <td>{{ req.ngayTra ? formatDate(req.ngayTra) : '' }}</td>
          <td><span :class="['badge', statusMap[req.trangThai]]">{{ req.trangThai }}</span></td>
          <td>
            <button v-if="req.trangThai === 'chờ duyệt'" @click="confirmDelete(req._id)" class="btn btn-xs btn-warning">
              <font-awesome-icon icon="fa-solid fa-rotate-left" />
              Thu hồi
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
