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
import {createRoom, getToken, listRooms} from "../api/meeting.js";
import {Room, RoomEvent, LocalVideoTrack, LocalAudioTrack, ParticipantEvent} from "livekit-client";
import {router} from "../router/router.js";
import {message} from "../api/api.js";

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
  // 从路由中获取name参数
  const name = router.currentRoute.value.params.name;

  joinMeeting(name).then(() => {
    message.success('成功加入会议室')
    console.log('Joined meeting, room:', room);
    // 获取所有发布的订阅
    // 获取当前房间
    // 加入会议后，订阅所有人的视频和音频

    room.on(RoomEvent.Disconnected, () => {
      console.log('Disconnected from room');
    });
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      // 如果有新的参与者加入，将自己的视频和音频推送给新加入的参与者
      console.log('Participant connected', participant);

    });
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log('Participant disconnected', participant);
    });

    room.on(RoomEvent.Reconnecting, () => {
      console.log('Reconnecting...');
    });

    room.on(RoomEvent.Reconnected, () => {
      console.log('Reconnected');
    });

    room.on(RoomEvent.ParticipantMetadataChanged, (participant, metadata) => {
      console.log('Participant metadata changed', participant, metadata);
    });

    room.on(ParticipantEvent.TrackPublished, (track, publication, participant) => {
      console.log('Track published', track, publication, participant);
    });
  });

})

const createMeeting = async (name) => {
  const res = await createRoom(name);
  console.log('Meeting created', res);
}

const joinMeeting = async (name) => {
  const res = await getToken(name);
  const token = res.data.data;
  console.log('Token:', token)
  await room.connect(wsUrl, token, {autoSubscribe: true});
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
  console.log('Track subscribed', track, publication, participant)
  // 将订阅的视频或音频添加到页面中
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
