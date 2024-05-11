import {post, download} from './api.js'

export function getUserInfo(){
    return post("/user/userInfo")
}

export function getFileContent(id) {
    return post("/file/content", {id: id}, {fileId: id})
}

export function addFile(name, projectId, userGroupId) {
    return post("/file/add", {name: name, projectId: projectId}, {userGroupId: userGroupId})
}

export function deleteFile(id, userGroupId){
    return post("/file/delete", {id: id}, {userGroupId: userGroupId})
}

export function updateFile(id, name){
    return post("/file/update", {id: id, name: name}, {fileId: id})
}

export function exportFile(id, fileId) {
    return download("/file/export", {id: id}, {fileId: fileId})
}

export function search(id, keyword) {
    return post("/file/search", {id: id, content: keyword})
}

export function getFilePermission(id){
    return post("/file/getPermission", {id: id})
}

export function updateFilePermission(items, userGroupId){
    return post("/file/updatePermission", items, {userGroupId: userGroupId})
}

export function getUserGroupIdByProjectId(projectId){
    return post("/file/getUserGroupIdByProjectId", {projectId: projectId})
}
