<template>
  <div>
    <video ref="localVideoRef" autoplay muted></video>
    <video v-for="(remoteStream, userId) in remoteStreams" :key="userId" :ref="'remoteVideoRef_' + userId" autoplay></video>
    <button @click="startMeeting">开始会议</button>
    <button @click="leaveMeeting">离开会议</button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const localVideoRef = ref(null);
    const remoteStreams = ref({});
    let localStream = null;
    let peerConnections = {};
    let websocket = null;

    const startMeeting = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        localVideoRef.value.srcObject = localStream;

        websocket = new WebSocket('ws://localhost:8080/meeting');
        websocket.onopen = () => {
          console.log('WebSocket 连接已建立');
        };
        websocket.onmessage = handleWebSocketMessage;
      } catch (error) {
        console.error('开始会议失败：', error);
      }
    };

    const leaveMeeting = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      Object.values(peerConnections).forEach(pc => pc.close());
      peerConnections = {};
      remoteStreams.value = {};
      if (websocket) {
        websocket.close();
        websocket = null;
      }
    };

    const handleWebSocketMessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'user-joined':
          const userId = message.userId;
          createPeerConnection(userId);
          break;
        case 'user-left':
          const user= message.userId;
          closePeerConnection(user);
          break;
        case 'offer':
          handleOfferMessage(message);
          break;
        case 'answer':
          handleAnswerMessage(message);
          break;
        case 'ice-candidate':
          handleIceCandidateMessage(message);
          break;
      }
    };

    const createPeerConnection = (userId) => {
      const pc = new RTCPeerConnection();
      peerConnections[userId] = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          websocket.send(JSON.stringify({
            type: 'ice-candidate',
            userId: userId,
            candidate: event.candidate,
          }));
        }
      };

      pc.ontrack = (event) => {
        remoteStreams.value[userId] = event.streams[0];
      };

      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    };

    const closePeerConnection = (userId) => {
      if (peerConnections[userId]) {
        peerConnections[userId].close();
        delete peerConnections[userId];
        delete remoteStreams.value[userId];
      }
    };

    const handleOfferMessage = async (message) => {
      const userId = message.userId;
      const pc = peerConnections[userId];

      await pc.setRemoteDescription(new RTCSessionDescription(message.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      websocket.send(JSON.stringify({
        type: 'answer',
        userId: userId,
        answer: answer,
      }));
    };

    const handleAnswerMessage = async (message) => {
      const userId = message.userId;
      const pc = peerConnections[userId];

      await pc.setRemoteDescription(new RTCSessionDescription(message.answer));
    };

    const handleIceCandidateMessage = async (message) => {
      const userId = message.userId;
      const pc = peerConnections[userId];

      await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    };

    onUnmounted(() => {
      leaveMeeting();
    });

    return {
      localVideoRef,
      remoteStreams,
      startMeeting,
      leaveMeeting,
    };
  },
};
</script>
