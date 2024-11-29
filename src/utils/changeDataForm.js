// ========转换数据格式和形式的方法========

// 首字母变小写
export function lowerInitial(oldLook) {
  const initial = oldLook[0].toLowerCase()
  const subsequent = oldLook.slice(1)
  const newLook = initial + subsequent
  return newLook
}
// 首字母变大写
export function upperInitial(oldLook) {
  const initial = oldLook[0].toUpperCase()
  const subsequent = oldLook.slice(1)
  const newLook = initial + subsequent
  return newLook
}
// 修剪字符串
export function typeFilter(name) {
  let oldLook = name.replace('Add', '')
  oldLook = oldLook.replace('Form', '')
  oldLook = oldLook.replace('Update', '')
  return lowerInitial(oldLook)
}

// 转换日期为字符串形式
export function dateToString(val) {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? '0' + (date.getDate()) : (date.getDate())
  const hour = date.getHours() < 10 ? '0' + (date.getHours()) : (date.getHours())
  const minute = date.getMinutes() < 10 ? '0' + (date.getMinutes()) : (date.getMinutes())
  const second = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : (date.getSeconds())
  const dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  return dateTime
}
