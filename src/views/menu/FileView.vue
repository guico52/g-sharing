<template>
<div class="content">
  <div class="search-content">
    <n-input class="search-input" round placeholder="搜索"/>
    <n-button @click="state.showModal = true">添加文件</n-button>
  </div>
  <div class="file-content">
    <div @click="gotoFile(item.fileId)" v-for="item in state.fileList" :key="item.id" class="file-list">
      <div class="file-name">{{item.fileName}}</div>
      <div class="file-info">{{item.createBy}} 创建于 {{item.createTime}}</div>
    </div>
  </div>

  <n-modal v-model:show="state.showModal" class="modal">
    <template #title>

    </template>
    <template #default>
      <div class="modal-content">
        <div class="modal-title">
          添加项目
        </div>
        <n-input v-model:value="state.fileName" placeholder="文件名称" class="modal-content-input"></n-input>
        <n-button @click="addFile">添加</n-button>
      </div>
    </template>
  </n-modal>
</div>
</template>

<script>
import {defineComponent, onMounted, reactive} from "vue";
import {router} from "../../router/router.js";
import {getProjectDetail} from "../../api/project.js";
import {addFile} from "../../api/file.js";
import {NInput, NButton, NModal} from "naive-ui";

export default defineComponent({
  methods: {
    router() {
      return router
    },
    gotoFile(id) {
      router.push({name: 'fileView', query: {fileId: id}})
    },
    addFile() {
      const projectId = router.currentRoute.value.params.id;
      addFile(this.state.fileName, projectId).then(
          () => {
            getProjectDetail(projectId).then(res => {
              this.state.fileList = res.data.data;
            })
          }
      )
    }

  },
  components:{
    NInput,
    NButton,
    NModal
  },
  setup(){
    const state = reactive({
      fileList: [],
      modalShow: false,
      fileName: '',
    })

    onMounted(() => {
      // 获取路径
      const id = router.currentRoute.value.params.id;
      getProjectDetail(id).then(res => {
        state.fileList = res.data.data;
      })
    })
    return {
      state
    }
  }
})
</script>



<style scoped>

.search-content , .search-content *{
  display: flex;
  justify-content: center;
  margin: 1em;
}
.search-content .search-input{
  width: 60%
}

.file-list:hover {
  cursor: pointer;
  background: var(--primary-200);
  /*过渡*/
  transition: background 0.3s;
}
/* project 只占一行*/
.file-list{
  display: flex;
  overflow-x: auto;
  width: 100vw;
  height: 4em;
  align-items: center;
  background: var(--primary-300);
  border-radius: 0.5em;
  margin: 1em;
}

.file-name {
  font-size: 24px;
  margin-left: 2em;
}

.file-info {
  position: absolute;
  font-size: 20px;
  right: 5em;
}
@media screen and (max-width: 50em) {
  .file-list {
    flex-direction: column;
    height: auto; /* 你可能需要调整高度以适应堆叠的内容 */
  }

  .file-info {
    position: static;
    right: auto;
  }
}

.modal{
  width: 40vw;
  height: 25vh;
  background: var(--primary-300);
  border-radius: 10px;
  min-width: 32vw;
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
.modal-title {
  font-size: 24px;
  margin: 1em;
}
</style>
