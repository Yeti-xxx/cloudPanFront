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

export function QPAvatar() {
    return axios({
        url: '/api/quickPanAvatar',
        method: 'get'
    })
}

export function useQPAvatar(params) {
    return axios({ url: '/api/SetQuickPanAvatar', method: 'get', params })
}