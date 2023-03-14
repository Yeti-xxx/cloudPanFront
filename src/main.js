import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from './axios/axios.js'
import router from './router/router'
import pinia from './pinia/pinia'
// el icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
document.body.style.margin = 0
document.body.style.padding = 0
const app = createApp(App)
// el icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(pinia)
app.mount('#app')
