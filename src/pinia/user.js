import { defineStore } from 'pinia'
export const useUserPinia = defineStore({
    id: 'user',
    state: () => {
        return {
            token: '',
            userInfo: {},
            isUpdateInfo: false
        }
    },
    actions: {
        setToken(token) {
            this.token = token
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo
        },
        changeIsUpdateInfo(){
            this.isUpdateInfo = !this.isUpdateInfo
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