import axios from '../axios/axios'

export function getUserInfo() {
    return axios({
        url: '/api/getUserInfo',
        method: 'get',
    })
}