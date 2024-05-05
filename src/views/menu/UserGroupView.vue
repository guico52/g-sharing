<template>
  <div class="search-content">
    <n-input/>
    <n-button @click="showModal=true"/>
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
import {list, detail} from "../../api/usergroup.js";

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
      return [
        h(NButton, {onClick: () => {
          showModal.value = true;
          detail(row.id).then(
              res => {
                groupDetail.value = res.data.data
              })
        }}, '浏览')
      ]
    }
  }
])
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
const radioValue = ref(1);
const detailColumns = ref([
  {
    title: '用户名',
    key: 'username'
  }, {
    title: '权限',
    key: 'permission',
    render: (row) => {
      return h( NRadioGroup, {value: radioOptions} , {
          default: () => {
            return h(NSpace, null, {
              default: () => {
                return radioOptions.value.map(option => {
                  return h(NRadio, {value: option.value}, {default: () => option.label})
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
</style>
