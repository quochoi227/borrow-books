<template>
  <div class="relative w-64">
    <!-- Input -->
    <input
      type="text"
      class="input input-bordered w-full"
      v-model="searchTerm"
      @focus="open = true"
      @blur="handleBlur"
      @input="onInput"
      :placeholder="placeholder"
    />

    <!-- Dropdown -->
    <ul
      v-if="open && filteredOptions.length > 0"
      class="menu bg-base-100 rounded-box absolute z-10 w-full mt-1 shadow-lg"
    >
      <li
        v-for="(item, index) in filteredOptions"
        :key="index"
        @mousedown.prevent="selectItem(item)"
        class="hover:bg-base-200"
      >
        <a>{{ item }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Nhập để tìm...' },
})

const emit = defineEmits(['update:modelValue', 'select'])

const searchTerm = ref(props.modelValue || '')
const open = ref(false)

// Gợi ý danh sách
const filteredOptions = computed(() => {
  if (!searchTerm.value) return props.options
  return props.options.filter(item =>
    item.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const onInput = () => {
  emit('update:modelValue', searchTerm.value)
}

const selectItem = (item) => {
  searchTerm.value = item
  emit('update:modelValue', item)
  emit('select', item)
  open.value = false
}

const handleBlur = () => {
  // dùng timeout để cho phép click vào item trước khi ẩn dropdown
  setTimeout(() => (open.value = false), 100)
}

watch(() => props.modelValue, (val) => {
  if (val !== searchTerm.value) searchTerm.value = val
})
</script>
