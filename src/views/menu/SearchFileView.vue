<template>
  <div class="search-content">
    <n-input round placeholder="请输入查找关键字" v-model:value="searchKeyword"></n-input>
    <n-button @click="handleSearch">搜索</n-button>
    <n-button @click="asyncFile()">同步数据</n-button>
  </div>
  <n-data-table :columns="columns" :data="data"/>
</template>

<script setup>
import {NInput, NButton, NDataTable} from "naive-ui";
import {h, ref} from "vue";
import {asyncFile, searchFile} from "../../api/search.js";
import {router} from "../../router/router.js";

const searchKeyword = ref('');
const columns = [
  {
    'title': '项目名称',
    'key': 'projectName'
  },{
    title: '文件名',
    key: 'fileName',
    render: (row) => {
      return h('div', {innerHTML: row.fileName})
    }
  }, {
    title: '内容',
    key: 'highlight',
    render: (row) => {
      return h('div', {innerHTML: row.textContentHighlight})
    }
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h('n-space', {}, [
        h(NButton, {onClick: () => {
          router.push(`/fileView/${row.fileId}`)
        }}, '浏览')
      ])
    }
  }
];

const data = ref([])


const handleSearch = () => {
  searchFile(searchKeyword.value).then(
      res => {
        data.value = res.data.data
      }
  )
}
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
