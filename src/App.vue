<script setup>

import {NMessageProvider} from "naive-ui";
import NavigateBar from "./components/NavigateBar.vue";
</script>

<template>
  <n-message-provider>
    <n-loading-bar-provider>
<!--      <NavigateBar class="navigate-bar"/>-->
      <router-view class="view"/>
    </n-loading-bar-provider>
  </n-message-provider>
</template>

<style scoped>
.navigate-bar{
  width: 100vw;
  height: 8vh;
  /*绝对布局*/
  position: fixed;
}
.view{
  width: 100vw;
  height: 100vh;
}
</style>
