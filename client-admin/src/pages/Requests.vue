<script setup>
import { onMounted, ref, computed } from 'vue'
import { getAllRequests, updateRequestAPI } from '@/apis'
import { formatDate } from '@/utils/formatters'
import { useBookStore } from '@/stores/bookStore'
import { REQUEST_STATUS } from '@/utils/constants'

const bookStore = useBookStore()

const hard = ref(0)

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
    return (waiting.value && req.trangThai === REQUEST_STATUS.PENDING)
      || (borrowing.value && req.trangThai === REQUEST_STATUS.ACCEPT)
      || (returned.value && (req.trangThai === REQUEST_STATUS.RETURNED || req.trangThai === REQUEST_STATUS.LATE))
      || (rejected.value && req.trangThai === REQUEST_STATUS.REJECTED)
      || (losted.value && req.trangThai === REQUEST_STATUS.LOSTED)
  })
})

onMounted(() => {
  getAllRequests().then((data) => {
    requests.value = data
  })
})

const updateRequest = (requestId, status, bookId) => {
  updateRequestAPI(requestId, {
    trangThai: status,
    maSach: bookId
  }).then((data) => {
    const target = requests.value.find((req) => req._id === requestId)
    Object.assign(target, data)
    if (status === REQUEST_STATUS.ACCEPT) {
      bookStore.decrementBookCopyCount(bookId)
    } else if (status === REQUEST_STATUS.RETURNED) {
      bookStore.incrementBookCopyCount(bookId)
    }
    hard.value++
  })
}
</script>
<template>
  <div class="px-2 py-6">
    <h2 class="text-xl font-semibold mb-4 text-center">Yêu cầu mượn sách</h2>
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
    <div class="w-full overflow-x-auto mt-4">
      <table class="table bg-base-200">
        <thead>
          <tr>
            <th>TT</th>
            <th>Tên độc giả</th>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Ngày yêu cầu</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(req, index) in requestsFiltered" :key="req._id" class="hover:bg-base-300">
            <td>{{ index + 1 }}</td>
            <td class="whitespace-nowrap">{{ req.docGia?.hoLot + ' ' + req.docGia?.ten }}</td>
            <td>{{ req.sach.maSach }}</td>
            <td
              style="
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                line-height: 1.5;
                max-height: 3em;
                "
              class="text-sm leading-snug"
            >{{ req.sach.tenSach }}</td>
            <td>{{ formatDate(req.ngayYeuCau) }}</td>
            <td class="whitespace-nowrap">{{ req.ngayMuon ? formatDate(req.ngayMuon) : '' }}</td>
            <td class="whitespace-nowrap">{{ req.hanTra ? formatDate(req.hanTra) : '' }}</td>
            <td class="whitespace-nowrap">{{ req.ngayTra ? formatDate(req.ngayTra) : '' }}</td>
            <td>
              <span v-if="req.hanTra && Date.now() > new Date(req.hanTra).getTime()" class="badge badge-error">Trễ</span>
              <span v-else :class="['badge whitespace-nowrap', statusMap[req.trangThai]]">{{ req.trangThai }}</span>
            </td>
            <td>
              <div class="flex gap-1">
                <div v-if="req.trangThai === REQUEST_STATUS.PENDING" class="tooltip" data-tip="Chấp nhận">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.ACCEPT, req.maSach)" class="btn btn-square btn-xs btn-success">
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </button>
                </div>
                <div v-if="req.trangThai === REQUEST_STATUS.PENDING" class="tooltip" data-tip="Từ chối">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.REJECTED, req.maSach)" class="btn btn-square btn-xs btn-error">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </button>
                </div>
                <div v-if="req.trangThai === REQUEST_STATUS.REJECTED" class="tooltip" data-tip="Hoàn tác">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.PENDING, req.maSach)" class="btn btn-square btn-xs btn-warning">
                    <font-awesome-icon icon="fa-solid fa-rotate-left" />
                  </button>
                </div>
                <div v-if="req.trangThai === 'đang mượn'" class="tooltip" data-tip="Đã trả sách">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.RETURNED, req.maSach)" class="btn btn-square btn-xs btn-success">
                    <font-awesome-icon icon="fa-solid fa-person-walking-arrow-loop-left" />
                  </button>
                </div>
                <div v-if="req.trangThai === 'đang mượn'" class="tooltip" data-tip="Làm mất">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.LOSTED, req.maSach)" class="btn btn-square btn-xs btn-error">
                    <font-awesome-icon icon="fa-solid fa-person-circle-exclamation" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
