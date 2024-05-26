<template>
  <NSpin :show="loading">
    <NLayout has-sider class="layout">
      <NLayoutSider
          :collapsed="collapsed"
          :width="200"
          collapse-mode="width"
          class="layout-sider"
      >
        <NMenu
            class="menu"
            v-model:value="selectedGroupId"
            :options="menuOption"
            @update:value="handleMenuSelectChange"
        />
      </NLayoutSider>
      <NLayout class="right-layout">
        <NLayoutContent>
          <div class="message-panel">
            <ChatMessage
                v-for="message in messages"
                :key="message.index"
                :message="message"
            />
          </div>
        </NLayoutContent>
        <NLayoutFooter class="layout-footer">
          <div class="input-panel">
            <NInput placeholder="请输入聊天内容" v-model:value="input" class="input-box" @keydown.enter="sendMessage" />
            <NButton type="primary" class="send-button" @click="sendMessage">发送</NButton>
          </div>
        </NLayoutFooter>
      </NLayout>
    </NLayout>
  </NSpin>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import { NLayout, NLayoutSider, NLayoutContent, NLayoutFooter, NMenu, NInput, NButton, NSpin } from "naive-ui";
import ChatMessage from "./componet/ChatMessage.vue";
import {listUser, listPrivateChat} from "../../api/chat.js";
import {message} from "../../api/api.js"
import {PrivateChatWebSocket} from "../../ws/privateChatWebSocket.js";

const users = ref([]);
const loading = ref(true);
const menuOption = ref([]);
const selectedGroupId = ref('');
const collapsed = ref(false);
const messages = ref([]);
let websocket = null;
const input = ref('');

onMounted(() => {
  listUser().then(res => {
    users.value = res.data.data;
    menuOption.value = users.value.map(group => {
      return {
        label: group.name,
        key: group.id,
      }
    });
    loading.value = false;
  })
});

const sendMessage = () => {
  if(input.value === ''){
    message.warning('请输入聊天内容');
    return;
  }
  websocket.sendMessage({message: input.value, type: 1, token: 'token'});
  input.value = '';
}
onUnmounted(() => {
  if(websocket){
    websocket.close();
  }
});

const handleMenuSelectChange = (value) => {
  listPrivateChat(value).then(res => {
    messages.value = res.data.data;
  });
  selectedGroupId.value = value;
  if(websocket){
    websocket.close();
  }
  websocket = new PrivateChatWebSocket(value, data => {
    messages.value.push(data);
  });
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
  --bg-100: #34495e;
  --bg-200: #ecf0f1;
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --text-color: #2c3e50;
  --text-light: #ecf0f1;
  --gray: #7f8c8d;
}

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

.layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-200), #bdc3c7);
}

.menu {
  height: 100vh;
  background: var(--bg-100);
  color: var(--text-light);
  padding-top: 20px; /* Add some padding to the top */
}

.layout-sider {
  flex: 1;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
}
.right-layout{
  margin-left: 2em;
}

.right-layout, .message-panel, .input-panel {
}

.message-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  border-radius: 10px;
  margin: 20px;
}

.input-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 25px;
  padding: 10px;
  width: 100%;
}

.input-box {
  flex: 1;
  margin-right: 10px;
}

.send-button {
  background-color: var(--primary-color);
  color: var(--text-light);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
}

.layout-footer {
  position: fixed;
  bottom: 20px;
  width: 70%;
  background-color: var(--bg-200);
  border-radius: 25px;
  padding: 10px 20px;
  margin-left: 200px;
  margin-right: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add some box shadow */
}
</style>
