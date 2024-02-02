<script setup>

import {darkTheme,NConfigProvider, NMessageProvider} from "naive-ui";
import NavigateBar from "./components/NavigateBar.vue";
</script>

<template>
  <n-message-provider>
      <n-config-provider :theme="darkTheme">
        <n-loading-bar-provider class="loading-bar-provider">
          <!--      <NavigateBar class="navigate-bar"/>-->
          <router-view class="view"/>
        </n-loading-bar-provider>
      </n-config-provider>


  </n-message-provider>
</template>

<style scoped>
.view{
  width: 100vw;
  height: 100vh;
}
</style>
