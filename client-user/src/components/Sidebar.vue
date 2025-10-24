<script setup>
import { BOOK_GENRES } from '@/utils/constants'
</script>
<template>
  <div class="min-w-[300px] max-w-[300px] overflow-y-auto p-4">
    <div>
      <div class="mb-2">Tìm theo tên sách</div>
      <div class="join w-full">
        <input type="text" class="input input-sm join-item">
        <button class="btn btn-sm btn-primary join-item">Tìm</button>
      </div>
    </div>
    <div class="mt-5">
      <div class="mb-2">Tìm theo thể loại</div>
      
      <label v-for="genre in BOOK_GENRES" class="label w-full">
        <input type="checkbox" class="checkbox" />
        {{ genre }}
      </label>
    </div>
  </div>
</template>
