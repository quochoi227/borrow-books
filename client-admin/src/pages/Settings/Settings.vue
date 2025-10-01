<template>
  <div class="flex flex-col gap-4 max-w-xl mx-auto">
    <!-- Ảnh chính -->
    <div class="w-full max-h-[400px] overflow-hidden rounded-lg border">
      <img
        :src="selectedImage"
        alt="Ảnh sản phẩm"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Ảnh thu nhỏ -->
    <div class="flex gap-2 overflow-x-auto">
      <div
        v-for="(img, index) in images"
        :key="index"
        @click="selectedImage = img"
        :class="[
          'border rounded-md transition-all',
          selectedImage === img ? 'border-blue-500 scale-95' : 'border-transparent'
        ]"
      >
        <img
          :src="img"
          :alt="`Thumbnail ${index}`"
          class="w-20 h-20 object-cover rounded-md"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Danh sách ảnh mẫu từ picsum.photos
const images = [
  'https://picsum.photos/id/1015/600/400',
  'https://picsum.photos/id/1025/600/400',
  'https://picsum.photos/id/1035/600/400',
  'https://picsum.photos/id/1045/600/400',
  'https://picsum.photos/id/1055/600/400'
]

const selectedImage = ref(images[0])
</script>
