<script setup>
import { generateTextAPI } from '@/apis'
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'

// const messages = ref([
//   { id: 1, text: 'Xin chào! Tôi có thể giúp gì cho bạn?', sender: 'bot', timestamp: new Date() },
//   { id: 2, text: 'Tôi muốn hỏi về sách mới', sender: 'user', timestamp: new Date() }
// ])
const messages = ref([])

const newMessage = ref('')
const chatContainer = ref(null)

const showSkeleton = ref(false)

const sendMessage = () => {
  if (newMessage.value.trim() === '') return

  const message = {
    id: Date.now(),
    text: newMessage.value,
    sender: 'user',
    timestamp: new Date()
  }

  messages.value.push(message)

  // Scroll to bottom
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })

  // Call AI API to get response
  showSkeleton.value = true
  generateTextAPI({ topic: newMessage.value }).then((data) => {
    const botMessage = {
      id: Date.now() + 1,
      text: data.answer,
      sender: 'bot',
      timestamp: new Date()
    }
    messages.value.push(botMessage)

    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
    showSkeleton.value = false
  })
  newMessage.value = ''
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // const oldMessages = JSON.parse(localStorage.getItem('chat-messages'))
  // if (oldMessages) {
  //   messages.value = oldMessages
  // }
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})

// watch(
//   messages,
//   (newMessages) => {
//     localStorage.setItem('chat-messages', JSON.stringify(newMessages))
//   },
//   { deep: true }
// )
</script>

<template>
  <div
    class="bg-base-200 mx-auto flex h-[600px] w-full max-w-2xl flex-col rounded-xl shadow-lg"
  >
    <!-- Chat Header -->
    <div class="bg-primary text-primary-content rounded-t-xl p-4">
      <h2 class="text-lg font-semibold">AI Chatbot</h2>
    </div>

    <!-- Messages Container -->
    <div
      ref="chatContainer"
      class="flex-1 space-y-4 overflow-y-auto scroll-smooth p-4"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['chat', message.sender === 'user' ? 'chat-end' : 'chat-start']"
      >
        <div class="chat-header mb-1">
          {{ message.sender === 'user' ? 'Bạn' : 'AI' }}
          <time class="ml-1 text-xs opacity-50">{{
            formatTime(message.timestamp)
          }}</time>
        </div>
        <div
          v-html="message.text"
          :class="[
            'chat-bubble',
            message.sender === 'user' ? 'chat-bubble-neutral' : ''
          ]"
        ></div>
      </div>
      <div :class="[showSkeleton ? 'chat chat-start' : 'hidden']">
        <div class="chat-header mb-1">
          Hỗ trợ
          <time class="ml-1 text-xs opacity-50"></time>
        </div>
        <div class="chat-bubble skeleton">
          <span class="opacity-70">AI is thinking harder</span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-base-100 border-base-300 rounded-b-lg border-t p-4">
      <form @submit.prevent="sendMessage" class="join w-full">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="input input-bordered join-item flex-1"
          @keypress.enter.prevent="sendMessage"
        />
        <button
          type="submit"
          class="btn btn-primary join-item"
          :disabled="!newMessage.trim()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
            />
          </svg>
          Gửi
        </button>
      </form>
    </div>
  </div>
</template>
