<template>
  <div class="container">
    <div class="search-content">
      <n-input round placeholder="请输入查找关键字" v-model:value="searchKeyword" />
      <n-button type="primary" icon="search" @click="handleSearch">搜索</n-button>
    </div>
    <n-data-table :columns="columns" :data="data" :pagination="{ defaultPageSize: 20 }" bordered />
  </div>
</template>

<script setup>
import { NInput, NButton, NDataTable, NSpace} from "naive-ui";
import { h, ref } from "vue";
import { searchFile } from "../../api/search.js";
import { useRouter } from "vue-router";
import { message } from "../../api/api.js";

const searchKeyword = ref('');
const data = ref([]);
const router = useRouter();

const columns = [
  {
    title: '项目名称',
    key: 'projectName'
  },
  {
    title: '文件名',
    key: 'fileName',
    render: (row) => h('div', { innerHTML: row.fileName })
  },
  {
    title: '内容',
    key: 'highlight',
    render: (row) => h('div', { innerHTML: row.textContentHighlight })
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, { type: 'info', size: 'small', icon: 'eye', onClick: () => router.push(`/fileView/${row.fileId}`) }, '浏览')
    ])
  }
];

const handleSearch = () => {
  if (searchKeyword.value === '' || !searchKeyword.value) {
    message.warning('请输入查找关键字');
    return;
  }
  searchFile(searchKeyword.value).then(res => {
    data.value = res.data.data;
  });
};

const asyncFile = () => {
  asyncFile().then(() => {
    message.success('数据同步成功');
  });
};
</script>

<style scoped>
.container {
  padding: 1.5em;
  background-color: #f5f5f5;
  border-radius: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.search-content * {
  margin-left: 0;
}

.n-data-table {
  background-color: #fff;
  border-radius: 0.5em;
  padding: 1.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

</style>
