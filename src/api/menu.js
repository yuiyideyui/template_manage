import request from '@/utils/request'

// 获取全部的系统菜单 弃用
// export function getAllMenus() {
//   return request({
//     url: '/sys/menuCtr/allMenus',
//     method: 'post'
//   })
// }

// 获取全部的系统菜单
export function getAllMenus() {
  return request({
    url: '/sys/menuCtr/allMenus',
    method: 'post'
  })
}

// 获取角色对应的系统菜单
export function getUserMenu() {
  return request({
    url: '/sys/menuCtr/getMenu',
    method: 'post'
  })
}

// 获取菜单列表

// 最好是依据parent_id进行请求
export function getMenus(data) {
  return request({
    url: '/sys/menuCtr/menuList',
    method: 'post',
    data
  })
}

// 获取菜单权限列表
export function getPowerList(data) {
  return request({
    url: '/sys/menuCtr/menuPowerList',
    method: 'post',
    data
  })
}

// 新建菜单
export function createMenu(data) {
  return request({
    url: '/sys/menuCtr/createMenu',
    method: 'post',
    data
    // data:
    // {
    //     "id":1,
    //    "name":1,
    //    "parent_id": 0,
    //    "component": /sys/menu,
    //    "path":/sys,
    //    "weight":100,
    //     "fields":{
    //           add:100,
    //           edit:200,

    //           }
    //  }
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: '/sys/menuCtr/deleteMenu',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 更新菜单
export function updateMenu(data) {
  return request({
    url: '/sys/menuCtr/updateMenu',
    method: 'post',
    data
    // data
    // {
    //     "id":1,
    //    "name":1,
    //    "parent_id": 0,
    //    "component": /sys/menu,
    //    "path":/sys,
    //    "weight":100,
    //     "fields":{
    //           add:100,
    //           edit:200,

    //           }
    //  }
  })
}
