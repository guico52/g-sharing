<template>
  <div class="chat-bubble-wrapper" :class="{ 'own-message-wrapper': message.isMe }">
    <div class="chat-bubble" :class="{ 'own-message': message.isMe }">
      <div class="message-content">
        <div v-if="!message.isMe && message.senderName" class="sender-name">{{ message.senderName }}</div>
        <div class="message-text">{{ message.content }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBubble',
  props: {
    message: Object,
    required: true,
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
  },
};
</script>
<style scoped>
.chat-bubble-wrapper {
  display: flex;
  margin: 10px 0;
}

.own-message-wrapper {
  justify-content: flex-end;
}

.chat-bubble {
  max-width: 80%;
  padding: 10px;
  border-radius: 15px;
  background-color: #f1f0f0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  word-wrap: break-word;
}

.own-message {
  background-color:  #daf8cb;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.sender-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-text {
  white-space: pre-wrap;
}

.message-time {
  text-align: right;
  font-size: 0.75em;
  opacity: 0.6;
  margin-top: 5px;
}
</style>
