import request from '@/utils/request'

// 获取配置列表
export function getConfig(data) {
  return request({
    url: '/sys/sysCtr/list',
    method: 'post',
    data
  })
}
// 请求格式
// {
//   page:1,
//   limit:10

// }
// 添加系统配置
export function addConfig(data) {
  return request({
    url: '/sys/sysCtr/addConfig',
    method: 'post',
    data
  })
}
// 请求格式
// {
//     "name":微信apppid,
//     "filed": "wx_appid",
//     "value": s103132fw9204203132,
//     "group_name":"wechat",
//     "status":1,
//      "remark":"备注一下"
//   }

// 更新系统配置
export function updateConfig(data) {
  return request({
    url: `/sys/sysCtr/updateConfig`,
    method: 'post',
    data
  })
}

// 删除配置
export function deleteConfig(data) {
  return request({
    url: `/sys/sysCtr/deleteConfig`,
    method: 'post',
    data
  })
}
