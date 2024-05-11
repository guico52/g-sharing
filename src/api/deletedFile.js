import {post} from './api.js'

export function deletedFileList(){
    return post('/deletedFile/list')
}

// 需要用户管理员以上权限
export function recoverFile(id){
    return post('/deletedFile/recover', {id: id})
}
// 需要用户管理员以上权限
export function deleteFile(id){
    return post('/deletedFile/delete', {id: id})
}
