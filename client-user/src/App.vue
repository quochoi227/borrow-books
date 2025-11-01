<script setup>
import Loading from './components/Loading.vue'
import { DialogsWrapper } from 'vuejs-confirm-dialog'
import ToastContainer from './components/ToastContainer.vue'
</script>
<template>
  <Loading />
  <RouterView />
  <ToastContainer />
  <DialogsWrapper />
</template>
