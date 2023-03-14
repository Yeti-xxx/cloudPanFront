import axios from '../axios/axios'

export function login(data){
    return axios({
        url:'/cloud/login',
        method:'post',
        data
    })
}