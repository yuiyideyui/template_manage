<template>
  <div class="user-info">
    <el-col :span="6" style="margin-right: 40px">
      <div class="block" style="margin-top: 50px; width: 100%; text-align: center">
        <el-avatar shape="square" :size="120" :src="updateUserManageForm.avatar" />
        <p @click="changeAvatar"><a>更换头像</a></p>
      </div>
    </el-col>

    <!-- 点击图片弹出对话框 -->
    <el-dialog title="修改头像" :visible.sync="avatarDialogVisible" width="750px">
      <vueCropper ref="cropper" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.avatarDialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-upload" :loading="loadingBtn" @click="updateImg">确认更改</el-button>
      </span>
    </el-dialog>

    <!-- 个人信息展示 -->
    <el-col :span="14" style="border-left: solid 1px rgba(0, 0, 0, 0.3); padding-left: 0px">
      <el-form
        ref="UpdateUserManageForm"
        name="UpdateUserManageForm"
        :model="updateUserManageForm"
        :rules="userRules"
        label-width="auto"
        label-position="left"
      >
        <el-form-item label="用户角色:" label-width="220">
          <span style="position: absolute; left: 94px">
            {{ roles }}
          </span>
        </el-form-item>
        <el-form-item label="用户名称:" label-width="220" prop="name">
          <el-input
            v-model.trim="updateUserManageForm.name"
            :placeholder="updateUserManageForm.name"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item label="手机号码:" label-width="220" prop="mobile">
          <el-input
            v-model.trim="updateUserManageForm.mobile"
            :placeholder="updateUserManageForm.mobile"
            style="width: 80%"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          />
        </el-form-item>
        <el-form-item label="电子邮箱:" label-width="220" prop="email">
          <el-input
            v-model.trim="updateUserManageForm.email"
            :placeholder="updateUserManageForm.email"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('UpdateUserManageForm')">提交</el-button>
          <el-button @click="resetForm('UpdateUserManageForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateData } from '@/utils/changeData'
import { actionReminder } from '@/utils/reminder'
import vueCropper from './vueCropper.vue'
import { updateSelfInfo } from '@/api/user'

export default {
  name: 'UserInfo',
  // 上传图片组件
  components: {
    vueCropper
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名称不能为空'))
      } else {
        callback()
      }
    }
    var checkTel = (rule, val, callback) => {
      if (!val) {
        callback(new Error('内容不能为空'))
      } else if (!/^0?1[3|4|5|6|7|8][0-9]\d{8}$/.test(val)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, val, callback) => {
      if (val === '' || val == null) {
        callback(new Error('内容不能为空'))
      } else if (
        !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
          val
        )
      ) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      avatarDialogVisible: false,
      updateTimer: null, // 更新防抖
      resetTimer: null, // 重置防抖
      loadingBtn: false,
      updateUserManageForm: {
        agency_id: null,
        name: '',
        login_code: '',
        avatar: '',
        mobile: '',
        s_role_id: null,
        email: '',
        userId: ''
      },
      userRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        mobile: [{ validator: checkTel, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      }
    }
  },
  created() {
    for (const v in this.updateUserManageForm) {
      switch (v) {
        case 's_role_id':
          this.updateUserManageForm[v] = this.sRoleId
          break
        case 'login_code':
          this.updateUserManageForm[v] = this.loginCode
          break
        case 'agency_id':
          this.updateUserManageForm[v] = this.agencyId
          break
        case 'userId':
          this.updateUserManageForm[v] = this.userId
          break
        default:
          this.updateUserManageForm[v] = this[v]
          break
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'agencyId',
      'mobile',
      'roles',
      'avatar',
      'sRoleId',
      'email',
      'loginCode',
      'userId'
    ])
  },
  methods: {
    // ========更改头像模块========
    changeAvatar() {
      this.avatarDialogVisible = true
    },

    // 上传头像确认按钮
    async updateImg() {
      this.loadingBtn = true
      await this.$refs.cropper.uploadImg('blob')
      this.loadingBtn = false
      this.avatarDialogVisible = false
      const timer = setTimeout(() => {
        location.reload()
        clearTimeout(timer)
      }, 500)
    },
    // ========更改头像模块结束========

    // ========更改个人信息模块========

    submitForm(formName, that) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
      }
      this.updateTimer = setTimeout(() => {
        that || (that = this)
        that.$refs[formName].validate(async(valid) => {
          if (valid) {
            const res = await updateSelfInfo(this.updateUserManageForm)
            if (res && res.code === 0) {
              actionReminder(res, that)
              this.$store.dispatch('user/getInfo')
            } else {
              that.isSubmitError = res
              that.hasErrorMessage = false
              that.errorMessage = ''
            }
          }
        })

        // updateData(formName, that, true).then((res) => {
        //   if (res.code || res.code === 0) {
        //     actionReminder(res, that)
        //   } else {
        //     that.isSubmitError = res
        //     that.hasErrorMessage = false
        //     that.errorMessage = ''
        //   }
        // })
      }, 500)
    },

    resetForm(formName) {
      if (this.resetTimer) {
        clearTimeout(this.resetTimer)
      }
      this.resetTimer = setTimeout(() => {
        this.$refs[formName].resetFields()
        this.$message({
          message: '重置成功',
          type: 'success'
        })
      }, 500)
    }
  }
}
</script>

<style lang="scss" scope>
.user-info {
  .el-form {
    width: 60%;
    height: 100%;
    margin-top: 20px;
    margin-left: 40px;
    text-align: center;

    .el-form-item__error {
      left: 80px;
    }
  }

  p a {
    color: #0363c4;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
