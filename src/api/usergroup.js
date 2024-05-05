import {post} from './api.js'

export function list(){
    return post('/userGroup/list')
}

export function detail(id){
    return post('/userGroup/getPermission', {id: id})
}
