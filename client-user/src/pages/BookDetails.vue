<script setup>
import { getBookDetailsAPI } from '@/apis'
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { useUserStore } from '@/stores/userStore'
import { API_ROOT } from '@/utils/constants'
import { addNewRequestAPI } from '@/apis'
// import { toast } from 'vue3-toastify'
import { formatCurrency } from '../utils/formatters'
import moment from 'moment'

import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const currentSlide = ref(0)

const slideTo = (nextSlide) => (currentSlide.value = nextSlide)

const galleryConfig = {
  itemsToShow: 1,
  wrapAround: true,
  slideEffect: 'fade',
  mouseDrag: false,
  touchDrag: false,
  height: 320,
}

const thumbnailsConfig = {
  height: 90,
  itemsToShow: 5,
  touchDrag: false,
  gap: 10,
}

const route = useRoute()
const router = useRouter()
const book = reactive({})
const userStore = useUserStore()

onMounted(() => {
  getBookDetailsAPI(route.params.id).then((data) => {
    Object.assign(book, data)
  }).catch(() => {
    router.push('/')
  })
})

const expanded = ref(false)

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async () => {
  if (userStore.currentActiveUser === null) {
    router.push('/login')
    return
  }
  const { isCanceled } = await dialog.reveal({
    title: 'Xác nhận gửi yêu cầu mượn sách?',
    description: 'Bạn sẽ phải trả ' + formatCurrency(book.donGia || 0) + ' nếu làm mất'
  })

  if(isCanceled) return
  addNewRequestAPI({
    maSach: book.maSach,
    maDocGia: userStore.currentActiveUser.maDocGia
  }).then(() => {
    toast.success('Yêu cầu mượn sách thành công!')
  })
}

const images = computed(() => {
  return Array.isArray(book.anhChiTiet) ? [book.anhBia, ...book.anhChiTiet] : [book.anhBia]
})

const inputValue = ref('')

const handleSubmit = () => {
  book.comments.push({
    noiDung: inputValue.value,
    hoTen: userStore.getFullName,
    commentedAt: new Date(Date.now()).toISOString()
  })
}
</script>
<template>
  <div class="h-[68px] bg-base-200"></div>
  <div class="bg-base-200 pt-4">
    <div class="flex gap-4 max-w-[1200px] mx-auto rounded-lg">
      <div class="w-5/12 flex flex-col gap-4">
        <div class="flex flex-col items-center bg-base-100 p-4 rounded-lg h-fit">
          <div class="w-full">
            <Carousel id="gallery" class="w-full" v-bind="galleryConfig" v-model="currentSlide">
              <Slide v-for="(image, index) in images" :key="index">
                <img :src="API_ROOT + '/images/' + image" alt="Gallery Image" class="rounded-lg w-full h-full object-contain" />
              </Slide>
            </Carousel>
    
            <Carousel id="thumbnails" class="w-full mt-4" v-bind="thumbnailsConfig" v-model="currentSlide">
              <Slide v-for="(image, index) in images" :key="index">
                <template #default="{ currentIndex, isActive }">
                  <div
                    :class="['w-full h-full object-contain opacity-60 cursor-pointer hover:opacity-100 transition-opacity duration-75', { 'opacity-100': isActive }]"
                    @click="slideTo(currentIndex)"
                  >
                    <img :src="API_ROOT + '/images/' + image" alt="Thumbnail Image" class="w-full h-full object-contain" />
                  </div>
                </template>
              </Slide>
    
              <template #addons>
                <Navigation />
              </template>
            </Carousel>
          </div>
          <div class="flex justify-center w-full gap-3 mt-4">
            <!-- <button class="btn btn-primary btn-outline flex-1">Thêm vào giỏ</button> -->
            <button v-if="book.soQuyen" @click="confirmDelete" class="btn btn-primary w-56">Yêu cầu mượn</button>
            <button v-else disabled class="btn w-56">Hết sách</button>
          </div>
        </div>
        <!-- <div class="p-4 rounded-lg bg-base-100">
          <h3 class="font-semibold text-lg">Đánh giá sản phẩm</h3>
          <div class="rating">
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" aria-label="1 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" aria-label="2 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" aria-label="3 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" aria-label="4 star" />
            <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" aria-label="5 star" />
          </div>
        </div> -->
      </div>
      <div class="w-7/12 flex flex-col gap-4">
        <div class="bg-base-100 p-4 rounded-lg">
          <h2 class="text-2xl">{{ book.tenSach }}</h2>
          <div class="w-full mt-2">
            <div class="w-[60%] inline-block text-sm">
              <span class="pr-1">Nhà xuất bản:</span>
              <span class="font-semibold">{{ book.nhaXuatBan?.tenNXB }}</span>
            </div>
            <div class="w-[40%] inline-block text-sm">
              <span class="pr-1">Năm xuất bản:</span>
              <span class="font-semibold">{{ book.namXuatBan }}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="font-semibold">Thể loại: </span>
            <span v-for="genre in book.theLoai" class="badge badge-info mr-1">{{ genre }}</span>
          </div>
        </div>
        <div class="bg-base-100 p-4 rounded-lg">
          <h3 class="font-semibold text-lg">Thông tin chi tiết</h3>
          <div class="overflow-x-auto mt-4">
            <table class="table">
              <tbody>
                <tr>
                  <th class="font-normal text-gray-600">Mã sách</th>
                  <td>{{ book.maSach }}</td>
                </tr>
                <tr>
                  <th class="font-normal text-gray-600">Tác giả</th>
                  <td>Nam Cao</td>
                </tr>
                <tr>
                  <th class="font-normal text-gray-600">NXB</th>
                  <td>NXB {{ book.nhaXuatBan?.tenNXB }}</td>
                </tr>
                <tr>
                  <th class="font-normal text-gray-600">Năm XB</th>
                  <td>{{ book.namXuatBan }}</td>
                </tr>
                <tr>
                  <th class="font-normal text-gray-600">Đơn giá</th>
                  <td>{{ formatCurrency(book.donGia || 0) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-base-100 p-4 rounded-lg">
          <h3 class="font-semibold text-lg">Mô tả</h3>
          <p class="mt-4 text-sm">{{ book.moTa }}</p>
          <div class="relative">

            <p class="text-sm" :class="[
              'overflow-hidden',
              expanded ? 'max-h-full' : 'max-h-[150px]'
            ]">
              {{ book.moTa }}
            </p>
            <div
              v-if="!expanded"
              class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"
            ></div>
          </div>
          <div class="w-full flex justify-center">
            <button
              class="text-blue-600 hover:underline cursor-pointer"
              @click="expanded = !expanded"
            >
              {{ expanded ? 'Thu gọn' : 'Xem thêm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
