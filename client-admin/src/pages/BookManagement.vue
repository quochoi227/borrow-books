<script setup>
import { ref, toRefs, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteBookAPI, fetchBooksAPI } from '@/apis'
// import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { formatCurrency } from '@/utils/formatters'
import AddBookModal from '@/components/AddBookModal.vue'
import { useDebounceFn } from '@/composables/useDebounceFn'
import { useBookStore } from '@/stores/bookStore'
import { useAdminStore } from '@/stores/adminStore'
import { permissions } from '@/config/rbacConfig'
import { usePermission } from '@/composables/usePermission'

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

watch(
  () => route.query,
  (newQuery) => {
    const page = parseInt(newQuery.page) || 1
    currentPage.value = page
    fetchBooks({
      page,
      search: searchValue.value,
      publisher: publisherValue.value,
      stockState: stockState.value
    })
  },
  { immediate: true }
)

onMounted(() => {
  const adminStore = useAdminStore()
  const { currentActiveAdmin } = adminStore

  const { hasPermission } = usePermission(currentActiveAdmin.chucVu)
  if (!hasPermission(permissions.VIEW_BOOKS)) {
    router.push('/dashboard')
  }
  fetchPublishers()
})

const modal = ref(null)
const exportModal = ref(null)

watch(publisherValue, (newVal) => {
  fetchBooks({
    page: currentPage.value,
    search: searchValue.value,
    publisher: newVal,
    stockState: stockState.value
  })
})

watch(stockState, (newVal) => {
  fetchBooks({
    page: currentPage.value,
    search: searchValue.value,
    publisher: publisherValue.value,
    stockState: newVal
  })
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
    fetchBooks({
      page: currentPage.value,
      search: searchValue.value,
      publisher: publisherValue.value,
      stockState: stockState.value
    })
    toast.success('Xóa sách thành công')
  })
}

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (maSach) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận xóa?' })

  if (isCanceled) return
  handleDeleteBook(maSach)
}

// Xuất excel
import * as XLSX from 'xlsx'

// Mock data
const booksData = [
  {
    _id: { $oid: '69245b57b3d59099d06b379b' },
    maSach: 'B0001',
    tenSach: 'Lap Trinh',
    tacGia: 'Scratch',
    donGia: 34000,
    soQuyen: 98,
    soQuyenConLai: 97,
    namXuatBan: 1987,
    maNXB: 'NXB001',
    moTa: 'Sach lap trinh',
    anhBia:
      'https://res.cloudinary.com/dkg5xoyc0/image/upload/v1763990357/book_images/f2fwf69zn0fj1gngmfxe.jpg',
    anhChiTiet: [
      'https://res.cloudinary.com/.../img1.webp',
      'https://res.cloudinary.com/.../img2.webp'
    ],
    theLoai: ['Sách công nghệ thông tin', 'Truyện cổ tích'],
    luotMuon: 1,
    __v: 0
  }
]

const exportAllBooksToExcel = () => {
  fetchBooksAPI({ limit: 999 }).then((res) => {
    exportBooksToExcel(res.books)
  })
}

const exportBooksToExcel = (books) => {
  // BƯỚC 1: Xử lý dữ liệu (Mapping)
  // Lọc bỏ _id, __v và format lại mảng
  const processedData = books.map((book) => ({
    'Mã sách': book.maSach,
    'Tên sách': book.tenSach,
    'Tác giả': book.tacGia,
    'Đơn giá': book.donGia,
    'Số lượng': book.soQuyen,
    'Còn lại': book.soQuyenConLai,
    'Năm XB': book.namXuatBan,
    'Mã NXB': book.maNXB,
    'Mô tả': book.moTa,

    // XỬ LÝ QUAN TRỌNG: Gộp mảng thành chuỗi
    'Thể loại': book.theLoai ? book.theLoai.join(', ') : '',

    // Ảnh bìa để cuối để dễ xử lý link
    'Ảnh bìa': book.anhBia
  }))

  // BƯỚC 2: Tạo Worksheet
  const worksheet = XLSX.utils.json_to_sheet(processedData)

  // BƯỚC 3: Tạo Hyperlink cho cột "Ảnh bìa"
  // Xác định vị trí cột ảnh bìa.
  // Trong map ở trên, "Ảnh bìa" là key thứ 11 -> index là 10 (Cột J)
  const colIndexImg = 10

  const range = XLSX.utils.decode_range(worksheet['!ref'])

  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const address = XLSX.utils.encode_cell({ r: R, c: colIndexImg })
    const cell = worksheet[address]

    if (cell && cell.v) {
      // Tạo link click được
      cell.l = { Target: cell.v }
      // Đổi text hiển thị cho gọn (Tùy chọn)
      cell.v = '👉 Xem ảnh'
    }
  }

  // Tùy chỉnh độ rộng cột cho đẹp
  worksheet['!cols'] = [
    { wch: 10 }, // Mã sách
    { wch: 20 }, // Tên sách
    { wch: 15 }, // Tác giả
    { wch: 10 }, // Đơn giá
    { wch: 10 }, // SL
    { wch: 10 }, // Còn lại
    { wch: 10 }, // Năm
    { wch: 10 }, // Mã NXB
    { wch: 20 }, // Mô tả
    { wch: 30 }, // Thể loại (rộng chút vì gộp chuỗi)
    { wch: 15 } // Ảnh bìa
  ]

  // BƯỚC 4: Xuất file
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Sách')
  XLSX.writeFile(workbook, 'Danh_sach_Sach.xlsx')
}
</script>

