<template>
  <div class="search-content">
    <n-input round/>
    <n-button>搜索</n-button>
  </div>
    <n-data-table :columns="columns" :data="data"/>
</template>
<script setup>
import {NInput, NButton, NDataTable} from "naive-ui";
import {ref, h} from "vue";

const columns = ref([
  {
    title: '文件名',
    key: 'fileName'
  }, {
    title: '删除日期',
    key: 'deleteTime'
  }, {
    title: '操作',
    key: 'action',
    render: (row) => {
      return h('n-space', {}, [
        h(NButton, {onClick: () => {
          console.log(row)
        }}, '恢复')
      ])
    }
  }
]);
const data = ref([])

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
