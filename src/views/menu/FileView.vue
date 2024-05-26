<template>
  <div class="container">
    <div class="search-content">
      <div class="search-content-inner">
        <n-input v-model:value="state.input" class="search-input" round placeholder="搜索" />
        <n-button type="primary" icon="search" @click="searchFile">搜索</n-button>
        <n-button type="success" icon="plus" @click="state.showModal = true">添加文件</n-button>
      </div>
      <div class="upload-content">
        <n-upload :action="state.uploadUrl" :accept="state.fileAccept"  :data="state.fileData" :headers="state.headers" @finish="getFileList">
          <n-button type="info">上传文件</n-button>
        </n-upload>
      </div>
    </div>
    <n-data-table :columns="state.tableColumns" :pagination="{pageSize: 20}"  :data="state.fileList" bordered />
    <n-modal v-model:show="state.showModal" class="modal">
      <template #default>
        <div class="modal-content">
          <div class="modal-title">添加文件</div>
          <n-input v-model:value="state.fileName" placeholder="文件名称" class="modal-content-input" />
          <n-button type="primary" @click="handleAddFile">添加</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script>
import { defineComponent, h, onMounted, reactive, toRefs } from "vue";
import { router } from "../../router/router.js";
import { BASE_URL, dialog, message } from "../../api/api.js";
import { getProjectDetail } from "../../api/project.js";
import { addFile, deleteFile, exportFile, getFilePermission, getUserGroupIdByProjectId, getUserGroupPermissionByProjectId, search, updateFilePermission } from "../../api/file.js";
import { NInput, NButton, NModal, NDataTable, NUpload, NSpace, NRadioGroup, NRadio } from "naive-ui";
import { UserFilePermissionEnum } from '../../util/enums.js';
export default defineComponent({
  computed: {
    UserFilePermissionEnum() {
      return UserFilePermissionEnum;
    }
  },
  methods: {
    handleAddFile() {
      const projectId = router.currentRoute.value.params.id;

      addFile(this.state.fileName, projectId, this.state.userGroupId).then(() => {
        getProjectDetail(projectId).then(res => {
          this.state.fileList = res.data.data;
        });
      });
    },
    getFileList() {
      const id = router.currentRoute.value.params.id;
      getProjectDetail(id).then(res => {
        this.state.fileList = res.data.data;
      });
    },
    searchFile() {
      const id = router.currentRoute.value.params.id;
      search(id, this.state.input).then(res => {
        this.state.dropdownOptions = [];
        const nameResult = res.data.data.name;
        const contentResult = res.data.data.content;
        nameResult.forEach(item => {
          this.state.dropdownOptions.push({ key: item.id, label: item.name });
        });
        this.state.dropdownOptions.push({ type: 'divider' });
        contentResult.forEach(item => {
          this.state.dropdownOptions.push({ key: item.id, label: item.name, highlighted: item.highlighted });
        });
      });
    }
  },
  components: {
    NInput,
    NButton,
    NModal,
    NDataTable,
    NUpload,
    NSpace
  },
  setup() {
    const handleDeleteFile = (id) => {
      deleteFile(id, state.userGroupId).then(() => {
        getProjectDetail(router.currentRoute.value.params.id).then(res => {
          state.fileList = res.data.data;
        });
      });
    };

    const handleExportFile = (id, name) => {
      exportFile(id, name);
    };

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
        },
        {
          title: '更新时间',
          key: 'updateTime'
        },
        {
          title: '操作',
          key: 'action',
          render: (row) => h(NSpace, {}, [
            h(NButton, {
              type: 'error',
              size: 'small',
              icon: 'delete',
              onClick: () => handleDeleteFile(row.fileId),
              style: {
                display: state.permission >= 3 ? 'block' : 'none'
              }
            }, '删除'),
            h(NButton, {
              type: 'info',
              size: 'small',
              icon: 'eye',
              onClick: () => router.push(`/fileView/${row.fileId}`),
              style: {
                display: row.permission >= 1 || state.permission >= 2 ? 'block' : 'none'
              }
            }, '浏览'),
            h(NButton, {
              type: 'success',
              size: 'small',
              icon: 'download',
              onClick: () => handleExportFile(row.fileId, row.fileName),
              style: {
                display: row.permission >= 1 || state.permission >= 2 ? 'block' : 'none'
              }
            }, '导出'),
            h(NButton, {
              type: 'warning',
              size: 'small',
              icon: 'setting',
              onClick: () => {
                const fileId = row.fileId;
                getFilePermission(fileId).then(res => {
                  state.filePermissionList = res.data.data;
                });
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
                              row.level = value;
                            }
                          }, [
                            h(NSpace, null, {
                              default: () => radioOptions.map(option => h(NRadio, {
                                value: option.value,
                                defaultChecked: row.level === option.value,
                                checked: row.level === option.value
                              }, { default: () => option.label }))
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
                    const items = state.filePermissionList.map(item => ({
                      id: item.id,
                      userId: item.userId,
                      level: item.level
                    }));
                    updateFilePermission(items, state.userGroupId).then(() => message.success('设置成功'));
                  }
                });
              },
              style: {
                display: row.permission >= 3 || state.permission >= 2 ? 'block' : 'none'
              }
            }, '设置权限')
          ])
        }
      ],
      fileList: [],
      filePermissionList: [],
      showModal: false,
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
      permission: 0
    });

    const radioOptions = [
      {
        label: '不可读',
        value: UserFilePermissionEnum.UNREADABLE
      },
      {
        label: '只读',
        value: UserFilePermissionEnum.READ_ONLY
      },
      {
        label: '读写',
        value: UserFilePermissionEnum.READ_WRITE
      },
      {
        label: '管理员',
        value: UserFilePermissionEnum.ADMIN
      }
    ];

    onMounted(() => {
      const id = router.currentRoute.value.params.id;
      getProjectDetail(id).then(res => {
        state.fileList = res.data.data;
      });
      getUserGroupIdByProjectId(id).then(res => {
        state.userGroupId = res.data.data;
      });
      getUserGroupPermissionByProjectId(id).then(res => {
        state.permission = res.data.data;
      });
    });

    return {
      state, handleExportFile, handleDeleteFile
    };
  }
});
</script>

<style scoped>
.container {
  padding: 1.5em;
  border-radius: 0.5em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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
  width: 60%;
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

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
