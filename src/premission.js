// permission.js
import router from '@/router'
import store from '@/store'
import Bus from "@/utils/bus";
import {
  Message
} from 'element-ui'

const whiteList = ['/login', '/regist'] // 不重定向白名单

const getRolesFn = (to, from, next) => {
  // getRolesFn=(to,from,next,flag)  没加/cdn之前
  // (store.getters.roles.length === 0||flag)
  if (store.getters.roles.length === 0) {
    store.dispatch('GetUserPerms').then(res => { // 拉取用户信息
      store.dispatch('GenerateRoutes').then(res => { // 根据roles权限生成可访问的路由表
        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
        next({
          ...to,
          replace: true
        }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      })
    })
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/regist') {
    store.dispatch('CleenAllState')
    Bus.$emit('loginOut', true)
    next()
  } else {
    if (!localStorage.getItem('token')) {
      next({
        path: '/'
      })
    }
    document.onkeydown = null
    let token = localStorage.getItem('token')
    let userString = decodeURIComponent(escape(window.atob(token.split('.')[1])))
    let flag = JSON.parse(userString).username !== store.getters.userInfo.username
    // console.log(flag, 111111)
    if (!store.getters.userInfo.username || flag) {
      store.dispatch('GetUserInfo').then(res => {
        Bus.$emit('loginIn', true)
        getRolesFn(to, from, next)
        //  getRolesFn(to,from,next,flag)  没加/cdn之前
      })
    } else {
      getRolesFn(to, from, next)
    }
  }
  /*if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        console.log('roles====0')
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          console.log('roles?', roles)
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            console.log('addrouters', store.getters.addRouters)
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        console.log('====1')
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }*/
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})