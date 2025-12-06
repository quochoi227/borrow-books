<script setup>
import Conversation from './Conversation.vue'
</script>
<template>
  <!-- Open the modal using ID.showModal() method -->
  <div class="fixed right-8 bottom-16 z-20 w-18 rounded-full p-1">
    <div class="absolute inset-0 animate-ping rounded-full bg-sky-200"></div>
    <div
      onclick="my_modal_1.showModal()"
      class="avatar avatar-placeholder cursor-pointer"
    >
      <div class="bg-neutral text-neutral-content w-16 rounded-full">
        <span class="text-xl">AI</span>
      </div>
    </div>
  </div>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box rounded-[20px] p-2">
      <form method="dialog">
        <button
          class="btn btn-ghost btn-sm btn-circle absolute top-3 right-3 bg-transparent text-lg text-white"
        >
          <font-awesome-icon icon="fa-solid fa-x" />
        </button>
      </form>
      <Conversation />
    </div>
  </dialog>
</template>
