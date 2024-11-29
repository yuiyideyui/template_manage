<template>
  <div class="table">
    <el-table
      v-loading="isLoading"
      :data="userList"
      style="width: 100%; font-size: 13px"
      row-key="id"
      border
      @selection-change="userSelectionsChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column
        prop="name"
        label="用户名称"
        width="120"
        align="center"
      />
      <el-table-column
        prop="s_role_id"
        label="用户角色"
        width="100"
        align="center"
      />
      <el-table-column prop="avatarUrl" label="头像" width="80" align="center">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center">
            <el-avatar
              shape="square"
              size="medium"
              fit="scale-down"
              :src="scope.row.avatarUrl"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="login_code" label="登录账号" align="center" />
      <el-table-column
        prop="mobile"
        label="电话号码"
        width="120"
        align="center"
      />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column
        prop="updatedAt"
        label="更新时间"
        width="150"
        align="center"
      />

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showUpdateUserForm(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="scope.row.s_role_id === '系统管理员'"
            @click="delUser(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :page-size="8"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        background
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑用户信息弹出框 -->
    <el-dialog
      class="userModal"
      title="编辑用户信息"
      :visible.sync="updateUserManageFormVisible"
      center
      width="40%"
      @close="submitCancel('UpdateUserManageForm')"
    >
      <el-form
        ref="UpdateUserManageForm"
        name="UpdateUserManageForm"
        :model="updateUserManageForm"
        :rules="userRules"
        label-width="120px"
        label-position="right"
        size="small"
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
        <el-form-item label="头像" prop="avatar">
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
            <img
              v-if="this.updateUserManageForm.avatar"
              :src="this.updateUserManageForm.avatar"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户类型" prop="s_role_id">
          <el-select
            v-model="updateUserManageForm.s_role_id"
            placeholder="请选择搜索类型"
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
            v-model.trim="updateUserManageForm.name"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录账号" prop="login_code">
          <el-input
            v-model.number="updateUserManageForm.login_code"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model.trim="updateUserManageForm.password"
            placeholder="请输入新密码，空则默认为原密码"
            style="margin-left: 10px; width: 80%"
            show-password
            minlength="6"
            maxlength="12"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input
            v-model.trim="updateUserManageForm.mobile"
            style="margin-left: 10px; width: 80%"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="updateUserManageForm.email"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="submitCancel('UpdateUserManageForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpdateUserManageForm('UpdateUserManageForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delIndeed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from '@/store/modules/api'
import { mapState, mapGetters } from 'vuex'
import { updateData, submitCancelCallback, batchDel } from '@/utils/changeData'
import { actionReminder } from '@/utils/reminder'
import { dateToString } from '@/utils/changeDataForm'
import skip from '@/utils/skip'
export default {
  name: 'Table',
  props: ['rules', 'userTypeOptions', 'uploadPicUrl', 'loading'],
  data() {
    return {
      isLoading: true, // 使表格处于加载状态
      userList: [], // 展示表格
      currentPage: 1, // 当前页
      total: 1, // 总条目数
      updateUserManageFormVisible: false,
      delDialogVisible: false,
      delRowId: null, // 要删除的行id
      isSubmitError: false,
      hasErrorMessage: false,
      errorMessage: '',
      userManageSelections: [],
      updateUserManageForm: {
        id: null,
        avatar: '',
        s_role_id: '',
        name: '',
        login_code: '',
        password: '',
        mobile: '',
        email: ''
      },
      userRules: {
        avatar: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        s_role_id: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        name: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        login_code: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        password: [
          { validator: this.rules.checkUpdatePassword, trigger: 'blur' }
        ],
        mobile: [{ validator: this.rules.checkTel, trigger: 'blur' }],
        email: [{ validator: this.rules.checkEmail, trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 外界操作后表格进入加载状态
    loading() {
      this.isLoading = !this.isLoading
    },
    goupdate() {
      this.searchUser()
    },
    // 新增或更新数据时刷新页面
    goreset() {
      this.refreshUserManageList()
    },
    godelete() {
      this.delSelection()
    }
  },
  mounted() {
    this.refreshUserManageList()
  },
  methods: {
    // 刷新用户信息列表
    refreshUserManageList() {
      const val = {
        roleIdList: [1, 2],
        currentPage: this.currentPage
      }
      this.$store.dispatch('userManage/getUserListAction', val).then(() => {
        this.userList = this.$store.getters['userManage/getUserList']
        this.total = this.$store.getters['userManage/getBMUserCount']
        console.log(this.userList)
        this.handleList()
        this.isLoading = false
      })
    },

    // 切换页码
    handleCurrentChange(val) {
      this.isLoading = true
      this.currentPage = val
      this.refreshUserManageList()
    },

    // 搜索回调用户信息
    searchUser() {
      this.userList = this.$store.getters['userManage/getUserList']
      console.log(this.userList)
      this.total = this.$store.getters['userManage/getBMUserCount']
      this.handleList(true)
      this.isLoading = false
    },

    // 处理表格内容
    handleList(changeDate) {
      for (let i = 0, len = this.userList.length; i < len; i++) {
        // 处理用户角色
        switch (this.userList[i].s_role_id) {
          case 1:
            this.userList[i].s_role_id = '系统管理员'
            break
          case 2:
            this.userList[i].s_role_id = '二级管理员'
            break
          case 3:
            this.userList[i].s_role_id = '教师'
            break
          case 4:
            this.userList[i].s_role_id = '学生'
            break
        }

        // 拼接头像路径  '/manager/prod-api' +
        this.userList[i].avatarUrl = baseUrl.baseUrl + this.userList[i].avatar
        // this.userList[i].avatarUrl = baseUrl.baseUrl + this.userList[i].avatar;

        // 改变搜索后返回的更新时间
        if (changeDate) {
          this.userList[i].updatedAt = dateToString(this.userList[i].updatedAt)
        }
      }
    },

    // 删除用户
    delUser(target) {
      this.delDialogVisible = true
      this.delRowId = target.id
    },

    // 确认删除
    delIndeed() {
      this.isLoading = true
      const val = { list: [this.delRowId] }
      this.$store
        .dispatch('userManage/delUserManageAction', val)
        .then((res) => {
          this.delDialogVisible = false
          this.delRowId = null
          actionReminder(res, this)
          if (res.code === 0) {
            this.refreshUserManageList()
          } else {
            this.isLoading = false
          }
        })
    },

    // 弹出用户更新表单
    showUpdateUserForm(target) {
      console.log(target)
      for (const v in this.updateUserManageForm) {
        if (v === 'password') {
          continue
        } else if (v === 's_role_id') {
          switch (target[v]) {
            case '系统管理员':
              this.updateUserManageForm[v] = 1
              break
            case '二级管理员':
              this.updateUserManageForm[v] = 2
              break
            case '教师':
              this.updateUserManageForm[v] = 3
              break
            case '学生':
              this.updateUserManageForm[v] = 4
              break
          }
        } else {
          this.updateUserManageForm[v] = target[v]
        }
      }
      this.updateUserManageFormVisible = true
      console.log(this.updateUserManageForm)
    },

    // 提交课程信息更新表单
    submitUpdateUserManageForm(formName, that) {
      that || (that = this)
      updateData(formName, that, true).then((res) => {
        if (res.code || res.code === 0) {
          actionReminder(res, that)
        } else {
          that.isSubmitError = res
          that.hasErrorMessage = false
          that.errorMessage = ''
        }
      })
    },

    // 将上传的图片路径存起来
    handleAvatarSuccess(res, file) {
      this.updateUserManageForm.avatar = '/manager/prod-api' + res.data
    },

    // 限制上传头像图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    // 取消表单
    submitCancel(formName) {
      submitCancelCallback(formName, this)
    },

    // 更新多选
    userSelectionsChange(val) {
      this.userManageSelections = val
      console.log(val)
      this.$store.commit('userManage/set_isDisabled', val)
    },

    // 删除选中课程信息
    delSelection() {
      this.isLoading = true
      const that = this
      batchDel('userManage', that)
    },

    // 用户填写表单按下enter时的回调
    skipInput(e) {
      skip.skipInput(e, this)
    }
  },
  computed: {
    ...mapState('userManage', ['goupdate', 'goreset', 'godelete']),
    ...mapGetters(['myHeader'])
  }
}
</script>

<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  align-items: center;

  .el-pagination {
    margin: 10px auto;
  }
}

.submitError {
  position: absolute;
  top: 40px;
  left: 160px;
  color: rgba(255, 0, 0, 0.8);
}

.el-avatar {
  ::v-deep {
    display: flex;
    justify-content: center;
  }
}

// 上传头像样式
.avatar-uploader {
  ::v-deep {
    .el-upload {
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
