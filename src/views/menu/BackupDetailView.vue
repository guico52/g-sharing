<template>
  <div>
    <n-input>

    </n-input>
  </div>
  <div>
    <n-data-table :columns="columns" :data="data">
    </n-data-table>
  </div>
</template>

<script setup>
import {NInput, NButton, NDataTable} from "naive-ui";
import {h, onMounted, ref} from "vue";
import {backupFileList, exportBackupFile} from "../../api/backup.js";
import {useRouter} from "vue-router";

const columns = ref([
  {
    title: '文件名',
    key: 'fileName'
  }, {
    title: '创建日期',
    key: 'createTime'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return [
        h(NButton, {
          onClick: () => {
            console.log(row.id)
            router.push(`/backup/detail/${row.id}`)
          }
        }, '浏览'),
        h(NButton, {
          onClick: () => {
            exportBackupFile(row.id)
          }}, '导出')

      ]
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

</style>
