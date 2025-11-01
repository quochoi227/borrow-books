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
  itemsToShow: 4.5,
  gap: 16,
}

const books = ref([])

onMounted(() => {
  fetchBooksAPI({ sortBy: 'luotMuon' }).then((data) => {
    books.value = data
  })
})

</script>
<template>
  <div style="max-height: calc(100vh - 68px);" class="overflow-y-auto">
    <div class="w-full">
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
    <div class="my-8">
      <h3 class="text-center text-2xl font-semibold text-primary">Sách được mượn nhiều nhất</h3>
    </div>
    <div class="hero bg-base-200 w-[1200px] mx-auto rounded-lg p-8">
      <div class="hero-content flex-col lg:flex-row-reverse justify-between w-full">
        <img
          :src="API_ROOT + '/images/' + books[0]?.anhBia"
          class="w-48 rounded-lg shadow-2xl"
        />
        <div>
          <h1 class="text-5xl font-bold">{{ books[0]?.tenSach }}</h1>
          <p class="py-6">
            {{ books[0]?.moTa }}
          </p>
          <RouterLink :to="'/books/' + books[0]?._id">
            <button class="btn btn-primary">Xem chi tiết</button>
          </RouterLink>
        </div>
      </div>
    </div>
    <div style="max-height: calc(100vh - 68px); overflow: auto;" class="pt-4 w-full">
      <div class="my-4">
        <h3 class="text-center text-2xl font-semibold text-primary">Sách nổi bật</h3>
      </div>
      <div class="relative">
        <!-- <div class="w-full max-w-[1200px] mx-auto grid grid-cols-10 overflow-auto gap-4"> -->
        <div class="w-full flex justify-center">
          <Carousel v-bind="bookList" class="w-[1200px]">
            <Slide v-for="book in books" :key="book._id">
              <div class="carousel__item h-full w-full py-4">
                <div class="p-3 h-full shadow-2xl border border-base-300 rounded-lg transition duration-500">
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
        <RouterLink to="/books">
          <button class="btn btn-outline btn-primary">Xem tất cả</button>
        </RouterLink>
      </div>
    </div>
    <footer class="footer footer-horizontal footer-center bg-primary text-primary-content p-10">
      <aside>
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill-rule="evenodd"
          clip-rule="evenodd"
          class="inline-block fill-current">
          <path
            d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
        </svg>
        <p class="font-bold">
          BORROWEE
          <br />
          Library Management System
        </p>
        <p>Copyright © {{ new Date().getFullYear() }} - All right reserved</p>
      </aside>
      <nav>
        <div class="grid grid-flow-col gap-4">
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current">
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  </div>
</template>
