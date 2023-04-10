import axios from "../axios/axios";

export function getFilesInfo() {
    return axios({
        url: '/api/getFiles',
        method: 'get'
    })
}

// init文件接口
export function initFilesAxios(size, type, fileName, fileSize, url,timer) {
    let initFormData = new FormData()
    initFormData.append('type', 'init')
    initFormData.append('createTime', timer)
    initFormData.append('size', size)
    initFormData.append('filetype', type)
    initFormData.append('fileName', fileName)
    initFormData.append('totalChunk', Math.ceil(fileSize / 15 / 1024 / 1024))
    return axios.post(url, initFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': JSON.parse(localStorage.getItem('QuickPan_user')).token
        },
    })
}

export function verifyFile(data){
    return axios({
        url:'/api/verifyFile',
        method:'post',
        data:data
    })
}