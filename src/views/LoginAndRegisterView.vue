<template>
  <div class="container" >
    <div class="bubble" style="left: 10%; animation-duration: 8s;"></div>
    <div class="bubble" style="left: 20%; animation-duration: 5s;"></div>
    <div class="bubble" style="left: 35%; animation-duration: 7s;"></div>
    <div class="bubble" style="left: 50%; animation-duration: 10s;"></div>
    <div class="bubble" style="left: 65%; animation-duration: 6s;"></div>
    <div class="bubble" style="left: 80%; animation-duration: 8s;"></div>
    <div class="bubble" style="left: 90%; animation-duration: 9s;"></div>

    <div class="container-inner" :class="{ flipped: isFlipped }">
      <div class="login-form">
        <!-- 登录表单 -->
        <h2>登录</h2>
        <input :value="this.username" type="text" placeholder="用户名" />
        <input :value="this.password" type="password" placeholder="密码" />
        <div>
          <button>登录</button>
          <button @click="toggleFlip">没有账号？去注册</button>
        </div>

      </div>
      <div class="register-form">
        <!-- 注册表单 -->
        <h2>注册</h2>
        <input type="text" placeholder="用户名" />
        <input type="password" placeholder="密码" />
        <input type="password" placeholder="确认密码" />
        <div>
          <button>注册</button>
          <button @click="toggleFlip">已有账号？去登录</button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { login, register} from "../api/login.js";

export default {
  data() {
    return {
      isFlipped: false,
      username: '',
      password: '',
      registerUsername: '',
      registerPassword: '',
      confirmPassword: '',
    };
  },
  methods: {
    // 翻转表单
    toggleFlip() {
      this.isFlipped = !this.isFlipped;
    },

    // 登录
    login() {
      login(this.username, this.password)
        .then(res => {
          console.log(res);
          // 保存token
          localStorage.setItem('token', res.data.token)
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 注册
    register() {
      if(this.registerPassword !== this.confirmPassword) {
        alert('两次密码不一致')
        return
      }
      register(this.registerUsername, this.registerPassword, this.confirmPassword)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
};
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
  width: 400px;
  height: 400px;
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

input, button {
  margin: 10px 0;
  color: var(--text-200);
  background: var(--primary-100);
  border-radius: 10px;
}

input {
  padding: 10px;
  border: none;
  outline: none;
  width: 220px;
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

