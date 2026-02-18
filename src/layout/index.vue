<template>
  <div class="app-wrapper" :class="{ 'hideSidebar': !sidebar.opened, 'openSidebar': sidebar.opened }">
    <div class="sidebar-wrapper">
      <Sidebar />
    </div>
    <div class="main-container">
      <div class="fixed-header">
        <Navbar />
      </div>
      <el-scrollbar class="main-scrollbar">
        <AppMain />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Sidebar, Navbar, AppMain } from './components'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const sidebar = computed(() => appStore.sidebar)
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--td-bg-color-page); /* Global background for TDesign pages */
  overflow-x: hidden;
}

.sidebar-wrapper {
  width: 232px; /* TDesign Sidebar width */
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  transition: width 0.28s;
  background-color: var(--td-bg-color-container);
}

.hideSidebar .sidebar-wrapper {
  width: 64px !important;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: 232px;
  width: calc(100% - 232px);
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 64px; /* Navbar height */
}

.hideSidebar .main-container {
  margin-left: 64px;
  width: calc(100% - 64px);
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - 232px);
  transition: width 0.28s;
  background-color: var(--td-bg-color-component);
}

.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}

.main-scrollbar {
  height: calc(100vh - 64px);
  
  :deep(.el-scrollbar__view) {
    min-height: 100%;
  }
}
</style>
