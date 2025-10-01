<script setup>
defineProps(['title', 'show'])
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div>
    <input type="checkbox" id="my_modal_6" class="modal-toggle" checked />
    <div class="modal" role="dialog">
      <div class="modal-box p-2">
        <h1 class="text-center text-xl">{{ title }}</h1>
        <!-- The modal component body -->
        <div class="flex justify-end mt-4">
          <button class="btn btn-success" @click="emit('confirm')">Yes</button>
          <button class="btn ml-2 btn-error" @click="emit('cancel')">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