<template>
  <div class="relative h-full w-full">
    <!-- Add book modal -->
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
    <!-- Open the modal using ID.showModal() method -->
    <!-- Export books modal -->
    <dialog ref="exportModal" class="modal">
      <div class="modal-box">
        <div class="flex justify-between">
          <button
            @click="exportAllBooksToExcel"
            class="btn bg-[#217346] text-white"
          >
            Xuất tất cả sách
          </button>
          <button
            @click="exportBooksToExcel(books)"
            class="btn bg-[#217346] text-white"
          >
            Xuất trang hiện tại
          </button>
          <button @click="exportModal.close()" class="btn">Hủy</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div>
      <div class="flex items-end gap-2 rounded-lg p-2">
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input
              @input="handleInputChange"
              type="text"
              placeholder="Tìm theo tên sách"
            />
          </label>
        </fieldset>
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Theo NXB</legend>
          <select v-model="publisherValue" class="select">
            <option value="">Tất cả</option>
            <option v-for="publisher in publishers" :value="publisher.maNXB">
              {{ publisher.tenNXB }}
            </option>
          </select>
        </fieldset>
        <fieldset class="fieldset py-0">
          <legend class="fieldset-legend">Trạng thái</legend>
          <select v-model="stockState" class="select">
            <option value="available">Có sẵn</option>
            <option value="unavailable">Đã mượn hết</option>
          </select>
        </fieldset>
        <button
          @click="exportModal.showModal()"
          class="btn bg-[#217346] text-white"
        >
          <font-awesome-icon icon="fa-solid fa-file-excel" />
          Xuất Excel
        </button>
        <div class="mt-1 flex flex-1 justify-end">
          <div class="join">
            <button
              @click="handleDecrease"
              :class="['join-item btn', { 'btn-disabled': currentPage === 1 }]"
            >
              «
            </button>
            <RouterLink
              v-for="n in totalPages"
              :to="{ query: { page: n }, replace: true }"
            >
              <button
                @click="() => (currentPage = n)"
                :class="['join-item btn', { 'btn-primary': currentPage === n }]"
              >
                {{ n }}
              </button>
            </RouterLink>
            <button
              @click="handleIncrease"
              :class="[
                'join-item btn',
                {
                  'btn-disabled': currentPage === totalPages || totalPages === 0
                }
              ]"
            >
              »
            </button>
          </div>
        </div>
        <button @click="modal.showModal()" class="btn btn-primary">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm sách
        </button>
      </div>
      <div class="overflow-x-auto px-2">
        <table class="bg-base-200 table overflow-hidden">
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
            <tr v-for="book in books" class="hover:bg-base-300">
              <td class="py-1">{{ book.maSach }}</td>
              <td class="flex max-w-[230px] items-center gap-4 py-1">
                <div class="h-18 w-12 overflow-hidden rounded">
                  <img
                    class="h-full w-full object-cover"
                    :src="book.anhBia"
                    alt="Book image"
                  />
                </div>
              </td>
              <td class="max-w-[200px] py-1">
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
              <td class="max-w-[200px] py-1">
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
              <td class="py-1 font-semibold text-amber-600">
                {{ formatCurrency(book.donGia || 0) }}
              </td>
              <td class="py-1">
                <div
                  :class="[
                    'badge',
                    book.soQuyen ? 'badge-warning' : 'badge-error'
                  ]"
                >
                  {{ book.soQuyen }}
                </div>
              </td>
              <td class="py-1">
                <div
                  :class="[
                    'badge',
                    book.soQuyen ? 'badge-warning' : 'badge-error'
                  ]"
                >
                  {{ book.soQuyenConLai }}
                </div>
              </td>
              <td class="py-1">{{ book.nhaXuatBan?.tenNXB }}</td>
              <td class="space-x-1 py-1">
                <button
                  @click="confirmDelete(book._id)"
                  class="btn btn-error btn-sm btn-square"
                >
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
