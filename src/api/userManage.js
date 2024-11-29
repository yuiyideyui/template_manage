import request from '@/utils/request'

export function findUserList(data) {
  return request({
    url: `/courseLibrary/courseLibrary/findAllTeacher`,
    method: 'post',
    data
  })
}

// 根据机构获取用户信息
export function findUserListWithAgency(data) {
  return request({
    url: `/user/userCtr/getUserInfoByAgencyId`,
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: `/user/userCtr/addSUser`,
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: `/user/userCtr/deleteUser`,
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/user/userCtr/updateUser`,
    method: 'post',
    data
  })
}

// 根据id查询用户个人信息
export function findUserByID(data) {
  return request({
    url: `/user/userCtr/getUserInfo`,
    method: 'post',
    data
  })
}

// 更改头像
/* export function updateAvatar(data) {
  return request({
    url: `/user/userCtr/updatePicture`,
    method: 'post',
    data
  })
} */

// 更改用户管理头像
export function updateUsersAvatar(data) {
  return request({
    url: `/user/userCtr/uploadPicture`,
    method: 'post',
    data
  })
}

// 对用户进行模糊搜索
export function fuzzySearchOfUser(data) {
  return request({
    url: `/user/userCtr/fuzzySearchOfUser`,
    method: 'post',
    data
  })
}
