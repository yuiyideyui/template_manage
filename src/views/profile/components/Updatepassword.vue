<template>
  <div>
    <el-form
      ref="resetForm"
      class="update-password"
      :model="resetForm"
      :rules="resetFormRules"
      status-icon
      label-width="100px"
    >
      <el-form-item label="旧密码：" prop="oldPsd">
        <el-input
          v-model.trim="resetForm.oldPsd"
          type="password"
          auto-complete="off"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码：" prop="firstPsd">
        <el-input
          v-model.trim="resetForm.firstPsd"
          type="password"
          auto-complete="off"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="secPsd">
        <el-input
          v-model.trim="resetForm.secPsd"
          type="password"
          auto-complete="off"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetPasswordForm('resetForm')">重置</el-button>
        <el-button
          type="primary"
          @click.native.prevent="showUpdatePassword"
        >修改</el-button>
      </el-form-item>
    </el-form>

    <!-- 修改密码模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="passwordDialogVisible"
      width="30%"
      center
    >
      <span>是否确认修改？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6-18位'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetForm.firstPsd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordDialogVisible: false,
      updateTimer: null, // 更新防抖
      resetTimer: null, // 重置防抖
      resetForm: {
        oldPsd: '',
        firstPsd: '',
        newpassword1: ''
      },
      resetFormRules: {
        oldPsd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        firstPsd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        secPsd: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    updatePassword() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          updatePassword(this.resetForm)
            .then((res) => {
              console.log(res)
              if (res.code !== 0) {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: '2000'
                })
                return false
              }
              if (res.code === 0) {
                this.$message.success('修改成功,3秒后跳转到首页！')
                this.$notify({
                  title: '修改成功',
                  dangerouslyUseHTMLString: true,
                  message: `
                    <div>用户名: ${res.data}</div>
                  `,
                  type: 'success'
                })
                setTimeout(() => {
                  this.backToDashboard() // 调用跳转到首页的方法
                }, 3000)
              }
            })
            .catch(() => {})
          this.passwordDialogVisible = false
        }
      })
    },

    async backToDashboard() {
      this.$router.push(`/dashboard`)
    },

    showUpdatePassword() {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          this.passwordDialogVisible = true
        }
      })
    },

    resetPasswordForm(formName) {
      if (this.resetTimer) {
        clearTimeout(this.resetTimer)
      }
      this.resetTimer = setTimeout(() => {
        this.$refs[formName].resetFields()
      }, 500)
    }
  }
}
</script>
<style lang="less" scope>
.el-form.update-password {
  width: 60%;
  margin: 50px auto 0;
  text-align: center;
  button {
    margin: 20px 0 0;
  }
}
</style>
