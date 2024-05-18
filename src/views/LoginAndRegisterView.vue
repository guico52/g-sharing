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
  </div>
</template>

<script>
import { login, register } from "../api/login.js";
import { defineComponent, reactive } from "vue";
import { router } from "../router/router.js";
import { NInput, NButton } from "naive-ui";

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
              console.log(res.data.data.token);
              localStorage.removeItem('token')
              localStorage.setItem('token', res.data.data.token);
              router.push({name: 'MenuView'});
            }
          })
          .catch(err => {
            console.log(err);
          });
    };

    const registerFunc = () => {
      console.log(state.registerUsername, state.registerPassword, state.confirmPassword);
      if (state.registerPassword !== state.confirmPassword) {
        alert('两次密码不一致');
        return;
      }
      register(state.registerUsername, state.registerPassword, state.confirmPassword)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
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
  background: linear-gradient(to right, #83a4d4, #b6fbff); /* 渐变背景 */
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
  background: rgba(255, 255, 255, 0.95);
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

.primary-button , .secondary-button {
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
