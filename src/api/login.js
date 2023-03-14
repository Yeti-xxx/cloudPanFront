import axios from '../axios/axios'

export function login(data) {
    return axios({
        url: '/cloud/login',
        method: 'post',
        data
    })
}
export function register(data) {
    return axios({
        url: '/cloud/regUser',
        method: 'post',
        data
    })
}