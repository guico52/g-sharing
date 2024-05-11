<template>
  <div class="content">
    <div class="search-content">
      <div class="search-content-inner">
          <n-input v-model:value="state.input"
                   class="search-input"
                   round
                   placeholder="搜索"/>

<!--        </n-dropdown>-->
        <n-button @click="searchFile">搜索</n-button>
        <n-button @click="state.showModal = true">添加文件</n-button>
      </div>
      <div class="upload-content">
        <n-upload :action="state.uploadUrl"
                  :accept="state.fileAccept"
                  :data="state.fileData"
                  :headers="state.headers"
                  @finish="getFileList"
        >
          <n-button>上传文件</n-button>
        </n-upload>
      </div>
    </div>
    <n-data-table :columns="state.tableColumns" :data="state.fileList">
      <template #default="{row}">
        <div>{{row.fileName}}</div>
        <div>
          <n-button
            @click="handleDeleteFile(row.fileId)"
            v-pms-file="UserFilePermissionEnum.ADMIN"
          >
            删除
          </n-button>
          <n-button
            @click="$router.push({name: 'fileView', query: {fileId: row.fileId}})"
            v-pms-file="UserFilePermissionEnum.READ_ONLY"
          >
            浏览
          </n-button>
          <n-button
            @click="handleExportFile(row.fileId)"
            v-pms-file="UserFilePermissionEnum.READ_ONLY"
          >
            导出
          </n-button>
        </div>

      </template>
    </n-data-table>
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
import {defineComponent, h, onMounted, reactive, toRefs} from "vue";
import {router} from "../../router/router.js";
import {BASE_URL, dialog, message} from "../../api/api.js";
import {getProjectDetail} from "../../api/project.js";
import {
  addFile,
  deleteFile,
  exportFile,
  getFilePermission,
  getUserGroupIdByProjectId,
  search,
  updateFilePermission
} from "../../api/file.js";
import {NInput, NButton, NModal, NDataTable, NDropdown, NUpload, NSpace, NRadioGroup, NRadio} from "naive-ui";
import {UserFilePermissionEnum} from '../../util/enums.js';

