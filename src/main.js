import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from './axios/axios.js'
import router from './router/router'
import pinia from './pinia/pinia'
document.body.style.margin = 0
document.body.style.padding = 0
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
