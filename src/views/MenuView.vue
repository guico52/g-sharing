<script setup>
import {h, ref} from "vue";
import {darkTheme, NIcon, NLayout, NLayoutSider, NMenu} from "naive-ui";
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
    icon: renderIcon(AccessibilityOutline)
  }, {
    label: () => h(
        RouterLink,
        {
          class: 'menu-item',
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
          class: 'menu-item',
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

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}
</script>

<template>
  <div class="background">
    <div class="menu">
      <n-config-provider :theme="darkTheme">


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
      </n-config-provider>
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


</style>
