import { defineStore } from 'pinia'
export const useUserPinia = defineStore({
    id: 'user',
    state: () => {
        return {
            token: ''
        }
    },
    actions: {
        setToken(token) {
            this.token = token
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