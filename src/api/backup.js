import {post, download} from './api.js'

export function backupInfoList(){
    return post('/backup/list')
}

export function backupFileList(id) {
    return post('/backup/detail', {fileId: id})
}

export function backupFileContent(id){
    return post('/backup/content', {id: id})
}

export function exportBackupFile(id){
    return download('/backup/export', {id: id})
}
