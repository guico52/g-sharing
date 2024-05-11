import {post} from './api.js'

export function list(){
    return post('/user/list')
}

export function add(username, password){
    return post('/user/add', {username: username, password: password})
}

export function deleteUser(id){
    return post('/user/delete', {id: id})
}

export function updateUserPermission(id, level){
    return post('/user/update', {userId: id, level: level})
}


