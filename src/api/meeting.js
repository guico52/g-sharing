import {post} from './api.js'

export function getToken(meetingName){
    return post("/meeting/token", {name: meetingName})
}

export function createRoom(meetingName) {
    return post("/meeting/create", {name: meetingName})
}

export function listRooms(){
    return post("/meeting/listRooms")
}
