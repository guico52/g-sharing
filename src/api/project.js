import {post} from './api.js'

export function getProjectList(name) {
    return post("/project/list", {name: name})
}

export function getProjectDetail(id, name) {
    return post("/project/detail", {id: id, name: name})
}

export function createProject(name, description, userGroupId) {
    return post("/project/create", {name, description, userGroupId})
}

export function getUserGroups(name){
    return post("/userGroup/list", {name: name})
}

export function deleteProject(id, userGroupId) {
    return post("/project/delete", {id: id}, {userGroupId: userGroupId})
}

export function updateProject(id, name, description, userGroupId){
    return post("/project/update", {
        id: id,
        name: name,
        description: description,
}, {userGroupId: userGroupId})
}

export function search(keyword) {
    return post("/project/search", {content: keyword})
}

