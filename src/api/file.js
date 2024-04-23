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
