<script setup>
import { onMounted, ref } from 'vue'
import { getAllRequests } from '@/apis'
import { formatDate } from '@/utils/formatters'

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
</script>
<template>
  <div class="px-2 py-6">
    <h2 class="text-xl font-semibold mb-4 text-center">Yêu cầu mượn sách</h2>
    <table class="table w-full shadow-md overflow-hidden bg-white">
      <thead>
        <tr class="bg-primary text-white">
          <th>Người mượn</th>
          <th>Sách</th>
          <th>Ngày mượn</th>
          <th>Hạn trả</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="req in requests" :key="req.id" class="hover:bg-base-300">
          <td>{{ req.docGia[0]?.hoLot + ' ' + req.docGia[0]?.ten }}</td>
          <td>{{ req.sach[0]?.name }}</td>
          <td>{{ formatDate(req.ngayMuon) }}</td>
          <td>{{ formatDate(req.hanTra) }}</td>
          <td>{{ req.ngayTra ? formatDate(req.ngayTra) : '_________' }}</td>
          <td><span :class="['badge badge-outline', statusMap[req.status]]">{{ req.status }}</span></td>
          <td>
            <button class="btn btn-circle btn-xs btn-success">
              <font-awesome-icon icon="fa-solid fa-check" />
            </button>
            <button class="ml-1 btn btn-circle btn-xs btn-error">
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
            <button class="ml-1 btn btn-circle btn-xs btn-warning">
              <font-awesome-icon icon="fa-solid fa-list" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
