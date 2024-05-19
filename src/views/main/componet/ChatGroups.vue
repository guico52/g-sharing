<template>
  <div class="chat-groups">
      <NButton v-for="group in props.groups"
               class="button"
               :key="group.id"
               @click="selectGroup(group)"
               bordered
      >{{group.name}}</NButton>

  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
import {NSpace, NButton} from 'naive-ui';
const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update']);

const selectGroup = (group) => {
  emit('selectGroup', group);
}
</script>

<style scoped>
.chat-groups {
  display: flex;
  flex-direction: column;
  /* 边框 */
  border : #0D0D0D 3px solid;
  /* 圆角 */
  border-radius: 10px;
  overflow-y: auto;
}
.button {
  margin: 10px;
  width: 20em;
  height: 4em;
  border: 2px
}
</style>
