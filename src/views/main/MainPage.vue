<script setup>
</script>

<template>
  <div class="container">
    <header>
      <nav>
        <ul>
          <li><RouterLink to="/">首页</RouterLink></li>
          <li><RouterLink to="/projects">文件</RouterLink></li>
          <li><RouterLink to="/meeting">会议</RouterLink></li>
          <li><RouterLink to="/groupChat">用户组</RouterLink></li>
          <li><RouterLink to="/privateChat">同事</RouterLink></li>
          <li><RouterLink to="/backstage">后台</RouterLink></li>
        </ul>
      </nav>
    </header>
    <router-view class="view"></router-view>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #4A90E2; /* 更加饱和的蓝色 */
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
}

nav li {
  margin: 0 15px;
}

nav a {
  text-decoration: none;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.3s ease;
}

nav a:hover {
  color: #FFD700; /* 金黄色 */
  transform: scale(1.1);
}

.view {
  flex: 1;
  background-color: #f4f4f4; /* 柔和的灰色背景 */
}

* {
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 调整字体大小适应视口大小 */
html {
  font-size: 100%;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    align-items: center;
  }

  nav li {
    margin: 10px 0;
  }
}
</style>
