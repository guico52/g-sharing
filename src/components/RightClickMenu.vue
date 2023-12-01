<script setup>
import {computed} from "vue";

const props = defineProps({
  position: Object,
  visible: Boolean,
})

const menuStyle = computed(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`,
}))

</script>

<template>
  <div v-if="">

  </div>

</template>

<style scoped>

</style>