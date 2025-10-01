<script setup>
import { reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import book from '@/assets/images/book-svgrepo-com.svg'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue3-toastify'

const router = useRouter()
const userStore = useUserStore()

const { loginUserAPI } = userStore

const registerInfo = reactive({
  dienThoai: '',
  matKhau: '',
})

const handleSubmit = (values) => {
  toast.promise(
    loginUserAPI(values),
    { pending: 'Đang đăng nhập' }
  ).then(() => {
    router.push('/home')
  })
}
</script>
<template>
  <Form @submit="handleSubmit" class="rounded-lg bg-white p-6 grid grid-cols-12 mx-auto max-w-lg">
    <div class="col-span-12">
      <h1 class="text-center text-2xl font-semibold">Đăng nhập</h1>
    </div>
    <div class="col-span-12 max-h-24">
      <img class="w-full h-full object-contain" :src="book" alt="Image">
    </div>
    <div class="col-span-12">
      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Số điện thoại</legend>
          <Field name="dienThoai" :validateOnInput="true" v-model="registerInfo.dienThoai" type="text" class="input w-full" placeholder="Type here" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Đặt mật khẩu</legend>
          <Field name="matKhau" :validateOnInput="true" v-model="registerInfo.matKhau" type="password" class="input w-full" placeholder="Type here" />
        </fieldset>
      </div>
    </div>
    <div class="mt-2 col-span-12">
      <button type="submit" class="btn btn-primary w-full">Đăng nhập</button>
    </div>
    <div class="mt-2 col-span-12 text-center">
      <RouterLink to="/register">
        <span class="text-sky-700">Tạo tài khoản</span>
      </RouterLink>
    </div>
  </Form>
</template>
