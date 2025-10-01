<script setup>
import { reactive, ref } from 'vue'
import { uploadImageAPI, updateBookAPI } from '@/apis'
import { toast } from 'vue3-toastify'

const props = defineProps(['currentActivebook', 'isActive'])
const emit = defineEmits(['update:isActive', 'update-book'])
const bookData = reactive(props.currentActivebook)
const disableSubmit = ref(false)

const handleUpload = (e) => {
  disableSubmit.value = true
  let formData = new FormData()
  formData.append('bookImg', e.target?.files[0])
  uploadImageAPI(formData).then((data) => {
    bookData.image = data.secure_url
  }).finally(() => {
    disableSubmit.value = false
  })
}

const handleAdjust = () => {
  updateBookAPI(bookData._id, bookData).then((book) => {
    toast.success("Cập nhật sách thành công", {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    emit('update:isActive', false)
    emit('update-book', book)
    // const targetBook = books.value.find((book) => {
    //   return book._id === bookData._id
    // })
    // for (let key in data) {
    //   targetBook[key] = data[key]
    // }
  })
}

const handleSubmit = () => {
  handleAdjust()
}
</script>
<template>
  <div class="grid grid-cols-12 gap-x-4 gap-y-0 max-w-[900px] mt-4 mx-auto">
    <div class="col-span-12 py-4">
      <h2 class="text-2xl font-semibold text-center text-main">Chi tiết sách</h2>
    </div>
    <div class="w-fit flex flex-col items-center col-span-4 row-span-2 gap-2">
      <div class="w-[220px] h-[300px] bg-amber-50">
        <img :src="bookData.image || 'https://placehold.co/400x600'" class="w-full h-full object-contain" alt="">
      </div>
      <!-- <ImageCropper :imageUrl="bookData.image || 'https://placehold.co/400x600'" /> -->
      <input @change="handleUpload" type="file" class="file-input" />
    </div>
    <div class="col-span-4">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Mã sách</legend>
        <input v-model="bookData.bookId" type="text" class="input" placeholder="B0001" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tên sách</legend>
        <input v-model="bookData.name" type="text" class="input" placeholder="Lão Hạc" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Đơn giá</legend>
        <input v-model="bookData.unitPrice" type="number" class="input" placeholder="45000" />
      </fieldset>
    </div>
    <div class="col-span-4">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tổng số lượng</legend>
        <input v-model="bookData.stock" type="number" class="input" placeholder="70" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Năm xuất bản</legend>
        <input v-model="bookData.publishedYear" type="number" class="input" placeholder="1943" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Mã nhà xuất bản</legend>
        <input v-model="bookData.publisherId" type="text" class="input" placeholder="NXB001" />
      </fieldset>
    </div>
    <div class="col-span-8 col-start-5">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Mô tả</legend>
        <textarea v-model="bookData.description" class="textarea h-24 w-full" placeholder="Đây là mô tả của quyển sách"></textarea>
      </fieldset>
    </div>
    <div class="col-span-12 flex justify-end">
      <button @click="handleSubmit" type="button" :class="['btn', disableSubmit ? 'btn-disabled' : 'bg-main text-white']">Lưu</button>
      <button @click="emit('update:isActive', false)" type="button" :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']">Hủy</button>
    </div>
  </div>
</template>
