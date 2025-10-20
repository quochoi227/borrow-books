<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import { addNewBookAPI, deleteBookAPI, fetchPublishersAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { cloneDeep } from 'lodash'
import { API_ROOT } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import AddBookModal from '@/components/AddBookModal.vue'
import { useDebounceFn } from '@/composables/useDebounceFn'
import { useBookStore } from '@/stores/bookStore'

const bookStore = useBookStore()

const handleInput = (value) => {
  searchValue.value = value
}

const debouncedInput = useDebounceFn(handleInput, 500)

const handleInputChange = (e) => {
  debouncedInput.value(e.target.value)
}

const modal = ref(null)

const books = ref([])
const publishers = ref([])

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
  pageSum.value = Math.ceil(newVal / rowsPerPage.value)
  if (newVal % rowsPerPage.value === 0 && currentPage.value > 1 && currentPage.value === pageSum.value + 1) {
    currentPage.value--
  }
})

watch(
  () => bookStore.books,
  (newBooks) => {
    books.value = newBooks
    pageSum.value = Math.ceil(newBooks.length / rowsPerPage.value)
  },
  { immediate: true }
)

onMounted(() => {
  fetchPublishersAPI().then((data) => {
    publishers.value = data
  })
})

onUnmounted(() => {
  bookStore.setBooks(books.value)
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

const newPublisher = ref(null)

const handleSubmit = (bookData) => {
  const formData = new FormData()
  Object.keys(bookData).forEach((key) => {
    if (key === 'anhChiTiet' && bookData.anhChiTiet) {
      for (let i = 0; i < bookData.anhChiTiet.length; i++) {
        formData.append('bookImgs', bookData.anhChiTiet[i])
      }
    } else if (key === 'anhBia') {
      formData.append('bookImg', bookData.anhBia)
    } else if (key === 'theLoai') {
      formData.append('theLoai', JSON.stringify(bookData[key]))
    } else if (key === 'soQuyenConLai') {
      formData.append('soQuyenConLai', bookData.soQuyen)
    } else {
      formData.append(key, bookData[key])
    }
  })
  addNewBookAPI(formData).then((data) => {
    newPublisher.value = publishers.value.find((publisher) => publisher.maNXB === data.maNXB)
    books.value.push({
      ...data,
      nhaXuatBan: {
        ...newPublisher.value
      }
    })
    if (currentPage.value === pageSum.value && booksAfter.length < rowsPerPage.value) {
      booksAfter.push(data)
    }
    toast.success('Thêm sách thành công!', {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    modal.value.close()
  }).catch((err) => {
    console.log(err)
  })
}

const closeModal = () => {
  modal.value.close()
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

// const handleUpdateBook = (book, newPublisher) => {
//   const targetBook = books.value.find((b) => b._id === book._id)
//   for (let key in book) {
//     targetBook[key] = book[key]
//   }
//   targetBook.nhaXuatBan = newPublisher
// }

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (maSach) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận xóa?' })

  if(isCanceled) return
  handleDeleteBook(maSach)
}
</script>

<template>
  <div class="w-full h-full relative">
    <dialog ref="modal" class="modal z-0">
      <AddBookModal
        @submit="handleSubmit"
        @closeModal="closeModal"
        :bookData="bookData"
        :publishers="publishers"
      />
      <form method="dialog" class="modal-backdrop">
        <button></button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div>
      <div class="flex gap-2 p-2 rounded-lg relative">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input @input="handleInputChange" type="text" placeholder="Tìm theo tên sách" />
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
        <button @click="modal.showModal()" class="btn btn-primary absolute right-2 bottom-2">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm sách
        </button>
      </div>
      <div class="overflow-x-auto px-2">
        <table class="table">
          <thead>
            <tr>
              <th>Mã sách</th>
              <th>Ảnh bìa</th>
              <th>Tên sách</th>
              <th>Mô tả</th>
              <th>Đơn giá</th>
              <th>Số quyển</th>
              <th>Còn lại</th>
              <th>Nhà xuất bản</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book) in booksAfter" class="hover:bg-base-300">
              <td class="py-1">{{ book.maSach }}</td>
              <td class="max-w-[230px] flex items-center gap-4 py-1">
                  <div class="w-12 h-18 rounded overflow-hidden">
                    <img class="w-full h-full object-cover" :src="API_ROOT + '/images/' + book.anhBia" alt="Book image">
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
              <td class="py-1">
                <div :class="['badge', book.soQuyen ? 'badge-warning' : 'badge-error' ]">{{ book.soQuyenConLai }}</div>
              </td>
              <td class="py-1">{{ book.nhaXuatBan?.tenNXB || newPublisher?.tenNXB }}</td>
              <td class="py-1 space-x-1">
                <button @click="confirmDelete(book._id)" class="btn btn-error btn-sm btn-circle">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
                <RouterLink :to="'/books/' + book._id">
                  <button class="btn btn-sm btn-info btn-circle">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                  </button>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!filterMode" class="flex justify-end mt-1 px-2">
        <div class="join">
          <button @click="handleDecrease" :class="['join-item btn', { 'btn-disabled': currentPage === 1 }]">«</button>  
          <button v-for="n in pageSum" @click="() => currentPage = n" :class="['join-item btn', { 'btn-primary': currentPage === n }]">{{ n }}</button>
          <button @click="handleIncrease" :class="['join-item btn', { 'btn-disabled': currentPage === pageSum || pageSum === 0 }]">»</button>
        </div>
      </div>
    </div>
  </div>
</template>
