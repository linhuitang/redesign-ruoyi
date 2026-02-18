import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    theme: localStorage.getItem('theme') || 'light',
    size: localStorage.getItem('size') || 'default'
  }),
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
    },
    closeSideBar({ withoutAnimation }) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      // 切换 html 的 class
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    initTheme() {
      // 初始化时应用主题
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    },
    setSize(size) {
      this.size = size
      localStorage.setItem('size', size)
    }
  }
})

