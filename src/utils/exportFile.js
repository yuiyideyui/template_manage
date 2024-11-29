// 下载模板或表
export function exportFile(res, name) {
  const link = document.createElement('a')
  const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
  const objUrl = URL.createObjectURL(blob)
  link.href = objUrl
  link.download = name
  link.click()
  URL.revokeObjectURL(objUrl)
  link.remove()
}
