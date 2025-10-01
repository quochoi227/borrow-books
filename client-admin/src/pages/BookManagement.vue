<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { uploadImageAPI, addNewBookAPI, fetchBooksAPI, deleteBookAPI, fetchSourcesAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { cloneDeep } from 'lodash'
import BookDetails from './BookDetails.vue'

const disableSubmit = ref(false)
const books = ref([])
const publishers = ref([])
const isActive = ref(false)

const rowsPerPage = ref(5)
const currentPage = ref(1)
const pageSum = ref(0)

const filterMode = ref(false)

const searchValue = ref('')
const sourceValue = ref('all')
const stockState = ref('all')

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
  console.log(newVal)
  pageSum.value = Math.ceil(newVal / rowsPerPage.value)
  if (newVal % rowsPerPage.value === 0 && currentPage.value > 1 && currentPage.value === pageSum.value + 1) {
    currentPage.value--
  }
})

onMounted(() => {
  fetchBooksAPI().then((data) => {
    books.value = data
    pageSum.value = Math.ceil(data.length / rowsPerPage.value)// booksAfter.value = data.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  })
  fetchSourcesAPI().then((data) => {
    publishers.value = data
  })
})

const remainingCheck = (num) => {
  if (num === 0) return 'out-of-stocked'
  return 'available'
}

const booksAfter = computed(() => {
  if (searchValue.value === '' && sourceValue.value === 'all' && stockState.value === 'all') {
    filterMode.value = false
    return books.value.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  } else {
    filterMode.value = true
    return books.value.filter((book) => {
      return book.name.toLowerCase().includes(searchValue.value.toLowerCase()) && (sourceValue.value === 'all' || book.publisherId.toLowerCase().includes(sourceValue.value.toLowerCase())) && (stockState.value === 'all' || remainingCheck(book.remaining) === stockState.value)
    })
  }
})

const bookData = reactive({
  bookId: '',
  name: '',
  unitPrice: 0,
  stock: 0,
  publishedYear: 2025,
  remaining: 0,
  publisherId: '',
  description: '',
  image: ''
})

const handleUpload = (e) => {
  disableSubmit.value = true
  let formData = new FormData()
  formData.append('bookImg', e.target?.files[0])
  uploadImageAPI(formData).then((data) => {
    bookData.image = data.secure_url
    currentActiveBook.image = data.secure_url
  }).finally(() => {
    disableSubmit.value = false
  })
}

const handleSubmit = () => {
  addNewBookAPI(bookData).then((data) => {
    books.value.push(data)
    if (currentPage.value === pageSum.value && booksAfter.length < rowsPerPage.value) {
      booksAfter.push(data)
    }
    toast.success('Thêm sách thành công!', {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
  })
}

const currentActiveBook = ref()

const handleActiveBook = (book) => {
  currentActiveBook.value = cloneDeep(book)
  isActive.value = true
}

const handleDeleteBook = (bookId) => {
  deleteBookAPI(bookId).then(() => {
    toast.success("Xóa sách thành công", {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    books.value = books.value.filter((book) => {
      return book._id !== bookId
    })
  })
}

const handleUpdateBook = (book) => {
  const targetBook = books.value.find((b) => b._id === book._id)
  for (let key in book) {
    targetBook[key] = book[key]
  }
}

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (bookId) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận xóa?' })

  if(isCanceled) return
  handleDeleteBook(bookId)
}
</script>

<template>
  <BookDetails v-if="isActive" @update-book="handleUpdateBook" v-model:isActive="isActive" v-model:currentActivebook="currentActiveBook" />
  <div v-else class="w-full h-full relative">
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box w-fit max-w-5xl">
        <div class="space-y-2 grid grid-cols-12 gap-x-4 gap-y-0">
          <div class="w-fit flex flex-col items-center col-span-4 row-span-2 gap-4">
            <h2 class="text-xl">Ảnh tổng quan</h2>
            <div class="w-[220px] h-[300px]">
              <img :src="bookData.image || 'https://placehold.co/400x600'" class="w-full h-full object-contain" alt="">
            </div>
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
            <button @click="handleSubmit" onclick="my_modal_3.close()" type="button" :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']">Thêm</button>
            <button onclick="my_modal_3.close()" type="button" :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']">Hủy</button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div class="p-2 mt-1">
      <div class="flex gap-2 p-2 bg-white rounded-lg shadow-md relative">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input v-model="searchValue" type="text" placeholder="Tìm theo tên sách, tác giả,..." />
          </label>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Theo NXB</legend>
          <select v-model="sourceValue" class="select">
            <option value="all">Tất cả</option>
            <option v-for="publisher in publishers" :value="publisher.publisherId">{{ publisher.name }}</option>
          </select>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Trạng thái</legend>
          <select v-model="stockState" class="select">
            <option value="all">Tất cả</option>
            <option value="available">Có sẵn</option>
            <option value="out-of-stocked">Đã mượn hết</option>
          </select>
        </fieldset>
        <!-- <fieldset class="fieldset">
          <legend class="fieldset-legend">Thêm sách</legend>
          <button onclick="my_modal_3.showModal()" class="btn bg-main text-white">
            <font-awesome-icon icon="fa-solid fa-plus" />
          </button>
        </fieldset> -->
        <button onclick="my_modal_3.showModal()" class="btn btn-primary text-white absolute right-2 bottom-2">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm sách
        </button>
      </div>
    </div>
    <div class="overflow-auto px-2 min-h-[460px] max-h-[520px]">
      <table class="table bg-white overflow-hidden shadow-md">
        <thead>
          <tr class="bg-primary text-white">
            <th>Mã sách</th>
            <th>Ảnh bìa</th>
            <th>Tên sách</th>
            <th>Mô tả</th>
            <th>Đơn giá</th>
            <th>Tổng số lượng</th>
            <th>Còn lại</th>
            <th>Nhà xuất bản</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book) in booksAfter" class="hover:bg-base-300">
            <td class="py-1">{{ book.bookId }}</td>
            <td class="max-w-[230px] flex items-center gap-4 py-1">
              <div class="min-w-[44px] max-w-[44px] h-[70px]">
                <img class="w-full h-full object-contain" :src="book.image" alt="Book image">
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
                {{ book.name }}
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
                {{ book.description }}
              </div>
            </td>
            <td class="py-1">{{ book.unitPrice }}đ</td>
            <td class="py-1 text-center">
              <div class="badge badge-primary">{{ book.stock }}</div>
            </td>
            <td class="py-1 text-center">
              <div class="badge badge-warning">{{ book.remaining || 10 }}</div>
            </td>
            <td class="py-1">{{ book.source ? book.source[0]?.name : 'No data' }}</td>
            <td class="py-1 space-x-1">
              <button @click="confirmDelete(book._id)" class="btn btn-error btn-sm btn-circle">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
              <button @click="handleActiveBook(book)" class="btn btn-sm btn-info btn-circle">
                <font-awesome-icon icon="fa-solid fa-list-ul" />
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
</template>
