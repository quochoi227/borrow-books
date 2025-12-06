<script setup>
import { changePasswordAPI } from '@/apis'
import { reactive } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
import { useToast } from '@/composables/useToast'
const toast = useToast()

const updateInfo = reactive({
  matKhauHienTai: '',
  matKhauMoi: '',
  xacNhanMatKhauMoi: ''
})

const handleSubmit = (values) => {
  changePasswordAPI({
    ...values,
    id: adminStore.currentActiveAdmin._id
  }).then(() => {
    toast.success('Đổi mật khẩu thành công!')
  })
}

const validatePassword = (value) => {
  if (!value) {
    return 'Bạn phải nhập trường này'
  }
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!regex.test(value)) {
    return 'Mật khẩu phải bao gồm 8 ký tự, có ít nhất 1 chữ cái, 1 chữ số'
  }
  return true
}

const validatePasswordComfirmation = (value) => {
  if (!value) {
    return 'Bạn phải nhập trường này'
  }
  if (value != updateInfo.matKhauMoi) {
    return 'Mật khẩu không khớp, vui lòng kiểm tra lại!'
  }
  return true
}
</script>
<template>
  <Form
    @submit="handleSubmit"
    class="auth-appear z-10 mx-auto max-w-xl rounded-lg bg-white p-6 shadow-lg"
  >
    <h1 class="text-center text-2xl font-semibold">Đổi mật khẩu</h1>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Mật khẩu hiện tại</legend>
      <Field
        name="matKhauHienTai"
        :rules="validatePassword"
        :validateOnInput="true"
        v-model="updateInfo.matKhauHienTai"
        type="password"
        class="input w-full"
        placeholder="Type here"
      />
      <ErrorMessage class="text-red-500" name="matKhauHienTai" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Mật khẩu mới</legend>
      <Field
        name="matKhauMoi"
        :rules="validatePassword"
        :validateOnInput="true"
        v-model="updateInfo.matKhauMoi"
        type="password"
        class="input w-full"
        placeholder="Type here"
      />
      <ErrorMessage class="text-red-500" name="matKhauMoi" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Mật khẩu mới</legend>
      <Field
        name="xacNhanMatKhauMoi"
        :rules="validatePasswordComfirmation"
        :validateOnInput="true"
        type="password"
        class="input w-full"
        placeholder="Type here"
      />
      <ErrorMessage class="text-red-500" name="xacNhanMatKhauMoi" />
    </fieldset>
    <button type="submit" class="btn btn-primary mt-2 w-full">
      Đổi mật khẩu
    </button>
  </Form>
</template>
