<template>
  <div class="search-div">
    <n-input class="search-input" round placeholder="搜索">

    </n-input>
    <n-button @click="state.showModal = true">
      添加项目
    </n-button>
  </div>
  <n-data-table :columns="state.tableColumns" :data="state.projects" :row-props="rowProps"/>

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
          <n-input v-model:value="state.projectName" placeholder="项目名称" class="modal-content-input"></n-input>
          <n-input v-model:value="state.projectDescription" type=textarea placeholder="项目描述" class="modal-content-input" style="height: 5em"></n-input>
          <n-select v-model:value="state.projectUserGroup" placeholder="选择项目组" :options="state.options" class="modal-content-input"></n-select>
          <n-button @click="handleAddProject">添加</n-button>
        </div>
      </template>
  </n-modal>

</template>

<script>
import {defineComponent, onMounted, reactive, ref} from "vue";
import {NInput, NButton, NModal, NSelect, NDataTable} from "naive-ui"
import {router} from "../../router/router.js";
import {getProjectList, createProject, getUserGroups} from "../../api/project.js";

export default defineComponent({
  components:{
    NInput,
    NButton,
    NModal,
    NSelect,
    NDataTable
  },
  setup(){
    const state = reactive({
      showModal: false,
      projectName: '',
      projectDescription:'',
      projectUserGroup: '',
      tableColumns: [
        {
          title: '项目名称',
          key: 'name'
        },
        {
          title: '创建者',
          key: 'createBy'
        }, {
          title: '创建时间',
          key: 'createTime'
        }
      ],
      projects :[],
      userGroups: [],
      options: []
    })

    const handleAddProject = () => {
      console.log(state)
      createProject(state.projectName, state.projectDescription, state.projectUserGroup).then(res => {
        getPageProjectList();
        state.showModal = false;
      })
    }

    const getPageProjectList = () => {
      getProjectList().then(res => {
        state.projects = res.data.data;
        console.log(state.projects)
      })
    }

    const getUserGroupList = () => {
      getUserGroups().then(res => {
        state.userGroups = res.data.data
        state.options = state.userGroups.map(group => {
          return {
            label: group.name,
            value: group.id
          }
        })
      })
    }
    const rowProps = row=> {
      return {
        style: "cursor: pointer;",
        onClick: () => router.push('/project/' + row.id)
      }
    }

    onMounted(() => {
          getPageProjectList();
          getUserGroupList();
        }
    )

    return {
      state, router, handleAddProject, rowProps
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
  width: 40vw;
  height: 50vh;
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
