<template>
  <div class="search-div">
    <n-input class="search-input" round placeholder="搜索">

    </n-input>
    <n-button @click="state.showModal = true; console.log(state.showModal)">
      添加项目
    </n-button>
  </div>
  <div class="project-list">
    <div @click="router.push('/project/'+project.id)" class="project" v-for="project in state.projects" :key="project.id">
      <div class="project-name">{{project.name}}</div>
      <div class="project-create-info"> {{project.createBy}} 创建于 {{project.createTime}}</div>
    </div>
  </div>
  <n-modal v-model:show="state.showModal" class="modal">
      <template #title>
        <div >
          添加项目
        </div>
      </template>
      <template #default>

        <div class="modal-content">
          <div class="modal-title">
            添加项目
          </div>
          <n-input placeholder="项目名称" class="modal-content-input"></n-input>
          <n-input type=textarea placeholder="项目描述" class="modal-content-input" style="height: 5em"></n-input>
          <n-button>添加</n-button>
        </div>
      </template>
  </n-modal>

</template>

<script>
import {defineComponent, reactive, ref} from "vue";
import {NInput, NButton, NModal} from "naive-ui"
import {router} from "../../router/router.js";

export default defineComponent({
  components:{
    NInput,
    NButton,
    NModal
  },
  setup(){
    const state = reactive({
      showModal: false,
      projects :ref([
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
      ])
    })

    return {
      state, router
    }
  }
})

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
  background: var(--primary-200);
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
  background: var(--primary-300);
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

.modal{
  width: 50vw;
  height: 50vh;
  background: var(--primary-300);
}
.modal, .modal-content, .modal-title{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-content-input{
  width: 30em;
}

.modal-content * {
  margin: 1em;
}


</style>
