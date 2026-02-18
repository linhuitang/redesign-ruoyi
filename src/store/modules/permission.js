import { defineStore } from 'pinia'
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index.vue'
import ParentView from '@/layout/components/ParentView/index.vue'
import InnerLink from '@/layout/components/InnerLink/index.vue'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    setSidebarRoutes(routes) {
      this.sidebarRouters = routes
    },
    generateRoutes(roles) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          // sdata 用于侧边栏展示（保留外链菜单）
          const sdata = JSON.parse(JSON.stringify(res.data))
          // rdata 用于注册 Vue Router 路由（过滤外链，防止路径格式报错）
          const rdata = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata, false, false, true)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true, false)
          this.setRoutes(rewriteRoutes)
          this.setSidebarRoutes(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(constantRoutes.concat(sidebarRoutes))
          resolve(rewriteRoutes)
        })
      })
    }
  }
})

/**
 * 遍历后台传来的路由字符串，转换为组件对象
 * @param {Array}   asyncRouterMap  路由数组
 * @param {Boolean} lastRouter      上一级路由（用于 filterChildren）
 * @param {Boolean} type            是否展平子路由（注册路由时为 true）
 * @param {Boolean} keepExternal    是否保留外链菜单（侧边栏展示时为 true）
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false, keepExternal = false) {
  return asyncRouterMap.filter(route => {
    // 外链路由（path 以 http/https 开头）：
    //   - 侧边栏模式（keepExternal=true）：保留，Link.vue 会渲染为 <a> 标签
    //   - 注册路由模式（keepExternal=false）：过滤掉，避免 Vue Router 报错
    const isExternalLink = route.path && (route.path.startsWith('http://') || route.path.startsWith('https://'))
    if (isExternalLink && !keepExternal) {
      return false
    }
    // 外链菜单不需要处理 component，直接保留
    if (!isExternalLink) {
      if (type && route.children) {
        route.children = filterChildren(route.children)
      }
      if (route.component) {
        // Layout ParentView 组件特殊处理
        if (route.component === 'Layout') {
          route.component = Layout
        } else if (route.component === 'ParentView') {
          route.component = ParentView
        } else if (route.component === 'InnerLink') {
          route.component = InnerLink
        } else {
          route.component = loadView(route.component)
        }
      }
      if (route.children != null && route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, route, type, keepExternal)
      } else {
        delete route['children']
        delete route['redirect']
      }
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children.push(c)
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore
