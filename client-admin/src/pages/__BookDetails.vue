<script setup>
import { reactive, ref, watch } from 'vue'
import { updateBookAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import { API_ROOT, BOOK_GENRES } from '@/utils/constants'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

// Crop image
const cropperRef = ref(null);

function change({ canvas }) {
  if (canvas) {
      // GỌI HÀM CẬP NHẬT: Không gửi đi ngay, chỉ cập nhật FormData
    prepareForUpload(canvas); 
  }
}

function prepareForUpload(canvas) {
  canvas.toBlob((blob) => {
    if (blob) {
      // SỬ DỤNG SET() ĐỂ GHI ĐÈ:
      // Nếu 'cover_image' đã tồn tại, nó sẽ bị ghi đè bằng 'blob' mới.
      // uploadFormData.value.set(IMAGE_KEY, blob, 'cropped_cover.jpg');
      bookData.anhBia = new File([blob], 'cropped_cover.jpg', { type: 'image/jpeg' });
      
      console.log(`FormData đã được cập nhật. Key bookImg chỉ có 1 giá trị.`);
    }
  }, 'image/jpeg', 0.9);
}

const props = defineProps(['currentActivebook', 'isActive', 'publishers'])
const emit = defineEmits(['update:isActive', 'update-book'])
const bookData = reactive(props.currentActivebook)
const disableSubmit = ref(false)

const bookImg = ref(API_ROOT + '/images/' + bookData.anhBia)
const bookImgs = ref([...bookData.anhChiTiet])

const handleUploadImage = (e) => {
  bookImg.value = URL.createObjectURL(e.target?.files[0])
  bookData.anhBia = e.target?.files[0]
}

const handleUploadImages = (e) => {
  const files = e.target?.files || []
  for (let i = 0; i < e.target?.files.length; i++) {
    bookImgs.value.push(URL.createObjectURL(files[i]))
  }
  const filesArray = Array.from(bookData.anhChiTiet)
  const newFiles = Array.from(e.target?.files || [])
  bookData.anhChiTiet = [...filesArray, ...newFiles]
}

const deleteAnImage = () => {
  if (bookImg.value && bookImg.value.includes('5173')) {
    URL.revokeObjectURL(bookImg.value)
    bookImg.value = null
    bookData.anhBia = null
  } else if (bookImg.value) {
    bookImg.value = null
    bookData.anhBia = null
  }
}

const deleteOneInImages = (img, index) => {
  if (img && img.includes('5173')) {
    URL.revokeObjectURL(img)
    bookImgs.value = bookImgs.value.filter((i) => i !== img)
    const filesArray = Array.from(bookData.anhChiTiet)
    filesArray.splice(index, 1)
    bookData.anhChiTiet = filesArray
  } else if (img) {
    bookImgs.value = bookImgs.value.filter((i) => i !== img)
    const filesArray = Array.from(bookData.anhChiTiet)
    filesArray.splice(index, 1)
    bookData.anhChiTiet = filesArray
  }
}

const handleAdjust = async () => {
  const formData = new FormData()
  Object.keys(bookData).forEach((key) => {
    if (key === 'anhChiTiet' && bookData.anhChiTiet) {
      for (let i = 0; i < bookData.anhChiTiet.length; i++) {
        if (typeof bookData.anhChiTiet[i] === 'string') {
          formData.append('bookImgsOld', bookData.anhChiTiet[i])
        } else {
          formData.append('bookImgs', bookData.anhChiTiet[i])
        }
      }
    } else if (key === 'anhBia') {
      if (typeof bookData.anhBia === 'string') {
        formData.append('bookImgOld', bookData.anhBia)
      } else {
        formData.append('bookImg', bookData.anhBia)
      }
    } else if (key === 'theLoai') {
      formData.append(key, JSON.stringify(bookData[key]))
    } else {
      formData.append(key, bookData[key])
    }
  })
  updateBookAPI(bookData._id, formData).then((book) => {
    toast.success("Cập nhật sách thành công", {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    const newPublisher = props.publishers.find((p) => p.maNXB === bookData.maNXB)
    emit('update:isActive', false)
    emit('update-book', book, newPublisher)
  })
}

const handleSubmit = () => {
  handleAdjust()
}
</script>
<template>
  <div class="p-5 mt-5 mx-4">
    <form @submit.prevent="handleSubmit" class="space-y-2 grid grid-cols-12 gap-x-4 gap-y-0">
      <div class="col-span-4 row-span-3 flex flex-col items-center justify-center min-w-[300px]">
        <div>
          <div v-if="bookImg" class="relative group">
            <div class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10">
              <button type="button" @click="deleteAnImage" class="btn btn-circle btn-ghost">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </div>
            <cropper
              ref="cropperRef"
              class="w-[200px] h-[300px]"
              :src="bookImg"
              :stencil-props="{ aspectRatio: 2/3 }"
              @change="change"
            />
            <!-- <img v-if="bookImg.includes('5173')" :src="bookImg" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt="hello">
            <img v-else :src="API_ROOT + '/images/' + bookImg" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt=""> -->
          </div>
          <label v-else for="dropzone-file" class="flex flex-col items-center justify-center w-[180px] h-[270px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div class="flex flex-col items-center justify-center p-5">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Chọn ảnh bìa</span></p>
            </div>
            <input required id="dropzone-file" @change="handleUploadImage" type="file" class="opacity-0" />
          </label>
        </div>
        <div class="flex w-[320px] flex-wrap justify-center gap-2 mt-4 max-h-56 overflow-auto">
          <label class="flex flex-col px-3 items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <font-awesome-icon icon="fa-solid fa-upload" class="text-3xl text-gray-500" />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400"><span class="font-semibold">Ảnh chi tiết</span></p>
            <input @change="handleUploadImages" multiple type="file" class="hidden" />
          </label>
          <div v-for="(img, index) in bookImgs" class="relative group">
            <div class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10">
              <button type="button" @click="deleteOneInImages(img, index)" class="btn btn-circle btn-ghost">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </div>
            <div class="w-24 h-24 rounded border-2 border-base-300 overflow-hidden">
              <img v-if="img.includes('5173')" :src="img" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer" alt="">
              <img v-else :src="API_ROOT + '/images/' + img" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer" alt="">
            </div>
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
          <select required v-model="bookData.maNXB" class="select">
            <option value="" disabled selected>Chọn nhà xuất bản</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">{{ publisher.tenNXB }}</option>
          </select>
        </fieldset>
      </div>
      <div class="col-span-8 col-start-5">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Thể loại</legend>
          <div class="grid grid-cols-4 gap-2">
            <label v-for="genre in BOOK_GENRES" class="label">
              <input type="checkbox" :value="genre" v-model="bookData.theLoai" class="checkbox" />
              {{ genre }}
            </label>
          </div>
        </fieldset>
      </div>
      <div class="col-span-8 col-start-5">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mô tả</legend>
          <textarea required v-model="bookData.moTa" class="textarea h-24 w-full" placeholder="Đây là mô tả của quyển sách"></textarea>
        </fieldset>
      </div>
      <div class="col-span-12 flex justify-end">
        <button type="submit" :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']">Cập nhật</button>
        <button @click="emit('update:isActive', false)" type="reset" :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']">Thoát</button>
      </div>
    </form>
  </div>
</template>
