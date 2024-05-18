<template>
  <div class="search-content">
    <n-input round placeholder="用户组名称查询" v-model:value="searchInput"/>
    <n-button @click="search">搜索</n-button>
    <n-button>重置</n-button>
    <n-button @click="addUserGroupHandler">添加</n-button>
<!--    <n-button @click="aiGenerate('', '你好')">测试</n-button>-->
  </div>
  <div class="content">
    <n-data-table :columns="columns" :data="data">
    </n-data-table>
  </div>

</template>
<script setup>
import {NInput, NButton, NDataTable, NModal, NRadio, NRadioGroup, NSpace, NTransfer} from "naive-ui"
import {h, onMounted, ref} from "vue";
import {
  list,
  detail,
  rename,
  updatePermission,
  add,
  listUser,
  updateUserGroupMember,
  deleteUserGroup
} from "../../api/usergroup.js";
import {message, dialog, aiGenerate} from "../../api/api.js";

const data = ref([]);
const showModal = ref(false);
const groupDetail = ref([]);
const radioOptions =ref([
  {
    label:'普通用户',
    value: 1
  }, {
    label: '管理员',
    value: 2
  }, {
    label: '超级管理员',
    value: 3
  }
])
const newName = ref('');
const userOption =  ref([]);
const userValue = ref([]);
const searchInput = ref('');
const selectedGroupId = ref('');

const columns = ref([
  {
    title: '用户组名称',
    key: 'name'
  }, {
    title: '创建日期',
    key: 'createTime'
  }, {
    key: 'action',
    render: (row) => {
      return h(NSpace, {}, [
        h(NButton, {
          onClick: () => {
            selectedGroupId.value = row.id;
            dialog.create({
              title: '重命名用户组',
              message: '请输入新的用户组名称',
              positiveText: '确认',
              negativeText: '取消',
              content: () => {
                return h(NSpace, null, [
                  h(NInput, {
                    placeholder: '请输入新的用户组名称',
                    clearable: true,
                    bind: {value: newName.value},
                    onUpdateValue: (value) => {
                      newName.value = value
                    }
                  })
                ])
              },
              onPositiveClick: () => {
                console.log(newName.value)
                if (newName.value === '') {
                  message.error('用户组名称不能为空')
                } else {
                  rename(row.id, newName.value).then(
                      res => {
                        if (res.data.code === 200) {
                          row.name = newName.value;
                          message.success('重命名成功')
                        }
                      }
                  )
                }
              }
            })
          }
        }, '重命名'),
        h(NButton, {
          onClick: () => {
            detail(row.id).then(
                res => {
                  groupDetail.value = res.data.data
                })
            dialog.info({
              title: '更改权限',
              content: () => {
                return h('div', {class: 'permission-content'}, [
                  h(NDataTable, {
                    columns: detailColumns.value,
                    data: groupDetail.value
                  })
                ])
              },
              positiveText: '确认',
              negativeText: '取消',
              onAfterLeave: onAfterLeave
            });
          }
        }, '更改权限'),
        h(NButton, {
          onClick: () => {
            // 先获取option和所有用户
            selectedGroupId.value = row.id;
            detail(row.id).then(
                res => {
                  userValue.value = res.data.data.map(user => {
                    return user.userId
                  })
                }
            );
            dialog.info({
              title: '管理成员',
              content: () => {
                return h(NTransfer,
                    {
                      value: userValue.value,
                      options: userOption.value,
                      onUpdateValue: (value) => {
                        userValue.value = value
                      }
                    }
                )
              },
              positiveText: '确认',
              negativeText: '取消',
              onPositiveClick: () => {
                updateUserGroupMember(row.id, userValue.value).then(
                    res => {
                      if(res.data.code === 200){
                        message.success('修改成功')
                      }
                    }
                )
              }
            });
          }
        }, '管理成员'),
        h(NButton, {
          onClick: () => {
            dialog.error({
              title: '解散用户组',
              content: '解散后，用户组将无法恢复，确定解散吗？',
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: () => {
                deleteUserGroup(row.id).then(
                    res => {
                      if(res.data.code === 200){
                        message.success('解散成功')
                        list().then(
                            res => {
                              data.value = res.data.data
                            })
                      }
                    })
              }
            })
          }
        }, '解散')
      ])
    },
    title: '操作'
  }
])
const detailColumns = ref([
  {
    title: '用户名',
    key: 'username'
  }, {
    title: '权限',
    key: 'permission',
    render: (row) => {
      return h( NRadioGroup, {
        value: row.level,
        onUpdateValue: (value) => {
          row.level = value
        }
      } , {
          default: () => {
            return h(NSpace, null, {
              default: () => {
                return radioOptions.value.map(option => {
                  return h(NRadio, {
                    value: option.value,
                    defaultChecked: row.level === option.value,
                    checked: row.level === option.value,
                  }, {default: () => option.label})
                })
              }
            })
          }
      })
    }
  }
])
const newUserGroupName = ref('');


const addUserGroupHandler = () => {
  dialog.info({
        title: '添加用户组',
        message: '请输入用户组名称',
        positiveText: '确认',
        negativeText: '取消',
        content: () => {
          return h(NSpace, null, [
            h(NInput, {
              placeholder: '请输入用户组名称',
              clearable: true,
              bind: {value: newUserGroupName.value},
              onUpdateValue: (value) => {
                newUserGroupName.value = value
              }
            })
          ])
        },
      onPositiveClick: () => {
        console.log(newUserGroupName.value)
          if (newUserGroupName.value === '') {
            message.error('用户组名称不能为空')
          } else {
            add(newUserGroupName.value).then(
                res => {
                  if (res.data.code === 200) {
                    message.success('添加成功')
                    list().then(
                        res => {
                          data.value = res.data.data
                        })
                  }
                }
            )
          }
        }
      },
  )
}

onMounted(
    () => {
      list().then(
          res => {
            data.value = res.data.data
          })
      listUser().then(
          res => {
            userOption.value = res.data.data.map(user => {
              return {
                label: user.username,
                value: user.id
              }
            })
          }
      )
    }
)

const search = () => {
  list(searchInput.value).then(
      res => {
        data.value = res.data.data
      })
}

const onAfterLeave = () => {
  const reqParams = groupDetail.value.map(user => {
    return {
      id: user.id,
      level: user.level
    }
  })
  updatePermission(reqParams, selectedGroupId).then(
      res => {
        if(res.data.code === 200){
          message.success('修改成功')
          groupDetail.value = []
        }
      }
  )
}
</script>
<style scoped>
.permission-content {
  width: 35em;
  background: var(--bg-200);
  padding: 1em;
  border-radius: 0.5em;
}
.search-content {
  display: flex;
  justify-content: flex-end;
  margin: 1em;
}

.search-content * {
  margin: 1em;
}
</style>
