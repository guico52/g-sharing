import {post} from './api.js'

export function searchFile(keyword){
    return post('/search/file', {keyword: keyword})
}

export function searchBackup(keyword){
    return post('/search/backup', {keyword: keyword})
}

export function asyncFile(){
    return post('/file/asyncFile')
}
