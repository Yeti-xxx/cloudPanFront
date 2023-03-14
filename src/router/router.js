import { createRouter, createWebHistory } from "vue-router";
import Home from '../components/Home.vue'
const routes = [
    {
        path:'/login',
        name:'Login',
        component:()=>import('../components/Login.vue')
    },
    {
        path:'/',
        name:'Home',
        component:Home
    },
    {
        path:'/home',
        name:'Home',
        component:Home
    },
]
const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;