import {post} from './api.js'

export function list(){
    return post('/userGroup/list')
}

export function detail(id){
    return post('/userGroup/getPermission', {id: id})
}

export function rename(id, name){
    return post('/userGroup/update', {id: id, name: name})
}
export function updatePermission(id, level){
    return post('/userGroup/updatePermission', {id: id, level: level})
}
