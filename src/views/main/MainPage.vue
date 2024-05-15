<script setup>
</script>

<template>
  <div class="container">
    <header>
      <img src="logo.png" alt="Logo" class="logo" />
      <nav>
        <ul>
          <li><RouterLink to="/">首页</RouterLink></li>
          <li><RouterLink to="/projects">项目</RouterLink></li>
          <li><RouterLink to="/meeting">会议</RouterLink></li>
          <li><RouterLink to="/backstage">后台</RouterLink></li>
        </ul>
      </nav>
    </header>
    <router-view class="view" ></router-view>
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


.logo {
  height: 50px;
}

nav ul {
  display: flex;
  list-style: none;
}

nav li {
  margin-left: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
}
nav {
  margin-left: auto;
  margin-right: 20%;
}


header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
</style>
