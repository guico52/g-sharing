<template>
  <div class="container" >
    <div class="bubble" style="left: 10%; animation-duration: 8s;"></div>
    <div class="bubble" style="left: 20%; animation-duration: 5s;"></div>
    <div class="bubble" style="left: 35%; animation-duration: 7s;"></div>
    <div class="bubble" style="left: 50%; animation-duration: 10s;"></div>
    <div class="bubble" style="left: 65%; animation-duration: 6s;"></div>
    <div class="bubble" style="left: 80%; animation-duration: 8s;"></div>
    <div class="bubble" style="left: 90%; animation-duration: 9s;"></div>
        <div class="container-inner" :class="{ flipped: state.isFlipped }">
          <div class="login-form">
            <!-- 登录表单 -->
            <h2>登录</h2>
            <n-input class="input" v-model="state.username" type="text" placeholder="用户名" />
            <n-input class="input" v-model="state.password" type="password" placeholder="密码" />
            <div>
              <n-button @click="loginFunc">登录</n-button>
              <n-button @click="toggleFlip">没有账号？去注册</n-button>
            </div>

          </div>
          <div class="register-form">
            <!-- 注册表单 -->
            <h2>注册</h2>
            <n-input class="input" v-model="state.registerUsername" type="text" placeholder="用户名" />
            <n-input class="input" v-model="state.registerPassword" type="password" placeholder="密码" />
            <n-input class="input" v-model="state.confirmPassword" type="password" placeholder="确认密码" />
            <div>
              <n-button @click="registerFunc">注册</n-button>
              <n-button @click="toggleFlip">已有账号？去登录</n-button>
            </div>
          </div>
        </div>
  </div>
</template>
<script>
import { login, register} from "../api/login.js";
import {defineComponent, reactive} from "vue";
import {router} from "../router/router.js";
import {NInput, NButton} from "naive-ui";

export default defineComponent({
  components: {
    NInput,
    NButton
  },
  setup() {
    const state =reactive({
      isFlipped: false,
      username: '',
      password: '',
      registerUsername: '',
      registerPassword: '',
      confirmPassword: '',
    })
    const toggleFlip = () => {
      state.isFlipped = !state.isFlipped;
    };

    const loginFunc = () => {
      console.log(state.username)
      console.log(state.password)
      login(state.username, state.password)
          .then(res => {
            console.log(res);
            if(res.data.data){
              console.log(res)
              console.log(res.data.data)
              localStorage.setItem('token', res.data.data)
              router.push("/menu")
            }
          })
          .catch(err => {
            console.log(err);
          })
    };

    const registerFunc = () => {
      console.log(state.registerUsername)
      console.log(state.registerPassword, state.confirmPassword)
      if(state.registerPassword !== state.confirmPassword) {
        alert('两次密码不一致')
        return
      }
      register(state.registerUsername, state.registerPassword, state.confirmPassword)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          })
    };
    return {
      state,
      toggleFlip,
      loginFunc,
      registerFunc
    }
  },



});
</script>
<style scoped>

.container {
  //background-color: transparent;
  width: 100vw;
  height: 100vh;
  //perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
}

.container-inner {
  width: 30em;
  height: 30em;
  position: relative;

  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;


}


.login-form, .register-form {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: var(--bg-200);
  color: var(--text-200);
  border-radius: 20px;
}


.register-form {
  transform: rotateY(180deg);
}

.flipped {
  transform: rotateY(180deg);
}

.input, button {
  margin: 0.5em 0;
  color: var(--text-200);
  border-radius: 10px;
}

.input {
  padding: 10px;
  border: none;
  outline: none;
  width: 400px;
  height: 50px;
}

button {
  padding: 10px 20px;
  margin: 10px;
  border: none;
  outline: none;
  cursor: pointer;
}
/* 现有的样式保持不变 */

/* 动画背景样式 */
.bubble {
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  bottom: -150px;
  animation: bubbleUp 10s linear infinite;
}

/* 动画关键帧 */
@keyframes bubbleUp {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    bottom: 100%;
    transform: scale(0.5);
    opacity: 0;
  }
}


</style>

