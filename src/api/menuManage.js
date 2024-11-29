import request from '@/utils/request'

export function findMenuList(data) {
  return request({
    url: `/sys/menuCtr/getMenu`,
    method: 'post',
    data
  })
}

// 模糊搜索
export function fuzzySearchOfMenu(data) {
  return request({
    url: `/sys/menuCtr/fuzzySearchOfMenu`,
    method: 'post',
    data
  })
}
