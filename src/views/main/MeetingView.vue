<template>
  <NSpin :show="loading">
    <section class="meetings">
      <h2 class="title">会议列表</h2>
      <div class="meeting-list">
        <NCard v-if="meetings.length === 0" class="meeting-card no-meeting-card">
          <div class="meeting-content">
            <h3>暂无会议</h3>
          </div>
        </NCard>
        <NCard v-for="meeting in paginatedMeetings" :key="meeting.id" class="meeting-card">
          <div class="meeting-header">
            <div class="meeting-title">
              <h3>{{ meeting.name }}</h3>
            </div>
          </div>
          <div class="meeting-content">
            <p>{{ meeting.description }}</p>
            <p>参与人数：{{ meeting.participants }}</p>
            <NButton type="primary" class="join-button" @click="joinMeeting(meeting.id)">加入会议</NButton>
          </div>
        </NCard>
      </div>
      <div class="pagination">
        <NPagination
            v-show="meetings.length > 5"
            v-model:page="currentPage"
            :page-size="pageSize"
            :page-count="pageCount"
            @update:page="handlePageChange"
        />
      </div>
    </section>
  </NSpin>
</template>

<script setup>
import { NCard, NButton, NPagination, NSpin } from 'naive-ui';
import { onMounted, ref, computed } from 'vue';
import { listRooms } from '../../api/meeting.js';
import { router } from '../../router/router.js';

const loading = ref(true);
const meetings = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

onMounted(() => {
  listRooms().then(res => {
    meetings.value = res.data.data;
    loading.value = false;
  });
});

const joinMeeting = (name) => {
  router.push(`/meeting-room/${name}`);
};

const paginatedMeetings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return meetings.value.slice(start, start + pageSize.value);
});

const pageCount = computed(() => {
  return Math.ceil(meetings.value.length / pageSize.value);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

:root {
  --bg-color: #f5f6fa;
  --primary-color: #3498db;
  --text-color: #2c3e50;
  --text-light: #7f8c8d;
  --card-bg: #ffffff;
  --card-header-bg: #3498db;
  --card-shadow: rgba(0, 0, 0, 0.1);
  --header-text-color: #ffffff;
}

body {
  font-family: 'Roboto', sans-serif;
}

.meetings {
  margin: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-color);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px var(--card-shadow);
}

.title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 24px;
  text-align: center;
  color: var(--text-color);
}

.meeting-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.meeting-card {
  border: none;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px var(--card-shadow);
  transition: box-shadow 0.3s;
}

.meeting-header {
  padding: 16px;
  background-color: var(--card-header-bg);
  color: var(--header-text-color);
}

.meeting-title h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.no-meeting-card .meeting-content h3 {
  color: var(--primary-color);
}

.meeting-content {
  padding: 20px;
}

.meeting-content p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 10px;
}

.meeting-content p:first-of-type {
  color: var(--text-color);
  font-size: 16px;
  font-weight: 500;
}

.join-button {
  background-color: var(--primary-color);
  color: var(--header-text-color);
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
