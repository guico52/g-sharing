<template>
  <div>
    <video ref="localVideoRef" autoplay muted></video>
    <video v-for="(remoteStream, userId) in remoteStreams" :key="userId" :ref="'remoteVideoRef_' + userId" autoplay></video>
    <button @click="startMeeting">开始会议</button>
    <button @click="leaveMeeting">离开会议</button>
    <button @click="shareScreen">共享屏幕</button>
    <button @click="openCamera">打开摄像头</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';


    const localVideoRef = ref(null);
    const remoteStreams = ref({});
    let localStream = null;
    let peerConnections = new Map();
    let websocket = null;
    let userId = ref('');

    const startMeeting = () => {
      userId = Math.random().toString(36).substr(2, 8);
      websocket = new WebSocket('ws://localhost:8221/ws/meeting/123456/'+userId);
      websocket.onopen = () => {
        console.log('WebSocket 连接已建立');
      };
      websocket.onmessage = handleWebSocketMessage;
    };

    const leaveMeeting = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      Object.values(peerConnections).forEach(pc => pc.close());
      peerConnections.clear();
      remoteStreams.value = {};
      if (websocket) {
        websocket.close();
        websocket = null;
      }
    };

    const shareScreen = async () => {
      try {
        localStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localVideoRef.value.srcObject = localStream;
        sendStreamToOtherUsers(localStream);
      } catch (error) {
        console.error('共享屏幕失败：', error);
      }
    };

    const openCamera = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.value.srcObject = localStream;
        sendStreamToOtherUsers(localStream);
      } catch (error) {
        console.error('打开摄像头失败：', error);
      }
    };

    const sendStreamToOtherUsers = (stream) => {
      Object.values(peerConnections).forEach(pc => {
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });
    };

    const handleWebSocketMessage = (event) => {
      console.log(`user ${userId}Received message:`, event.data)
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'user-joined':
          const userId = message.userId;
          createPeerConnection(userId);
          break;
        case 'user-left':
          const user = message.userId;
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

    const createPeerConnection = async (userId) => {
      const pc = new RTCPeerConnection();
      peerConnections[userId] = pc;
      console.log('perConnection created, now state: ', pc.signalingState);
      console.log('perConnection created, iceConnectionState: ', pc.iceConnectionState);
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

      if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      }

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log('prepared offer, now state: ', pc.signalingState)
        console.log("prepared offer, iceConnectionState: ", pc.iceConnectionState)
        websocket.send(JSON.stringify({
          type: 'offer',
          userId: userId,
          offer: offer,
        }));
        console.log(`${userId} send offer`);
      } catch (error) {
        console.error('Error creating offer:', error);
      }
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
      console.log('Received offer, now state: ', pc.signalingState)
      console.log("Received offer, iceConnectionState: ", pc.iceConnectionState)
      const answer = await pc.createAnswer();
      console.log('prepared answer, now state: ', pc.signalingState)
      console.log("prepared answer, iceConnectionState: ", pc.iceConnectionState)
      console.log('answer: ', answer)
      console.log('pc: ', pc)
      await pc.setLocalDescription(answer);
       console.log('setLocalDescription, now state: ', pc.signalingState)
      console.log("setLocalDescription, iceConnectionState: ", pc.iceConnectionState)
      console.log('pc: ', pc)
      websocket.send(JSON.stringify({
        type: 'answer',
        userId: userId,
        answer: answer,
      }));
      console.log(`${userId} send answer`);
    };

    const handleAnswerMessage = async (message) => {
      const userId = message.userId;
      const pc = peerConnections[userId];
      console.log('Received answer, now state: ', pc.signalingState);
      console.log('Received answer, iceConnectionState: ', pc.iceConnectionState);

      if(pc.signalingState === 'have-local-offer') {
        pc.setRemoteDescription(new RTCSessionDescription(message.answer));
      }

      // 接下来，开始交换 ice candidate
      pc.onicecandidate = event => {
        if (event.candidate) {
          console.log('Sending ice candidate')
          websocket.send(JSON.stringify({
            type: 'ice-candidate',
            userId: userId,
            candidate: event.candidate,
          }));
          console.log(`${userId} send ice candidate`)
        }
      }
    };

    const handleIceCandidateMessage = async (message) => {
      const userId = message.userId;
      const pc = peerConnections[userId];
      await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }




</script>
