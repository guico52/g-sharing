<template>
  <NLayout>
    <NLayoutContent>
      <div class="chat-panel">
        <div v-if="selectedGroup">
          <h2>{{ selectedGroup.name }}</h2>
        </div>
        <div v-else>
          <p>Select a group to start chatting</p>
        </div>
      </div>
    </NLayoutContent>
    <NLayoutFooter>

      <div class="input-panel">
        <NInput>

        </NInput>
      </div>
    </NLayoutFooter>
  </NLayout>

</template>

<script setup>
import {defineProps} from "vue";
import {NLayout,NInput, NLayoutContent, NLayoutFooter} from "naive-ui";

const props = defineProps({
  selectedGroup: {
    type: Object,
    default: null,
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
