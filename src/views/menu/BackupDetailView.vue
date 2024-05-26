<template>
  <div class="container">
    <div class="search-content">
      <n-input round placeholder="搜索备份" v-model="searchInput" />
      <n-button type="primary" icon="search" @click="search">搜索</n-button>
    </div>
    <div class="table-container">
      <n-data-table :columns="columns" :data="data" :pagination="{ pageSize: 20 }" bordered />
    </div>
  </div>
</template>

<script setup>
import { NInput, NButton, NDataTable, NSpace, NEllipsis } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { backupFileList, deleteBackupFile, exportBackupFile, restoreBackupFile } from "../../api/backup.js";
import { useRouter } from "vue-router";
import { message } from "../../api/api.js";

const columns = ref([
  {
    title: '文件内容',
    key: 'content',
    render: (row) => h(NEllipsis, { style: 'width: 200px' }, row.content)
  },
  {
    title: '创建日期',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, { type: 'info', size: 'small', icon: 'eye', onClick: () => viewDetail(row.id) }, '浏览'),
      h(NButton, { type: 'success', size: 'small', icon: 'download', onClick: () => exportFile(row.id, row.fileName) }, '导出'),
      h(NButton, { type: 'warning', size: 'small', icon: 'sync', onClick: () => restoreFile(row.id) }, '恢复'),
      h(NButton, { type: 'error', size: 'small', icon: 'delete', onClick: () => deleteFile(row.id) }, '删除')
    ])
  }
]);

const router = useRouter();
const data = ref([]);
const searchInput = ref('');
const fileId = router.currentRoute.value.params.id;

onMounted(() => {
  fetchBackupFiles();
});

const fetchBackupFiles = () => {
  backupFileList(fileId).then(res => {
    data.value = res.data.data;
  });
};

const viewDetail = (id) => {
  router.push(`/backup/detail/${id}`);
};

const exportFile = (id, fileName) => {
  exportBackupFile(id, fileName);
};

const restoreFile = (id) => {
  restoreBackupFile(id).then(() => {
    fetchBackupFiles();
    message.success('恢复成功');
  });
};

const deleteFile = (id) => {
  deleteBackupFile(id).then(() => {
    message.success('删除成功');
    fetchBackupFiles();
  });
};

const search = () => {
  // Implement search functionality based on searchInput value
  console.log(searchInput.value);
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
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.search-content * {
  margin-left: 0;
}

.table-container {
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
