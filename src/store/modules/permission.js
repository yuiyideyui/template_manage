// 原文件代码
import { asyncRoutes, constantRoutes, constantRoutes2 } from '@/router'
import { getUserMenu } from '@/api/menu'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes, constantRoutes2)
  }
  // SET_POWERS:
}
// /**
//  * 后台查询的菜单数据拼装成路由格式的数据
//  * @param routes
//  */
function filterMenus(localMenus, remoteMenus) {
  const res = []
  localMenus.forEach(local => {
    remoteMenus.forEach(remote => {
      // console.log('remote and local', remote, local)
      if (local.path !== undefined && remote.path === local.path) {
        // 替换一级菜单的role
        // console.log('remote', remote)
        local.meta.title = remote.name
        local.meta.roles = remote.roles
        local.meta.icon = remote.icon
        local.meta.powers = remote.powers
        if (local.children && remote.children) {
          local.children = filterMenus(local.children, remote.children)
        }
        res.push(local)
      }
    })
  })
  return res
}
// function generaMenu(routes, data) {
//   data.forEach(item => {
//     let menu = {
//       path: item.path,
//       component:() => import(`@/views${item.component}`),
//       hidden: item.hidden === 1? true : false,
//       children: item.children,
//       name: item.name,
//       meta: { title: item.name, id: item.id, icon:item.icon, roles: ['admin'] }
//     }
//     if (item.children) {
//       generaMenu(menu.children, item.children)
//     }
//     routes.push(menu)
//   })
// }

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 获取角色对应的系统菜单，如果是系统管理员角色，则显示全部已经预渲染好的路由 --> 失效
      getUserMenu().then(res => {
        const remoteRoutes = res.data
        // console.log(remoteRoutes)
        let accessedRoutes
        // console.log(roles)
        if (roles === '系统管理员') {
          accessedRoutes = asyncRoutes || []
        } else {
          console.log('走到筛选routes区')
          console.log('asyncRoutes', remoteRoutes)
          accessedRoutes = filterMenus(asyncRoutes, remoteRoutes) || []
        }
        // console.log('accessedRoutes', accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
