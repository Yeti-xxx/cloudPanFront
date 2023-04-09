import { defineStore } from 'pinia'
export const useFilePinia = defineStore({
    id: 'file',
    state: () => {
        return {
            OverFileArray: [],
            noOverFileArray: [],
            needUploadFile: ''
        }
    },
    actions: {
        addOverFileArray(arr) {
            this.OverFileArray = []
            this.OverFileArray = arr
        },
        addnoOverFileArray(arr) {
            this.noOverFileArray = []
            this.noOverFileArray = arr
        },
        setUploadFile(fileNameType) {
            this.needUploadFile = fileNameType
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