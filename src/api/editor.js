import {BASE_URL, instance} from './api.js'

export function uploadImg(file) {
    let formData = new FormData()
    formData.append('file', file)
    return instance.post(BASE_URL+'/uploadImg', formData, {headers: {
            'Content-Type': 'multipart/form-data'
        }})
}
