<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  getRequestsByIdAPI,
  deleteRequestAPI,
  updateRequestAPI,
  getBookDetailsAPI
} from '@/apis'
import { formatDate } from '../utils/formatters'
import { REQUEST_STATUS } from '@/utils/constants'
import { useUserStore } from '@/stores/userStore'
import { API_ROOT } from '@/utils/constants'
// import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '@/composables/useToast'
const toast = useToast()

const userStore = useUserStore()
const requests = ref([])

const statusMap = {
  'chờ duyệt': 'badge-warning',
  'đã từ chối': 'badge-error',
  'đã trả': 'badge-success',
  'đang mượn': 'badge-info',
  'quá hạn': 'badge-error',
  'bị mất': 'badge-error'
}

const requestStatus = ref(REQUEST_STATUS.ACCEPT)

const requestsFiltered = computed(() => {
  if (requestStatus.value === 'all') return [...requests.value]
  return requests.value.filter((req) => {
    if (requestStatus.value === 'đã trả') {
      return (
        req.trangThai === requestStatus.value || req.trangThai === 'quá hạn'
      )
    } else {
      return req.trangThai === requestStatus.value
    }
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
  const { isCanceled } = await dialog.reveal({
    title: 'Thu hồi yêu cầu? (không thể hoàn tác)'
  })

  if (isCanceled) return
  deleteRequest(requestId)
}

const updateRequest = (requestId, status, bookId) => {
  updateRequestAPI(requestId, {
    trangThai: status,
    maSach: bookId,
    maDocGia: userStore.currentActiveUser.maDocGia
  }).then((data) => {
    const target = requests.value.find((req) => req._id === requestId)
    Object.assign(target, data)
  })
}

const payModal = ref(null)
const cost = ref(0)

const calculateCost = (request) => {
  getBookDetailsAPI(request.maSach).then((book) => {
    if (request.trangThai === REQUEST_STATUS.LOSTED) {
      cost.value = book.donGia
    } else if (request.trangThai === REQUEST_STATUS.LATE) {
      cost.value = Math.ceil(book.donGia * 0.1)
    }
  })
}

const handleCalculateCost = (req) => {
  calculateCost(req)
  payModal.value.showModal()
}

onMounted(() => {
  getRequestsByIdAPI(userStore.currentActiveUser.maDocGia).then((data) => {
    requests.value = data
  })
})
</script>
<template>
  <!-- You can open the modal using ID.showModal() method -->
  <dialog ref="payModal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          ✕
        </button>
      </form>
      <h3 class="text-center font-semibold">
        <!-- <img :src="API_ROOT + '/images/scan-me.jpg'" alt="Mã qr code" /> -->
        Vui lòng đến trực tiếp quầy thư viện để đóng phí!
      </h3>
      <p class="py-4 text-center">
        Mức phí bạn phải đóng là <span>{{ formatCurrency(cost) }}</span>
      </p>
    </div>
  </dialog>
  <div class="px-2 py-6">
    <div class="tabs tabs-box justify-center">
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        value="all"
        class="tab"
        aria-label="Tất cả"
      />
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        :value="REQUEST_STATUS.PENDING"
        class="tab"
        aria-label="Chờ duyệt"
      />
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        :value="REQUEST_STATUS.ACCEPT"
        class="tab"
        aria-label="Đang mượn"
      />
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        :value="REQUEST_STATUS.RETURNED"
        class="tab"
        aria-label="Đã trả"
      />
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        :value="REQUEST_STATUS.REJECTED"
        class="tab"
        aria-label="Đã bị từ chối"
      />
      <input
        v-model="requestStatus"
        type="radio"
        name="my_tabs_1"
        :value="REQUEST_STATUS.LOSTED"
        class="tab"
        aria-label="Đã làm mất"
      />
    </div>
    <table class="bg-base-200 mt-2 table overflow-hidden">
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
        <tr
          v-for="req in requestsFiltered"
          :key="req.id"
          class="hover:bg-base-300"
        >
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
            <div
              v-if="req.hanTra && Date.now() > new Date(req.hanTra)"
              class="badge badge-error"
            >
              quá hạn
            </div>
            <div
              v-else-if="
                req.hanTra &&
                !req.ngayTra &&
                req.trangThai !== REQUEST_STATUS.LOSTED
              "
              class="badge badge-error"
            >
              Còn
              {{
                Math.ceil(
                  (new Date(req.hanTra) - new Date(Date.now())) / 86400000
                )
              }}
              ngày
            </div>
          </td>
          <td>{{ req.ngayTra ? formatDate(req.ngayTra) : '' }}</td>
          <td>
            <span :class="['badge', statusMap[req.trangThai]]">{{
              req.trangThai
            }}</span>
          </td>
          <td>
            <button
              v-if="req.trangThai === 'chờ duyệt'"
              @click="confirmDelete(req._id)"
              class="btn btn-xs btn-warning"
            >
              <font-awesome-icon icon="fa-solid fa-rotate-left" />
              Thu hồi
            </button>
            <button
              v-if="req.trangThai === 'đang mượn'"
              @click="updateRequest(req._id, REQUEST_STATUS.LOSTED, req.maSach)"
              class="btn btn-xs btn-error"
            >
              <font-awesome-icon icon="fa-solid fa-person-circle-exclamation" />
              Làm mất
            </button>

            <button
              v-if="req.trangThai === 'quá hạn' || req.trangThai === 'bị mất'"
              class="btn btn-xs btn-neutral"
              @click="handleCalculateCost(req)"
            >
              Đóng phí
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
