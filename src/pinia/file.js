import { defineStore } from 'pinia'
export const useFilePinia = defineStore({
    id: 'file',
    state: () => {
        return {
            OverFileArray: [],
            noOverFileArray: []
        }
    },
    actions: {
        addOverFileArray(arr) {
            console.log(arr);
            this.OverFileArray = []
            this.OverFileArray = arr
        },
        addnoOverFileArray(arr) {
            console.log(arr);
            this.noOverFileArray = []
            this.noOverFileArray = arr
        }
    },
    persist: {
        enabled: true,
        strategies: [{
            key: 'QuickPan_File',
            storage: localStorage,
        }]
    }

})