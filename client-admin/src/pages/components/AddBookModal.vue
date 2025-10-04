<script setup>
import { API_ROOT } from '@/utils/constants'
import { reactive } from 'vue';

const props = defineProps(['modelValue', 'handleUploadImage', 'handleUploadImages', 'publishers', 'disableSubmit'])
const bookData = reactive(props.modelValue)


</script>
<template>
  <div class="modal-box w-fit container">
    <form @submit.prevent="handleSubmit" class="space-y-2 grid grid-cols-12 gap-x-4 gap-y-0">
      <div class="col-span-4 row-span-2 flex flex-col items-center gap-2">
        <div class="w-fit h-full flex justify-center flex-col min-w-[300px] items-center gap-2">
          <div class="w-[180px] h-[270px]">
            <div v-if="bookData.anhBia" class="relative group">
              <div class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10">
                <button type="button" @click="bookData.anhBia = ''" class="btn btn-circle btn-ghost">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>
              <img :src="API_ROOT + '/images/' + bookData.anhBia" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt="">
            </div>
            <label v-else for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Chọn ảnh bìa</span></p>
              </div>
              <input required id="dropzone-file" @change="handleUploadImage" type="file" class="opacity-0" />
            </label>
          </div>
        </div>
      </div>
      <div class="col-span-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mã sách</legend>
          <input required v-model="bookData.maSach" pattern="^B\d{4}$" title="Bắt đầu bằng ký tự B và kết thúc bằng 4 chữ số" type="text" class="input" placeholder="B0001" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tên sách</legend>
          <input required v-model="bookData.tenSach" type="text" class="input" placeholder="Lão Hạc" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Đơn giá</legend>
          <input required v-model="bookData.donGia" type="number" class="input" placeholder="45000" />
        </fieldset>
      </div>
      <div class="col-span-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Số quyển</legend>
          <input required v-model="bookData.soQuyen" type="number" class="input" placeholder="70" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Năm xuất bản</legend>
          <input required v-model="bookData.namXuatBan" type="number" class="input" placeholder="1943" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Nhà xuất bản</legend>
          <!-- <input v-model="bookData.maNXB" type="text" class="input" placeholder="NXB001" /> -->
          <select required v-model="bookData.maNXB" class="select">
            <option value="" disabled selected>Chọn nhà xuất bản</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">{{ publisher.tenNXB }}</option>
          </select>
        </fieldset>
      </div>
      <div class="col-span-8 col-start-5">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mô tả</legend>
          <textarea required v-model="bookData.moTa" class="textarea h-24 w-full" placeholder="Đây là mô tả của quyển sách"></textarea>
        </fieldset>
      </div>
      <div class="col-span-12">
        <div class="flex justify-center gap-2 mt-2">
          <label class="flex flex-col px-3 items-center justify-center w-28 h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <font-awesome-icon icon="fa-solid fa-upload" class="text-3xl text-gray-500" />
            <p class="mb-2 text-xs text-gray-500 dark:text-gray-400"><span class="font-semibold">Ảnh chi tiết</span></p>
            <input @change="handleUploadImages" multiple type="file" class="hidden" />
          </label>
          <div class="flex gap-2 overflow-auto">
            <div v-for="img in bookData.anhChiTiet" class="relative group">
              <div class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10">
                <button type="button" @click="bookData.anhBia = ''" class="btn btn-circle btn-ghost">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
              </div>
              <div class="avatar">
                <div class="w-28 rounded">
                  <img :src="API_ROOT + '/images/' + img" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 flex justify-end">
        <button type="submit" :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']">Thêm</button>
        <button @click="modal.close()" type="reset" :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']">Hủy</button>
      </div>
    </form>
  </div>
</template>
