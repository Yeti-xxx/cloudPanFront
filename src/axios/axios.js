import axios from 'axios';
import {useUserPinia} from '../pinia/user'
//1. 创建axios对象
let api_base_url = 'http://127.0.0.1:5007'
const service = axios.create({
    timeout: 1000 * 80,
    baseURL: api_base_url
});

//2. 请求拦截器
service.interceptors.request.use(config => {
    if (useUserPinia().token) {
        config.headers['Token'] = useUserPinia().token
    }
    return config;
}, error => {
    Promise.reject(error);
});

//3. 响应拦截器
service.interceptors.response.use(response => {

    return response.data;
}, error => {
    return Promise.reject(error);
});

export default service;