<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])

const getBreadcrumb = () => {
  let matched = []
  
  // 如果有 activeMenu，先找到父级面包屑
  if (route.meta.activeMenu) {
    const parentRoute = router.resolve(route.meta.activeMenu)
    if (parentRoute && parentRoute.matched && parentRoute.matched.length > 0) {
      matched = parentRoute.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    }
  }
  
  // 如果没有找到 activeMenu 对应的面包屑，则使用当前路由的 matched
  if (matched.length === 0) {
    matched = route.matched.filter(item => item.meta && item.meta.title)
  } else {
    // 否则，将当前页面的 title 追加到末尾
    if (route.meta && route.meta.title) {
      matched.push({
        path: route.path,
        meta: route.meta
      })
    }
  }

  // 始终添加主页作为第一项
  const homeItem = { path: '/', meta: { title: '首页' } }
  
  // 如果当前就是主页根路径，只显示主页
  if (route.path === '/dashboard') {
    breadcrumbs.value = [homeItem]
  } else {
    // 否则，主页 + 当前路由层级
    breadcrumbs.value = [homeItem].concat(matched)
  }
}

const handleLink = (item) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(path)
}

watch(() => route.path, () => {
  getBreadcrumb()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 12px;
  line-height: 50px;

  .no-redirect {
    color: var(--td-text-color-placeholder);
    cursor: text;
  }

  a {
    color: var(--td-text-color-secondary);
    font-weight: normal;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      color: var(--td-brand-color);
    }
  }
}

:deep(.el-breadcrumb__separator) {
  color: var(--td-text-color-placeholder);
  margin: 0 8px;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--td-text-color-placeholder);
}
</style>
