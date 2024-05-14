import {post} from './api.js'

export function getToken(meetingName){
    return post("/meeting/token", {name: meetingName})
}

export function create(meetingName) {
    return post("/meeting/create", {name: meetingName})
}

export function listRooms(){
    return post("/meeting/listRooms")
}
