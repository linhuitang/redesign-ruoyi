import router from './router'
import { useUserStore } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'

const whiteList = ['/login', '/auth-redirect']

import { usePermissionStore } from '@/store/modules/permission'

router.beforeEach((to, from, next) => {
  const token = getToken()
  
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const userStore = useUserStore()
      if (userStore.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        userStore.getUserInfo().then(() => {
          const permissionStore = usePermissionStore()
          permissionStore.generateRoutes().then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            accessRoutes.forEach(route => {
              router.addRoute(route) // 动态添加可访问路由表
            })
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          userStore.logout().then(() => {
            ElMessage.error(err)
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`) // 否则全部重定向到登录页
    }
  }
})
