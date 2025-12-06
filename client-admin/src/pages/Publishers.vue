<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import {
  addNewPublisherAPI,
  fetchPublishersAPI,
  updatePublisherAPI,
  deletePublisherAPI
} from '@/apis'
// import { toast } from 'vue3-toastify'
import ModalDialog from '@/components/ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const adjustModal = ref(null)

const disableSubmit = ref(false)
const publishers = ref([])

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

watch(
  () => publishers.value.length,
  (newVal) => {
    pageSum.value = Math.ceil(newVal / rowsPerPage.value)
    if (
      newVal % rowsPerPage.value === 0 &&
      currentPage.value > 1 &&
      currentPage.value === pageSum.value + 1
    ) {
      currentPage.value--
    }
  }
)

onMounted(() => {
  fetchPublishersAPI().then((data) => {
    publishers.value = data
    pageSum.value = Math.ceil(data.length / rowsPerPage.value) // booksAfter.value = data.slice((currentPage.value - 1) * rowsPerPage.value, (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value)
  })
})

const publishersAfter = computed(() => {
  if (searchValue.value === '') {
    filterMode.value = false
    return publishers.value.slice(
      (currentPage.value - 1) * rowsPerPage.value,
      (currentPage.value - 1) * rowsPerPage.value + rowsPerPage.value
    )
  } else {
    filterMode.value = true
    return publishers.value.filter((publisher) => {
      return publisher.tenNXB
        .toLowerCase()
        .includes(searchValue.value.toLowerCase())
    })
  }
})

const publisherData = reactive({
  maNXB: '',
  tenNXB: '',
  diaChi: ''
})

const handleSubmit = () => {
  addNewPublisherAPI(publisherData).then((data) => {
    publishers.value.push(data)
    if (
      currentPage.value === pageSum.value &&
      publishersAfter.length < rowsPerPage.value
    ) {
      publishersAfter.push(data)
    }
    toast.success('Thêm nhà xuất bản thành công!')
  })
}

const handleAdjust = (publisherInfo) => {
  Object.assign(publisherData, publisherInfo)
  adjustModal.value.showModal()
}

const handleUpdate = () => {
  updatePublisherAPI(publisherData._id, publisherData).then((data) => {
    const index = publishers.value.findIndex(
      (item) => item.maNXB === publisherData.maNXB
    )
    if (index !== -1) {
      publishers.value[index] = data
    }
    adjustModal.value.close()
    toast.success('Cập nhật nhà xuất bản thành công!')
  })
}

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async (maNXB) => {
  const { isCanceled } = await dialog.reveal({ title: 'Xác nhận xóa?' })

  if (isCanceled) return
  deletePublisherAPI(maNXB).then(() => {
    const index = publishers.value.findIndex((item) => item._id === maNXB)
    if (index !== -1) {
      publishers.value.splice(index, 1)
    }
    toast.success('Xóa nhà xuất bản thành công!')
  })
}
</script>

<template>
  <dialog ref="adjustModal" class="modal">
    <div class="modal-box w-fit max-w-5xl">
      <div class="grid w-[320px] grid-cols-12 gap-y-4">
        <div class="col-span-12">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Mã nhà xuất bản</legend>
            <input
              v-model="publisherData.maNXB"
              type="text"
              class="input"
              placeholder="NXB001"
            />
          </fieldset>
        </div>
        <div class="col-span-12">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Tên nhà xuất bản</legend>
            <input
              v-model="publisherData.tenNXB"
              type="text"
              class="input"
              placeholder="Kim Đồng"
            />
          </fieldset>
        </div>
        <div class="col-span-12">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Địa chỉ</legend>
            <input
              v-model="publisherData.diaChi"
              type="text"
              class="input"
              placeholder="123 treet abc"
            />
          </fieldset>
        </div>
        <div class="col-span-12 flex justify-center">
          <button
            @click="handleUpdate"
            type="button"
            :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']"
          >
            Cập nhật
          </button>
          <button
            @click="adjustModal.close()"
            type="button"
            :class="['btn ml-1', disableSubmit ? 'btn-disabled' : 'btn-ghost']"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </dialog>
  <div class="relative h-full w-full">
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box w-fit max-w-5xl">
        <div class="grid w-[320px] grid-cols-12 gap-y-4">
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Mã nhà xuất bản</legend>
              <input
                v-model="publisherData.maNXB"
                type="text"
                class="input"
                placeholder="NXB001"
              />
            </fieldset>
          </div>
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Tên nhà xuất bản</legend>
              <input
                v-model="publisherData.tenNXB"
                type="text"
                class="input"
                placeholder="Kim Đồng"
              />
            </fieldset>
          </div>
          <div class="col-span-12">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">Địa chỉ</legend>
              <input
                v-model="publisherData.diaChi"
                type="text"
                class="input"
                placeholder="123 treet abc"
              />
            </fieldset>
          </div>
          <div class="col-span-12 flex justify-center">
            <button
              @click="handleSubmit"
              onclick="my_modal_3.close()"
              type="button"
              :class="['btn', disableSubmit ? 'btn-disabled' : 'btn-primary']"
            >
              Thêm
            </button>
            <button
              onclick="my_modal_3.close()"
              type="button"
              :class="[
                'btn ml-1',
                disableSubmit ? 'btn-disabled' : 'btn-ghost'
              ]"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <!-- name of each tab group should be unique -->
    <div class="m-2 mt-3 p-2">
      <div class="relative flex gap-2 p-2">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tìm kiếm</legend>
          <label class="input">
            <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
            <input
              v-model="searchValue"
              type="text"
              placeholder="Tìm theo tên nhà xuất bản"
            />
          </label>
        </fieldset>
        <button
          onclick="my_modal_3.showModal()"
          class="btn btn-primary absolute right-2 bottom-2 text-white"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          Thêm NXB
        </button>
      </div>
      <div class="h-[460px] overflow-auto px-2">
        <table class="bg-base-200 table overflow-hidden">
          <thead>
            <tr>
              <th>Mã NXB</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="publisher in publishersAfter" class="hover:bg-base-300">
              <td class="py-1">{{ publisher.maNXB }}</td>
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
                  {{ publisher.tenNXB }}
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
                  {{ publisher.diaChi }}
                </div>
              </td>
              <td class="space-x-1 py-1">
                <button
                  @click="confirmDelete(publisher._id)"
                  class="btn btn-error btn-sm btn-square"
                >
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </button>
                <button
                  @click="handleAdjust(publisher)"
                  class="btn btn-sm btn-info btn-square"
                >
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!filterMode" class="mt-1 flex justify-end px-2">
        <div class="join">
          <button
            @click="handleDecrease"
            :class="['join-item btn', { 'btn-disabled': currentPage === 1 }]"
          >
            «
          </button>
          <button
            v-for="n in pageSum"
            @click="() => (currentPage = n)"
            :class="['join-item btn', { 'btn-primary': currentPage === n }]"
          >
            {{ n }}
          </button>
          <button
            @click="handleIncrease"
            :class="[
              'join-item btn',
              { 'btn-disabled': currentPage === pageSum }
            ]"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
