import {post} from './api.js'

export function list(name){
    return post('/userGroup/list', {name: name})
}

// 需要用户管理员以上权限
export function add(name){
    return post('/userGroup/add', {name: name})
}

export function detail(id){
    return post('/userGroup/getPermission', {id: id})
}

export function rename(id, name){
    return post('/userGroup/update', {id: id, name: name}, {userGroupId: id})
}
export function updatePermission(items, userGroupId){
    return post('/userGroup/updatePermission', items, {userGroupId: userGroupId})
}
export function listUser(){
    return post('/userGroup/listUser')
}

export function deleteUserGroup(id){
    return post('/userGroup/delete', {id: id}, {userGroupId: id})
}

export function updateUserGroupMember(id, userIds){
    return post('/userGroup/updateMembers', {id: id, userIds: userIds}, {userGroupId: id})
}
