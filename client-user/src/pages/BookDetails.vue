<script setup>
import Navbar from '@/components/Navbar.vue'
import { getBookDetailsAPI } from '@/apis'
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { useUserStore } from '@/stores/userStore'
import { addNewRequestAPI } from '@/apis'
import { toast } from 'vue3-toastify'

const route = useRoute()
const book = reactive({})
const userStore = useUserStore()

const quantity = ref(1)

onMounted(() => {
  getBookDetailsAPI(route.params.id).then((data) => {
    data.source = data.source[0]
    Object.assign(book, data)
  })
})



const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (bookId) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận mượn?' })

  if(isCanceled) return
  // handleDeleteBook(bookId)
  addNewRequestAPI({
    maDocGia: userStore.currentActiveUser.maDocGia,
    maSach: book.bookId
  }).then(() => {
    toast.success('Gửi yêu cầu thành công!')
  })
}
</script>
<template>
  <Navbar />
  <div class="w-full max-h-[68px] min-h[68px]">
    <div class="grid grid-cols-12 gap-x-4 gap-y-0 max-w-[900px] mt-4 mx-auto">
      <div class="col-span-4 mx-auto">
        <div class="w-[220px] h-[300px] bg-amber-50">
          <img :src="book.image || 'https://placehold.co/400x600'" class="w-full h-full object-contain" alt="">
        </div>
      </div>
      <div class="col-span-8 text-[16px]">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 text-[16px]">
          <legend class="fieldset-legend text-xs">Thông tin sách</legend>
          <div><span class="font-semibold">Mã sách:</span> {{ book.bookId }}</div>
          <div><span class="font-semibold">Tên sách:</span> {{ book.name }}</div>
          <div><span class="font-semibold">Đơn giá</span> {{ book.unitPrice }}</div>
          <div><span class="font-semibold">Số lượng:</span> {{ book.stock }}</div>
          <div><span class="font-semibold">Năm xuât bản:</span> {{ book.publishedYear }}</div>
          <div><span class="font-semibold">Nhà xuất bản:</span> {{ book.source?.name }}</div>
          <div><span class="font-semibold">Mô tả:</span> {{ book.description }}</div>
        </fieldset>
      </div>
      <!-- <div class="col-span-4">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend class="fieldset-legend">Mượn sách</legend>

          <label class="label">Số lượng</label>
          <input type="number" v-model="quantity" min="0" max="3" class="input" placeholder="Số lượng sách muốn mượn" />
        </fieldset>
      </div> -->

      <div class="col-span-12 flex justify-end">
        <button @click="confirmDelete" class="btn btn-primary">Xác nhận mượn</button>
      </div>
    </div>
  </div>
</template>
