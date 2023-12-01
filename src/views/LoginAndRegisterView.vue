<script setup>
import {ref} from 'vue'
import {NButton, NInput, useMessage} from 'naive-ui'

const message = useMessage()
const login = () => {
  message.success(`${username.value} 您已发送登录请求`)
}

// model vars
const username = ref('')
const password = ref('')

</script>

<template>
  <div class="background">
    <div class="form">
      <div class="title">this is a login form</div>
      <n-input class="input" placeholder="账号" v-model:value="username"/>
      <n-input class="input" placeholder="密码" v-model:value="password" type="password" show-password-on="click"/>
      <n-button class="button" color="green" @click="login">登录</n-button>
    </div>
  </div>
  <div class="star"></div>
</template>


<style scoped>
.background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  /*背景为渐变色*/
  background: linear-gradient(45deg, #42b883, #646cff);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40vh;
  width: 40vw;
  border: #1a1a1a solid 1px;
  box-shadow: 0 0 10px #1a1a1a;
  border-radius: 10px;

  /*泛白*/
  backdrop-filter: blur(10px);
  /*最小宽度*/
  min-width: 300px;
  max-width: 450px;
}

.input {
  width: 80%;
  margin-bottom: 30px;
}

.title {
  font-size: 20px;
  margin-bottom: 30px;
}
</style>