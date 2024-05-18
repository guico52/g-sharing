<template>
  <div class="container">
    <main>
      <section class="feature" @click="goToDetail('collaboration')">
        <img src="collaboration.png" alt="多人实时协同编辑" />
        <h2>多人实时协同编辑</h2>
        <p>多个用户可同时编辑文档，提高协作效率。</p>
      </section>

      <section class="feature" @click="goToDetail('permission')">
        <img src="permission.png" alt="用户分组权限分级" />
        <h2>用户分组权限分级</h2>
        <p>灵活的权限管理，满足不同场景需求。</p>
      </section>

      <section class="feature" @click="goToDetail('meeting')">
        <img src="meeting.png" alt="多人会议" />
        <h2>多人会议</h2>
        <p>支持多人视频会议，屏幕共享等丰富功能。</p>
      </section>
    </main>

  </div>
</template>

<script>
export default {
  methods: {
    goToDetail(feature) {
      // 跳转到对应功能的详细介绍页面
      console.log(`Going to ${feature} detail page...`);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}



main {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.feature {
  width: 30%;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.feature:hover {
  border-color: #007bff;
}

.feature img {
  width: 100%;
  margin-bottom: 20px;
}

.feature h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.feature p {
  font-size: 16px;
  color: #666;
}

footer {
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
