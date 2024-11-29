import request from '@/utils/request'

export function findRoleList(data) {
  return request({
    url: `/user/roleCtr/roleList`,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/user/roleCtr/updateRole`,
    method: 'post',
    data
  })
}

// 模糊搜索
export function fuzzySearchOfRole(data) {
  return request({
    url: `/user/roleCtr/fuzzySearchOfRole`,
    method: 'post',
    data
  })
}
