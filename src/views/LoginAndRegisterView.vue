<template>
  <div class="container">
    <div class="container-inner" :class="{ flipped: state.isFlipped }">
      <div class="login-form">
        <!-- 登录表单 -->
        <h2>登录</h2>
        <n-input class="input" v-model:value="state.username" type="text" placeholder="用户名" />
        <n-input class="input" v-model:value="state.password" type="password" placeholder="密码" />
        <div>
          <n-button class="primary-button" @click="loginFunc">登录</n-button>
          <n-button class="secondary-button" @click="toggleFlip">没有账号？去注册</n-button>
        </div>
      </div>
      <div class="register-form">
        <!-- 注册表单 -->
        <h2>注册</h2>
        <n-input class="input" v-model:value="state.registerUsername" type="text" placeholder="用户名" />
        <n-input class="input" v-model:value="state.registerPassword" type="password" placeholder="密码" />
        <n-input class="input" v-model:value="state.confirmPassword" type="password" placeholder="确认密码" />
        <div>
          <n-button class="primary-button" @click="registerFunc">注册</n-button>
          <n-button class="secondary-button" @click="toggleFlip">已有账号？去登录</n-button>
        </div>
      </div>
    </div>
    <!-- 动态背景泡泡 -->
    <div class="bubble bubble1"></div>
    <div class="bubble bubble2"></div>
    <div class="bubble bubble3"></div>
    <div class="bubble bubble4"></div>
    <!-- 装饰性背景元素 -->
    <div class="decorative-element decorative-element1"></div>
    <div class="decorative-element decorative-element2"></div>
    <div class="decorative-element decorative-element3"></div>
    <div class="decorative-element decorative-element4"></div>
    <!-- 新增背景元素 -->
    <div class="background-element background-element1"></div>
    <div class="background-element background-element2"></div>
    <div class="background-element background-element3"></div>
    <div class="background-element background-element4"></div>
  </div>
</template>

<script>
import { login, register } from "../api/login.js";
import { defineComponent, reactive } from "vue";
import { router } from "../router/router.js";
import { NInput, NButton } from "naive-ui";
import { message } from "../api/api.js";

export default defineComponent({
  components: {
    NInput,
    NButton
  },
  setup() {
    const state = reactive({
      isFlipped: false,
      username: '',
      password: '',
      registerUsername: '',
      registerPassword: '',
      confirmPassword: ''
    });

    const toggleFlip = () => {
      state.isFlipped = !state.isFlipped;
    };

    const loginFunc = () => {
      console.log(state.username, state.password);
      login(state.username, state.password)
          .then(res => {
            console.log(res);
            if (res.data.data) {
              message.success("登录成功")
              console.log(res.data.data.token);
              localStorage.removeItem('token')
              localStorage.setItem('token', res.data.data.token);
              document.cookie = `token=${res.data.data.token}`;
              router.push({ name: 'MenuView' });
            }
          })
          .catch(err => {
            message.error(err.data.message)
          });
    };

    const registerFunc = () => {
      console.log(state.registerUsername, state.registerPassword, state.confirmPassword);
      if (state.registerPassword !== state.confirmPassword) {
        message.error("两次密码不一致");
        return;
      }
      register(state.registerUsername, state.registerPassword, state.confirmPassword)
          .then(res => {
            if(res.data.code===200)
            message.success("注册成功")
          })
          .catch(err => {
            message.error(err.data.message)
          });
    };

    return {
      state,
      toggleFlip,
      loginFunc,
      registerFunc
    };
  }
});
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to right, #ff7e5f, #feb47b); /* 更加鲜艳的渐变背景 */
  height: 100vh;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(to right, #ff7e5f, #feb47b, #ff7e5f); /* 多层次鲜艳渐变背景 */
}

.container-inner {
  width: 50em;
  height: 45em;
  position: relative;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 2em;
}

.login-form, .register-form {
  position: absolute;
  width: 30em;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
}

.register-form {
  transform: rotateY(180deg);
}

.flipped {
  transform: rotateY(180deg);
}

.input {
  width: 100%;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 0.75em;
  border: 1px solid #ddd;
}

.primary-button, .secondary-button {
  height: 3em;
  font-size: 18px;
}

.primary-button {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #3a86ff;
  color: #fff;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.primary-button:hover {
  background: #2652b0;
}

.secondary-button {
  margin: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #ffa69e;
  color: #fff;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.secondary-button:hover {
  background: #cc4c4c;
}

/* 动态背景泡泡 */
.bubble {
  position: absolute;
  width: 50px;
  height: 50px;
  background: rgba(58, 134, 255, 0.2); /* 半透明蓝色 */
  border-radius: 50%;
  bottom: -150px;
  animation: bubbleUp 10s linear infinite;
}

.bubble1 {
  left: 20%;
  animation-duration: 8s;
  animation-delay: 2s;
}

.bubble2 {
  left: 40%;
  animation-duration: 6s;
  animation-delay: 4s;
}

.bubble3 {
  left: 60%;
  animation-duration: 10s;
  animation-delay: 6s;
}

.bubble4 {
  left: 80%;
  animation-duration: 12s;
  animation-delay: 8s;
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

/* 装饰性背景元素 */
.decorative-element {
  position: absolute;
  background: rgba(58, 134, 255, 0.1); /* 半透明蓝色 */
  border-radius: 50%;
}

.decorative-element1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.decorative-element2 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 70%;
  animation: float 8s ease-in-out infinite;
}

.decorative-element3 {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 20%;
  animation: float 10s ease-in-out infinite;
}

.decorative-element4 {
  width: 40px;
  height: 40px;
  top: 30%;
  left: 80%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 新增背景元素 */
.background-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.2); /* 半透明白色 */
  border-radius: 50%;
  animation: float 15s linear infinite;
}

.background-element1 {
  width: 150px;
  height: 150px;
  top: 10%;
  left: 25%;
}

.background-element2 {
  width: 120px;
  height: 120px;
  top: 40%;
  left: 60%;
}

.background-element3 {
  width: 180px;
  height: 180px;
  top: 70%;
  left: 15%;
}

.background-element4 {
  width: 100px;
  height: 100px;
  top: 85%;
  left: 75%;
}

@keyframes backgroundFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}
</style>
