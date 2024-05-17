import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router/router.js";
import './assets/css/main.css'
import {createStore} from "vuex";

const store = createStore({
    state() {
        return {
            userPermission: 0,
            userFilePermission: 0
        }
    },
    mutations: {
        setUserPermission(state, payload) {
            state.userPermission = payload
        },
        setUserFilePermission(state, payload) {
            state.userFilePermission = payload
        }
    }
})
const app = createApp(App)

app.use(router)
app.use(store)
// 定义一个pms的组件属性
app.directive('pms-user', {
    beforeMount(el, binding, vnode){
        const value = binding.value
        if (value < store.state.userPermission) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
});
app.directive('pms-file', {
    beforeMount(el, binding, vnode){
        const value = binding.value
        if (value < store.state.userFilePermission) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
});
app.mount('#app')

