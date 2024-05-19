import {post} from './api.js'

export function listUserGroup(){
    return post('/chat/userGroups')
}

export function listGroupChat(groupId) {
    return post('/chat/groupChats', {groupId: groupId})
}

export function listUser(){
    return post('/chat/users')
}

export function listPrivateChat(userId) {
    return post('/chat/privateChats', {userId: userId})
}
