<template>
  <div class="search-content">

      <n-input round placeholder="搜索备份"/>
      <n-button>搜索</n-button>

  </div>
  <div>
    <n-data-table :columns="columns" :data="data" :pagination="{pageSize: 10}">
    </n-data-table>
  </div>
</template>

<script setup>
import {NInput, NButton, NDataTable, NSpace, NEllipsis} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {backupFileList, exportBackupFile} from "../../api/backup.js";
import {useRouter} from "vue-router";

const columns = ref([
  {
    title: '文件内容',
    key: 'content',
    render: (row) => {
      return h(NEllipsis, {
        style: 'width: 200px'
      } , [
        h('span', {}, row.content)
      ])
    }
  }, {
    title: '创建日期',
    key: 'createTime'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h(NSpace, {}, [
        h(NButton, {
          onClick: () => {
            console.log(row.id)
            router.push(`/backup/detail/${row.id}`)
          }
        }, '浏览'),
        h(NButton, {
          onClick: () => {
            exportBackupFile(row.id, row.fileName)
          }}, '导出')
      ])
    }
  }
])
const router = useRouter()
const data = ref([])
const fileId = router.currentRoute.value.params.id
onMounted(() => {
  backupFileList(fileId).then(
      res => {
        data.value = res.data.data
      }
  )
})

</script>
<style scoped>
.search-content{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-content * {
  margin: 1em;
}
</style>
