import axios from "../axios/axios";

export function getFilesInfo(){
    return axios({
        url:'/api/getFiles',
        method:'get'
    })
}