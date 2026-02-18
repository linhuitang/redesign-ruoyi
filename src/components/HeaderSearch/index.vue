<template>
  <div class="header-search" :class="{ show: show }">
    <div class="search-icon-wrapper" @click.stop="click">
      <svg-icon icon-class="search" class-name="search-icon" />
    </div>
    
    <div class="search-input-container">
      <el-select
        ref="headerSearchSelectRef"
        v-model="search"
        :remote-method="querySearch"
        filterable
        default-first-option
        remote
        placeholder="菜单搜索"
        class="header-search-select"
        @change="change"
      >
        <el-option
          v-for="item in options"
          :key="item.path"
          :value="item"
          :label="item.title.join(' > ')"
        >
          <div class="option-content">
            <span class="option-title">{{ item.title.join(" > ") }}</span>
            <span class="option-path">{{ item.path }}</span>
          </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import usePermissionStore from '@/store/modules/permission'

const search = ref('')
const options = ref([])
const searchPool = ref([])
const show = ref(false)
const fuse = ref(undefined)
const headerSearchSelectRef = ref(null)
const router = useRouter()

const permissionStore = usePermissionStore()
const routes = computed(() => permissionStore.defaultRoutes)

function click() {
  show.value = !show.value
  if (show.value) {
    headerSearchSelectRef.value && headerSearchSelectRef.value.focus()
  }
}

function close() {
  headerSearchSelectRef.value && headerSearchSelectRef.value.blur()
  options.value = []
  show.value = false
}

function change(val) {
  if (!val) return
  
  const path = val.path
  const query = val.query
  
  if (path.startsWith('http')) {
    window.open(path, "_blank")
  } else {
    if (query) {
      router.push({ path: path, query: JSON.parse(query) })
    } else {
      router.push(path)
    }
  }

  search.value = ''
  options.value = []
  nextTick(() => {
    show.value = false
  })
}

function initFuse(list) {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'path',
      weight: 0.3
    }]
  })
}

/**
 * 获取正规路径
 */
function getNormalPath(p) {
  if (p.length > 1 && p.endsWith('/')) {
    return p.substring(0, p.length - 1)
  }
  return p
}

function generateRoutes(routes, basePath = '', prefixTitle = []) {
  let res = []

  for (const r of routes) {
    if (r.hidden) { continue }
    
    const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path
    const fullPath = r.path.startsWith('http') ? r.path : getNormalPath(basePath + p)
    
    const data = {
      path: fullPath,
      title: [...prefixTitle],
      icon: ''
    }

    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]
      data.icon = r.meta.icon
      if (r.redirect !== "noRedirect") {
        res.push(data)
      }
    }
    
    if (r.query) {
      data.query = r.query
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

function querySearch(query) {
  if (query !== '') {
    const results = fuse.value.search(query)
    options.value = results.map((item) => item.item)
  } else {
    options.value = []
  }
}

onMounted(() => {
  searchPool.value = generateRoutes(routes.value)
})

watch(searchPool, (list) => {
  initFuse(list)
})

watch(show, (value) => {
  if (value) {
    document.body.addEventListener('click', close)
  } else {
    document.body.removeEventListener('click', close)
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  display: flex;
  align-items: center;
  height: 100%;

  .search-icon-wrapper {
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 100%;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--el-fill-color-light);
    }
    
    .search-icon {
      font-size: 18px;
      color: var(--el-text-color-regular);
    }
  }

  .search-input-container {
    width: 0;
    overflow: hidden;
    transition: width 0.3s;
    display: flex;
    align-items: center;
  }

  &.show {
    .search-input-container {
      width: 210px;
      margin-left: 5px;
    }
    
    .search-icon-wrapper {
      background-color: var(--el-fill-color-light);
    }
  }

  .header-search-select {
    width: 100%;
    
    :deep(.el-select__wrapper) {
      background-color: transparent;
      box-shadow: none !important;
      border-bottom: 1px solid var(--el-border-color);
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;
      
      &.is-focused {
        border-bottom-color: var(--el-color-primary);
      }
    }
    
    :deep(.el-input__inner) {
      color: var(--el-text-color-primary);
    }
  }
}

.option-content {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  
  .option-title {
    font-size: 14px;
    line-height: 1.4;
    color: var(--el-text-color-primary);
  }
  
  .option-path {
    font-size: 12px;
    line-height: 1.2;
    color: var(--el-text-color-secondary);
    margin-top: 2px;
  }
}

:deep(.el-select-dropdown__item) {
  height: auto;
  line-height: normal;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
