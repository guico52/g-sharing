

<template>
  <div>
    <NButton @click="addMeeting">添加会议</NButton>
  </div>
  <div>
    <NDataTable :columns="columns" :data="data"/>
  </div>
</template>
<script setup>
import {h, onMounted, ref} from "vue";
import {NButton, NInput, NSpace, NDataTable} from "naive-ui";
import {dialog, message} from "../../api/api.js";
import {createRoom, deleteRoom, listRooms} from "../../api/meeting.js";
import {router} from "../../router/router.js";
import {RoomServiceClient} from "livekit-server-sdk";
const serverUrl = 'ws://101.33.210.228:7880';
const columns = [
    {
      title: '会议名称',
      key: 'name'
    }, {
      title: '会议创建时间',
      key: 'createTime'
    }, {
      title: '参会人数',
      key: 'participants'
    }, {
      title: '操作',
      key: 'action',
      render: (row) => h(NSpace, {} , [
          h(NButton, {
            onClick: () => {
              router.push(`/meeting-room/${row.name}`)
            }
          }, '加入'),
          h(NButton, {
            onClick: () => {
              deleteRoom(row.name).then(
                  ()  => {
                    const roomServiceClient = new RoomServiceClient(serverUrl, 'devkey', 'secret');
                    roomServiceClient.deleteRoom(row.name).then(
                        () => {
                          listRooms().then(
                              res => {
                                data.value = res.data.data
                              }
                          )
                          message.success('解散成功')
                        }
                    )

                  }
              )
            }
          }, '解散')
      ])
    }
  ]
  const data = ref([])
  const roomName = ref('')

  onMounted(() => {
    listRooms().then(
        res => {
          data.value = res.data.data
        }
    )
  })
  const addMeeting = () => dialog.info({
    title: '添加会议',
    content: () =>  h(NInput, {
      placeholder: '请输入会议名称',
      onUpdateValue: (value) => {
        roomName.value = value
      }
    }),
    positiveText: '添加',
    negativeText: '取消',
    onPositiveClick: () => {
      createRoom(roomName.value).then(
          res => {
            listRooms().then(
                res => {
                  data.value = res.data.data
                }
            )
            message.success('添加成功')
          }
      )
    }
  })
</script>


<style scoped>

</style>
