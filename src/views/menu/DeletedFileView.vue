<template>
  <div class="search-content">
    <n-input round/>
    <n-button>搜索</n-button>
  </div>
    <n-data-table :columns="columns" :data="data"/>
</template>
<script setup>
import {NInput, NButton, NDataTable, NSpace} from "naive-ui";
import {ref, h, onMounted} from "vue";
import {deletedFileList, deleteFile, recoverFile} from "../../api/deletedFile.js";
import {dialog, message} from "../../api/api.js"

const columns = ref([
  {
    title: '文件名',
    key: 'name'
  }, {
    title: '删除日期',
    key: 'deleteTime'
  },{
    title: '删除者',
    key: 'deleteBy'
  },{
    title:'项目',
    key: 'project'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h(NSpace, {}, [
        h(NButton, {onClick: () => {
          recoverFile(row.id).then(
              () => {
                console.log(row.id)
                deletedFileList().then(
                    res => {
                      data.value = res.data.data
                    }
                )
                message.success('恢复成功')
              }
          )
        }}, '恢复'),
        h(NButton, {onClick: () => {
                  dialog.error({
                    title: '删除文件',
                    content: '删除后，文件将无法恢复，确定删除吗？',
                    positiveText: '确定',
                    negativeText: '取消',
                    onPositiveClick: () => {
                      deleteFile(row.id).then(
                          () => {
                            deletedFileList().then(
                                res => {
                                  data.value = res.data.data
                                }
                            )
                            message.success('删除成功')
                          }
                      )
                    }
                  })
                }}, '删除')
      ])
    }
  }
]);
const data = ref([])

onMounted(
    () => {
      deletedFileList().then(
          res => {
            data.value = res.data.data
          }
      )
    }
)
</script>


<style scoped>
.search-content{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.search-content * {
  margin: 1em;
}
</style>
