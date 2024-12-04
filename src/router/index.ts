
 

/* Layout */
import Layout from '@/layout/index.vue'
 
export const constantRoutes = [ 
  {
    path: '/redirect', 
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }   
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    hidden: true
  },
  {
    path: '/404',
    // component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    // component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      { 
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'Printer', affix: true }
      }
    ]
  },
   
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/userManage',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'Tickets',
      roles: ['超级管理员', 'admin', 'editor']
    },
    children: [
      {
        path: 'userManage',
        component: () => import('@/views/courseManage/courseLib.vue'),
        name: 'userManage',
        meta: { title: '账号管理', icon: 'Document', noCache: true }
      },
      {
        path: 'roleManage',
        component: () => import('@/views/courseManage/courseInfo.vue'),
        name: 'roleManage1',
        meta: { title: '角色管理', icon: 'Notebook', noCache: true }
      }
    ]
  },
  {
    path: '/partyEvaluation',
    component: Layout,
    redirect: '/partyEvaluation/dataManagement',
    alwaysShow: true, // will always show the root menu
    name: 'partyEvaluation',
    meta: {
      title: '党员评价',
      icon: 'lock',
      roles: ['超级管理员', 'admin', 'editor'] 
    },
    children: [
      {
        path: 'dataManagement',
        component: () => import('@/views/partyEvaluation/dataManagement.vue'),
        name: 'dataManagement',
        meta: {
          title: '数据管理',
          icon: 'education',
          roles: ['超级管理员', 'admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'evaluationResults',
        component: () => import('@/views/partyEvaluation/evaluationResults.vue'),
        name: 'evaluationResults',
        meta: {
          title: '评价结果',
          icon: 'tree-table',
          roles: ['超级管理员', 'admin']
        }
      }
    ]
  }
] as any

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/roleManage',
    component: Layout,
    redirect: '/roleManage',
    children: [
      {
        path: 'roleManage',
        // component: () => import('@/views/roleManage/index.vue'),
        name: 'roleManage',
        meta: { title: '角色管理', icon: 'User', affix: false }
      }
    ]
  },
  {
    path: '/organizManage',
    component: Layout,
    redirect: '/organizManage',
    children: [
      {
        path: 'organizManage',
        // component: () => import('@/views/organizManage/index.vue'),
        name: 'organizManage',
        meta: { title: '组织管理', icon: 'Operation', affix: false }
      }
    ]
  },
  {
    path: '/menuManage',
    component: Layout,
    redirect: '/menuManage',
    children: [
      {
        path: 'menuManage',
        // component: () => import('@/views/menuManage/index.vue'),
        name: 'menuManage',
        meta: { title: '菜单管理', icon: 'list', affix: false }
      }
    ]
  },
  
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404' }}
]

export const constantRoutes2 = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/profile/index.vue'),
        name: 'profile',
        meta: { title: '个人中心', icon: 'user', affix: false }
      }
    ]
  }
]

export const defaultroutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '系统设置',
      icon: 'lock',
      roles: ['超级管理员', 'admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        // component: () => import('@/views/permission/user.vue'),
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['超级管理员', 'admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'roles',
        // component: () => import('@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          icon: 'tree-table',
          roles: ['超级管理员', 'admin']
        }
      },
      {
        path: 'menu',
        // component: () => import('@/views/permission/menu.vue'),
        name: 'Menu',
        meta: {
          title: '菜单管理',
          icon: 'list',
          roles: ['系统管理员', 'admin']
        }
      },
      {
        path: 'config',
        // component: () => import('@/views/permission/config.vue'),
        name: 'Config',
        meta: {
          title: '系统配置',
          icon: 'size',
          roles: ['系统管理员', 'admin']
        }
      },
      {
        path: 'agency',
        // component: () => import('@/views/permission/agency.vue'),
        name: 'Agency',
        meta: {
          title: '机构管理',
          icon: 'qq',
          roles: ['系统管理员', 'admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404' }}
]
import { createRouter, createWebHistory  } from 'vue-router'
// console.log([...constantRoutes, ...constantRoutes2]);

const createRouterInstance = () => {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 创建基于 HTML5 History 模式的路由
    scrollBehavior: () => ({ y: 0 }), // 每次路由切换时，页面滚动到顶部
    routes: [...constantRoutes2,...constantRoutes], // 合并路由配置
  })
}

const router = createRouterInstance();


 
export function resetRouter() {
  const newRouter = createRouterInstance() // 创建新的路由实例
  router.matcher = newRouter.matcher // 重置现有路由的 matcher
}
export default router

 


