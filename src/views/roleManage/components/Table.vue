<template>
  <div class="role-table">
    <el-table
      v-loading="isLoading"
      :data="roleList"
      style="width: 100%; font-size: 10px"
      border
    >
      <el-table-column prop="id" label="序号" width="80" align="center" />
      <el-table-column
        prop="name"
        label="角色名称"
        width="120"
        align="center"
      />
      <el-table-column
        prop="type"
        label="角色类型"
        width="120"
        align="center"
      />
      <el-table-column
        prop="permission"
        label="菜单权限"
        width="280"
        header-align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="
              !(scope.row.contain_menu_names instanceof Array) ||
                !scope.row.contain_menu_names[0]
            "
            style="margin-left: 30px"
          >———————</span>
          <ul v-if="scope.row.contain_menu_names[0]">
            <li
              v-for="(item, index) in scope.row.contain_menu_names"
              v-show="item.menuName"
              :key="index"
            >
              <span>{{ item.menuName }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" align="center" />
      <el-table-column prop="remark" label="备注" width="400" align="center" />

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showUpdateRoleForm(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑角色信息弹出框 -->
    <el-dialog
      class="roleModal"
      title="编辑课程信息"
      :visible.sync="updateRoleManageFormVisible"
      center
      width="40%"
      @close="submitCancel('UpdateRoleManageForm')"
    >
      <el-form
        ref="UpdateRoleManageForm"
        name="UpdateRoleManageForm"
        :model="updateRoleManageForm"
        :rules="roleRules"
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
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model.trim="updateRoleManageForm.name"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="
              hasErrorMessage
                ? (hasErrorMessage = false)
                : (isSubmitError = false)
            "
          />
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select
            v-model="updateRoleManageForm.type"
            placeholder="请选择"
            style="width: 86%"
            disabled
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限" prop="contain_menu">
          <el-cascader-panel
            :options="permissOptions"
            style="width: 86%"
            disabled
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="updateRoleManageForm.remark"
            type="textarea"
            style="width: 86%"
            disabled
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="submitCancel('UpdateRoleManageForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpdateRoleManageForm('UpdateRoleManageForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { updateData, submitCancelCallback } from '@/utils/changeData'
import skip from '@/utils/skip'
import { dateToString } from '@/utils/changeDataForm'
import { actionReminder } from '@/utils/reminder'
export default {
  name: 'Table',
  // props: ['loading'],
  data() {
    const checkContent = (rule, val, callback) => {
      if (typeof val !== 'number') {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    const checkContentTwo = (rule, val, callback) => {
      if (!val) {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    const checkInt = (rule, val, callback) => {
      if (!val && val != 0) {
        callback(new Error('内容不能为空'))
      } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
        callback(new Error('值必须为正整数'))
      } else if (val < 1) {
        callback(new Error('值必须为正整数'))
      } else {
        callback()
      }
    }
    const checkLevel = (rule, val, callback) => {
      if (val === '' || val == null) {
        callback(new Error('内容不能为空'))
      } else if (val < 0 || val > 3) {
        callback(new Error('值的范围为0~3的整数'))
      } else if (val > 0 && val < 1) {
        callback(new Error('值的范围为0~3的整数'))
      } else {
        callback()
      }
    }
    return {
      isLoading: true,
      roleList: [],
      updateRoleManageFormVisible: false,
      isSubmitError: false,
      hasErrorMessage: false,
      errorMessage: '',
      typeOptions: [
        { value: 0, label: '系统管理员', disabled: true },
        { value: 1, label: '二级管理员' },
        { value: 2, label: '普通用户' }
      ],
      permissOptions: [
        { value: 0, label: '系统设置', disabled: true, children: [] },
        { value: 1, label: '课程管理', disabled: true, children: [] },
        { value: 2, label: '用户管理', disabled: true, children: [] },
        { value: 2, label: '角色管理', disabled: true },
        { value: 2, label: '组织管理', disabled: true },
        { value: 2, label: '菜单管理', disabled: true }
      ],
      updateRoleManageForm: {
        id: null,
        agency_id: null,
        name: '',
        type: null,
        contain_menu: [],
        remark: ''
      },
      roleRules: {
        name: [{ validator: checkContentTwo, trigger: 'blur' }],
        type: [{ validator: checkContent, trigger: 'blur' }],
        time: [{ validator: checkInt, trigger: 'blur' }],
        level: [{ validator: checkLevel, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('roleManage', ['goupdate', 'goreset'])
  },
  watch: {
    // 外界操作后表格进入加载状态
    loading() {
      this.isLoading = !this.isLoading
    },
    goupdate() {
      this.searchRole()
    },
    goreset() {
      this.refreshRoleList()
    }
  },
  mounted() {
    this.refreshRoleList()
  },
  methods: {
    // 刷新角色列表
    refreshRoleList() {
      this.$store.dispatch('roleManage/getRoleListAction').then(() => {
        this.roleList = this.$store.getters['roleManage/getRoleList']
        this.handleData()
        this.isLoading = false
      })
    },

    // 处理数据格式
    handleData(isSearch) {
      for (let i = 0, len = this.roleList.length; i < len; i++) {
        // 处理角色类型格式
        switch (this.roleList[i].type) {
          case 0:
            this.roleList[i].type = '系统管理员'
            break
          case 1:
            this.roleList[i].type = '二级管理员'
            break
          case 2:
            this.roleList[i].type = '普通用户'
            break
        }

        // 处理角色权限格式
        if (this.roleList[i].contain_menu_names[0]) {
          const permissList = this.roleList[i].contain_menu_names
          for (
            let j = 0, permissLen = permissList.length;
            j < permissLen;
            j++
          ) {
            if (permissList[j].menuName == '用户管理') {
              permissList[j].menuName = `用户管理-智能教学平台 | 后台管理系统`
            } else if (permissList[j].menuName == '课程管理') {
              permissList[j].menuName = `课程管理-课程库 | 课程信息`
            } else if (
              permissList[j].menuName == '后台管理系统' ||
              permissList[j].menuName == '智能教学平台' ||
              permissList[j].menuName == '课程库' ||
              permissList[j].menuName == '课程信息'
            ) {
              permissList[j] = ''
            }
          }
        }

        // 处理时间
        if (isSearch) {
          this.roleList[i].createdAt = dateToString(this.roleList[i].createdAt)
        }
      }
    },

    // 搜索角色
    searchRole() {
      this.roleList = this.$store.getters['roleManage/getRoleList']
      console.log(this.roleList)
      this.handleData(true)
      this.isLoading = false
    },

    // 弹出角色更新表单
    showUpdateRoleForm(target) {
      for (const v in this.updateRoleManageForm) {
        switch (v) {
          case 'contain_menu':
            this.updateRoleManageForm.contain_menu = target.contain_menu_names
            break
          case 'type':
            switch (target.type) {
              case '系统管理员':
                this.updateRoleManageForm.type = 0
                break
              case '二级管理员':
                this.updateRoleManageForm.type = 1
                break
              case '普通用户':
                this.updateRoleManageForm.type = 2
                break
            }
            break
          default:
            this.updateRoleManageForm[v] = target[v]
            break
        }
      }
      this.updateRoleManageFormVisible = true
    },

    // 提交角色更新表单
    submitUpdateRoleManageForm(formName, that) {
      that || (that = this)
      updateData(formName, that, true).then((res) => {
        if (res.code || res.code === 0) {
          actionReminder(res, this)
        } else {
          that.isSubmitError = res
          that.hasErrorMessage = false
          that.errorMessage = ''
        }
      })
    },

    // 取消表单
    submitCancel(formName) {
      console.log(this.updateRoleManageForm)
      submitCancelCallback(formName, this)
    },

    // 用户填写表单按下enter时的回调
    skipInput(e) {
      skip.skipInput(e, this)
    }
  }
}
</script>

<style lang="scss" scoped>
.role-table {
  margin-top: 30px;

  .submitError {
    position: absolute;
    top: 40px;
    left: 160px;
    color: rgba(255, 0, 0, 0.8);
  }
}
</style>
