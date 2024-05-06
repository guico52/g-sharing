

<template>
    <div class="search-content">
      <n-input placeholder="请输入文件名" v-model="input" round/>
      <n-button>搜索</n-button>
    </div>
    <div class="backup-content">
      <n-data-table :columns="tableColumns" :data="fileInfoList" :row-prop="rowProps"/>
    </div>

</template>

<script setup>
import {h, onMounted, ref} from "vue";
  import {NInput, NButton, NDataTable} from 'naive-ui';
  import {router} from "../../router/router.js";
import { backupInfoList} from "../../api/backup.js";




  const input = ref(``)
  const fileInfoList = ref([])
  const tableColumns = ref([
    {
      title: '文件名',
      key: 'fileName'
    }, {
      title: '备份数量',
      key: 'nums'
    }, {
      title: '操作',
      key: 'action',
      render: (row) => {
        return [
            h(NButton, {onClick: () => router.push(`/backup/${row.fileId}`)}, '浏览')
        ]
      }
    }
  ])
onMounted(() => {
  backupInfoList().then(
      res => {
        fileInfoList.value = res.data.data
      }
  )
})
  const rowProps = row => {
    return {
      style: 'cursor: pointer;',
    }
  }
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
