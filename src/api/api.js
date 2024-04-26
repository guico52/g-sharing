import axios from 'axios'
import {createDiscreteApi} from "naive-ui";
// import {inject} from "vue"
export const BASE_URL = 'http://localhost:8221'
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
// 在请求发送之前做一些事情

instance.interceptors.request.use(
    config => {
        loadingBar.start();
        // 如果有token，就加到请求头上
        const token = localStorage.getItem('token')
        if(token){
            console.log("token exist")
            config.headers.Authorization = token
            console.log(config.headers)
        } else {
            console.log("token not exist")
        }
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

export function download(url, data){
    return instance.post(BASE_URL+url, data, {responseType: 'blob'}).then(
        resp => {
            message.info('下载成功')
            const blob = new Blob([resp.data], {type: 'application/octet-stream'})
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob)
            downloadElement.href = href
            console.log(resp.headers)
            downloadElement.download = "file.docx"
            document.body.appendChild(downloadElement)
            downloadElement.click()
            document.body.removeChild(downloadElement)
            window.URL.revokeObjectURL(href)
        }
    )
}
