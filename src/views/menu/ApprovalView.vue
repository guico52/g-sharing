<script setup>
import {NDataTable} from "naive-ui";
</script>

<template>
  <div>
    <NDataTable :columns="columns" pagination="{ pageSize: 20 }" :data="data"/>
  </div>
</template>

<style scoped>

</style>
