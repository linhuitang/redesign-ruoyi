<template>
  <header class="login-header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo" />
      <span class="logo-title">{{ title }}</span>
    </div>
    <div class="header-actions">
      <el-button link @click.prevent="toggleFullScreen($event)" class="action-btn">
        <el-icon size="20">
          <FullScreen />
        </el-icon>
      </el-button>
      <el-button link @click.prevent="toggleTheme($event)" class="action-btn">
        <el-icon size="20">
          <Sunny v-if="isDark" />
          <Moon v-else />
        </el-icon>
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Moon, Sunny, FullScreen } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'

const title = import.meta.env.VITE_APP_TITLE
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

const toggleTheme = (event) => {
  appStore.toggleTheme()
  event.currentTarget?.blur()
}

const toggleFullScreen = (event) => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  event.currentTarget?.blur()
}
</script>

<style lang="scss" scoped>
.login-header {
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--td-text-color-primary);
  height: 64px;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 2px;
  
  img {
    height: 35px;
    width: auto;
  }
  
  .logo-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--td-text-color-primary);
    white-space: nowrap;
    font-style: italic;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  color: var(--td-text-color-secondary);
  cursor: pointer !important;
  outline: none !important;
  
  &:hover {
    color: var(--td-text-color-primary);
  }
  
  &:focus, &:active, &:focus-visible {
    outline: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
