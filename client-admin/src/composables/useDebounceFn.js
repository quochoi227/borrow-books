// useDebounceFn.js
import { ref, watchEffect } from 'vue'
import { debounce } from 'lodash'

export function useDebounceFn(fnToDebounce, delay = 500) {
  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }

  if (!fnToDebounce || typeof fnToDebounce !== 'function') {
    throw new Error('Debounce must have a function')
  }

  const debouncedFn = ref(debounce(fnToDebounce, delay))

  // Nếu muốn cập nhật lại debounce khi fn hoặc delay thay đổi
  watchEffect(() => {
    debouncedFn.value = debounce(fnToDebounce, delay)
  })

  return debouncedFn
}
