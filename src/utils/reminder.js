// 操作成功或失败返回提醒
export function actionReminder(judge, that) {
  if (judge.code === 0) {
    that.$message({
      message: judge.data,
      type: 'success'
    })
  } else {
    that.$message.error(judge.msg)
  }
}
