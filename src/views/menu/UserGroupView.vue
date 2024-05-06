<template>
  <div class="search-content">
    <n-input round/>
    <n-button @click="showModal=true">搜索</n-button>
  </div>
  <div class="content">
    <n-data-table :columns="columns" :data="data">
    </n-data-table>
  </div>
  <n-modal v-model:show="showModal">
    <template #title>
    </template>
    <template #default>
      <div class="permission-content">
        <n-data-table :columns="detailColumns" :data="groupDetail"/>
      </div>
    </template>
  </n-modal>

</template>
<script setup>
import {NInput, NButton, NDataTable, NModal, NRadio, NRadioGroup, NSpace} from "naive-ui"
import {h, onMounted, ref} from "vue";
import {list, detail, rename,updatePermission} from "../../api/usergroup.js";
import {message, dialog} from "../../api/api.js";

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
const columns = ref([
  {
    title: '用户组名称',
    key: 'name'
  }, {
    title: '创建日期',
    key: 'createTime'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h(NSpace, {} ,[
        h(NButton,{onClick: () => {
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
          })}}, '重命名'),
        h(NButton, {onClick: () => {
            showModal.value = true;
            detail(row.id).then(
                res => {
                  groupDetail.value = res.data.data
                })
          }}, '浏览'),
      ])
    }
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
          updatePermission(row.id, value).then(
              res => {
                if(res.data.code === 200){
                  row.level = value;
                  message.success('修改成功')
                }
              }
          )
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

onMounted(
    () => {
      list().then(
          res => {
            data.value = res.data.data
          })
    }
)
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
