<template>
  <div class="navbar">
    <div class="header-left">
      <el-button link class="collapse-btn" @click.prevent="toggleSideBar($event)">
        <el-icon size="20">
          <svg-icon icon-class="list" />
        </el-icon>
      </el-button>
      <div class="search-container">
        <el-select
          v-model="searchText"
          filterable
          remote
          reserve-keyword
          placeholder="搜索菜单"
          :remote-method="handleSearch"
          :loading="searchLoading"
          class="header-search-select"
          popper-class="header-search-select-dropdown"
          @change="handleSelect"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <el-option
            v-for="item in searchOptions"
            :key="item.path"
            :label="item.title.join(' > ')"
            :value="item"
          >
            <div class="search-option-item">
              <span class="title">{{ item.title.join(" > ") }}</span>
              <span class="path">{{ item.path }}</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="header-right">
       <el-space :size="16">

          <el-button link class="header-action-btn" @click.prevent="toggleFullScreen($event)">
              <el-icon size="18">
                <FullScreen />
              </el-icon>
          </el-button>
         
          <el-button link class="header-action-btn" @click.prevent="toggleTheme($event)">
              <el-icon size="18">
                <Sunny v-if="isDark" />
                <Moon v-else />
              </el-icon>
          </el-button>

          <el-dropdown trigger="click" class="size-dropdown" @command="handleSizeChange">
            <el-button link>
              <el-icon size="20">
                <svg-icon icon-class="font-size" />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="large" :class="{ 'is-active': appStore.size === 'large' }">
                  大型
                </el-dropdown-item>
                <el-dropdown-item command="default" :class="{ 'is-active': appStore.size === 'default' }">
                  默认
                </el-dropdown-item>
                <el-dropdown-item command="small" :class="{ 'is-active': appStore.size === 'small' }">
                  小型
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown trigger="click" class="user-dropdown">
            <div class="avatar-wrapper">
              <el-avatar :size="30" :src="userStore.avatar || defaultAvatar" />
              <span class="user-name">{{ userStore.name || '用户' }}</span>
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                 <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                   <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
       </el-space>
    </div>
  </div>
</template>

<script setup>
import { h, computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import { CaretBottom, Expand, Fold, Search, Moon, Sunny, User, SwitchButton, FullScreen } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import usePermissionStore from '@/store/modules/permission'
import defaultAvatar from '@/assets/avatar.png'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const isCollapse = computed(() => !appStore.sidebar.opened)
const isDark = computed(() => appStore.theme === 'dark')

const toggleSideBar = (event) => {
  appStore.toggleSideBar()
  // 延迟移除焦点，确保生效
  setTimeout(() => {
    event.currentTarget?.blur()
    document.activeElement?.blur()
  }, 0)
}

const toggleTheme = (event) => {
  appStore.toggleTheme()
  // 移除焦点，避免出现边框
  event.currentTarget.blur()
}

const toggleFullScreen = (event) => {
  if (!document.fullscreenElement) {
    // 进入全屏
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  // 移除焦点，避免出现边框
  event.currentTarget?.blur()
}

const logout = async () => {
  await userStore.logout()
  router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
}

const goToProfile = () => {
  router.push('/user/profile')
}

const handleSizeChange = (size) => {
  appStore.setSize(size)
}

// 搜索功能实现
const permissionStore = usePermissionStore()
const searchText = ref('')
const searchOptions = ref([])
const searchPool = ref([])
const searchLoading = ref(false)
const fuse = ref(null)

const routes = computed(() => permissionStore.defaultRoutes)

const initFuse = (list) => {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [{ name: 'title', weight: 0.7 }, { name: 'path', weight: 0.3 }]
  })
}

const getNormalPath = (p) => {
  if (p.length > 1 && p.endsWith('/')) {
    return p.substring(0, p.length - 1)
  }
  return p
}

