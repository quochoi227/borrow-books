<script setup>
import { adminRegisterAPI } from '@/apis'
import { reactive } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import router from '@/router'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const registerInfo = reactive({
  hoVaTen: '',
  diaChi: '',
  dienThoai: '',
  chucVu: 'admin',
  matKhau: '',
})

const handleSubmit = (values) => {
  adminRegisterAPI({
    ...values,
    chucVu: registerInfo.chucVu
  }).then(() => {
    toast.success('Đăng ký tài khoản thành công!')
    router.push('/login')
  })
}

const validateEmpty = (value) => {
  if (!value) {
    return 'Bạn phải nhập trường này'
  }
  return true
}

const validatePhoneNumber = (value) => {
  if (!value) {
    return 'Bạn phải nhập trường này'
  }
  const regex = /^0\d{9}$/
  if (!regex.test(value)) {
    return 'Số điện thoại không hợp lệ'
  }
  return true
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
  if (value != registerInfo.matKhau) {
    return 'Mật khẩu không khớp, vui lòng kiểm tra lại!'
  }
  return true
}
</script>
<template>
  <Form @submit="handleSubmit" class="auth-appear rounded-lg bg-base-100 p-6 z-10">
    <h1 class="text-center text-2xl font-semibold">Đăng ký tài khoản</h1>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Họ và tên</legend>
      <Field name="hoLot" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.hoLot" type="text" class="input w-full" placeholder="Type here" />
      <ErrorMessage class="text-red-500" name="hoLot" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Địa chỉ</legend>
      <Field name="diaChi" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.diaChi" type="text" class="input w-full" placeholder="Type here" />
      <ErrorMessage class="text-red-500" name="diaChi" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Số điện thoại</legend>
      <Field name="dienThoai" :rules="validatePhoneNumber" :validateOnInput="true" v-model="registerInfo.dienThoai" type="text" class="input w-full" placeholder="Type here" />
      <ErrorMessage class="text-red-500" name="dienThoai" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Chức vụ</legend>
      <select class="select w-full" v-model="registerInfo.chucVu">
        <option value="admin">Quản trị viên</option>
        <option value="staff">Nhân viên</option>
      </select>
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Đặt mật khẩu</legend>
      <Field name="matKhau" :rules="validatePassword" :validateOnInput="true" v-model="registerInfo.matKhau" type="password" class="input w-full" placeholder="Type here" />
      <ErrorMessage class="text-red-500" name="matKhau" />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Nhập lại mật khẩu</legend>
      <Field name="matKhauXacNhan" :rules="validatePasswordComfirmation" :validateOnInput="true" type="password" class="input w-full" placeholder="Type here" />
      <ErrorMessage class="text-red-500" name="matKhauXacNhan" />
    </fieldset>
    <button type="submit" class="btn btn-primary w-full mt-2">Đăng ký</button>
    <div class="mt-2 col-span-12 text-center">
      <RouterLink to="/login">
        <span class="text-sky-700 hover:text-sky-500 hover:underline">Đăng nhập</span>
      </RouterLink>
    </div>
  </Form>
</template>
