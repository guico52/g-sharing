<script setup>
</script>

<template>
  <div class="container">
    <header>
      <nav>
        <ul>
          <li><RouterLink to="/">首页</RouterLink></li>
          <li><RouterLink to="/projects">项目</RouterLink></li>
          <li><RouterLink to="/meeting">会议</RouterLink></li>
          <li><RouterLink to="/groupChat">用户组</RouterLink></li>
          <li><RouterLink to="">同事</RouterLink></li>
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

.navigation a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  transition: color 0.3s ease;
}

.navigation a:hover {
  color: #007BFF;
}

.logo {
  height: 50px;
}

nav ul {
  display: flex;
  list-style: none;
  justify-content: space-around;
  padding: 0;
}

nav li {
  margin: 0 20px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-size: 18px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

nav {
  flex: 1;
  text-align: right;
}
</style>
