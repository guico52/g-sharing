<template>
  <div class="container">
    <main>
      <section class="feature" @click="goToDetail('collaboration')">
        <h2>📄 多人实时协同编辑</h2>
        <p>多个用户可同时编辑文档，提高协作效率。</p>
        <button @click.stop="expandContent('collaboration')">了解更多</button>
        <div v-if="expandedFeature === 'collaboration'" class="extra-content">
          <p>实时协作，高效沟通。</p>
          <p>文档历史版本查看和恢复。</p>
        </div>
      </section>

      <section class="feature" @click="goToDetail('permission')">
        <h2>🔒 用户分组权限分级</h2>
        <p>灵活的权限管理，满足不同场景需求。</p>
        <button @click.stop="expandContent('permission')">了解更多</button>
        <div v-if="expandedFeature === 'permission'" class="extra-content">
          <p>细粒度权限控制，确保数据安全。</p>
          <p>可定制的权限策略，适应不同的业务场景。</p>
        </div>
      </section>

      <section class="feature" @click="goToDetail('meeting')">
        <h2>📹 多人会议</h2>
        <p>支持多人视频会议，屏幕共享等丰富功能。</p>
        <button @click.stop="expandContent('meeting')">了解更多</button>
        <div v-if="expandedFeature === 'meeting'" class="extra-content">
          <p>高质量音视频通话，确保沟通顺畅。</p>
          <p>支持主持人会议管理，确保会议秩序。</p>
        </div>
      </section>
      
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expandedFeature: null,
    };
  },
  methods: {
    goToDetail(feature) {
      console.log(`Going to ${feature} detail page...`);
    },
    expandContent(feature) {
      this.expandedFeature = this.expandedFeature === feature ? null : feature;
    },
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  background-attachment: fixed;
}

main {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.feature {
  flex: 1 0 calc(33.333% - 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.feature:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.feature h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.feature p {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.extra-content {
  margin-top: 15px;
  width: 100%;
  text-align: left;
}

* {
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%;
}

@media (max-width: 768px) {
  .feature {
    flex: 1 1 100%;
  }
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  background: url('https://www.transparenttextures.com/patterns/purty-wood.png') repeat;
  z-index: -1;
}
</style>
