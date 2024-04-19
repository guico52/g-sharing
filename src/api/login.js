import axios from 'axios';
import {post} from "./api";



export const login = (username, password) => {
   return post('/login', {
        username: username,
        password: password
    })
}

export const register = (username, password) => {
    return post('/register', {
        username: username,
        password: password
    })
}
