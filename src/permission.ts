import router from './router'
import store from './store/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth.js'
import { asyncRoutes } from '@/router/index'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = "测试" || 'getPageTitle(to.meta.title)'

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
      // console.log(store.state.user);
      
      if (hasRoles) {
        // console.log('next');
        
        next()
      } else {
        try {
          const { roleName } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleName)
          console.log('到这里',accessRoutes);
          
          // 添加动态路由
          accessRoutes.forEach(route => {
            // console.log(route);
            if(route.path==="*"){
              
            }else{
             router.addRoute(route)
            }
           
          })
          
          next()
        } catch (error) {
          
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