const generateRoutes = (routes, basePath = '', prefixTitle = []) => {
  let res = []
  for (const r of routes) {
    if (r.hidden) continue
    const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path
    const fullPath = r.path.startsWith('http') ? r.path : getNormalPath(basePath + p)
    const data = { path: fullPath, title: [...prefixTitle], icon: '' }
    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]
      if (r.redirect !== "noRedirect") {
        res.push(data)
      }
    }
    if (r.children) {
      const tempRoutes = generateRoutes(r.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

const handleSearch = (query) => {
  if (query !== '') {
    searchLoading.value = true
    const results = fuse.value.search(query)
    searchOptions.value = results.map(item => item.item)
    searchLoading.value = false
  } else {
    searchOptions.value = []
  }
}

const handleSelect = (val) => {
  if (!val) return
  if (val.path.startsWith('http')) {
    window.open(val.path, "_blank")
  } else {
    router.push(val.path)
  }
  searchText.value = ''
  searchOptions.value = []
}

onMounted(() => {
  searchPool.value = generateRoutes(routes.value)
})

watch(searchPool, (list) => {
  initFuse(list)
})

watch(routes, () => {
  searchPool.value = generateRoutes(routes.value)
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px; /* TDesign Header height */
  overflow: hidden;
  position: relative;
  background: var(--td-bg-color-component);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid var(--td-component-stroke);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .collapse-btn {
      font-size: 20px;
      color: var(--td-text-color-secondary);
      cursor: pointer !important;
      outline: none !important;
      border: none !important;
      
      /* Force pointer on all children */
      :deep(*) {
        cursor: pointer !important;
      }
      
      &:hover {
         color: var(--td-text-color-primary);
      }
      
      &:focus, &:active, &:focus-visible, &:focus-within {
        outline: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      /* 移除 Element Plus 可能添加的边框 */
      :deep(.el-button) {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
        
        &:focus, &:active, &:focus-visible {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      }
    }
    
    .search-container {
      width: 400px;
      
      .header-search-select {
        width: 100%;
        
        :deep(.el-select__wrapper) {
           border-radius: 4px;
           background-color: var(--td-bg-color-page);
           box-shadow: none !important;
           padding-left: 12px;
           
           &.is-focus {
              background-color: var(--td-bg-color-component);
              box-shadow: 0 0 0 1px var(--td-brand-color) !important;
           }
        }
      }
    }
  }

  .search-option-item {
    display: flex;
    flex-direction: column;
    padding: 6px 0;
    line-height: 1.5;
    
    .title {
      font-size: 14px;
      font-weight: 500;
      color: var(--td-text-color-primary);
      white-space: normal;
    }
    
    .path {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
      white-space: normal;
      word-break: break-all;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    
    .el-button.is-link {
       color: var(--td-text-color-secondary);
       cursor: pointer !important;
       outline: none !important;
       
       /* Force pointer on all children */
       :deep(*) {
         cursor: pointer !important;
       }
       
       &:hover {
         color: var(--td-text-color-primary);
       }
       
       &:focus, &:active, &:focus-visible {
         outline: none !important;
         background-color: transparent;
         box-shadow: none !important;
         border: none !important;
       }
    }

    .header-action-btn {
      width: 32px !important;
      height: 32px !important;
      padding: 0 !important;
      min-height: unset !important;
    }

    .size-dropdown {
      .el-button.is-link {
        color: var(--td-text-color-secondary);
        cursor: pointer !important;
        outline: none !important;
        border: none !important;
        
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
    }

    .avatar-wrapper {
        margin-left: 8px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;

        .user-name {
          font-size: 14px;
          color: var(--td-text-color-primary);
        }
    }
  }
}

.header-search-select-dropdown {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: normal !important;
    padding: 0 !important;
  }

  .search-option-item {
    display: flex !important;
    flex-direction: column !important;
    padding: 8px 16px !important;
    line-height: normal !important;
    width: 100% !important;
    box-sizing: border-box !important;
    
    .title {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: var(--td-text-color-secondary) !important;
      white-space: normal !important;
      display: block !important;
      line-height: 1.4 !important;
    }
    
    .path {
      font-size: 12px !important;
      color: #999 !important;
      margin-top: 4px !important;
      white-space: normal !important;
      word-break: break-all !important;
      display: block !important;
      line-height: 1.2 !important;
      font-weight: normal;
    }
  }
}
</style>
