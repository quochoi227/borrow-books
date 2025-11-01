<script setup>
import { registerAPI } from '@/apis'
import { reactive } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
// import { toast } from 'vue3-toastify'
import router from '@/router'

import { useToast } from '@/composables/useToast'
const toast = useToast()

const registerInfo = reactive({
  hoLot: '',
  ten: '',
  ngaySinh: '',
  gioiTinh: 'nam',
  diaChi: '',
  dienThoai: '',
  matKhau: '',
})

const handleSubmit = (values) => {
  registerAPI(values).then(() => {
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
  <Form @submit="handleSubmit" class="auth-appear rounded-lg bg-base-100 p-6 grid grid-cols-12 gap-x-4 w-[700px] z-10">
    <div class="col-span-12">
      <h1 class="text-center text-2xl font-semibold mb-4">Đăng ký tài khoản</h1>
    </div>
    <div class="col-span-6">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Họ lót</legend>
        <Field name="hoLot" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.hoLot" type="text" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="hoLot" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tên</legend>
        <Field name="ten" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.ten" type="text" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="ten" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Ngày sinh</legend>
        <Field name="ngaySinh" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.ngaySinh" type="date" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="ngaySinh" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Phái</legend>
        <div class="mx-auto">
          <Field name="gioiTinh" v-model="registerInfo.gioiTinh" id="male" value="nam" type="radio" class="radio radio-primary" />
          <label for="male" class="text-[14px] ml-1">Nam</label>
          <Field name="gioiTinh" v-model="registerInfo.gioiTinh" id="female" value="nữ" type="radio" class="radio radio-primary ml-4" />
          <label for="female" class="text-[14px] ml-1">Nữ</label>
        </div>
      </fieldset>
    </div>
    <div class="col-span-6">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Địa chỉ</legend>
        <Field name="diaChi" :rules="validateEmpty" :validateOnInput="true" v-model="registerInfo.diaChi" type="text" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="diaChi" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Số điện thoại</legend>
        <Field name="dienThoai" :rules="validatePhoneNumber" :validateOnInput="true" v-model="registerInfo.dienThoai" type="text" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="dienThoai" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Đặt mật khẩu</legend>
        <Field name="matKhau" :rules="validatePassword" :validateOnInput="true" v-model="registerInfo.matKhau" type="password" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="matKhau" />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nhập lại mật khẩu</legend>
        <Field name="matKhauXacNhan" :rules="validatePasswordComfirmation" :validateOnInput="true" type="password" class="input" placeholder="Type here" />
        <ErrorMessage class="text-red-500" name="matKhauXacNhan" />
      </fieldset>
    </div>
    <div class="mt-2 col-span-4 col-start-5">
      <button type="submit" class="btn btn-primary w-full">Đăng ký</button>
    </div>
    <div class="mt-2 col-span-12 text-center">
      <RouterLink to="/login">
        <span class="text-sky-700 hover:text-sky-500 hover:underline">Đăng nhập</span>
      </RouterLink>
    </div>
  </Form>
</template>
