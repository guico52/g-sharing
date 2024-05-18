<template>
  <div class="chat-panel">
    <div v-if="selectedGroup">
      <h2>{{ selectedGroup.name }}</h2>
      <!-- display chat content here -->
    </div>
    <div v-else>
      <p>Select a group to start chatting</p>
    </div>
  </div>
  <div class="input-panel">
    <NInput>

    </NInput>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedGroup: {
    type: Object,
    required: false
  }
});
</script>

<style scoped>
.chat-panel {
  width: 70%;
  /* add your styles */
}
</style>
