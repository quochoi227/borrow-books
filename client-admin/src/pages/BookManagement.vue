<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteBookAPI } from '@/apis'
// import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { API_ROOT } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import AddBookModal from '@/components/AddBookModal.vue'
import { useDebounceFn } from '@/composables/useDebounceFn'
import { useBookStore } from '@/stores/bookStore'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const route = useRoute()
const router = useRouter()
// Access book store
const bookStore = useBookStore()
const { books, publishers, totalPages } = toRefs(bookStore)
const { addBook, deleteBook, fetchBooks, fetchPublishers } = bookStore

// Handle search input with debounce
const handleInput = (value) => {
  searchValue.value = value
  fetchBooks({ search: searchValue.value })
}

const debouncedInput = useDebounceFn(handleInput, 500)

const handleInputChange = (e) => {
  debouncedInput.value(e.target.value)
}
const currentPage = ref(1)
const searchValue = ref('')
const publisherValue = ref('')
const stockState = ref('available')

watch(() => route.query, (newQuery) => {
  const page = parseInt(newQuery.page) || 1
  currentPage.value = page
  fetchBooks({ page, search: searchValue.value, publisher: publisherValue.value, stockState: stockState.value })
}, { immediate: true })

onMounted(() => {
  fetchPublishers()
})

const modal = ref(null)

watch(publisherValue, (newVal) => {
  fetchBooks({ page: currentPage.value, search: searchValue.value, publisher: newVal, stockState: stockState.value })
})

watch(stockState, (newVal) => {
  fetchBooks({ page: currentPage.value, search: searchValue.value, publisher: publisherValue.value, stockState: newVal })
})

const handleIncrease = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    router.replace({ query: { page: currentPage.value } })
  }
}

const handleDecrease = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    router.replace({ query: { page: currentPage.value } })
  }
}

const handleSubmit = (bookData) => {
  modal.value.close()
  addBook(bookData)
}

const closeModal = () => {
  modal.value.close()
}

const handleDeleteBook = (maSach) => {
  deleteBookAPI(maSach).then(() => {
    // deleteBook(maSach)
    // if (books.value.length === 0 && currentPage.value > 1) {
    //   currentPage.value--
    //   router.replace({ query: { page: currentPage.value } })
    // }
    fetchBooks({ page: currentPage.value, search: searchValue.value, publisher: publisherValue.value, stockState: stockState.value })
    toast.success("Xóa sách thành công")
  })
}

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
        :publishers="publishers"
      />
      <form method="dialog" class="modal-backdrop">
        <button></button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div>
      <div class="flex gap-2 p-2 rounded-lg items-end">
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input @input="handleInputChange" type="text" placeholder="Tìm theo tên sách" />
          </label>
        </fieldset>
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Theo NXB</legend>
          <select v-model="publisherValue" class="select">
            <option value="">Tất cả</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">{{ publisher.tenNXB }}</option>
          </select>
        </fieldset>
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Trạng thái</legend>
          <select v-model="stockState" class="select">
            <option value="available">Có sẵn</option>
            <option value="unavailable">Đã mượn hết</option>
          </select>
        </fieldset>
        <div class="flex-1 flex justify-end mt-1">
          <div class="join">
            <button @click="handleDecrease" :class="['join-item btn', { 'btn-disabled': currentPage === 1 }]">«</button>  
            <RouterLink v-for="n in totalPages" :to="{ query: { page: n }, replace: true }">
              <button @click="() => currentPage = n" :class="['join-item btn', { 'btn-primary': currentPage === n }]">{{ n }}</button>
            </RouterLink>
            <button @click="handleIncrease" :class="['join-item btn', { 'btn-disabled': currentPage === totalPages || totalPages === 0 }]">»</button>
          </div>
        </div>
        <button @click="modal.showModal()" class="btn btn-primary">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm sách
        </button>
      </div>
      <div class="overflow-x-auto px-2">
        <table class="table bg-base-200 overflow-hidden">
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
            <tr v-for="(book) in books" class="hover:bg-base-300">
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
              <td class="py-1">{{ book.nhaXuatBan?.tenNXB }}</td>
              <td class="py-1 space-x-1">
                <button @click="confirmDelete(book._id)" class="btn btn-error btn-sm btn-square">
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
                <RouterLink :to="'/books/' + book._id">
                  <button class="btn btn-sm btn-info btn-square">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                  </button>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
