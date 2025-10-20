<script setup>
import { onMounted, ref } from 'vue';
import { fetchBooksAPI } from '@/apis'
import { API_ROOT } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const carouselConfig = {
  itemsToShow: 1.5,
  wrapAround: true,
  autoplay: 3000,
  transition: 500
}

const bookList = {
  itemsToShow: 5,
  gap: 13,
}

const books = ref([])

onMounted(() => {
  fetchBooksAPI().then((data) => {
    books.value = data
  })
})

</script>
<template>
  <div class="w-full bg-[#f5f5f5]">
    <div class="w-[1200px] mx-auto">
      <Carousel v-bind="carouselConfig" class="w-full">
        <Slide v-for="slide in 10" :key="slide">
          <div class="carousel__item">
            <img :src="API_ROOT + '/images/FE_banners/' + slide + '.jpg'" alt="" class="w-full">
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
  </div>
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
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
          <input type="search" placeholder="Nhập tên sách" />
        </label>
        <button class="btn join-item btn-primary">Tìm</button>
      </div>
    </div>
    <div class="my-4">
      <h3 class="text-center text-2xl font-semibold text-primary">Sách nổi bật</h3>
    </div>
    <div class="bg-gradient-to-br from-blue-400 to-blue-800 py-4">
      <!-- <div class="w-full max-w-[1200px] mx-auto grid grid-cols-10 overflow-auto gap-4"> -->
      <div class="w-full flex justify-center">
        <Carousel v-bind="bookList" class="w-[1200px]">
          <Slide v-for="book in books" :key="book._id">
            <div class="carousel__item h-full w-full">
              <div class="p-3 h-full bg-white rounded-lg hover:shadow-xl transition duration-500">
                <div class="book-3d h-[200px] flex items-center">
                  <div class="book-3d__inner">
                    <img class="book-3d__cover"
                  :src="API_ROOT + '/images/' + book.anhBia">
                  </div>
                </div>
                <!-- <img class="h-44 w-full object-contain"
                  :src="API_ROOT + '/images/' + book.anhBia"> -->
                <div class="mt-3">
                  <h3 class="text-gray-900 text-left">
                    <span
                      style="
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: break-word;
                        line-height: 1.5;
                        height: 3em;
                        "
                    >
                      {{ book.tenSach }}
                    </span>
                  </h3>
                  <div>
                    <span>Lượt mượn: <span class="font-semibold text-amber-600">{{ book.luotMuon }}</span></span>
                  </div>
                  <div>
                    <span>Còn lại: <span class="font-semibold text-amber-600">{{ book.soQuyenConLai }}</span> quyển</span>
                  </div>
                  <div class="mt-3 flex justify-center">
                    <RouterLink :to="'/books/' + book._id">
                      <button class="btn btn-primary btn-sm">Chi tiết</button>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>
    </div>
    <div class="w-full flex justify-center py-4">
      <button class="btn btn-outline btn-primary">Xem tất cả</button>
    </div>
  </div>
</template>
