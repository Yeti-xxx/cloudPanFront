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
        },
        popUploadFile(fileNameType) {
            this.noOverFileArray.map((el, index) => {
                if ((el.filename + el.type) === fileNameType) {
                    this.noOverFileArray.splice(index, 1)
                }
            })
            this.addnoOverFileArray(this.noOverFileArray)
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