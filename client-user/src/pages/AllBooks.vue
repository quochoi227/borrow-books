<script setup>
import { fetchBooksAPI } from '@/apis'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { BOOK_GENRES } from '@/utils/constants'

const books = ref([])
onMounted(async () => {
  const res = await fetchBooksAPI({})
  books.value = res
})

const searchValue = ref('')
const genres = ref([])

const handleSearch = () => {
  fetchBooksAPI({
    search: searchValue.value,
    genres: JSON.stringify(genres.value)
  }).then((res) => {
    books.value = res
  })
}

// Tìm kiếm bằng giọng nói
// Kiểm tra trình duyệt có hỗ trợ không
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
// if (SpeechRecognition) {
const recognition = new SpeechRecognition()
recognition.lang = 'vi-VN' // Thiết lập tiếng Việt
recognition.continuous = false // Dừng nghe sau khi người dùng ngừng nói

// Bắt đầu nghe khi bấm nút
function startListening() {
  recognition.start()
}

// Xử lý kết quả trả về
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript
  console.log('Kết quả:', transcript)

  // Gán vào ô input tìm kiếm
  // document.getElementById('searchInput').value = transcript;
  searchValue.value = transcript
  handleSearch()
  // Thực hiện submit form hoặc gọi API tìm kiếm
}

recognition.onerror = (event) => {
  console.error('Lỗi:', event.error)
}
// } else {
//   alert('Trình duyệt của bạn không hỗ trợ tìm kiếm giọng nói.')
// }
</script>
<template>
  <div class="h-[68px] w-full"></div>
  <div class="mx-auto w-full max-w-[1200px]">
    <div class="flex w-full items-center justify-between">
      <div class="join">
        <button @click="startListening" class="btn btn-neutral join-item">
          <font-awesome-icon icon="fa-solid fa-microphone" />
        </button>
        <input
          placeholder="Nhập tên sách"
          @keydown.enter="handleSearch"
          v-model="searchValue"
          type="text"
          class="input join-item w-2xs"
        />
        <button @click="handleSearch" class="btn btn-primary join-item">
          Tìm
        </button>
      </div>
      <div class="drawer w-fit">
        <input id="my-drawer-1" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <!-- Page content here -->
          <label for="my-drawer-1" class="btn btn-primary drawer-button">
            <font-awesome-icon icon="fa-solid fa-filter" />
            Bộ lọc
          </label>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer-1"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <!-- <ul class="menu bg-base-200 min-h-full w-80 p-4">
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
          </ul> -->
          <div
            class="bg-base-200 h-full max-w-[300px] min-w-[300px] overflow-y-auto p-4"
          >
            <div class="mt-5">
              <div class="mb-2">Tìm theo thể loại</div>
              <label v-for="genre in BOOK_GENRES" class="label w-full">
                <input
                  v-model="genres"
                  :value="genre"
                  type="checkbox"
                  class="checkbox"
                />
                {{ genre }}
              </label>
              <div>
                <button
                  @click="handleSearch"
                  class="btn btn-primary mt-4 w-full"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      style="max-height: calc(100vh - 68px)"
      class="mt-4 grid grid-cols-5 gap-8"
    >
      <div v-for="book in books">
        <div
          class="border-base-300 h-fit rounded-lg border p-3 transition duration-500"
        >
          <div class="book-3d flex h-[200px] items-center">
            <div class="book-3d__inner">
              <img class="book-3d__cover" :src="book.anhBia" />
            </div>
          </div>
          <!-- <img class="h-44 w-full object-contain"
            :src="API_ROOT + '/images/' + book.anhBia"> -->
          <div class="mt-3">
            <h3 class="text-left text-gray-900">
              <span
                style="
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-word;
                  line-height: 1.5;
                  height: 3em;
                "
              >
                {{ book.tenSach }}
              </span>
            </h3>
            <div>
              <span
                >Lượt mượn:
                <span class="font-semibold text-amber-600">{{
                  book.luotMuon
                }}</span></span
              >
            </div>
            <div>
              <span
                >Còn lại:
                <span class="font-semibold text-amber-600">{{
                  book.soQuyenConLai
                }}</span>
                quyển</span
              >
            </div>
            <div class="mt-3 flex justify-center">
              <RouterLink :to="'/books/' + book._id">
                <button class="btn btn-primary btn-sm">Chi tiết</button>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
