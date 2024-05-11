import {post} from './api.js'

export function getMyInfo() {
    return post("/myInfo/myInfo")
}

export function getMyGroups() {
    return post("/myInfo/myGroup")
}

export function updateMyName(username) {
    return post("/myInfo/updateName", {username: username})
}

export function updateMyPassword(password) {
    return post("/myInfo/updatePassword", {password: password})
}

export function exitUserGroup(id) {
    return post("/myInfo/exitUserGroup", {id: id})
}
