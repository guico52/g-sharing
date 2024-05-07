<template>
  <div class="search-content">
    <n-input round placeholder="请输入查找关键字"></n-input>
    <n-button>搜索</n-button>
  </div>
  <n-data-table :columns="columns" :data="data"/>
</template>

<script setup>
import {NInput, NButton, NDataTable} from "naive-ui";
import {h, ref} from "vue";

const columns = [
  {
    'title': '项目名称',
    'key': 'projectName'
  },{
    title: '文件名',
    key: 'fileName'
  }, {
    title: '内容',
    key: 'highlightContent'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h('n-space', {}, [
        h(NButton, {onClick: () => {
          console.log(row)
        }}, '浏览')
      ])
    }
  }
];

const data = ref([])
</script>



<style scoped>
.search-content{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.search-content * {
  margin: 10px;
}
</style>
