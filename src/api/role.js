import request from '@/utils/request'

// export function getRoutes() {
//   return request({
//     url: '/vue-element-admin/routes',
//     method: 'get'
//   })
// }

// 获取角色信息列表
export function getRoles(data) {
  return request({
    url: '/user/roleCtr/roleList',
    method: 'post',
    data
  })
}
// 请求格式
// {
//   page:1,
//   limit:10

// }
// 新建角色
export function addRole(data) {
  return request({
    url: '/user/roleCtr/addRole',
    method: 'post',
    data
  })
}
// 请求格式
// {
//   name:sakf,
//   contain_menu:[3,4,5]
//   sort:90,
//   menu_weight:100,
//   login_weight:100,
//   remark:"这个是别墅"
// }

// 更新角色
export function updateRole(data) {
  return request({
    url: `/user/roleCtr/updateRole`,
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: `/user/roleCtr/deleteRole`,
    method: 'post',
    data
  })
}
