<template>
  <div class="container">
    <div class="search-content">
      <n-input round placeholder="用户组名称查询" v-model:value="searchInput" />
      <n-button type="primary" @click="search" icon="search">搜索</n-button>
      <n-button @click="reset" icon="refresh">重置</n-button>
      <n-button type="success" @click="addUserGroupHandler" icon="plus">添加</n-button>
    </div>
    <div class="content">
      <n-data-table :columns="columns" :data="data" bordered />
    </div>
  </div>
</template>

<script setup>
import { NInput, NButton, NDataTable, NModal, NRadio, NRadioGroup, NSpace, NTransfer } from "naive-ui";
import { h, onMounted, ref } from "vue";
import { list, detail, rename, updatePermission, add, listUser, updateUserGroupMember, deleteUserGroup } from "../../api/usergroup.js";
import { message, dialog } from "../../api/api.js";

const data = ref([]);
const showModal = ref(false);
const groupDetail = ref([]);
const radioOptions = ref([
  { label: '普通用户', value: 1 },
  { label: '管理员', value: 2 },
  { label: '超级管理员', value: 3 }
]);
const newName = ref('');
const userOption = ref([]);
const userValue = ref([]);
const searchInput = ref('');
const selectedGroupId = ref('');

const columns = ref([
  { title: '用户组名称', key: 'name' },
  { title: '创建日期', key: 'createTime' },
  {
    title: '操作',
    key: 'action',
    render: (row) => h(NSpace, {}, [
      h(NButton, { type: 'info', size: 'small', onClick: () => showRenameDialog(row), icon: 'edit' }, '重命名'),
      h(NButton, { type: 'warning', size: 'small', onClick: () => showUpdatePermissionDialog(row), icon: 'lock' }, '更改权限'),
      h(NButton, { type: 'primary', size: 'small', onClick: () => showManageMembersDialog(row), icon: 'users' }, '管理成员'),
      h(NButton, { type: 'error', size: 'small', onClick: () => showDeleteGroupDialog(row), icon: 'trash' }, '解散')
    ])
  }
]);

const detailColumns = ref([
  { title: '用户名', key: 'username' },
  {
    title: '权限',
    key: 'permission',
    render: (row) => h(NRadioGroup, {
      value: row.level,
      onUpdateValue: (value) => row.level = value
    }, () => h(NSpace, null, () => radioOptions.value.map(option => h(NRadio, {
      value: option.value,
      checked: row.level === option.value,
    }, option.label))))
  }
]);

const newUserGroupName = ref('');

const addUserGroupHandler = () => {
  dialog.info({
    title: '添加用户组',
    message: '请输入用户组名称',
    positiveText: '确认',
    negativeText: '取消',
    content: () => h(NSpace, null, [
      h(NInput, {
        placeholder: '请输入用户组名称',
        clearable: true,
        value: newUserGroupName.value,
        onUpdateValue: (value) => newUserGroupName.value = value
      })
    ]),
    onPositiveClick: () => {
      if (newUserGroupName.value === '') {
        message.error('用户组名称不能为空');
      } else {
        add(newUserGroupName.value).then(
            res => {
              if (res.data.code === 200) {
                message.success('添加成功');
                fetchUserGroups();
              } else {
                message.error(res.data.message || '添加失败');
              }
            }
        ).catch(() => message.error('添加失败'));
      }
    }
  });
};

const showRenameDialog = (row) => {
  selectedGroupId.value = row.id;
  dialog.create({
    title: '重命名用户组',
    message: '请输入新的用户组名称',
    positiveText: '确认',
    negativeText: '取消',
    content: () => h(NSpace, null, [
      h(NInput, {
        placeholder: '请输入新的用户组名称',
        clearable: true,
        value: newName.value,
        onUpdateValue: (value) => newName.value = value
      })
    ]),
    onPositiveClick: () => {
      if (newName.value === '') {
        message.error('用户组名称不能为空');
      } else {
        rename(row.id, newName.value).then(
            res => {
              if (res.data.code === 200) {
                row.name = newName.value;
                message.success('重命名成功');
              } else {
                message.error(res.data.message || '重命名失败');
              }
            }
        ).catch(() => message.error('重命名失败'));
      }
    }
  });
};

const showUpdatePermissionDialog = (row) => {
  selectedGroupId.value = row.id;
  detail(row.id).then(
      res => {
        groupDetail.value = res.data.data;
        dialog.info({
          title: '更改权限',
          content: () => h('div', { class: 'permission-content' }, [
            h(NDataTable, {
              columns: detailColumns.value,
              data: groupDetail.value
            })
          ]),
          positiveText: '确认',
          negativeText: '取消',
          onPositiveClick: onAfterLeave
        });
      }
  ).catch(() => message.error('获取权限详情失败'));
};

const showManageMembersDialog = (row) => {
  selectedGroupId.value = row.id;
  detail(row.id).then(
      res => {
        userValue.value = res.data.data.map(user => user.userId);
        dialog.info({
          title: '管理成员',
          content: () => h(NTransfer, {
            value: userValue.value,
            options: userOption.value,
            onUpdateValue: (value) => userValue.value = value
          }),
          positiveText: '确认',
          negativeText: '取消',
          onPositiveClick: () => {
            updateUserGroupMember(row.id, userValue.value).then(
                res => {
                  if (res.data.code === 200) {
                    message.success('修改成功');
                  } else {
                    message.error(res.data.message || '修改失败');
                  }
                }
            ).catch(() => message.error('修改失败'));
          }
        });
      }
  ).catch(() => message.error('获取成员详情失败'));
};

const showDeleteGroupDialog = (row) => {
  dialog.error({
    title: '解散用户组',
    content: '解散后，用户组将无法恢复，确定解散吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteUserGroup(row.id).then(
          res => {
            if (res.data.code === 200) {
              message.success('解散成功');
              fetchUserGroups();
            } else {
              message.error(res.data.message || '解散失败');
            }
          }
      ).catch(() => message.error('解散失败'));
    }
  });
};

const fetchUserGroups = () => {
  list().then(
      res => {
        data.value = res.data.data;
      }
  ).catch(() => message.error('获取用户组列表失败'));
};

const fetchUsers = () => {
  listUser().then(
      res => {
        userOption.value = res.data.data.map(user => ({
          label: user.username,
          value: user.id
        }));
      }
  ).catch(() => message.error('获取用户列表失败'));
};

onMounted(() => {
  fetchUserGroups();
  fetchUsers();
});

const search = () => {
  list(searchInput.value).then(
      res => {
        data.value = res.data.data;
      }
  ).catch(() => message.error('搜索失败'));
};

const reset = () => {
  searchInput.value = '';
  fetchUserGroups();
};

const onAfterLeave = () => {
  const reqParams = groupDetail.value.map(user => ({
    id: user.id,
    level: user.level
  }));
  updatePermission(reqParams, selectedGroupId.value).then(
      res => {
        if (res.data.code === 200) {
          message.success('修改成功');
          groupDetail.value = [];
        } else {
          message.error(res.data.message || '修改失败');
        }
      }
  ).catch(() => message.error('修改失败'));
};
</script>

<style scoped>
.container {
  padding: 1em;
  border-radius: 0.5em;
}

.search-content {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

.search-content * {
  margin-left: 0.5em;
}

.permission-content {
  width: 35em;
  background: var(--bg-200);
  padding: 1em;
  border-radius: 0.5em;
}
</style>
