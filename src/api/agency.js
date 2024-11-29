import request from '@/utils/request'

// 获取机构列表
export function getAgency(data) {
  return request({
    url: `/user/agencyCtr/list`,
    method: 'post',
    data
  })
}
// 请求格式{
// page:1,
// limit:10
// }

// 新建机构
export function addAgency(data) {
  return request({
    url: `/user/agencyCtr/add`,
    method: 'post',
    data
  })
}

// 请求格式
// {
//     name:sakf,
//     parent_id:2,
//     remark:"sdaad"
// }

// 更新机构
export function updateAgency(data) {
  return request({
    url: `/user/agencyCtr/update`,
    method: 'post',
    data
  })
}

// 请求格式
// {
//     id：sakf,
//     name:asdas,
//     parent_id:dasda,
//     remark:ads
// }

// 删除机构
export function deleteAgency(data) {
  return request({
    url: `/user/agencyCtr/delete`,
    method: 'post',
    data
  })
}
// 请求示例
// {
//     id：3
// }

// 机构树
export function dateTree(data) {
  return request({
    url: `/user/agencyCtr/dataTree`,
    method: 'post',
    data
  })
}
