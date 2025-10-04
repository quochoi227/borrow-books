<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { uploadImageAPI, addNewBookAPI, fetchBooksAPI, deleteBookAPI, fetchPublishersAPI, uploadImagesAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { cloneDeep } from 'lodash'
import BookDetails from './BookDetails.vue'
import { API_ROOT } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import GenresSelect from '@/components/GenresSelect.vue'

const modal = ref(null)

const disableSubmit = ref(false)
const books = ref([])
const publishers = ref([])
const isActive = ref(false)

const rowsPerPage = ref(5)
const currentPage = ref(1)
const pageSum = ref(0)

const filterMode = ref(false)

const searchValue = ref('')
const publisherValue = ref('all')
const stockState = ref('available')

const handleIncrease = () => {
  if (currentPage.value < pageSum.value) {
    currentPage.value++
  }
}

const handleDecrease = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(() => books.value.length, (newVal) => {
  bookData.maSach = 'B' + String(newVal + 1).padStart(4, '0')
  pageSum.value = Math.ceil(newVal / rowsPerPage.value)
  if (newVal % rowsPerPage.value === 0 && currentPage.value > 1 && currentPage.value === pageSum.value + 1) {
    currentPage.value--
  }
})

onMounted(() => {
  fetchBooksAPI().then((data) => {
    bookData.maSach = 'B' + String(data.length + 1).padStart(4, '0')
    books.value = data
    pageSum.value = Math.ceil(data.length / rowsPerPage.value)// booksAfter.value = data.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  })
  fetchPublishersAPI().then((data) => {
    publishers.value = data
  })
})

const remainingCheck = (num) => {
  if (num === 0) return 'out-of-stock'
  return 'available'
}

const booksAfter = computed(() => {
  if (searchValue.value === '' && publisherValue.value === 'all' && stockState.value === 'available') {
    filterMode.value = false
    return books.value.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  } else {
    filterMode.value = true
    return books.value.filter((book) => {
      return book.tenSach.toLowerCase().includes(searchValue.value.toLowerCase()) && (publisherValue.value === 'all' || book.maNXB.toLowerCase().includes(publisherValue.value.toLowerCase())) && (stockState.value === 'available' || remainingCheck(book.conLai) === stockState.value)
    })
  }
})

const bookData = reactive({
  maSach: '',
  tenSach: '',
  donGia: '',
  soQuyen: '',
  namXuatBan: '',
  conLai: '',
  maNXB: '',
  moTa: '',
  anhBia: '',
  anhChiTiet: []
})

const handleUploadImage = (e) => {
  disableSubmit.value = true
  let formData = new FormData()
  formData.append('bookImg', e.target?.files[0])
  uploadImageAPI(formData).then((data) => {
    bookData.anhBia = data.img
    currentActiveBook.anhBia = data.img
  }).finally(() => {
    disableSubmit.value = false
  })
}

const handleUploadImages = (e) => {
  disableSubmit.value = true
  let formData = new FormData()
  const files = e.target?.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append('bookImgs', files[i])
    }
  }
  uploadImagesAPI(formData).then((data) => {
    bookData.anhChiTiet.push(...data)
  }).finally(() => {
    disableSubmit.value = false
  })
}

const deleteOneInImages = (img) => {
  bookData.anhChiTiet = bookData.anhChiTiet.filter((i) => i !== img)
}

const newPublisher = ref('')

const handleSubmit = () => {
  addNewBookAPI(bookData).then((data) => {
    newPublisher.value = publishers.value.find((publisher) => publisher.maNXB === data.maNXB)
    books.value.push(data)
    if (currentPage.value === pageSum.value && booksAfter.length < rowsPerPage.value) {
      booksAfter.push(data)
    }
    toast.success('Thêm sách thành công!', {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    modal.value.close()
  })
}

const currentActiveBook = ref()

const handleActiveBook = (book) => {
  currentActiveBook.value = cloneDeep(book)
  isActive.value = true
}

const handleDeleteBook = (maSach) => {
  deleteBookAPI(maSach).then(() => {
    toast.success("Xóa sách thành công", {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    books.value = books.value.filter((book) => {
      return book._id !== maSach
    })
  })
}

const handleUpdateBook = (book, newPublisher) => {
  const targetBook = books.value.find((b) => b._id === book._id)
  for (let key in book) {
    targetBook[key] = book[key]
  }
  targetBook.nhaXuatBan = newPublisher
}

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (maSach) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận xóa?' })

  if(isCanceled) return
  handleDeleteBook(maSach)
}
</script>

<template>
  <BookDetails
    v-if="isActive"
    @update-book="handleUpdateBook"
    v-model:isActive="isActive"
    :currentActivebook="currentActiveBook"
    :publishers="publishers"
  />
  <div v-else class="w-full h-full relative">
    <dialog ref="modal" class="modal">
      <div class="modal-box w-fit max-w-full">
        <form @submit.prevent="handleSubmit" class="space-y-2 grid grid-cols-12 gap-x-4 gap-y-0">
          <div class="col-span-4 row-span-2">
            <div class="w-fit h-full flex justify-center min-w-[300px] items-center">
              <div v-if="bookData.anhBia" class="relative group w-[180px] h-[270px]">
                <div class="hidden group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10">
                  <button type="button" @click="bookData.anhBia = ''" class="btn btn-circle btn-ghost">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </button>
                </div>
                <img :src="API_ROOT + '/images/' + bookData.anhBia" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer rounded-lg" alt="">
              </div>
              <label v-else for="dropzone-file" class="flex flex-col items-center justify-center w-[180px] h-[270px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                <div class="flex flex-col items-center justify-center p-5">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Chọn ảnh bìa</span></p>
                </div>
                <input required id="dropzone-file" @change="handleUploadImage" type="file" class="opacity-0" />
              </label>
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
                    <button type="button" @click="deleteOneInImages(img)" class="btn btn-circle btn-ghost">
                      <font-awesome-icon icon="fa-solid fa-trash" />
                    </button>
                  </div>
                  <div class="w-28 h-28 rounded border-2 border-base-300 overflow-hidden">
                    <img :src="API_ROOT + '/images/' + img" class="w-full h-full object-contain group-hover:brightness-50 cursor-pointer" alt="">
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
      <form method="dialog" class="modal-backdrop">
        <button></button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div class="m-2 mt-3 p-2 bg-white shadow-md rounded">
      <div class="flex gap-2 p-2 rounded-lg relative">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input v-model="searchValue" type="text" placeholder="Tìm theo tên sách" />
          </label>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Theo NXB</legend>
          <select v-model="publisherValue" class="select">
            <option value="all">Tất cả</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">{{ publisher.tenNXB }}</option>
          </select>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Trạng thái</legend>
          <select v-model="stockState" class="select">
            <option value="available">Có sẵn</option>
            <option value="out-of-stock">Đã mượn hết</option>
          </select>
        </fieldset>
        <button @click="modal.showModal()" class="btn btn-primary text-white absolute right-2 bottom-2">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm sách
        </button>
      </div>
      <div class="overflow-auto px-2 h-[460px]">
        <table class="table bg-white overflow-hidden shadow-md">
          <thead>
            <tr class="bg-primary text-white">
              <th>Mã sách</th>
              <th>Ảnh bìa</th>
              <th>Tên sách</th>
              <th>Mô tả</th>
              <th>Đơn giá</th>
              <th>Số quyển</th>
              <th>Nhà xuất bản</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book) in booksAfter" class="hover:bg-base-300">
              <td class="py-1">{{ book.maSach }}</td>
              <td class="max-w-[230px] flex items-center gap-4 py-1">
                <div class="avatar">
                  <div class="w-16 rounded">
                    <img class="w-full h-full object-cover" :src="API_ROOT + '/images/' + book.anhBia" alt="Book image">
                  </div>
                </div>
              </td>
              <td class="py-1 max-w-[200px]">
                <div
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-word;
                    "
                  class="text-sm leading-snug"
                >
                  {{ book.tenSach }}
                </div>
              </td>
              <td class="py-1 max-w-[200px]">
                <div
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-word;
                  "
                  class="text-sm leading-snug"
                >
                  {{ book.moTa }}
                </div>
              </td>
              <td class="py-1 font-semibold text-amber-600">{{ formatCurrency(book.donGia || 0) }}</td>
              <td class="py-1">
                <div :class="['badge', book.soQuyen ? 'badge-warning' : 'badge-error' ]">{{ book.soQuyen }}</div>
              </td>
              <td class="py-1">{{ book.nhaXuatBan?.tenNXB || newPublisher.tenNXB }}</td>
              <td class="py-1 space-x-1">
                <button @click="confirmDelete(book._id)" class="btn btn-error btn-sm btn-circle">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
                <button @click="handleActiveBook(book)" class="btn btn-sm btn-info btn-circle">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!filterMode" class="flex justify-end mt-1 px-2">
        <div class="join">
          <button @click="handleDecrease" :class="['join-item btn', { 'btn-disabled': currentPage === 1 }]">«</button>  
          <button v-for="n in pageSum" @click="() => currentPage = n" :class="['join-item btn', { 'btn-primary': currentPage === n }]">{{ n }}</button>
          <button @click="handleIncrease" :class="['join-item btn', { 'btn-disabled': currentPage === pageSum }]">»</button>
        </div>
      </div>
    </div>
  </div>
</template>
