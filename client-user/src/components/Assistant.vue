<script setup>
import Conversation from './Conversation.vue'
</script>
<template>
  <!-- Open the modal using ID.showModal() method -->
  <div class="z-20 w-18 rounded-full fixed right-8 bottom-16 p-1">
    <div class="absolute inset-0 bg-sky-200 rounded-full animate-ping">
    </div>
    <div onclick="my_modal_1.showModal()" class="cursor-pointer avatar avatar-placeholder">
      <div class="bg-neutral text-neutral-content w-16 rounded-full">
        <span class="text-xl">AI</span>
      </div>
    </div>
  </div>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box rounded-[20px] p-2">
      <form method="dialog">
        <button class="btn btn-sm bg-transparent text-white hover:bg-red-400 rounded-none rounded-bl-sm rounded-tr-xl absolute right-2 top-2">
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </form>
      <Conversation />
    </div>
  </dialog>
</template>
