import { createRouter, createWebHistory } from "vue-router";
import Home from '../components/Home.vue'
// 导入user仓库
import {useUserPinia} from '../pinia/user'
const routes = [
    {
        path:'/login',
        name:'Login',
        component:()=>import('../components/Login.vue')
    },
    {
        path:'/',
        redirect:'/home',
    },
    {
        path:'/home',
        name:'Home',
        component:Home,
        children:[
            {
                path:'myCenter',
                name:'myCenter',
                component:()=>import('../views/MyCenter.vue')
            },
            {
                path:'test',
                name:'test',
                component:()=>import('../test/test.vue')
            },
            {
                path:'trans',
                name:'trans',
                component:()=>import('../views/Trans.vue')
            },
            {
                path:'myFiles',
                name:'myFiles',
                component:()=>import('../views/MyFiles.vue')
            },
            {
                path:'myRecycle',
                name:'myRecycle',
                component:()=>import('../views/MyRecycle.vue')
            }
        ],
        beforeEnter: (to, from, next) => {
            if (useUserPinia().token) {
                next()
            }else{
                next('/login')
            }
        }
    },
]
const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;