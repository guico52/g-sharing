<template>
  <NSpin :show="loading">
    <div class="project-list">
      <div class="search-content">
        <NInput placeholder="请输入关键词" v-model:value="input"/>
        <NButton type="primary" @click="handleSearch">搜索</NButton>
      </div>
      <div class="project-list__cards">
        <NCard
            v-for="file in paginatedFiles"
            :key="file.fileId"
            class="project-list__item"
        >
          <div class="project-list__file-info">
            <div class="project-list__file-name" v-html="file.fileName"></div>
            <div class="project-list__project-name">{{ file.projectName }}</div>
            <div class="project-list__highlight"
                 v-show="file.content"
                 v-html="file.content"
            />
            <div class="project-list__file-time">{{ file.createTime }}</div>
          </div>
          <div class="project-list__file-actions">
            <NButton type="primary" size="small" @click="openFile(file)">查看</NButton>
            <NButton type="default" size="small" @click="handleExportFile(file)">导出</NButton>
          </div>
        </NCard>
      </div>
      <div class="project-list__pagination">
        <NPagination
            v-model:page="currentPage"
            :page-size="pageSize"
            :page-count="pageCount"
            @update:page="handlePageChange"
        />
      </div>
    </div>
  </NSpin>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { NCard, NButton, NPagination, NInput , NSpin} from "naive-ui";
import { getProjectAndFiles } from "../../api/project.js";
import { router } from "../../router/router.js";
import {exportFile} from "../../api/file.js";

const files = ref([]);
const projects = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const input = ref('');
const loading = ref(true)

onMounted(() => {
  getProjectAndFiles().then((res) => {
    files.value = res.data.data;
    loading.value = false;
  });
});

const openFile = (file) => {
  router.push(`/fileView/${file.fileId}`);
};

const handleExportFile = (file) => {
  exportFile(file.fileId, file.fileName)
};

const handleSearch = () => {
  getProjectAndFiles(input.value).then((res) => {
    files.value = res.data.data;
  });
};

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return files.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(files.value.length / pageSize.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
.project-list {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-content * {
  margin: 2em;
}

.project-list__cards {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 16px;
}

.project-list__item {
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.project-list__item:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.project-list__file-info {
  margin-bottom: 16px;
}

.project-list__file-name {
  font-size: 18px;
  color: #333;
}

.project-list__project-name {
  font-size: 16px;
  color: #666;
  margin-top: 4px;
}

.project-list__file-time {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.project-list__file-actions {
  display: flex;
  justify-content: flex-end;
}

.project-list__file-actions .n-button {
  margin-left: 8px;
}

.project-list__pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
