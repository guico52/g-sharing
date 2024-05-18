<template>
  <div class="chat-container">
    <ChatGroups :groups="groups" @selectGroup="selectGroup" />
    <ChatPanel :selectedGroup="selectedGroup" />
  </div>
</template>

<script setup>
import ChatGroups from './componet/ChatGroups.vue';
import ChatPanel from './componet/ChatPanel.vue';
import {ref} from "vue";

  const groups =  ref([]); // replace with your groups data
  const selectedGroup = ref(null);

  const selectGroup = (group) => {
    this.selectedGroup = group;
  }



</script>

<style scoped>
.chat-container {
  display: flex;
}
</style>
