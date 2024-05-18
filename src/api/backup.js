import {post, download} from './api.js'

export function backupInfoList(name){
    return post('/backup/list', {name: name})
}

export function backupFileList(id) {
    return post('/backup/detail', {fileId: id})
}

export function backupFileContent(id){
    return post('/backup/content', {id: id})
}

export function exportBackupFile(id, name){
    return download('/backup/export', {id: id}, name, {fileId: id})
}

export function elsSearch(keyword){
    return post('/backup/elsSearch', {keyword: keyword})
}
