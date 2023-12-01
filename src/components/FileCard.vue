<script setup>
  import {NCard} from 'naive-ui'
  import {useRouter} from "vue-router";


  const router = useRouter()
  const props = defineProps({
        fileType: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileId: {
            type: String,
            required: true
        },
      }
  )

  function handleClick() {
    router.push({
      path: '/collaborative-editing',
      query: {
        fileId: props.fileId,
        userId: '1'
      }
    })
  }
</script>

<template>
  <n-card class="card" @click="handleClick">
    <img v-if="fileType === '0'" src="/src/assets/word-icon.jpg" width="150" height="120" alt="">
    <img v-if="fileType === '1'" src="/src/assets/excel-icon.jpg" width="150" height="120" alt="">
    <div class="file-name">{{fileName}}</div>
  </n-card>
</template>

<style scoped>
.card{
  width: 170px;
  height: 170px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin: 10px;
  /*内部元素垂直居中*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card:hover{
  cursor: pointer;
}

.file-name{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>