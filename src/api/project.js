import {post} from './api.js'

export function getProjectList() {
    return post("/project/list")
}

export function getProjectDetail(id) {
    return post("/project/detail", {id})
}

