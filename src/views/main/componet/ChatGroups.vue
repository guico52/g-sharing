<template>
  <div class="chat-groups">
    <ul>
      <li v-for="group in groups" :key="group.id" @click="selectGroup(group)">
        {{ group.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
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
  width: 30%;
  /* add your styles */
}
</style>
