import {post, download} from './api.js'

export function getUserInfo(){
    return post("/user/userInfo")
}

export function getFileContent(id) {
    return post("/file/content", {id: id})
}

export function addFile(name, projectId) {
    return post("/file/add", {name: name, projectId: projectId})
}

export function deleteFile(id) {
    return post("/file/delete", {id: id})
}

export function updateFile(id, name){
    return post("/file/update", {id: id, name: name})
}

export function exportFile(id) {
    return download("/file/export", {id: id})
}

export function search(id, keyword) {
    return post("/file/search", {id: id, content: keyword})
}
