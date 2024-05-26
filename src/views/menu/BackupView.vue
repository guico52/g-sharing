<template>
  <div class="container">
    <div class="search-content">
      <n-input placeholder="请输入文件名" v-model:value="input" round />
      <n-button type="primary" icon="search" @click="searchBackupFileByName">搜索</n-button>
      <n-button icon="refresh" @click="resetList">重置</n-button>
    </div>
    <div class="backup-content">
      <n-data-table :columns="tableColumns" :data="fileInfoList" :row-props="rowProps" :pagination="{ defaultPageSize: 20 }" bordered />
    </div>
  </div>
</template>

<script setup>
import { h, onMounted, ref } from "vue";
import {NInput, NButton, NDataTable, NSpace} from 'naive-ui';
import { useRouter } from "vue-router";
import { backupInfoList } from "../../api/backup.js";

const input = ref('');
const fileInfoList = ref([]);
const router = useRouter();

const tableColumns = ref([
  {
    title: '文件名',
    key: 'fileName'
  },{
    title: '项目名',
    key: 'projectName'
  },
  {
    title: '备份数量',
    key: 'nums'
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, { type: 'info', size: 'small', icon: 'eye', onClick: () => router.push(`/backup/${row.fileId}`) }, '浏览')
    ])
  }
]);

onMounted(() => {
  fetchBackupList();
});

const rowProps = row => ({
  style: 'cursor: pointer;',
});

const fetchBackupList = () => {
  backupInfoList().then(res => {
    fileInfoList.value = res.data.data;
  });
};

const searchBackupFileByName = () => {
  backupInfoList(input.value).then(res => {
    fileInfoList.value = res.data.data;
  });
};

const resetList = () => {
  input.value = '';
  fetchBackupList();
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
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-content * {
  margin-left: 0;
}

.backup-content {
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
