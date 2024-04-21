<template>
  <div class="search-div">
    <n-input class="search-input" round placeholder="搜索">
      <template #suffix>
        <n-icon :component="Search" />
      </template>
    </n-input>
    <n-button>
      添加项目
    </n-button>
    <n-button>
      项目成员
    </n-button>
  </div>
  <div class="project-list">
    <div class="project" v-for="project in projects" :key="project.id">
      <div class="project-name">{{project.name}}</div>
      <div class="project-create-info"> {{project.createBy}} 创建于 {{project.createTime}}</div>
    </div>
  </div>

</template>

<script setup>
import {ref} from "vue";
import {NInput,NButton, NCollapse, NCollapseItem} from "naive-ui"
import {Search} from "@vicons/ionicons5";

const projects = ref([
  {
    "id": 1,
    "name": "初始项目",
    "createBy": "root",
    "createTime": "2024-04-19"
  },
  {
    "id": 2,
    "name": "再一次重建的项目",
    "createBy": "root",
    "createTime": "2024-04-19"
  }
]);
</script>



<style scoped>

.search-div , .search-div *{
  display: flex;
  justify-content: center;
  margin: 1em;
}
.search-div .search-input{
  width: 60%
}

.project:hover {
  cursor: pointer;
  background: var(--bg-200);
  /*过渡*/
  transition: background 0.3s;
}
/* project 只占一行*/
.project{
  display: flex;
  overflow-x: auto;
  width: 100vw;
  height: 4em;
  align-items: center;
  background: var(--bg-300);
  border-radius: 0.5em;
  margin: 1em;
}

.project-name {
  font-size: 24px;
  margin-left: 2em;
}

.project-create-info {
  position: absolute;
  font-size: 20px;
  right: 5em;
}
@media screen and (max-width: 50em) {
  .project {
    flex-direction: column;
    height: auto; /* 你可能需要调整高度以适应堆叠的内容 */
  }

  .project-create-info {
    position: static;
    right: auto;
  }
}

</style>
