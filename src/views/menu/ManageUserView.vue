<template>
  this is manage user view
  <n-data-table :columns="columns" :data="data"/>
</template>

<script setup>
import {NDataTable, NSpace, NButton, NRadioGroup, NRadio, NInput} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {deleteUser, list, updateUserPermission, add} from "../../api/userManage.js";
import {dialog, message} from "../../api/api.js";

const radioOption = [
  {
    label: '用户',
    value: 1
  }, {
    label: '管理员',
    value: 2
  }, {
    label: '超级管理员',
    value: 3
  }
]
const columns = [
  {
    title: '用户名称',
    key: 'username'
  }, {
    title: '用户权限',
    key: 'userLevel',
    render: (row) => {
      return h(NRadioGroup, {
        value: row.userLevel,
        onUpdateValue: (value) => {
          updateUserPermission(row.userId, value).then(
              res => {
                list().then(
                    res => {
                      data.value = res.data.data
                    }
                )
                message.success('修改成功')
              })
        }
      }, radioOption.map(item => {
        return h(NRadio, {
          value: item.value,
          checked: row.userLevel === item.value
        }, item.label)
      }))
    }
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h(NSpace, {}, [
        h(NButton, {
          onClick: () => {
            deleteUser(row.userId).then(
                res => {
                  list().then(
                      res => {
                        data.value = res.data.data
                      }
                  )
                  message.success('删除成功')
                }
            )
          }
        }, '删除用户'),
        h(NButton, {
          onClick: () => {
            dialog.create({
              title: '添加用户',
              message: '请输入用户名',
              content: () => {
                return h(NSpace, {}, [
                      h(NInput, {
                        placeholder: '请输入用户名',
                        bindValue: username,
                        onUpdateValue: (value) => {
                          username.value = value
                        }
                      }),
                      h(NInput, {
                        placeholder: '请输入密码',
                        type: 'password',
                        bindValue: password,
                        onUpdateValue: (value) => {
                          password.value = value
                        }
                      })
                    ])
              },
              positiveText: '确认',
              negativeText: '取消',
              onPositiveClick: () => {
                add(username.value, password.value).then(
                    res => {
                      list().then(
                          res => {
                            data.value = res.data.data
                          }
                      )
                      message.success('添加成功')
                      username.value = ''
                      password.value = ''
                    })
              },
              showInput: true,
            })
          }
        }, '添加用户')
      ])
    }
  }
]

const data = ref([])
const username = ref('')
const password = ref('')

onMounted(() => {
  list().then(
      res => {
        data.value = res.data.data
      }
  )
})
</script>



<style scoped>

</style>
