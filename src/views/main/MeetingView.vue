<template>
  <section class="meetings">
    <h2>正在进行中的会议</h2>
    <div class="meeting-list">
      <NCard v-if="meetings.length === 0" class="meeting-card">
        <div class="meeting-content">
          <h3>暂无会议</h3>
        </div>
      </NCard>
      <NCard v-for="meeting in meetings" :key="meeting.id" class="meeting-card">
        <div class="meeting-content">
          <h3>{{ meeting.title }}</h3>
          <p>开始时间：{{ meeting.startTime }}</p>
          <p>参与人数：{{ meeting.participants }}</p>
          <NButton>加入会议</NButton>
        </div>
      </NCard>
    </div>
  </section>
</template>


<script setup>
import {NCard, NButton} from "naive-ui";
import {onMounted, ref} from "vue";
import {listRooms} from "../../api/meeting.js";

const meetings = ref([
  {
    id: 1,
    title: "项目进度会议",
    host: "张三",
    avatar: "avatar1.png",
    startTime: "2023-06-01 14:00",
    participants: 10,
    progress: 50,
    status: "active",
  },
  {
    id: 2,
    title: "销售月度总结",
    host: "李四",
    avatar: "avatar2.png",
    startTime: "2023-06-01 16:00",
    participants: 20,
    progress: 80,
    status: "active",
  },
  // 更多会议数据。..
])

onMounted(
    () => {
      listRooms().then(
          res => {
            meetings.value = res.data.data;
          }
      )
    }
)


</script>

<style scoped>
.meetings {
  margin-bottom: 40px;
}

.meetings h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.meeting-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}

.meeting-card {
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.meeting-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.meeting-info {
  margin-left: 20px;
}

.meeting-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.meeting-info p {
  color: #666;
  font-size: 14px;
}

.meeting-content {
  padding: 20px;
}

.meeting-content p {
  margin-bottom: 10px;
}
</style>
