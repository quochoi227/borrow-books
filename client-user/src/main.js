import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './assets/main.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

// Toastify
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';

// Confirmation
import * as ConfirmDialog from 'vuejs-confirm-dialog'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

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
