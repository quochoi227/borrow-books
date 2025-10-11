<script setup>
import { onMounted, ref } from 'vue';
import { fetchBooksAPI } from '@/apis'
import { API_ROOT } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'

const books = ref([])

onMounted(() => {
  fetchBooksAPI().then((data) => {
    books.value = data
  })
})

</script>
<template>
  <div style="max-height: calc(100vh - 68px); overflow: auto;" class="pt-4 w-full">
    <div class="relative w-full max-w-[1200px] mx-auto flex">
      <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <!-- Page content here -->
          <label for="my-drawer" class="btn btn-primary drawer-button">
            <font-awesome-icon icon="fa-solid fa-filter" />
            Bộ lọc
          </label>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
          <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
          </ul>
        </div>
      </div>
      <div class="join w-[350px]">
        <label class="input join-item">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" placeholder="Nhập tên sách" />
        </label>
        <button class="btn join-item btn-primary">Tìm</button>
      </div>
    </div>
    <div class="mt-4 bg-gradient-to-br from-indigo-400 to-indigo-800 py-4">
      <div class="w-full max-w-[1200px] mx-auto grid grid-cols-10 grid-rows-2 overflow-auto gap-4">
        <div v-for="book in books" class="col-span-2 p-3 bg-white rounded-lg hover:shadow-xl transition duration-500">
          <img class="h-44 w-full object-contain"
            :src="API_ROOT + '/images/' + book.anhBia">
          <div class="mt-3">
            <h3 class="text-gray-900 text-left">
              <a
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-word;
                  "
              >
                {{ book.tenSach }}
              </a>
            </h3>
            <span class="font-semibold text-amber-600">{{ formatCurrency(book.donGia) }}</span>
            <div class="mt-3 flex justify-center">
              <RouterLink :to="'/books/' + book._id">
                <button class="btn btn-primary btn-sm">Chi tiết</button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
