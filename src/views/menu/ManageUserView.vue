<template>
  <div class="container">
    <div class="header">
      <h1>用户管理</h1>
      <p>在此页面中，您可以查看和管理系统中的所有用户。</p>
      <NButton type="primary" @click="showAddUserDialog">添加用户</NButton>
    </div>
    <div class="table-container">
      <NDataTable :columns="columns" :pagination="{pageSize: 20}" :data="data" />
    </div>
  </div>
</template>

<script setup>
import { h, onMounted, ref } from "vue";
import { NDataTable, NSpace, NButton, NRadioGroup, NRadio, NInput, } from "naive-ui";
import { deleteUser, list, updateUserPermission, add, updatePassword } from "../../api/userManage.js";
import { dialog, message } from "../../api/api.js";

const radioOption = [
  { label: '用户', value: 1 },
  { label: '管理员', value: 2 },
  { label: '超级管理员', value: 3 }
];

const columns = [
  { title: '用户名称', key: 'username' },
  {
    title: '系统内权限',
    key: 'userLevel',
    render: (row) => h(NRadioGroup, {
      value: row.userLevel,
      onUpdateValue: (value) => {
        updateUserPermission(row.userId, value).then(() => {
          list().then(res => {
            data.value = res.data.data;
          });
          message.success('修改成功');
        });
      }
    }, radioOption.map(item => h(NRadio, { value: item.value, checked: row.userLevel === item.value }, item.label)))
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, {
        type: 'error',
        onClick: () => {
          deleteUser(row.userId).then(() => {
            list().then(res => {
              data.value = res.data.data;
            });
            message.success('删除成功');
          });
        }
      }, '删除用户'),
      h(NButton, {
        type: 'info',
        onClick: () => showUpdatePasswordDialog(row.userId)
      }, '修改密码')
    ])
  }
];

const data = ref([]);
const username = ref('');
const password = ref('');

onMounted(() => {
  list().then(res => {
    data.value = res.data.data;
  });
});

const showAddUserDialog = () => {
  dialog.info({
    title: '添加用户',
    content: () => h(NSpace, {}, [
      h(NInput, {
        placeholder: '请输入用户名',
        onUpdateValue: (value) => {
          username.value = value;
        }
      }),
      h(NInput, {
        placeholder: '请输入密码',
        type: 'password',
        onUpdateValue: (value) => {
          password.value = value;
        }
      })
    ]),
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      add(username.value, password.value).then(() => {
        list().then(res => {
          data.value = res.data.data;
        });
        message.success('添加成功');
        username.value = '';
        password.value = '';
      });
    }
  });
};

const showUpdatePasswordDialog = (userId) => {
  const newPassword = ref('');
  dialog.info({
    title: '修改密码',
    content: () => h(NInput, {
      placeholder: '请输入新密码',
      type: 'password',
      onUpdateValue: (value) => {
        newPassword.value = value;
      }
    }),
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      // 调用修改密码的接口
      updatePassword(userId, newPassword.value).then(() => {
        message.success('密码修改成功');
      });
    }
  });
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.header p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.table-container {
  margin-top: 20px;
}
</style>
