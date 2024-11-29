import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',

    // 登录端口
    url: '/user/loginCtr/login',
    method: 'post',
    data
  })
}

// 获取登录用户信息
export function getInfo() {
  return request({
    url: '/user/userCtr/getUserInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    // url: '/vue-element-admin/user/logout',

    // 退出登录接口
    url: '/user/loginCtr/logout',
    method: 'post'
  })
}

// 创建用户
export function addSUser(data) {
  return request({
    url: '/user/userCtr/addSUser',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/user/userCtr/updatePassword',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/user/userCtr/deleteUser',
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request({
    url: '/user/userCtr/updateUser',
    method: 'post',
    data
  })
}

// 更新用户2
export function updateSelfInfo(data) {
  return request({
    url: '/user/userCtr/updateSelfInfo',
    method: 'post',
    data
  })
}

// 用户列表
export function getUsers(data) {
  return request({
    url: '/user/userCtr/userList',
    method: 'post',
    data
  })
}
// data返回格式示例
// data:[
//   {
//     id:1, //现为login_code
//     username:"admin",
//     name:"小王",
//     avatar:null,
//     mobile:'123123',
//     remark: 'system init',
//     roles:[ "admin"], //可以不用
//     roleIds:[1],//同上
//   }
// ]

