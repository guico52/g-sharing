import {post} from './api.js'

export function list(){
    return post('/userGroup/list')
}
