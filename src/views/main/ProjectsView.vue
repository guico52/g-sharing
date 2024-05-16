<template>
  <div class="project-list">
    <h2 class="project-list__title">项目列表</h2>
    <n-collapse class="project-list__collapse" accordion>
      <template #arrow></template>
      <n-collapse-item
          v-for="project in projects"
          :key="project.id"
          :name="project.id"
          :title="project.name"
          class="project-list__item"
      >
        <div class="project-list__files">
          <div v-for="file in project.files" :key="file.id" class="project-list__file">
            <div class="project-list__file-info">
              <span class="project-list__file-name">{{ file.name }}</span>
              <span class="project-list__file-time">{{ file.createTime }}</span>
            </div>
            <div class="project-list__file-actions">
              <n-button type="primary" size="small" @click="openFile(file)">打开</n-button>
              <n-button type="error" size="small" @click="deleteFile(file)">删除</n-button>
            </div>
          </div>
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<style scoped>
.project-list {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.project-list__title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.project-list__collapse {
  border: none;
}

.project-list__item {
  margin-bottom: 10px;
}

.project-list__item .n-collapse-item__header {
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
}

.project-list__files {
  padding: 10px;
}

.project-list__file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.project-list__file-info {
  flex: 1;
}

.project-list__file-name {
  font-size: 16px;
  font-weight: bold;
}

.project-list__file-time {
  font-size: 14px;
  color: #999;
  margin-left: 10px;
}

.project-list__file-actions {
  display: flex;
  align-items: center;
}

.project-list__file-actions .n-button {
  margin-left: 10px;
}
</style>


<script setup>
import {NCollapse, NCollapseItem, NButton} from "naive-ui";
import {ref} from "vue";

const projects = ref([
  {
    id: 1,
    name: "项目1",
    files: [
      {
        id: 1,
        name: "文件1",
        createTime: "2023-06-01 14:00",
      },
      {
        id: 2,
        name: "文件2",
        createTime: "2023-06-01 15:00",
      },
      // 更多文件数据...
    ]
  },
  {
    id: 2,
    name: "项目2",
    files: [
      {
        id: 3,
        name: "文件3",
        createTime: "2023-06-01 16:00",
      },
      {
        id: 4,
        name: "文件4",
        createTime: "2023-06-01 17:00",
      },
      // 更多文件数据...
    ]
  },
  // 更多项目数据...
])
</script>

