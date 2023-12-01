<script setup>

import FileCard from "../../components/FileCard.vue";
</script>

<template>
  <div class="content">
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
    <FileCard file-name="doc1" file-type="0" file-id="1"/>
  </div>
</template>

<style scoped>
.content{
  display: flex;
  flex-wrap: wrap;
}
</style>
