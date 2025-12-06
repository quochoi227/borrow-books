<script setup>
import { onMounted, reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'
// import { toast } from 'vue3-toastify'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const { loginAdminAPI } = adminStore

const registerInfo = reactive({
  dienThoai: '',
  matKhau: ''
})

const handleSubmit = (values) => {
  loginAdminAPI(values).then(() => {
    toast.success('Đăng nhập thành công!')
    router.push('/')
  })
}
</script>
<template>
  <Form
    @submit="handleSubmit"
    class="auth-appear grid grid-cols-12 rounded-lg bg-white p-6 shadow-lg"
  >
    <div class="col-span-12">
      <h1 class="text-center text-2xl font-semibold">Đăng nhập</h1>
    </div>
    <div v-if="route.query.registeredPhone" class="col-span-12">
      <div
        role="alert"
        class="alert alert-success alert-soft alert-vertical sm:alert-horizontal mt-4"
      >
        <div>
          <h3 class="font-bold">Đăng ký tài khoản thành công!</h3>
          <div class="text-xs">Đăng nhập để sử dụng!</div>
        </div>
      </div>
    </div>
    <div class="col-span-12">
      <div>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Số điện thoại</legend>
          <Field
            name="dienThoai"
            :validateOnInput="true"
            v-model="registerInfo.dienThoai"
            type="text"
            class="input w-full"
            placeholder="Type here"
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Mật khẩu</legend>
          <Field
            name="matKhau"
            :validateOnInput="true"
            v-model="registerInfo.matKhau"
            type="password"
            class="input w-full"
            placeholder="Type here"
          />
        </fieldset>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <button type="submit" class="btn btn-primary w-full">Đăng nhập</button>
    </div>
  </Form>
</template>
