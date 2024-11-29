import { lowerInitial, upperInitial, typeFilter } from './changeDataForm'
import { actionReminder } from './reminder'
import { Message } from 'element-ui'
// ========用户进行数据更新行为的回调========

// 添加与编辑 isType是判断type
export function updateData(formName, that, noList, isType) {
  return new Promise((resolve) => {
    const newLook = lowerInitial(formName)
    const type = typeFilter(formName)
    const action = newLook.slice(0, -4) + 'Action'
    let formContent = null

    // console.log('添加与编辑-->', that.addCourseInfoForm);

    if (noList) {
      console.log(1)
      formContent = that[newLook]
      console.log('formContent', formContent)
    } else {
      console.log(2)
      formContent = { list: [that[newLook]] }
    }
    const arr = []
    let trigger = null

    that.$refs[formName].validate((valid) => {
        console.log('valid', valid)
      console.log(formName)
      if (valid) {
        if (formName == 'AddCourseInfoForm') {
          if (that.addCourseInfoForm.stuList.length == 0) {
            Message('没有勾选学生，无法新增')
            return
          }
        }
        // if (formName == 'UpdateCourseInfoForm') {
        //   if (that.updateCourseInfoForm.stuList == undefined) {
        //     Message('没有勾选学生，无法编辑')
        //     return
        //   }
        // }

        console.log(3)
        console.log(formContent)
        console.log('`${type}/${action}`', `${type}/${action}`)
        if (typeof isType == 'boolean') {
            formContent.type = isType
        }
        const result = that.$store.dispatch(`${type}/${action}`, formContent)
          .then((res) => {
            console.log(4)
            console.log(res)
            if (res.code === 0) {
              that.$emit('setLoading') // 表格进入加载状态
              that.$store.commit(`${type}/set_goreset`)
              console.log(5)
              that[`${newLook}Visible`] = false
              that.$refs[formName].resetFields()
              trigger = {
                code: res.code,
                data: res.data
              }
              return trigger
            } else {
              console.log(6)
              console.log('Error')
              console.log(res)
              that.errorMessage = res.msg
              that.hasErrorMessage = true
              that.isSubmitError = false
              trigger = {
                code: res.code,
                msg: res.msg
              }
              return trigger
            }
          })
        console.log(7)
        arr.push(result)
      } else {
        console.log('error submit!!')
        trigger = true
      }
    })
    Promise.all(arr).then(() => {
      resolve(trigger)
    })
  })
}

// 点击取消时的回调
export function submitCancelCallback(formName, that) {
  const newLook = lowerInitial(formName)
  that[`${newLook}Visible`] = false
  that.isSubmitError = false
  that.hasErrorMessage = false
  that.errorMessage = ''
  that.$refs[formName].resetFields()
}

// 批量删除
export async function batchDel(name, that) {
  console.log(that[`${name}Selections`])
  if (that[`${name}Selections`][0]) {
    const upperName = upperInitial(name)
    for (
      let i = 0, count = 0, len = that[`${name}Selections`].length;
      i < len;
      i++
    ) {
      const val = { list: [that[`${name}Selections`][i].id] }
      await that.$store.dispatch(`${name}/del${upperName}Action`, val).then((res) => {
        count++
        if (count === len) {
          console.log(`refresh${upperName}List`)
          that[`refresh${upperName}List`]()
          actionReminder(res, that)
          that[`${name}Selections`] = []
        }
      })
    }
  }
}
