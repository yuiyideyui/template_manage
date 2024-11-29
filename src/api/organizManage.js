import request from '@/utils/request'

export function findOrganizList(data) {
  return request({
    url: `/user/agencyCtr/list`,
    method: 'post',
    data
  })
}

export function findOrganizTreeList(data) {
  return request({
    url: `/user/agencyCtr/dataTree`,
    method: 'post',
    data
  })
}

export function addOrganiz(data) {
  return request({
    url: `/user/agencyCtr/add`,
    method: 'post',
    data
  })
}

export function delOrganiz(data) {
  return request({
    url: `/user/agencyCtr/delete`,
    method: 'post',
    data
  })
}

export function updateOrganiz(data) {
  return request({
    url: `/user/agencyCtr/update`,
    method: 'post',
    data
  })
}

// 根据id查询组织
export function findOrganizByID(data) {
  return request({
    url: `/user/agencyCtr/findAgency`,
    method: 'post',
    data
  })
}

// 模糊搜索
export function fuzzySearchOfOrganiz(data) {
  return request({
    url: `/user/agencyCtr/searchOfAgency`,
    method: 'post',
    data
  })
}
