import request from '@/utils/request'

export function findCourseInfoList(data) {
  return request({
    url: `/courseDetail/courseDetail/find`,
    method: 'post',
    data
  })
}

export function addCourseInfo(data) {
  return request({
    url: `/courseDetail/courseDetail/add`,
    method: 'post',
    data
  })
}

export function delCourseInfo(data) {
  return request({
    url: `/courseDetail/courseDetail/delete`,
    method: 'post',
    data
  })
}

export function updateCourseInfo(data) {
  return request({
    url: `/courseDetail/courseDetail/update`,
    method: 'post',
    data
  })
}

// 根据id查询课程
export function findCourseInfoID(data) {
  return request({
    url: `/courseDetail/courseDetail/find`,
    method: 'post',
    data
  })
}

// 模糊搜索
export function fuzzySearchOfCourseInfo(data) {
  return request({
    url: `/courseDetail/courseDetail/fuzzySearcheOfcourseDetail`,
    method: 'post',
    data
  })
}

// 下载模板文件
export function DLTemplate(data) {
  return request({
    url: `/courseLibrary/courseLibrary/download`,
    method: 'post',
    data,
    'responseType': 'arraybuffer'
  })
}

// ========2023.1.5 课程信息新需求=========
// 查找本课程的所有的学生
export function findCurrentCourseAllStuList(data) {
  return request({
    url: `/user/agencyCtr/findStuList`,
    method: 'post',
    data
  })
}
// 查找本课程的所有 勾选 的学生
export function findCurrentCourseAllCheckStu(data) {
  return request({
    url: `/courseDetail/courseDetail/findAllStu`,
    method: 'post',
    data
  })
}
// 班级与学生的模糊查询
export function searchAgencyAndStu(data) {
  return request({
    url: `/courseDetail/courseDetail/searchAgencyAndStu`,
    method: 'post',
    data
  })
}
// ========2023.1.5 课程信息新需求 完=========

