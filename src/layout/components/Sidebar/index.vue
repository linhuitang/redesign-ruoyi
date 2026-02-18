<template>
  <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse }">
    <div class="logo" @click="handleLogoClick">
      <img src="@/assets/logo.png" alt="logo" />
      <span v-if="!isCollapse" class="logo-title">{{ title }}</span>
    </div>
    
    <el-scrollbar class="menu-wrapper">
       <el-menu
        ref="menuRef"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        class="t-menu"
        @select="handleMenuSelect"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Odometer, Setting } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { isExternal } from '@/utils/validate'

import SidebarItem from './SidebarItem.vue'
import { usePermissionStore } from '@/store/modules/permission'

const title = import.meta.env.VITE_APP_TITLE
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const sidebarRouters = computed(() => permissionStore.sidebarRouters)
const menuRef = ref(null)

const isCollapse = computed(() => !appStore.sidebar.opened)

const handleLogoClick = () => {
  router.push('/')
}

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

/**
 * 监听菜单选中事件：外链菜单 index 为空字符串，
 * 选中后立即强制还原到当前路由对应的激活项
 */
const handleMenuSelect = (index) => {
  // index 为空字符串说明是外链菜单（见 SidebarItem.vue）
  if (index === '') {
    nextTick(() => {
      if (menuRef.value) {
        // 直接操作 el-menu 内部状态，强制还原激活项
        menuRef.value.updateActiveIndex(activeMenu.value)
      }
    })
  }
}

// 使用 CSS 变量，这样会自动适配暗色模式
const variables = {
  menuBg: 'transparent',
  menuText: 'var(--td-text-color-primary)',
  menuActiveText: 'var(--td-brand-color)'
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  background-color: var(--td-bg-color-container);
  display: flex;
  flex-direction: column;
  position: relative;
  
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--td-bg-color-component);
    border-bottom: 1px solid var(--td-component-stroke);
    gap: 2px;
    cursor: pointer;
    
    img {
      height: 35px; /* Increased from 28px */
      width: auto;
    }

    .logo-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--td-text-color-primary);
      white-space: nowrap;
      font-style: italic;
      font-weight: bold;
    }
  }

  .menu-wrapper {
    flex: 1;
    height: 0; // Fix for flexbox scrolling
    
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }

  /* 移除 menu 的默认右边框 */
  :deep(.el-menu) {
    border-right: none !important;
    
    /* 隐藏折叠时的箭头和标题 */
    &.el-menu--collapse {
      .el-sub-menu__icon-arrow {
        display: none !important;
      }
      .menu-title {
        display: none;
      }
    }
  }

  .sidebar-footer {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--td-text-color-placeholder);
    border-top: 1px solid var(--td-component-stroke);
  }
}
</style>
