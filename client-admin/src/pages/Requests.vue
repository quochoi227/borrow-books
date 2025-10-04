<script setup>
import { onMounted, ref } from 'vue'
import { getAllRequests, updateRequestAPI } from '@/apis'
import { formatDate } from '@/utils/formatters'

const REQUEST_STATUS = {
  PENDING: 'chờ duyệt',
  ACCEPT: 'đang mượn',
  REJECT: 'đã từ chối',
  RETURNED: 'đã trả'
}

const requests = ref([])

const statusMap = {
  'chờ duyệt': 'badge-warning',
  'đã từ chối': 'badge-error',
  'đã trả': 'badge-success',
  'đang mượn': 'badge-info',
  'quá hạn': 'badge-error'
}

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
    for (let key in data) {
      target[key] = data[key]
    }
  })
}
</script>
<template>
  <div class="px-2 py-6">
    <h2 class="text-xl font-semibold mb-4 text-center">Yêu cầu mượn sách</h2>
    <div class="h-[540px] overflow-x-auto">
      <table class="table w-full bg-white table-pin-rows">
        <thead>
          <tr class="bg-primary text-white overflow-hidden">
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
          <tr v-for="(req, index) in requests" :key="req.id" class="hover:bg-base-300">
            <td>{{ req.docGia.maDocGia }}</td>
            <td class="whitespace-nowrap">{{ req.docGia.hoLot + ' ' + req.docGia.ten }}</td>
            <td>{{ req.sach.maSach }}</td>
            <td
              style="
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                "
              class="text-sm leading-snug"
            >{{ req.sach.tenSach }}</td>
            <td>{{ formatDate(req.ngayYeuCau) }}</td>
            <td class="whitespace-nowrap">{{ req.ngayMuon ? formatDate(req.ngayMuon) : '_________' }}</td>
            <td class="whitespace-nowrap">{{ req.hanTra ? formatDate(req.hanTra) : '_________' }}</td>
            <td class="whitespace-nowrap">{{ req.ngayTra ? formatDate(req.ngayTra) : '_________' }}</td>
            <td>
              <span v-if="req.ngayTra > req.hanTra" class="badge badge-error badge-outline">Trễ</span>
              <span v-else :class="['badge badge-outline whitespace-nowrap', statusMap[req.trangThai]]">{{ req.trangThai }}</span>
            </td>
            <td>
              <div class="flex gap-1">
                <div v-if="req.trangThai === REQUEST_STATUS.PENDING" class="tooltip" data-tip="Chấp nhận">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.ACCEPT, req.maSach)" class="btn btn-circle btn-xs btn-success">
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </button>
                </div>
                <div v-if="req.trangThai === REQUEST_STATUS.PENDING" class="tooltip" data-tip="Từ chối">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.REJECT, req.maSach)" class="btn btn-circle btn-xs btn-error">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                  </button>
                </div>
                <div v-if="req.trangThai === REQUEST_STATUS.REJECT" class="tooltip" data-tip="Từ chối">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.PENDING, req.maSach)" class="btn btn-circle btn-xs btn-warning">
                    <font-awesome-icon icon="fa-solid fa-rotate-left" />
                  </button>
                </div>
                <div v-if="req.trangThai === REQUEST_STATUS.ACCEPT" class="tooltip" data-tip="Đã trả sách">
                  <button @click="updateRequest(req._id, REQUEST_STATUS.RETURNED, req.maSach)" class="btn btn-circle btn-xs btn-success">
                    <font-awesome-icon icon="fa-solid fa-person-walking-arrow-loop-left" />
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
