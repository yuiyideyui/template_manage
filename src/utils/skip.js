// 用户填写表单enter时的回调
export default {
  skipInput(e, that) {
    const theForm = e.target.form
    const formName = theForm.name
    const inputs = theForm.querySelectorAll('input')
    const len = inputs.length
    const string = `submit${formName}`
    console.log(string)
    const SubmitMethod = that.$options.methods[string]
    for (let i = 0; i < len; i++) {
      if (i == len - 1) {
        SubmitMethod(`${formName}`, that)
        break
      } else if (e.target == inputs[i]) {
        inputs[i + 1].focus()
        SubmitMethod(`${formName}`, that)
        break
      }
    }
  }
}
