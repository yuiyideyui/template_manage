<template>
  <div class="emendation">
    <el-button type="primary" @click="addUserManageFormVisible = true">
      新增用户
    </el-button>
    <el-button type="danger" :disabled="isDisabled" @click="batchDelDialogVisible = true">
      批量删除
    </el-button>

    <!-- 新增用户 -->
    <el-dialog
      class="user-modal"
      title="新增用户"
      :visible.sync="addUserManageFormVisible"
      center
      width="40%"
      @close="submitCancel('AddUserManageForm')"
    >
      <el-form
        ref="AddUserManageForm"
        name="AddUserManageForm"
        :model="addUserManageForm"
        :rules="userRules"
        label-width="120px"
        label-position="right"
        status-icon
      >
        <transition-group name="submitErrorTransition">
          <p v-show="isSubmitError" key="1" class="submitError">
            提交失败，请检查表格
          </p>
          <p v-show="hasErrorMessage" key="2" class="submitError">
            {{ errorMessage }}
          </p>
        </transition-group>
        <el-form-item label="头像" prop="avatar" style="margin-top: 20px">
          <el-upload
            ref="avatarUpload"
            class="avatar-uploader"
            :action="uploadPicUrl"
            :headers="myHeader"
            accept=".jpg,.jpeg,.png,.JPG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="margin-left: 10px; width: 80%"
          >
            <img v-if="addUserManageForm.avatar" :src="addUserManageForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户类型" prop="s_role_id">
          <el-select
            v-model="addUserManageForm.s_role_id"
            placeholder="请选择用户类型"
            style="margin-left: 10px; width: 80%"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input
            v-model.trim="addUserManageForm.name"
            placeholder="请输入用户名称"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录账号" prop="login_code">
          <el-input
            v-model.trim="addUserManageForm.login_code"
            placeholder="请输入登录账号"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model.trim="addUserManageForm.password"
            type="password"
            placeholder="请输入登录密码"
            style="margin-left: 10px; width: 80%"
            show-password
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input
            v-model.trim="addUserManageForm.mobile"
            type="tel"
            placeholder="请输入电话号码"
            style="margin-left: 10px; width: 80%"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="addUserManageForm.email"
            type="email"
            placeholder="请输入邮箱"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitCancel('AddUserManageForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddUserManageForm('AddUserManageForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认批量删除 -->
    <el-dialog title="提示" :visible.sync="batchDelDialogVisible" width="30%">
      <span>是否确认进行批量删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delIndeed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters
  } from 'vuex'
  import {
    updateData,
    submitCancelCallback
  } from '@/utils/changeData'
  import {
    actionReminder
  } from '@/utils/reminder'
  import XLSX from 'xlsx'
  import skip from '@/utils/skip'
  export default {
    name: 'Emendation',
    props: ['rules', 'userTypeOptions', 'uploadPicUrl'],
    data() {
      // 用户名称验证方法
      var validateName = function(rule, value, callback) {
        // var regEn = /[`!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
        var regEn = /[`!@#$%^&*()+<>?:"{},.\/;'[\]]/im
          var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        if (regEn.test(value) || regCn.test(value)) {
          return callback(new Error('用户名称不能含有特殊字符!'))
        } else if (value == '') {
          return callback(new Error('用户名称不能为空!'))
        } else {
          callback()
        }
      }
      return {
        addUserManageFormVisible: false,
        isDisabled: true, // 批量删除按钮是否禁用
        batchDelDialogVisible: false,
        isSubmitError: false,
        hasErrorMessage: false,
        errorMessage: '',
        addUserManageForm: {
          avatar: '', // 用户上传后返回的头像路径
          s_role_id: '', // 角色类型
          name: '',
          login_code: '',
          password: '',
          mobile: '',
          email: ''
        },
        userRules: {
          // avatar: [{ validator: this.rules.checkContent, trigger: "blur" }],
          s_role_id: [{
            required: true,
            validator: this.rules.checkContent,
            trigger: 'blur'
          }],
          name: [{
            required: true,
            validator: validateName,
            trigger: 'blur'
          }],
          login_code: [{
            required: true,
            validator: this.rules.checkContent,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: this.rules.checkNewPassword,
            trigger: 'blur'
          }],
          mobile: [{
            validator: this.rules.checkTel,
            trigger: 'blur'
          }],
          email: [{
            validator: this.rules.checkEmail,
            trigger: 'blur'
          }]
        }
      }
    },
    watch: {
      goabled() {
        this.isDisabled = this.$store.state.userManage.goabled
      }
    },
    methods: {
      // ========新增用户模块========
      submitAddUserManageForm(formName, that) {
        that || (that = this)
        console.log(formName)
        console.log(that.addUserManageForm)
        // 第四的true是为了给后端判断是否必填工号--前面的不知道
        updateData(formName, that, true, false).then((res) => {
          if (res.code || res.code === 0) {
            actionReminder(res, this)
          } else {
            that.isSubmitError = res
            that.hasErrorMessage = false
            that.errorMessage = ''
          }
        })
      },

      // 将上传的图片路径存起来
      handleAvatarSuccess(res, file) {
        this.addUserManageForm.avatar = '/manager/prod-api' + res.data
      },

      // 限制上传头像图片大小
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },

      // 取消新增页面
      submitCancel(formName) {
        submitCancelCallback(formName, this)
      },
      // ========新增用户模块结束========

      // 转换单元格地址
      encodeCell(r, c) {
        return XLSX.utils.encode_cell({
          r,
          c
        })
      },

      // 批量删除
      delIndeed() {
        this.$store.commit('userManage/set_godelete')
        this.batchDelDialogVisible = false
      },

      // 用户填写表单按下enter时的回调
      skipInput(e) {
        skip.skipInput(e, this)
      }
    },
    computed: {
      ...mapState('userManage', ['goabled']),
      ...mapGetters(['myHeader'])
    }
  }

</script>

<style lang="scss" scoped>
  .emendation {
    position: relative;
    margin: 10px 20px;

    button {
      padding: 0;
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 13px;
    }

    // 新增框样式
    .el-dialog.user-modal {

      .submitErrorTransition-enter-active,
      .submitErrorTransition-leave-active {
        transition: opacity 0.5s;
      }

      .submitErrorTransition-enter,
      .submitErrorTransition-leave-to {
        opacity: 0;
      }
    }

    .submitError {
      position: absolute;
      top: 40px;
      left: 160px;
      color: rgba(255, 0, 0, 0.8);
    }

    .user-modal::v-deep {

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    }

    .user-modal::v-deep input[type="number"] {
      -moz-appearance: textfield;
    }

    // 导入课表对话框样式
    .import-modal .course-upload {
      text-align: center;
    }
  }

  // 上传头像样式
  .avatar-uploader {
    ::v-deep {
      .el-upload {
        margin-top: -15px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .el-upload:hover {
        border-color: #409eff;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 58px;
    height: 58px;
    line-height: 58px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
