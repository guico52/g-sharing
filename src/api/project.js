import {post} from './api.js'

export function getProjectList() {
    return post("/project/list")
}

export function getProjectDetail(id) {
    return post("/project/detail", {id})
}

export function createProject(name, description, userGroupId) {
    return post("/project/create", {name, description, userGroupId})
}

export function getUserGroups(){
    return post("/userGroup/list")
}

