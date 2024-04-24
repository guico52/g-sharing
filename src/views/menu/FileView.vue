<template>
<div class="content">
  <div class="search-content">
    <n-input class="search-input" round placeholder="搜索"/>
    <n-button @click="state.showModal = true">添加文件</n-button>
    <n-button @click="state.projectTeamShow = true">项目成员</n-button>
  </div>
    <n-data-table :columns="state.tableColumns" :data="state.fileList" :row-props="tableProps"/>
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
  <n-modal v-model:show="state.projectTeamShow" class="project-modal">
    <template #title>
    </template>
    <template #default>
      <div class="project-modal-content">
        <div class="project-modal-content-title">
          成员管理
        </div>
        <div>

        </div>

      </div>
    </template>
  </n-modal>
</div>
</template>

<script>
import {defineComponent, h, onMounted, reactive} from "vue";
import {router} from "../../router/router.js";
import {getProjectDetail} from "../../api/project.js";
import {addFile, deleteFile} from "../../api/file.js";
import {NInput, NButton, NModal, NDataTable, NDropdown} from "naive-ui";

export default defineComponent({
  methods: {
    router() {
      return router
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
    },


  },
  components:{
    NInput,
    NButton,
    NModal,
    NDataTable,
    NDropdown
  },
  setup(){
    const handleDeleteFile = (id) => {
      console.log("delete file id: ", id)
      deleteFile(id).then(
          () => {
            getProjectDetail(router.currentRoute.value.params.id).then(res => {
              state.fileList = res.data.data;
            })
          }
      )
    }
    const state = reactive({
      tableColumns: [
        {
          title: '文件名称',
          key: 'fileName'
        },
        {
          title: '创建者',
          key: 'createBy'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },{
          title: '操作',
          key: 'action',
          render: (row) => {
            return h('div', {}, [
                h(NButton, {onClick:() => handleDeleteFile(row.fileId)}, '删除'),
                h(NButton, {onClick:() => router.push({name: 'fileView', query: {fileId: row.fileId}})}, '编辑'),
                ]
            )
          }
        }
      ],
      fileList: [],
      modalShow: false,
      projectTeamShow: false,
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

.modal{
  width: 40vw;
  height: 25vh;
  background: var(--bg-100);
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
.modal-title , .project-modal-content-title{
  font-size: 24px;
  margin: 1em;
}
</style>
