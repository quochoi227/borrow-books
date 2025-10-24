<script setup>
function isTurnedOn() {
  return document.documentElement.dataset.theme === 'night'
}

function handleModeChange(event) {
  if (event.target.checked) {
    document.documentElement.dataset.theme = event.target.value
    localStorage.setItem('borrow-books-user-theme', event.target.value)
  } else {
    document.documentElement.dataset.theme = 'winter'
    localStorage.setItem('borrow-books-user-theme', 'winter')
  }
}
</script>
<template>
  <input @change="handleModeChange" type="checkbox" :checked="isTurnedOn()" value="night" class="toggle theme-controller" />
</template>
