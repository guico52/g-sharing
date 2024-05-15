import axios from 'axios'
import {createDiscreteApi} from "naive-ui";
// import {inject} from "vue"
export const BASE_URL = 'http://192.168.1.3:8221'
const instance = axios.create({
    headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
    },
    timeout: 50000,

});

export const {message, loadingBar, dialog} = createDiscreteApi(
    ['message', 'loadingBar', 'dialog']
)
// 在请求发送之前做一些事情

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
        console.log(resp.status)
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
        if(error.response.status === 401){
            message.error('您没有该操作的权限，请联系管理员')
            return Promise.reject(error)
        }
        message.error(error.message)
        return Promise.reject(error);
    }
)
// 添加全局异常处理



// 封装axios的post请求
export function post(url, data,headers) {
    // console.log(loadingBar)
    return  instance.post(BASE_URL+url, data, {headers: headers})
}



export function download(url, data, name, headers){
    return instance.post(BASE_URL+url, data, {responseType: 'blob', headers:headers}).then(
        resp => {
            message.info('下载成功')
            const blob = new Blob([resp.data], {type: 'application/octet-stream'})
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob)
            downloadElement.href = href
            console.log(resp.headers)
            if(name.endsWith('.docx') || name.endsWith("doc")){
                downloadElement.download = name
            } else {
                downloadElement.download = `${name}.docx`
            }
            document.body.appendChild(downloadElement)
            downloadElement.click()
            document.body.removeChild(downloadElement)
            window.URL.revokeObjectURL(href)
        }
    )
}

export async function aiGenerate(prompt, content) {
    const response = await fetch(BASE_URL + '/ai/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
            prompt: prompt,
            content: content
        })
    })
    const reader = response.body.getReader();
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)
    while(true) {
        const {done, value} = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, {stream: true});
        console.log("Chunk received:", chunk)
    }

    // Concatenate all chunks to form the final data
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
    }
    const finalData = new TextDecoder("utf-8").decode(chunksAll);
    console.log("Complete data received:", finalData);
}
