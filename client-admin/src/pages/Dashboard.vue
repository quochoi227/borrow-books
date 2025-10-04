<script setup>
import { fetchBooksAPI } from '@/apis'
import { onMounted, ref } from 'vue';

const books = ref([])

onMounted(() => {
  fetchBooksAPI().then((data) => {
    books.value = data
  })
})
</script>
<template>
  <div class="p-6">
    <div class="grid grid-cols-4 gap-6 text-white">
      <div class="p-6 bg-gradient-to-r from-green-500 to-green-300 rounded-sm">
        <h1 class="text-lg font-semibold">Tổng số sách</h1>
        <h2 class="text-3xl font-semibold mt-2">{{ books.length }}</h2>
        <!-- <p class="mt-2">+ Hôm nay: 1</p> -->
      </div>
      <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-300 rounded-sm flex gap-2">
        <div class="radial-progress text-primary" style="--value:90;" aria-valuenow="90" role="progressbar">70%</div>
        <div>
          <h1 class="text-lg font-semibold">Sách đang mượn</h1>
          <h2 class="text-3xl font-semibold mt-2">2</h2>
        </div>
        <!-- <p class="mt-2">+ Hôm nay: 1</p> -->
      </div>
      <div class="p-6 bg-gradient-to-r from-amber-500 to-amber-300 rounded-sm flex gap-2">
        <div class="radial-progress text-primary" style="--value:90;" aria-valuenow="90" role="progressbar">70%</div>
        <div>
          <h1 class="text-lg font-semibold">Yêu cầu chờ duyệt</h1>
          <h2 class="text-3xl font-semibold mt-2">2</h2>
        </div>
        <!-- <p class="mt-2">+ Hôm nay: 1</p> -->
      </div>
      <div class="p-6 bg-gradient-to-r from-red-500 to-red-300 rounded-sm">
        <h1 class="text-lg font-semibold">Quá hạn trả sách</h1>
        <h2 class="text-3xl font-semibold mt-2">1</h2>
        <!-- <p class="mt-2">+ Hôm nay: 1</p> -->
      </div>
    </div>
  </div>
</template>
