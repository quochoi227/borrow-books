<script setup>
import Navbar from '@/components/Navbar.vue'
import { getBookDetailsAPI } from '@/apis'
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { useUserStore } from '@/stores/userStore'
import { API_ROOT } from '@/utils/constants'
import { addNewRequestAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import { formatCurrency } from '../utils/formatters'

const route = useRoute()
const book = reactive({})
const userStore = useUserStore()

const currentSlide = ref(1)

const handleDescreaseSlide = () => {
  currentSlide.value--
}

const handleInscreaseSlide = () => {
  currentSlide.value++
}

const quantity = ref(1)

onMounted(() => {
  getBookDetailsAPI(route.params.id).then((data) => {
    Object.assign(book, data)
  })
})

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async () => {
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

const imgs = computed(() => {
  return Array.isArray(book.anhChiTiet) ? [book.anhBia, ...book.anhChiTiet] : [book.anhBia]
})
</script>
<template>
  <Navbar />
  <div style="height: calc(100vh - 68px);" class="bg-[#f5f5f5] pt-5">
    <div class="grid grid-cols-12 gap-x-4 gap-y-0 max-w-[1000px] mx-auto bg-white p-5 shadow-lg rounded-lg">
      <div class="col-span-6 flex justify-center">
        <div class="carousel carousel-center shadow-2xl rounded-box space-x-4 p-2 w-[220px]">
          <div v-for="(img, index) in imgs" :id="`slide${index+1}`" class="carousel-item relative w-[220px]">
            <img
              :src="API_ROOT + '/images/' + img"
              class="w-full h-[330px] object-contain" />
            <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a :href="`#slide${index > 0 ? index : imgs.length}`" class="btn btn-circle">❮</a>
              <a :href="`#slide${index < imgs.length - 1 ? index + 2 : 1}`" class="btn btn-circle">❯</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-6 text-[16px]">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 text-[16px]">
          <legend class="fieldset-legend text-xs">Thông tin sách</legend>
          <div><span class="font-semibold">Mã sách:</span> {{ book.maSach }}</div>
          <div><span class="font-semibold">Tên sách:</span> {{ book.tenSach }}</div>
          <div><span class="font-semibold">Đơn giá</span> <span class="font-semibold text-amber-600">{{ formatCurrency(book.donGia || 0) }}</span></div>
          <div><span class="font-semibold">Số lượng:</span> {{ book.soQuyen }}</div>
          <div><span class="font-semibold">Năm xuât bản:</span> {{ book.namXuatBan }}</div>
          <div><span class="font-semibold">Nhà xuất bản:</span> {{ book.nhaXuatBan?.tenNXB }}</div>
          <div><span class="font-semibold">Mô tả:</span> {{ book.moTa }}</div>
          <div>
            <span class="font-semibold">Thể loại: </span>
            <span v-for="genre in book.theLoai" class="badge badge-info mr-1">{{ genre }}</span>
          </div>
        </fieldset>
      </div>
      <!-- <div class="col-span-4">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend class="fieldset-legend">Mượn sách</legend>

          <label class="label">Số lượng</label>
          <input type="number" v-model="quantity" min="0" max="3" class="input" placeholder="Số lượng sách muốn mượn" />
        </fieldset>
      </div> -->

      <div class="col-span-12 flex justify-end gap-2">
        <button v-if="book.soQuyen" @click="confirmDelete" class="btn btn-primary">Yêu cầu mượn</button>
        <button v-else disabled class="btn">Hết sách</button>
        <RouterLink to="/home">
          <button class="btn btn-ghost">Về trang chủ</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
