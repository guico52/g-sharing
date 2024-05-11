<template>
  <div class="my-info-content">
    <NDivider title-placement="center" >我的信息</NDivider>
    <NSpace class="my-info-space">
      <label class="my-info-label">我的昵称</label>
      <NInput class="my-info-input" round v-model:value="username"/>
      <NButton @click="handleModifyUsername">修改</NButton>
    </NSpace>
    <NSpace class="my-info-space">
      <label class="my-info-label">我的密码</label>
      <NInput class="my-info-input" round type="password" show-password-on="click" v-model:value="password"/>
      <NButton @click="handleModifyPassword">修改</NButton>
    </NSpace>
  </div>
  <NDivider title-placement="center" >我加入的用户组</NDivider>
  <div>
    <NDataTable :columns="columns" :data="data"/>
  </div>
</template>
<script setup>
import {NInput, NSpace, NDivider, NDataTable, NButton} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {message} from "../../api/api.js";
import {getMyInfo, getMyGroups, updateMyName, updateMyPassword, exitUserGroup} from '../../api/myInfo.js'

const username = ref('');
const password = ref('');
const columns = [{
  title: '用户组名称',
  key: 'name'
}, {
  title: '组内权限',
  key: 'permission',
  render: (row) => {
    return h('n-space', {}, [
      h('span', {}, row.permission === "1" ? '普通用户' : row.permission === "2" ? '管理员' : '超级管理员')
    ])
  }
}, {
  title: '操作',
  key: 'action',
  render: (row) => {
    return h('n-space', {}, [
      h(NButton, {
        onClick: () => {
          handleExitUserGroup(row.id)
        }
      }, '退出用户组')
    ])

  },
}
]
const data = ref([])

onMounted(() => {
  getMyInfo().then(
      res => {
        username.value = res.data.data.username
      }
  )
  getMyGroups().then(
      res => {
        data.value = res.data.data
      }
  )
})

const handleModifyUsername = () => {
  updateMyName(username.value).then(
      (res) => {
        if(res.data.code===200){
          message.success('修改成功')
        }

      }
  )
}

const handleModifyPassword = () => {
  updateMyPassword(password.value).then(
      () => {
        message.success('修改成功')
      }
  )
}

const handleExitUserGroup = (id) => {
  exitUserGroup(id).then(
      () => {
        getMyGroups().then(
            res => {
              data.value = res.data.data
            }
        )
        message.success('退出成功')
      }
  )
}

</script>


<style scoped>
.my-info-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 2em
}

.my-info-label {
  margin-right: 1em;
}

.my-info-input {
  width: 50em;
}

.my-info-space {
  margin: 1em;
}
</style>
