<script setup>
import { onMounted, ref } from 'vue';
import { fetchBooksAPI } from '@/apis'
import { API_ROOT } from '@/utils/constants'

const books = ref([])

onMounted(() => {
  fetchBooksAPI().then((data) => {
    books.value = data
  })
})

</script>
<template>
  <div style="max-height: calc(100vh - 68px); overflow: auto;" class="pt-4 w-full">
    <h1 class="text-center text-2xl font-bold text-main">Tất cả các sách</h1>
    <div class="mt-4 grid grid-cols-12 gap-8">
      <div v-for="book in books" class="col-span-3 nth-[3n+1]:bg-sky-100 border-b-4 nth-[3n+1]:border-sky-300 nth-[3n+2]:bg-yellow-100 nth-[3n+2]:border-yellow-300 nth-[3n+3]:bg-rose-100 nth-[3n+3]:border-rose-300 rounded-lg hover:shadow-xl transition duration-500">
        <img class="h-52 w-full object-contain drop-shadow-[0_0_30px_rgba(100,100,100,0.3)]"
          :src="API_ROOT + '/images/' + book.anhBia">
        <div class="px-6 py-3">
          <h1 class="font-medium text-gray-900 text-center">
            <a
              style="
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                "
            >
              {{ book.tenSach }}
            </a>
          </h1>
          <p class="text-center">{{ 'Năm xuất bản: ' + book.namXuatBan }}</p>
          <div class="mt-3 flex justify-center">
            <RouterLink :to="'/books/' + book._id">
              <button class="btn btn-primary btn-sm">Chi tiết</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
