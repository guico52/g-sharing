<script setup>
import {h, onMounted, ref} from "vue";
import { NIcon, NLayout, NLayoutSider, NMenu, NButton} from "naive-ui";
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
  ArrowBackCircleOutline, ChatbubblesOutline, PaperPlaneOutline
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
          default: () => '知识库项目'
        }
    ),
    key: 'file',
    icon: renderIcon(DocumentsOutline)

  }, {
    label: () => h (
        RouterLink,
        {
          class: 'menu-item',
          to: '/meetingList'
        }, {
          default: () => '会议列表'
        }),
    key: 'meetingList',
    icon: renderIcon(ChatbubblesOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/groupChat'
        }, {
          default: () => '群聊'
        }),
    key: 'groupChat',
    icon: renderIcon(PeopleOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
          to: '/privateChat'
        }, {
          default: () => '私聊'
        }),
    key: 'privateChat',
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
  }, {
    label: () => h(
        'div',
        {},
        {default: () => '我的审批'}
    ),
    key: 'submitApproval',
    icon: renderIcon(DocumentOutline)
  },{
    label: () => h(
        'div',
        {},
        {default: () => '汇报记录'}
    ),
    key: 'reportRecord',
    icon: renderIcon(PaperPlaneOutline)
  }, {
    label: () => h(
        'label',
        // {
        //   class: 'menu-header-item',
        // },
        '退出登录'
    ),
    key: 'logout',
    icon: renderIcon(LogOutOutline),
    props: {
      onClick: () => {
        localStorage.removeItem('token')
        router.push({name: 'LoginAndRegisterView'})
      }
    },

  }
])
const systemPermission = ref(0)

const handleMenuItemState = key => {
  if(key === 'logout'){
    localStorage.removeItem('token')
    router.push({name: 'LoginAndRegisterView'})
  }
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
            <div v-show ="!collapsed"
                 class="menu-title">在线系统</div>
            <n-menu
                :options="menuOption"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="24"
                :on-update:value="handleMenuItemState"
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
.menu-title {
  font-size: 20px;
  font-weight: bold;
  padding: 10px 0;
  text-align: center;
}



</style>
