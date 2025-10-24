import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/main.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import 'ant-design-vue/dist/reset.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

// Toastify
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';

// Confirmation
import * as ConfirmDialog from 'vuejs-confirm-dialog'

// Theme
const savedTheme = localStorage.getItem('borrow-books-admin-theme')
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(
  Vue3Toastify,
  {
    autoClose: 3000,
    theme: 'colored'
  }
)
app.use(ConfirmDialog)
app.use(router)
app.mount('#app')
