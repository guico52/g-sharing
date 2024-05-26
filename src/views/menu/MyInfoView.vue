<template>
  <div class="container">
    <div class="my-info-content">
      <NDivider title-placement="center">我的信息</NDivider>
      <NSpace class="my-info-space">
        <label class="my-info-label">我的昵称</label>
        <NInput class="my-info-input" round v-model:value="username" />
        <NButton type="primary" icon="edit" @click="handleModifyUsername">修改</NButton>
      </NSpace>
      <NSpace class="my-info-space">
        <label class="my-info-label">我的密码</label>
        <NInput class="my-info-input" round type="password" show-password-on="click" v-model:value="password" />
        <NButton type="primary" icon="key" @click="handleModifyPassword">修改</NButton>
      </NSpace>
    </div>
    <NDivider title-placement="center">我加入的用户组</NDivider>
    <div class="table-container">
      <NDataTable :columns="columns" :pagination="{ pageSize: 20 }" :data="data" bordered />
    </div>
  </div>
</template>

<script setup>
import { NInput, NSpace, NDivider, NDataTable, NButton } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { getMyInfo, getMyGroups, updateMyName, updateMyPassword, exitUserGroup } from '../../api/myInfo.js';
import {message} from "../../api/api.js";

const username = ref('');
const password = ref('');
const columns = [
  {
    title: '用户组名称',
    key: 'name'
  },
  {
    title: '组内权限',
    key: 'permission',
    render: (row) => h('span', {}, row.permission === "1" ? '普通用户' : row.permission === "2" ? '管理员' : '超级管理员')
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, {
        type: 'error',
        size: 'small',
        icon: 'exit',
        onClick: () => handleExitUserGroup(row.id)
      }, '退出用户组')
    ])
  }
];
const data = ref([]);

onMounted(() => {
  getMyInfo().then(res => {
    username.value = res.data.data.username;
  });
  getMyGroups().then(res => {
    data.value = res.data.data;
  });
});

const handleModifyUsername = () => {
  updateMyName(username.value).then(res => {
    if (res.data.code === 200) {
      message.success('修改成功');
    }
  });
};

const handleModifyPassword = () => {
  updateMyPassword(password.value).then(() => {
    message.success('修改成功');
  });
};

const handleExitUserGroup = (id) => {
  exitUserGroup(id).then(() => {
    getMyGroups().then(res => {
      data.value = res.data.data;
    });
    message.success('退出成功');
  });
};
</script>

<style scoped>
.container {
  padding: 1.5em;
  border-radius: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.my-info-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 2em 0;
}

.my-info-label {
  margin-right: 1em;
}

.my-info-input {
  width: 50em;
}

.my-info-space {
  margin: 1em 0;
}

.table-container {
  margin: 2em 0;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
