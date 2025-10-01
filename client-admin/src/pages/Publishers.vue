<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { addNewSourceAPI, fetchSourcesAPI, deleteBookAPI } from '@/apis'
import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { cloneDeep } from 'lodash'
import BookDetails from '@/pages/BookDetails.vue'

const disableSubmit = ref(false)
const sources = ref([])
const isActive = ref(false)

const rowsPerPage = ref(5)
const currentPage = ref(1)
const pageSum = ref(0)

const filterMode = ref(false)

const searchValue = ref('')

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

watch(() => sources.value.length, (newVal) => {
  pageSum.value = Math.ceil(newVal / rowsPerPage.value)
  if (newVal % rowsPerPage.value === 0 && currentPage.value > 1 && currentPage.value === pageSum.value + 1) {
    currentPage.value--
  }
})

onMounted(() => {
  fetchSourcesAPI().then((data) => {
    sources.value = data
    pageSum.value = Math.ceil(data.length / rowsPerPage.value)// booksAfter.value = data.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  })
})

const sourcesAfter = computed(() => {
  if (searchValue.value === '') {
    filterMode.value = false
    return sources.value.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  } else {
    filterMode.value = true
    return sources.value.filter((book) => {
      return book.name.toLowerCase().includes(searchValue.value.toLowerCase())
    })
  }
})

const sourceData = reactive({
  publisherId: '',
  name: '',
  address: ''
})

const handleSubmit = () => {
  addNewSourceAPI(sourceData).then((data) => {
    sources.value.push(data)
    if (currentPage.value === pageSum.value && sourcesAfter.length < rowsPerPage.value) {
      sourcesAfter.push(data)
    }
    toast.success('Thêm nhà xuất bản thành công!', {
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

const handleDeleteBook = (publisherId) => {
  deleteBookAPI(publisherId).then(() => {
    toast.success("Xóa sách thành công", {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
    })
    sources.value = sources.value.filter((book) => {
      return book._id !== publisherId
    })
  })
}

const handleUpdateBook = (book) => {
  const targetBook = sources.value.find((b) => b._id === book._id)
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
        <div class="grid grid-cols-12 w-[320px] gap-y-4">
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Mã nhà xuất bản</legend>
              <input v-model="sourceData.publisherId" type="text" class="input" placeholder="NXB001" />
            </fieldset>
          </div>
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Tên nhà xuất bản</legend>
              <input v-model="sourceData.name" type="text" class="input" placeholder="Kim Đồng" />
            </fieldset>
          </div>
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Địa chỉ</legend>
              <input v-model="sourceData.address" type="text" class="input" placeholder="123 treet abc" />
            </fieldset>
          </div>
          <div class="col-span-12 flex justify-center">
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
      <div class="p-2 flex gap-2 bg-white rounded-lg relative">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input v-model="searchValue" type="text" placeholder="Tìm theo mã, tên nhà xuất bản" />
          </label>
        </fieldset>
        <button onclick="my_modal_3.showModal()" class="btn btn-primary text-white absolute right-2 bottom-2">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm NXB
        </button>
      </div>
    </div>
    <div class="overflow-auto px-2 min-h-[460px] max-h-[520px]">
      <table class="table overflow-hidden shadow-md bg-white">
        <thead>
          <tr class="bg-primary text-white">
            <th>Mã NXB</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source) in sourcesAfter" class="hover:bg-base-300">
            <td class="py-1">{{ source.publisherId }}</td>
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
                {{ source.name }}
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
                {{ source.address }}
              </div>
            </td>
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
        <button v-for="n in pageSum" @click="() => currentPage = n" :class="['join-item btn', { 'bg-main text-white': currentPage === n }]">{{ n }}</button>
        <button @click="handleIncrease" :class="['join-item btn', { 'btn-disabled': currentPage === pageSum }]">»</button>
      </div>
    </div>
  </div>
</template>
