import {post} from './api.js'

export function getToken(meetingName){
    return post("/meeting/token", {name: meetingName})
}

export function createRoom(meetingName, rejoin) {
    return post("/meeting/create", {name: meetingName, rejoin: rejoin})
}

export function listRooms(){
    return post("/meeting/listRooms")
}

export function listParticipants(meetingId){
    return post("/meeting/listParticipants", {name: meetingId})
}

// 禁言用户
export function muteUser(meetingId, userId){
    return post("/meeting/mute", {name: meetingId, user: userId})
}

export function unmuteUser(meetingId, userId){
    return post("/meeting/unmute", {name: meetingId, user: userId})
}

export function kickUser(meetingId, userId){
    return post("/meeting/kick", {name: meetingId, user: userId})
}

export function deleteRoom(meetingId){
    return post("/meeting/delete", {name: meetingId})
}

export function isHost(meetingId){
    return post("/meeting/isHost", {name: meetingId})
}
