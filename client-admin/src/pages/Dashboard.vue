<script setup>
import { getAllRequests, fetchAllUsersAPI, fetchBooksAPI } from '@/apis'
import { computed, onMounted, ref } from 'vue'
import { REQUEST_STATUS } from '@/utils/constants'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const bookChartData = computed(() => {
  const labels = books.value.map((book) => book.tenSach)
  const dataValues = books.value.map((book) => book.luotMuon)
  return {
    labels,
    datasets: [
      {
        label: 'Lượt mượn sách',
        backgroundColor: '#32a893',
        data: dataValues
      }
    ]
  }
})

const readerChartData = computed(() => {
  // Dummy data for demonstration; replace with actual user borrowing data
  const labels = users.value.map((user) => user.hoLot + ' ' + user.ten)
  const borrows = users.value.map((user) => {
    return requests.value.filter((req) => req.maDocGia === user.maDocGia && req.trangThai !== REQUEST_STATUS.PENDING).length
  })
  const lateReturns = users.value.map((user) => {
    return requests.value.filter((req) => req.maDocGia === user.maDocGia && req.trangThai === REQUEST_STATUS.LATE).length
  })
  return {
    labels,
    datasets: [
      {
        label: 'Lượt mượn sách',
        backgroundColor: '#32a893',
        data: borrows
      },
      {
        label: 'Trả trễ',
        backgroundColor: '#f87171',
        data: lateReturns
      }
    ]
  }
})

const chartOptions = {
  responsive: true
}

const books = ref([])

const totalBooks = computed(() => {
  return books.value.reduce((total, book) => {
    return total + book.soQuyen
  }, 0)
})

const booksRemaining = computed(() => {
  return books.value.reduce((total, book) => {
    return total + book.soQuyenConLai
  }, 0)
})

const totalBorrowing = ref(0)
const users = ref([])
const requests = ref([])
onMounted(() => {
  fetchBooksAPI({ limit: 1000 }).then((data) => {
    books.value = data.books
  })
  getAllRequests().then((data) => {
    totalBorrowing.value = data.map((req) => req.trangThai !== REQUEST_STATUS.PENDING).length
    requests.value = data
  })
  fetchAllUsersAPI().then((data) => {
    users.value = data
  })
})

const statisticType = ref('book')
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21" stroke="#32a893" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div class="stat-title">Số lượng sách</div>
        <div class="stat-value">{{ totalBooks }}</div>
        <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg fill="#32a893" height="48px" width="48px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M24,25.6V22c0-0.9-0.4-1.8-1.2-2.4l-3.7-2.8c-0.3-0.2-0.4-0.5-0.4-0.8s0.1-0.6,0.4-0.8l3.7-2.8c0.8-0.6,1.2-1.5,1.2-2.4V6.4 c1.2-0.7,2-2,2-3.4c0-0.6-0.4-1-1-1H7C6.4,2,6,2.4,6,3c0,1.5,0.8,2.7,2,3.4V10c0,0.9,0.4,1.8,1.2,2.4l3.7,2.8 c0.3,0.2,0.4,0.5,0.4,0.8s-0.1,0.6-0.4,0.8l-3.7,2.8C8.4,20.2,8,21.1,8,22v3.6c-1.2,0.7-2,2-2,3.4c0,0.6,0.4,1,1,1h18 c0.6,0,1-0.4,1-1C26,27.5,25.2,26.3,24,25.6z M12.4,10.8c-0.4-0.2-0.5-0.7-0.4-1.1C12.2,9.3,12.6,9,13,9h6c0.4,0,0.8,0.3,1,0.7 c0.1,0.4,0,0.9-0.4,1.1l-3,2C16.4,12.9,16.2,13,16,13s-0.4-0.1-0.6-0.2L12.4,10.8z M15.3,20.3c0.4-0.4,1-0.4,1.4,0l4.7,4.7H10.6 L15.3,20.3z"></path> </g></svg>
        </div>
        <div class="stat-title">Số lượng sách còn lại</div>
        <div class="stat-value">{{ booksRemaining }}</div>
        <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#32a893" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </div>
        <div class="stat-title">Số lượng người dùng</div>
        <div class="stat-value">{{ users.length }}</div>
        <!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg fill="#32a893" width="48px" height="48px" viewBox="0 0 16 16" id="request-added-16px" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="Path_48" data-name="Path 48" d="M-6.5,0h-11A2.5,2.5,0,0,0-20,2.5v8A2.5,2.5,0,0,0-17.5,13h.5v2.5a.5.5,0,0,0,.309.462A.489.489,0,0,0-16.5,16a.5.5,0,0,0,.354-.146L-13.293,13H-6.5A2.5,2.5,0,0,0-4,10.5v-8A2.5,2.5,0,0,0-6.5,0ZM-5,10.5A1.5,1.5,0,0,1-6.5,12h-7a.5.5,0,0,0-.354.146L-16,14.293V12.5a.5.5,0,0,0-.5-.5h-1A1.5,1.5,0,0,1-19,10.5v-8A1.5,1.5,0,0,1-17.5,1h11A1.5,1.5,0,0,1-5,2.5Zm-3.5-4A.5.5,0,0,1-9,7h-2.5V9.5a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5V7H-15a.5.5,0,0,1-.5-.5A.5.5,0,0,1-15,6h2.5V3.5A.5.5,0,0,1-12,3a.5.5,0,0,1,.5.5V6H-9A.5.5,0,0,1-8.5,6.5Z" transform="translate(20)"></path> </g></svg>
        </div>
        <div class="stat-title">Lượt mượn sách</div>
        <div class="stat-value">{{ totalBorrowing }}</div>
        <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
      </div>
    </div>
    <!-- name of each tab group should be unique -->
    <!-- name of each tab group should be unique -->
    <!-- <div class="flex justify-center gap-4 mt-6">
      <label class="label">
        <input type="radio" value="book" v-model="statisticType" class="radio" />
        Theo sách
      </label>
      <label class="label">
        <input type="radio" value="reader" v-model="statisticType" class="radio" />
        Theo độc giả
      </label>
    </div> -->
    <!-- name of each tab group should be unique -->
    <div class="tabs tabs-box justify-center mt-2">
      <input type="radio" value="book" v-model="statisticType" name="my_tabs_1" class="tab" aria-label="Theo sách" />
      <input type="radio" value="reader" v-model="statisticType" name="my_tabs_1" class="tab" aria-label="Theo độc giả" />
    </div>
    <div class="mt-4">
      <Bar
        style="width: 900px"
        v-if="statisticType === 'book'"
        id="my-chart-id"
        :options="chartOptions"
        :data="bookChartData"
      />
      <Bar
        style="width: 900px"
        v-else
        id="my-chart-id"
        :options="chartOptions"
        :data="readerChartData"
      />
    </div>
  </div>
</template>
