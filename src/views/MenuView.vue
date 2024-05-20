<script setup>
import {h, onMounted, ref} from "vue";
import { NIcon, NLayout, NLayoutSider, NMenu} from "naive-ui";
import {RouterLink} from "vue-router";
import {
  DocumentsOutline,
  DocumentOutline,
  TrashOutline,
  AccessibilityOutline,
  SearchOutline,
  PeopleOutline,
  LogOutOutline,
  PeopleCircleOutline,
  ArrowBackCircleOutline, ChatbubblesOutline, ChatbubbleOutline, Chatbubbles, ArrowUpCircleOutline
} from "@vicons/ionicons5";
import {router} from "../router/router.js";
import {getMySysPermission} from "../api/myInfo.js";


const menuActiveKey = ref(null)
const collapsed = ref(false)

const menuOption = ref([
  {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/searchFile',
        }, {
          default: () => '知识库检索'
        }),
    key: 'permission',
    icon: renderIcon(SearchOutline)
  },
  {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/project'
        }, {
          default: () => '知识库'
        }
    ),
    key: 'file',
    icon: renderIcon(DocumentsOutline)

  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/backup',
        }, {
          default: () => '文件备份'
        }),
    key: 'template',
    icon: renderIcon(DocumentOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/deletedFile',
        }, {
          default: () => '回收站'
        }),
    key: 'deletedFile',
    icon: renderIcon(TrashOutline)
  }, {
    label: () => h (
        RouterLink,
        {
          class: 'menu-item',
          to: '/meetingList'
        }, {
          default: () => '会议管理'
        }),
    key: 'meetingList',
    icon: renderIcon(Chatbubbles)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/privateChat',
        }, {
          default: () => '私聊'
        }),
    key: 'privateChat',
    icon: renderIcon(ChatbubbleOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/groupChat',
        }, {
          default: () => '群聊'
        }),
    key: 'groupChat',
    icon: renderIcon(ChatbubblesOutline)
  }, {
    label: () => h(
        'div',
        {},
        {default: () =>'处理审批'}
    ),
    key: 'approval',
    icon: renderIcon(ArrowUpCircleOutline)
  }, {
    label: () => h(
        'div',
        {},
        {default: () =>'处理汇报'}
    ),
    key: 'report',
    icon: renderIcon(ArrowBackCircleOutline)
  } ,{
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/userGroup',
        }, {
          default: () => '用户组管理'
        }),
    key: 'user',
    icon: renderIcon(PeopleOutline)
  },{
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/manageUser'
        }, {
          default: () => '用户管理'
        }),
    key: 'manageUser',
    icon: renderIcon(PeopleCircleOutline)
  },{
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/myInfo',
        }, {
          default: () => '我的信息'
        }),
    key: 'myInfo',
    icon: renderIcon(AccessibilityOutline)
  },{
    label: () => h(
        'label',
        {
          class: 'menu-header-item',
          onClick: () => {
            localStorage.removeItem('token')
            router.push({name: 'LoginAndRegisterView'})
          }
        },
        '退出登录'
    ),
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
])
const systemPermission = ref(0)

const handleMenuItemState = item => {
  menuActiveKey.value = item.key
}

onMounted(
    () => {
      getMySysPermission().then(
          res => {
            systemPermission.value = res.data.data
            if(systemPermission.value <3){
              menuOption.value = menuOption.value.filter(item => item.key !== 'manageUser')
            }
          }
      )
    }
)

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}
</script>

<template>
  <div class="background">
    <div class="menu">
        <n-layout has-sider class="menu-sider-container">
          <n-layout-sider
              bordered
              collapse-mode="width"
              :collapsed-width="64"
              :width="240"
              :collapsed="collapsed"
              show-trigger
              @collapse="collapsed = !collapsed"
              @expand="collapsed = !collapsed"
              class="menu-sider"

          >
            <div v-show="!collapsed" class="menu-title">管理员后台</div>
            <n-menu
                :options="menuOption"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="24"
                class="menu"
            >
            </n-menu>
          </n-layout-sider>
          <n-layout class="menu-content-container">
            <router-view class="menu-content"/>
          </n-layout>
        </n-layout>
    </div>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
}

.menu {
  width: 100vw;
}

.menu-content-container {
  height: 100vh;
  overflow-x: scroll;
}
.menu-title{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}


</style>
