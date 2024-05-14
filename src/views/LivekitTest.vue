<template>
  <div class="meeting-container">
    <div class="video-container" ref="videoContainer"></div>
    <div class="controls">
      <button @click="toggleAudio">{{ state.isAudioEnabled ? '静音' : '取消静音' }}</button>
      <button @click="toggleVideo">{{ state.isVideoEnabled ? '关闭视频' : '开启视频' }}</button>
      <button @click="toggleScreen">{{ state.isScreenEnabled ? '结束共享' : '开启共享' }}</button>
      <button @click="leaveMeeting">离开会议</button>
      <button @click="listRoom">查看房间</button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, reactive} from "vue";
import {create, getToken, listRooms} from "../api/meeting.js";
import {Room, RoomEvent, LocalVideoTrack, LocalAudioTrack} from "livekit-client";

const wsUrl = 'http://101.33.210.228:7880'
const room = reactive(new Room());
const videoContainer = ref(null);

const state = reactive({
  isAudioEnabled: false,
  isVideoEnabled: false,
  isScreenEnabled: false,
});

const listRoom = () => {
  listRooms().then(res => {
    console.log('Rooms:', res.data.data);
  });
}
onMounted(() => {
  joinMeeting('123').then(() => {
    console.log('Joined meeting');
    // 添加时间监听回调
    room.on(RoomEvent.Connected, () => {
      console.log('Connected to room');
      setupLocalTracks();
    });
    room.on(RoomEvent.Disconnected, () => {
      console.log('Disconnected from room');
    });
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log('Participant connected', participant);
    });
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
  });

})

const createMeeting = async (name) => {
  const res = await create(name);
  console.log('Meeting created', res);
}

const joinMeeting = async (name) => {
  const res = await getToken(name);
  const token = res.data.data;
  console.log('Token:', token)
  await room.connect(wsUrl, token);
}

const setupLocalTracks = async () => {
  const localVideoTrack = await LocalVideoTrack.create();
  const localAudioTrack = await LocalAudioTrack.create();
  videoContainer.value.appendChild(localVideoTrack.attach());
}

const toggleAudio = async () => {
  state.isAudioEnabled = !state.isAudioEnabled;
  await room.localParticipant.setMicrophoneEnabled(state.isAudioEnabled);
}

const toggleVideo = async () => {
  state.isVideoEnabled = !state.isVideoEnabled;
  await room.localParticipant.setCameraEnabled(state.isVideoEnabled);
}


const toggleScreen = async () => {
  state.isScreenEnabled = !state.isScreenEnabled;
  await room.localParticipant.setScreenShareEnabled(state.isScreenEnabled);
}

const handleTrackSubscribed = (track, publication, participant) => {
  const element =track.attach();
  videoContainer.value.appendChild(element);
}
const leaveMeeting = () => {
  room.disconnect();
}
</script>

<style scoped>
.meeting-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-container {
  width: 80%;
  height: 60vh;
  background-color: #000;
}

.controls {
  margin-top: 20px;
}
</style>
