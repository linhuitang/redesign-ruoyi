<template>
  <div v-if="!item.hidden">
    <!-- No children (or only one child shown as parent) -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <!-- 外链菜单：用 el-menu-item 保证样式一致，内部 <a> 负责跳转 -->
      <el-menu-item
        v-if="onlyOneChild.meta && isExternal(resolvePath(onlyOneChild.path))"
        index=""
        :class="{ 'submenu-title-noDropdown': !isNest }"
        class="external-link-item"
      >
        <a
          :href="resolvePath(onlyOneChild.path)"
          target="_blank"
          rel="noopener"
          class="external-link-anchor"
          @click.stop
        >
          <svg-icon v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          <template v-if="onlyOneChild.meta.title">
            <span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span>
          </template>
        </a>
      </el-menu-item>
      <!-- 内链菜单：正常使用 el-menu-item -->
      <app-link v-else-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <svg-icon v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          <template #title>
             <span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <!-- Submenu -->
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon" />
        <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppLink from './Link.vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref(null)

const hasOneShowingChild = (children = [], parent) => {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}

const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // 如果是绝对路径，直接返回
  if(routePath.startsWith('/')) {
    return routePath;
  }
  
  // 简单的路径拼接
  if (props.basePath === '') {
    return routePath
  }
  return props.basePath + (props.basePath.endsWith('/') ? '' : '/') + routePath
}

const hasTitle = (title) => {
  if (title.length > 5) {
    return title;
  } else {
    return "";
  }
}
</script>

<style scoped>
.menu-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 外链菜单：确保相对定位，以便 a 标签的伪元素能够覆盖整个菜单项 */
.external-link-item {
  position: relative;
  overflow: hidden;
}

/* 外链链接：样式继承与点击区域扩展 */
.external-link-anchor {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--el-menu-text-color) !important; /* 强制使用菜单文字颜色，覆盖浏览器默认链接色 */
  text-decoration: none; /* 去除下划线 */
  outline: none;

  /* 使用伪元素覆盖整个 el-menu-item (包括 padding)，使整个行可点击 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  /* 确保图标大小继承 */
  :deep(.el-icon) {
    color: inherit;
    font-size: 18px; /* 强制对齐内链菜单图标大小 */
    width: 24px;     /* Element Plus 默认图标容器宽度 */
    vertical-align: middle;
  }
}

.menu-title {
  margin-left: 5px; /* 缩小图标与文字的间距 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
