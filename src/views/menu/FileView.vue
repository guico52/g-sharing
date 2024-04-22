<template>

</template>

<script>
import {defineComponent, onMounted, reactive} from "vue";
import {router} from "../../router/router.js";

export default defineComponent({
  setup(){
    const state = reactive({
      fileList: []
    })
    onMounted(() => {
      // 获取路径
      const id = router.currentRoute.value.params.id

    })
    return {
      state
    }
  }
})
</script>



<style scoped>

</style>
