import axios from 'axios'
import { initFilesAxios } from '../api/files'

const UPLOAD_URL = "http://127.0.0.1:5007/api/uploadFiles"  //请求地址

export const initUpload = async (file, timer) => {
    let size = parseFloat(file.size / 1024 / 1024).toFixed(2) - 0
    let type = file.name.split('.')[(file.name.split('.').length - 1)]
    const res = await initFilesAxios(size, type, file.name, file.size, UPLOAD_URL, timer)
    return res
}


