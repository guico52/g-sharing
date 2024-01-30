<script setup>
import {h, ref} from "vue";
import {NIcon, NLayout, NLayoutSider, NMenu} from "naive-ui";
import {RouterLink} from "vue-router";
import {
  DocumentsOutline,
  DocumentOutline,
  FileTrayOutline,
  TrashOutline, AccessibilityOutline
} from "@vicons/ionicons5";


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
          to: '/file'
        }, {
          default: () => '文件'
        }
    ),
    key: 'file',
    icon: renderIcon(DocumentsOutline)

  }, {
    label: () => h(
        RouterLink,
        {
          to: '/template',
        }, {
          default: () => '模板'
        }),
    key: 'template',
    icon: renderIcon(DocumentOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          to: '/user',
        }, {
          default: () => '用户管理'
        }),
    key: 'user',
    icon: renderIcon(AccessibilityOutline)
  },{
    label: () => h(
        RouterLink,
        {
          to: '/permission',
        }, {
          default: () => '权限'
        }),
    key: 'permission',
    icon: renderIcon(FileTrayOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          to: '/deletedFile',
        }, {
          default: () => '回收站'
        }),
    key: 'deletedFile',
    icon: renderIcon(TrashOutline)
  }
])

const handleMenuItemState = item => {
  menuActiveKey.value = item.key
}

function renderIcon(icon){
  return () => h(NIcon, null, {default: () => h(icon)})
}
</script>

<template>
  <div class="background">
    <div class="menu">
      <n-layout has-sider class="menu-sider">
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = !collapsed"
            @expand="collapsed = !collapsed"
        >
          <n-menu
              :options="menuOption"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="24"
          >
          </n-menu>
        </n-layout-sider>
        <n-layout class="menu-content">
          <router-view/>
        </n-layout>
      </n-layout>
    </div>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  background: var(--bg-100)
}

.menu {
  width: 100vw;
  height: 100vh;
  background: var(--bg-100)
}

.menu-content {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
}


.menu-header-item {
  color: black; /* 或您想要的任何颜色 */
  cursor: default; /* 防止光标变成手指形状 */
}

/* 覆盖 disabled 项的样式 */
.n-menu-item--disabled .menu-header-item {
  color: black; /* 保持与普通菜单项相同的颜色 */
}


</style>
