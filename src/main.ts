import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.config.globalProperties.$moment=moment

app.use(createPinia())
app.use(router)

app.mount('#app')
