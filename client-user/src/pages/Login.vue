<script setup>
import { reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// import { toast } from 'vue3-toastify'

import { useToast } from '@/composables/useToast'
const router = useRouter()
const userStore = useUserStore()

const { loginUserAPI } = userStore

const registerInfo = reactive({
  dienThoai: '',
  matKhau: '',
})

const handleSubmit = (values) => {
  loginUserAPI(values).then(() => {
    router.push('/home')
  })
}
</script>
<template>
  <Form @submit="handleSubmit" class="auth-appear rounded-lg p-6 grid grid-cols-12 shadow-lg bg-white">
    <div class="col-span-12 mx-auto">
      <RouterLink to="/">
        <button type="button" class="btn text-2xl font-[K2D] font-bold text-primary">B</button>
      </RouterLink>
    </div>
    <div class="col-span-12">
      <h1 class="text-center text-2xl font-semibold">Đăng nhập</h1>
    </div>
    <div class="col-span-12">
      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Số điện thoại</legend>
          <Field name="dienThoai" :validateOnInput="true" v-model="registerInfo.dienThoai" type="text" class="input w-full" placeholder="Type here" />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mật khẩu</legend>
          <Field name="matKhau" :validateOnInput="true" v-model="registerInfo.matKhau" type="password" class="input w-full" placeholder="Type here" />
        </fieldset>
      </div>
    </div>
    <div class="mt-2 col-span-12">
      <button type="submit" class="btn btn-primary w-full">Đăng nhập</button>
    </div>
    <div class="mt-2 col-span-12 text-center">
      <RouterLink to="/register">
        <span class="text-sky-700 hover:text-sky-500 hover:underline">Tạo tài khoản</span>
      </RouterLink>
    </div>
  </Form>
</template>
