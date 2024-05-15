<script setup>
</script>

<template>
  <div class="container">
    <nav class="navigation">
      <router-link to="/">主页</router-link>
      <router-link to="/projects">项目</router-link>
      <router-link to="/meeting">会议</router-link>
      <router-link to="/backstage">后台</router-link>
    </nav>
    <router-view class="view"></router-view>
  </div>

</template>

<style scoped>
.container{
  width: 100vw;
  height: 100vh;
}

/* navigation居于顶部 */
.navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  background-color: var(--bg-200);

}

.navigation a {
  text-decoration: none;
  color: var(--text-200);
  font-size: 18px;
}
</style>
