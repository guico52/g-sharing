import {post} from './api.js'

export function getProjectList() {
    return post("/project/list")
}

export function getProjectDetail(id) {
    return post("/project/detail", {id: id})
}

export function createProject(name, description, userGroupId) {
    return post("/project/create", {name, description, userGroupId})
}

export function getUserGroups(){
    return post("/userGroup/list")
}

export function deleteProject(id){
    return post("/project/delete", {id: id})
}

export function updateProject(id, name, description){
    return post("/project/update", {
        id: id,
        name: name,
        description: description,
})
}

export function search(keyword) {
    return post("/project/search", {content: keyword})
}

