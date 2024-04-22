import axios from 'axios'
import {createDiscreteApi} from "naive-ui";
// import {inject} from "vue";

const BASE_URL = 'http://localhost:8221'
const instance = axios.create({
    headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    },
    timeout: 5000,

});

export const {message, loadingBar, dialog} = createDiscreteApi(
    ['message', 'loadingBar', 'dialog']
)

instance.interceptors.request.use(
    config => {
        loadingBar.start();
        return config
    },
    error => {
        loadingBar.finish();
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    resp => {
        loadingBar.finish();
        // console.log(resp)
        if(resp.status === 401){
            const redirectPath = resp.data.redirectPath;
            if(redirectPath) {
                // 重定向到登录页面
                message.error('请先登录')
                VueRouter.push(redirectPath)
            } else {
                message.error('未授权的行为')
            }
        }
        if(resp.data.code >= 500){
            message.error(resp.data.message)
        } else {
            message.success(resp.data.message)
        }
        return resp;
    },
    error => {
        loadingBar.error();
        message.error(error.message)
        return Promise.reject(error);
    }
)



// 封装axios的post请求
export function post(url, data) {
    // console.log(loadingBar)
    return  instance.post(BASE_URL+url, data)
}

// 封装axios的put请求
export async function put(url, data) {
    return await instance.put(BASE_URL+url, data)
}

// 封装axios的delete请求
export async function del(url, data) {
    return await instance.delete(BASE_URL+url, data)
}


