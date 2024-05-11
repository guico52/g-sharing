import {post} from "./api";



export function login(username, password)  {
   return post('/login', {
        username: username,
        password: password
    })
}

export function  register (username, password)  {
    return  post('/register', {
        username: username,
        password: password
    })
}
