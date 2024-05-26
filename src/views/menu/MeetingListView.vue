<template>
  <div class="container">
    <div class="header">
      <h1>会议管理</h1>
      <p>在此页面中，您可以查看和管理所有会议。</p>
      <NButton type="primary" @click="addMeeting">添加会议</NButton>
    </div>
    <div class="table-container">
      <NDataTable :columns="columns" :pagination="{pageSize: 20}" :data="data" />
    </div>
  </div>
</template>

<script setup>
import { h, onMounted, ref } from "vue";
import { NButton, NInput, NSpace, NDataTable, NCheckbox } from "naive-ui";
import { dialog, message } from "../../api/api.js";
import { createRoom, deleteRoom, listRooms } from "../../api/meeting.js";
import { router } from "../../router/router.js";

const columns = [
  {
    title: '会议名称',
    key: 'name'
  },
  {
    title: '会议创建时间',
    key: 'createTime'
  },
  {
    title: '参会人数',
    key: 'participants'
  },{
    title: '是否允许踢出后重新加入',
    key: 'rejoin',
    render: (row) => h('span', {}, row.rejoin ? '是' : '否')
  },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, {
        type: 'primary',
        onClick: () => {
          router.push(`/meeting-room/${row.id}`)
        }
      }, '加入'),
      h(NButton, {
        type: 'error',
        onClick: () => {
          deleteRoom(row.id).then(
              (result) => {
                listRooms().then(
                    res => {
                      data.value = res.data.data
                    }
                )
                if (result.data.code === 200) {
                  message.success('解散成功')
                }
              })
        }
      }, '解散')
    ])
  }
];

const data = ref([]);
const roomName = ref('');
const rejoin = ref(false);

onMounted(() => {
  listRooms().then(
      res => {
        data.value = res.data.data
      }
  )
});

const addMeeting = () => dialog.info({
  title: '添加会议',
  content: () => h('div', {}, [
    h(NInput, {
      placeholder: '请输入会议名称',
      onUpdateValue: (value) => {
        roomName.value = value
      }
    }),
    h(NCheckbox, {
      checkedValue: true,
      uncheckedValue: false,
      defaultChecked: rejoin.value,
      onUpdateChecked: (value) => {
        rejoin.value = value
      }
    }, [
      '是否允许踢出后重新加入'
    ])
  ]),
  positiveText: '添加',
  negativeText: '取消',
  onPositiveClick: () => {
    createRoom(roomName.value, rejoin.value).then(
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
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.header p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.table-container {
  margin-top: 20px;
}
</style>
