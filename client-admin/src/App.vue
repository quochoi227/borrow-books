<script setup>
import { DialogsWrapper } from 'vuejs-confirm-dialog'
import Loading from './components/Loading.vue'
import ToastContainer from './components/ToastContainer.vue';
</script>
<template>
  <Loading />
  <RouterView />
  <DialogsWrapper />
  <ToastContainer />
</template>
