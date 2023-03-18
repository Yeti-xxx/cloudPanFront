import axios from '../axios/axios'

export function getUserInfo() {
    return axios({
        url: '/api/getUserInfo',
        method: 'get',
    })
}

export function updateAvatar(formData) {
    return axios.post(
        '/api/updateAvatar',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }

    )
}