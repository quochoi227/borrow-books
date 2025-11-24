<template>
  <transition-group name="toast" tag="div" class="toast toast-top toast-center z-50">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="alert shadow-lg"
      :class="toastClass(toast.type)"
      @click="removeToast(toast.id)"
    >
      <svg v-if="toast.type === 'success'"xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ toast.message }}</span>
    </div>
  </transition-group>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const toasts = ref([])

let timeoutId

const addToast = (toast) => {
  toasts.value.push(toast)
  timeoutId = setTimeout(() => removeToast(toast.id), toast.duration || 3000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
  if (toasts.value.length === 0) {
    clearTimeout(timeoutId)
  }
}

// Lắng nghe event global
const listener = (event) => {
  if (event.detail?.toast) addToast(event.detail.toast)
}

onMounted(() => {
  window.addEventListener('add-toast', listener)
})

onBeforeUnmount(() => {
  window.removeEventListener('add-toast', listener)
})

const toastClass = (type) => {
  switch (type) {
    case 'success': return 'alert-success'
    case 'error': return 'alert-error'
    case 'warning': return 'alert-warning'
    default: return 'alert-info'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.6);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.6);
}
</style>
