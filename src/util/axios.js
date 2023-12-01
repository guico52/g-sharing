import axios from 'axios'
import {useMessage, useLoadingBar} from "naive-ui";

const instance = axios.create({
    baseURI: 'http://localhost:8083',
    timeout: 5000,
    headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    }
});
const message = useMessage();
const loadingBar = useLoadingBar();


instance.interceptors.request.use(
    config => {
        loadingBar.start();
        return config
    },
    error => {
        loadingBar.error();
        message.error(error.message)
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    resp => {
        loadingBar.finish();
        return resp
    },
    error => {
        loadingBar.error();
        message.error(error.message)
        return Promise.reject(error)
    }
)

// 封装axios的get请求
export function get(url, params) {
    return instance.get(url, {
        params
    })
}

// 封装axios的post请求
export function post(url, data) {
    return instance.post(url, data)
}

// 封装axios的put请求
export function put(url, data) {
    return instance.put(url, data)
}

// 封装axios的delete请求
export function del(url, data) {
    return instance.delete(url, data)
}


// 封装axios的并发请求
export function all(requests) {
    return instance.all(requests)
}