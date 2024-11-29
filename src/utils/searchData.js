import { upperInitial } from './changeDataForm'
// ========搜索与重置========

// 搜索
export function searchTargetCallback(formName, type, val, that) {
    console.log('val', val)
  const upperType = upperInitial(type)
  console.log('upperType', type, upperType)
  that.$refs[formName].validate((valid) => {
    if (valid) {
        if (val?.form) {
            val.form = { ...val.form, ...val }
        }
      that.$store
        .dispatch(`${type}/search${upperType}Action`, val)
        .then((res) => {
          console.log(res)
          if (res[0]) {
            return
          } else {
            console.log('searchTargetCallback')
            // that.$emit('setLoading') // 表格停止加载状态
            // console.log('val==============', val)
            if (val?.form) {
                if (val?.form.currentPage > 1) {
                    --val.form.currentPage
                    searchTargetCallback(formName, type, val, that)
                } else if (val?.currentPage > 1) {
                    --val.currentPage
                    searchTargetCallback(formName, type, val, that)
                }
            }

            // that.showTip()
          }
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 重置
export function resetFormCallback(formName, type, that) {
  that.$refs[formName].validate((valid) => {
    if (valid) {
      that.$store.commit(`${type}/set_goreset`)
    } else {
      console.log('error submit!!')
      return false
    }
  })
  that.clearInput()
  that.$refs[formName].resetFields()
}
