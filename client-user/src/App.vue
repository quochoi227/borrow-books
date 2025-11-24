<script setup>
import Loading from './components/Loading.vue'
import { DialogsWrapper } from 'vuejs-confirm-dialog'
import ToastContainer from './components/ToastContainer.vue'
import Assistant from './components/Assistant.vue'
</script>
<template>
  <Loading />
  <RouterView />
  <ToastContainer />
  <DialogsWrapper />
  <Assistant />
</template>