export default defineComponent({
  computed: {
    UserFilePermissionEnum() {
      return UserFilePermissionEnum
    }
  },
  methods: {
    router() {
      return router
    },
    addFile() {
      const projectId = router.currentRoute.value.params.id;
      addFile(this.state.fileName, this.state.userGroupId).then(
          () => {
            getProjectDetail(projectId).then(res => {
              this.state.fileList = res.data.data;
            })
          }
      )
    },
    getFileList() {
      const id = router.currentRoute.value.params.id;
      getProjectDetail(id).then(res => {
        this.state.fileList = res.data.data;
      })
    },
    handleDropSelected(key) {
      router.push({name: 'fileView', query: {fileId: key}})
    },
    searchFile() {
      console.log("search file")
      const id = router.currentRoute.value.params.id;
      search(id, this.state.input).then(res => {
        this.state.dropdownOptions = []
        const nameResult = res.data.data.name
        const contentResult = res.data.data.content
        // 对于nameResult， id为key, name为label，放到下拉框中
        // 添加元素
        nameResult.forEach(item => {
          this.state.dropdownOptions.push({key: item.id, label: item.name})
        })
        // 添加分隔符
        this.state.dropdownOptions.push({type: 'divider'})
        // 对于contentResult， id为key, name为label，还有highlighted字段，放到下拉框中
        contentResult.forEach(item => {
          this.state.dropdownOptions.push({key: item.id, label: item.name, highlighted: item.highlighted})
        })
      })
    }


  },
  components: {
    NInput,
    NButton,
    NModal,
    NDataTable,
    NDropdown,
    NUpload,
    NSpace
  },
  setup() {
    const handleDeleteFile = (id) => {
      console.log("delete file id: ", id)
      deleteFile(id, state.userGroupId).then(
          () => {
            getProjectDetail(router.currentRoute.value.params.id).then(res => {
              state.fileList = res.data.data;
            })
          }
      )
    }

    const handleExportFile = (id, name) => {
      exportFile(id, name)
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
        }, {
          title: '操作',
          key: 'action',
          render: (row) => {
            return h(NSpace, {}, [
                  h(NButton, {
                    onClick: () => handleDeleteFile(row.fileId),
                    pmsFile: UserFilePermissionEnum.ADMIN
                  }, '删除'),
                  h(NButton, {
                    onClick: () => router.push({name: 'fileView', query: {fileId: row.fileId}}),
                    pmsFile: UserFilePermissionEnum.READ_ONLY
                  }, '浏览'),
                  h(NButton, {
                    onClick: () => handleExportFile(row.fileId, row.fileName),
                    pmsFile: UserFilePermissionEnum.READ_ONLY
                  }, '导出'),
                  h(NButton, {
                    onClick: () => {
                      const fileId = row.fileId;
                      getFilePermission(fileId).then(
                          res => {
                            state.filePermissionList = res.data.data;
                      }
                      )
                      dialog.info({
                        title: '设置权限',
                        content: () => h(NSpace, {}, [
                            h(NDataTable, {
                              columns: [
                                {
                                  title: '用户',
                                  key: 'username'
                                },
                                {
                                  title: '权限',
                                  key: 'level',
                                  render: (row) => h(NRadioGroup, {
                                    value: row.level,
                                    onUpdateValue: (value) => {
                                      row.level = value
                                    }
                                  }, [
                                      h(NSpace, null ,{
                                        default: () => radioOptions.map(option => h(NRadio, {
                                          value: option.value,
                                          defaultChecked: row.level === option.value,
                                          checked: row.level === option.value,
                                        }, {default: () => option.label}))
                                      })
                                  ])
                                }
                              ],
                              data: state.filePermissionList
                            })
                        ]),
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                          const items = state.filePermissionList.map(
                              item => {
                                return {
                                  id: item.id,
                                  userId: item.userId,
                                  level: item.level
                                }
                              }
                          );
                          updateFilePermission(items, state.userGroupId).then(
                              () => message.success('设置成功')
                          )
                        }
                      })
                    },
                    pmsFile: UserFilePermissionEnum.ADMIN
                  }, '设置权限')
                ]
            )
          }
        }
      ],
      fileList: [],
      filePermissionList: [],
      modalShow: false,
      fileName: '',
      uploadUrl: BASE_URL + '/file/upload',
      fileAccept: '.doc,.docx',
      fileData: {
        projectId: router.currentRoute.value.params.id
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      input: '',
      showDropdown: false,
      dropdownOptions: [],
      userGroupId: '',
    })
    const stateToRefs = toRefs(state);

    const radioOptions = [
      {
        label:'不可读',
        value: UserFilePermissionEnum.UNREADABLE
      }, {
        label: '只读',
        value: UserFilePermissionEnum.READ_ONLY
      }, {
        label: '读写',
        value: UserFilePermissionEnum.READ_WRITE
      }, {
        label: '管理员',
        value: UserFilePermissionEnum.ADMIN
      }
    ]
    onMounted(() => {
      // 获取路径
      getProjectDetail(router.currentRoute.value.params.id).then(res => {
        state.fileList = res.data.data;
      })
      getUserGroupIdByProjectId(router.currentRoute.value.params.id).then(res => {
        state.userGroupId = res.data.data;
      })


    })
    return {
      state, stateToRefs, handleExportFile, handleDeleteFile
    }
  }
})
</script>


<style scoped>

.search-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 1em;
}

.search-content-inner {
  display: flex;
  justify-content: center;
}

.search-content-inner * {
  margin: 1em;
}

.upload-content, .upload-content * {
  display: flex;
  justify-content: center;
  margin: 1em;
}

.search-content .search-input {
  width: 60%
}

.modal {
  width: 40vw;
  height: 25vh;
  background: var(--bg-100);
  border-radius: 10px;
  min-width: 32vw;
}

.modal, .modal-content, .modal-title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.modal-content-input {
  width: 30em;
}

.modal-content * {
  margin: 1em;
}

.modal-title, .project-modal-content-title {
  font-size: 24px;
  margin: 1em;
}
</style>
