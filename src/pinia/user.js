import { defineStore } from 'pinia'
export const useUserPinia = defineStore({
    id: 'user',
    state: () => {
        return {
            token: '',
            userInfo:{},
        }
    },
    actions: {
        setToken(token) {
            this.token = token
        },
        setUserInfo(userInfo){
            console.log(userInfo);
            this.userInfo = userInfo
        }
    },
    persist: {
        enabled: true,
        strategies: [{
            key: 'QuickPan_user',
            storage: localStorage,
        }]
    }
})