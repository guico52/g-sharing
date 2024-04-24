import {post} from './api.js'

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
