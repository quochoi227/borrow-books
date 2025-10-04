<script setup>
defineProps(['title', 'description'])
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div>
    <input type="checkbox" class="modal-toggle" checked />
    <div class="modal" role="dialog">
      <div class="modal-box p-4 rounded">
        <h1 class="text-center text-lg font-semibold">{{ title }}</h1>
        <p class="text-center mt-1">{{ description }}</p>
        <!-- The modal component body -->
        <div class="flex justify-end mt-4">
          <button class="btn btn-primary" @click="emit('confirm')">Đồng ý</button>
          <button class="btn ml-2 btn-ghost" @click="emit('cancel')">Từ chối</button>
        </div>
      </div>
    </div>
  </div>
</template>
