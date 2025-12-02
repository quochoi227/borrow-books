<script setup>
import { BOOK_GENRES } from '@/utils/constants'
import { reactive, watch, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

// Crop image
const cropperRef = ref(null)

function change({ canvas }) {
  if (canvas) {
    // GỌI HÀM CẬP NHẬT: Không gửi đi ngay, chỉ cập nhật FormData
    prepareForUpload(canvas)
  }
}

function prepareForUpload(canvas) {
  canvas.toBlob(
    (blob) => {
      if (blob) {
        // SỬ DỤNG SET() ĐỂ GHI ĐÈ:
        // Nếu 'cover_image' đã tồn tại, nó sẽ bị ghi đè bằng 'blob' mới.
        // uploadFormData.value.set(IMAGE_KEY, blob, 'cropped_cover.jpg');
        bookData.anhBia = new File([blob], 'cropped_cover.jpg', {
          type: 'image/jpeg'
        })

        // console.log(`FormData đã được cập nhật. Key bookImg chỉ có 1 giá trị.`);
      }
    },
    'image/jpeg',
    0.9
  )
}

const props = defineProps(['bookData', 'publishers'])
const emit = defineEmits(['submit', 'closeModal'])
const bookData = reactive({
  maSach: '',
  tenSach: '',
  tacGia: '',
  donGia: '',
  soQuyen: '',
  soQuyenConLai: '',
  namXuatBan: '',
  maNXB: '',
  moTa: '',
  anhBia: null,
  anhChiTiet: [],
  theLoai: []
})

const disableSubmit = ref(false)

watch(
  () => props.bookData,
  (newVal) => {
    for (let key in newVal) {
      bookData[key] = newVal[key]
    }
  }
)

const bookImg = ref(null)
const bookImgs = ref([])

const handleSubmit = () => {
  emit('submit', bookData)
}

const handleUploadImage = (e) => {
  bookImg.value = URL.createObjectURL(e.target?.files[0])
  // bookData.anhBia = e.target?.files[0]
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
  if (bookImg.value) {
    URL.revokeObjectURL(bookImg.value)
    bookImg.value = ''
    bookData.anhBia = null
  }
}

const deleteOneInImages = (img, index) => {
  if (img) {
    URL.revokeObjectURL(img)
    bookImgs.value = bookImgs.value.filter((i) => i !== img)
    const filesArray = Array.from(bookData.anhChiTiet)
    filesArray.splice(index, 1)
    bookData.anhChiTiet = filesArray
  }
}

const closeModal = () => {
  emit('closeModal')
  URL.revokeObjectURL(bookImg.value)
  bookImgs.value.forEach((img) => URL.revokeObjectURL(img))
  bookImg.value = ''
  bookImgs.value = []
}
</script>
<template>
  <div class="modal-box w-fit max-w-full">
    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-12 space-y-2 gap-x-4 gap-y-0"
    >
      <div
        class="col-span-4 row-span-3 flex min-w-[300px] flex-col items-center justify-center"
      >
        <div>
          <div v-if="bookImg" class="group relative">
            <div
              class="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-white group-hover:block"
            >
              <button
                type="button"
                @click="deleteAnImage"
                class="btn btn-circle btn-ghost"
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </div>
            <Cropper
              ref="cropperRef"
              class="h-[360px] w-[240px]"
              :src="bookImg"
              :stencil-props="{ aspectRatio: 2 / 3 }"
              @change="change"
            />
            <!-- <img :src="bookImg" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt=""> -->
          </div>
          <label
            v-else
            for="dropzone-file"
            class="flex h-[270px] w-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
          >
            <div class="flex flex-col items-center justify-center p-5">
              <font-awesome-icon
                icon="fa-solid fa-arrow-up-from-bracket"
                class="text-3xl"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Chọn ảnh bìa</span>
              </p>
            </div>
            <input
              required
              id="dropzone-file"
              @change="handleUploadImage"
              type="file"
              class="opacity-0"
            />
          </label>
        </div>
        <div
          class="mt-4 flex max-h-56 w-[320px] flex-wrap justify-center gap-2 overflow-auto"
        >
          <label
            class="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-3"
          >
            <font-awesome-icon
              icon="fa-solid fa-arrow-up-from-bracket"
              class="text-2xl"
            />
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Ảnh chi tiết</span>
            </p>
            <input
              @change="handleUploadImages"
              multiple
              type="file"
              class="hidden"
            />
          </label>
          <div v-for="(img, index) in bookImgs" class="group relative">
            <div
              class="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-white group-hover:block"
            >
              <button
                type="button"
                @click="deleteOneInImages(img, index)"
                class="btn btn-circle btn-ghost"
              >
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </div>
            <div
              class="border-base-300 h-24 w-24 overflow-hidden rounded border-2"
            >
              <img
                :src="img"
                class="h-full w-full cursor-pointer object-contain group-hover:brightness-50"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mã sách</legend>
          <input
            required
            v-model="bookData.maSach"
            pattern="^B\d{4}$"
            title="Bắt đầu bằng ký tự B và kết thúc bằng 4 chữ số"
            type="text"
            class="input"
            placeholder="B0001"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tên sách</legend>
          <input
            required
            v-model="bookData.tenSach"
            type="text"
            class="input"
            placeholder="Lão Hạc"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Đơn giá</legend>
          <input
            required
            v-model="bookData.donGia"
            type="number"
            class="input"
            placeholder="45000"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tác giả</legend>
          <input
            required
            v-model="bookData.tacGia"
            type="text"
            class="input"
            placeholder="Nam Cao"
          />
        </fieldset>
      </div>
      <div class="col-span-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Số quyển</legend>
          <input
            required
            v-model="bookData.soQuyen"
            type="number"
            class="input"
            placeholder="70"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Năm xuất bản</legend>
          <input
            required
            v-model="bookData.namXuatBan"
            type="number"
            class="input"
            placeholder="1943"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Nhà xuất bản</legend>
          <!-- <input v-model="bookData.maNXB" type="text" class="input" placeholder="NXB001" /> -->
          <select required v-model="bookData.maNXB" class="select">
            <option value="" disabled selected>Chọn nhà xuất bản</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">
              {{ publisher.tenNXB }}
            </option>
          </select>
        </fieldset>
      </div>
      <div class="col-span-8 col-start-5">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Thể loại</legend>
          <div class="grid grid-cols-4 gap-2">
            <label v-for="genre in BOOK_GENRES" class="label">
              <input
                type="checkbox"
                :value="genre"
                v-model="bookData.theLoai"
                class="checkbox"
              />
              {{ genre }}
            </label>
          </div>
        </fieldset>
      </div>
      <div class="col-span-8 col-start-5">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mô tả</legend>
          <textarea
            required
            v-model="bookData.moTa"
            class="textarea h-24 w-full"
            placeholder="Đây là mô tả của quyển sách"
          ></textarea>
        </fieldset>
      </div>
      <div class="col-span-12 flex justify-end">
        <button
          type="submit"
          :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']"
        >
          Thêm
        </button>
        <button
          @click="closeModal"
          type="reset"
          :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']"
        >
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>
