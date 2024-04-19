<!--<template>-->
<!--  <div class="container">-->
<!--    <div class="typing-demo">-->
<!--      collaboration changes the world-->
<!--    </div>-->
<!--&lt;!&ndash;    <RouterLink to="/login">登录</RouterLink>&ndash;&gt;-->
<!--  </div>-->
<!--</template>-->


<!--<script setup>-->

<!--</script>-->


<!--<style scoped>-->
<!--.container {-->
<!--  width: 100vw;-->
<!--  height: 100vh;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  background: var(&#45;&#45;bg-100);-->
<!--}-->

<!--.typing-demo {-->
<!--  width: 27ch;-->
<!--  user-select: none;-->
<!--  white-space: nowrap;-->
<!--  overflow: hidden;-->
<!--  border-right: 3px solid;-->
<!--  font-size: 5rem;-->
<!--  color: var(&#45;&#45;text-100);-->
<!--  animation: typing 2s steps(22), blink 0.5s step-end infinite alternate;-->
<!--  -webkit-background-clip: border-box;-->
<!--  background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;-->
<!--  background-size: 0, 1px;-->
<!--  transition: background-size 0.5s;-->
<!--}-->

<!--.typing-demo:hover {-->
<!--  background-size: 100%, 3px;-->
<!--}-->

<!--@keyframes typing {-->
<!--  from {-->
<!--    width: 0-->
<!--  }-->
<!--}-->

<!--@keyframes blink {-->
<!--  50% {-->
<!--    border-color: transparent-->
<!--  }-->


<!--}-->

<!--.typing-demo:hover {-->
<!--  background: linear-gradient(to right, #ec695c, #61c454) no-repeat left bottom;-->
<!--  background-size: 100%, 2px;-->
<!--}-->

<!--@keyframes typing {-->
<!--  from {-->
<!--    width: 0-->
<!--  }-->
<!--}-->

<!--@keyframes blink {-->
<!--  50% {-->
<!--    border-color: transparent-->
<!--  }-->
<!--}-->


<!--</style>-->
<template>
  <div class="container">
    <span class="context"> hello, world</span>
  </div>
</template>

<style scoped>
.container {
  /*容器仅仅用来铺满全球，元素垂直居中*/
  width: 100vw;
  height: 100vh;
  display: flex;

  justify-content: center;
  align-items: center;
  background: black;
  font-size: 5rem;
}
.context{
  cursor: pointer;
  /*这里设置背景为右下，这样鼠标移除的时候动画就从左到右*/
  background: linear-gradient(to right, #ec695c, #61c454) no-repeat right bottom;
  background-size: 0 5px;
  transition: background-size 1s;
}

.context:hover {
  /*设置背景位置横向靠左，这样动画就是从左向右播放*/
  background-position-x:left ;
  background-size: 100% 5px;
}
</style>
