<script setup>
const pages = [
  {
    name: '主页',
    path: '/'
  }, {
    name: '文档',
    path: '/menu'
  }
]
</script>

<template>
  <div class="list">
    <div v-for="item in pages" class="list item">
      <router-link class="route" :to="item.path">{{item.name}}</router-link>
    </div>
  </div>

</template>

<style scoped>
.list {
  width: 100vw;
  height: 5vh;
  /*元素横向排列*/
  display: flex;
  flex-direction: row;
  /*元素纵向居中*/
  align-items: center;
  /*元素横向居中*/
  justify-content: center;
}

.list-item{

}

.route{
  text-decoration: none;
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin: 0 20px;
}

</style>
