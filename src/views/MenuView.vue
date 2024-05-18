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
  ArrowBackCircleOutline, ChatbubblesOutline
} from "@vicons/ionicons5";
import {router} from "../router/router.js";
import {getMySysPermission} from "../api/myInfo.js";


const menuActiveKey = ref(null)
const collapsed = ref(false)

const menuOption = ref([
  {
    label: () => h(
        'label',
        {class: 'menu-header-item'},
        'welcome to GSharing',
    ),
    key: 'header',
  },
  {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/searchFile',
        }, {
          default: () => '搜索'
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
          default: () => '项目'
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
          default: () => '备份'
        }),
    key: 'template',
    icon: renderIcon(DocumentOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/userGroup',
        }, {
          default: () => '用户组'
        }),
    key: 'user',
    icon: renderIcon(PeopleOutline)
  },  {
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
    label: () => h (
        RouterLink,
        {
          class: 'menu-item',
          to: '/meetingList'
        }, {
          default: () => '会议'
        }),
    key: 'meetingList',
    icon: renderIcon(ChatbubblesOutline)
  }, {
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
        RouterLink,
        {
          class: 'menu-item',
          to: '/',
        }, {
          default: () => '返回主页'
        }),
    icon: renderIcon(ArrowBackCircleOutline)
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
  height: 100vh;
}

.menu-content-container {
  height: 100vh;
  overflow-x: scroll;
}


</style>
