<template>
  <div class="container">
    <div class="search-content">
      <n-input round placeholder="请输入文件名"/>
      <n-button type="primary" icon="search" @click="searchFiles">搜索</n-button>
    </div>
    <n-data-table :columns="columns" :data="data" :pagination="{ defaultPageSize: 20 }" bordered />
  </div>
</template>

<script setup>
import { NInput, NButton, NDataTable, NSpace } from "naive-ui";
import { ref, h, onMounted } from "vue";
import { deletedFileList, deleteFile, recoverFile } from "../../api/deletedFile.js";
import { dialog, message } from "../../api/api.js";

const columns = ref([
  {
    title: '文件名',
    key: 'name'
  },
  {
    title: '删除日期',
    key: 'deleteTime'
  },
  {
    title: '删除者',
    key: 'deleteBy'
  },
  {
    title: '项目',
    key: 'project'
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, { type: 'success', size: 'small', icon: 'sync', onClick: () => recoverFileHandler(row.id) }, '恢复'),
      h(NButton, { type: 'error', size: 'small', icon: 'delete', onClick: () => deleteFileHandler(row.id) }, '删除')
    ])
  }
]);

const data = ref([]);

onMounted(() => {
  fetchDeletedFiles();
});

const fetchDeletedFiles = () => {
  deletedFileList().then(res => {
    data.value = res.data.data;
  });
};

const recoverFileHandler = (id) => {
  recoverFile(id).then(() => {
    fetchDeletedFiles();
    message.success('恢复成功');
  });
};

const deleteFileHandler = (id) => {
  dialog.error({
    title: '删除文件',
    content: '删除后，文件将无法恢复，确定删除吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteFile(id).then(() => {
        fetchDeletedFiles();
        message.success('删除成功');
      });
    }
  });
};

const searchFiles = () => {
  // Implement search functionality based on input value
  console.log('Searching files...');
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
