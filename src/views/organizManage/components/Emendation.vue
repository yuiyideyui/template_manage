<template>
  <div class="emendation">
    <el-button
      type="primary"
      @click="addOrganizManageFormVisible = true"
    >新增组织</el-button>

    <!-- 新增用户 -->
    <el-dialog
      class="organiz-modal"
      title="新增组织"
      :visible.sync="addOrganizManageFormVisible"
      center
      width="40%"
      @close="submitCancel('AddOrganizManageForm')"
    >
      <el-form
        ref="AddOrganizManageForm"
        name="AddOrganizManageForm"
        :model="addOrganizManageForm"
        :rules="organizRules"
        label-width="120px"
        size="small"
        label-position="right"
        status-icon
      >
        <transition-group name="submitErrorTransition">
          <p
            v-show="isSubmitError"
            key="1"
            class="submitError"
          >
            提交失败，请检查表格
          </p>
          <p
            v-show="hasErrorMessage"
            key="2"
            class="submitError"
          >
            {{ errorMessage }}
          </p>
        </transition-group>
        <el-form-item
          label="组织名称"
          prop="name"
        >
          <el-input
            v-model.trim="addOrganizManageForm.name"
            placeholder="请输入组织名称（例：智能交通1班）"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item
          label="组织类型"
          prop="type"
        >
          <el-select
            v-model="addOrganizManageForm.type"
            placeholder="请选择组织类型"
            style="width: 86%"
            @change="changeTipList"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="上级组织"
          prop="parent_id"
        >
          <el-select
            v-model="addOrganizManageForm.parent_id"
            filterable
            placeholder="请选择上级组织"
            style="width: 86%"
            :disabled="disableParent"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in parentIdListCopy"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="showGrade"
          label="年级"
          prop="value"
        >
          <el-date-picker
            v-model="addOrganizManageForm.value"
            type="year"
            value-format="yyyy"
            placeholder="选择年级"
            style="width: 86%"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="submitCancel('AddOrganizManageForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAddOrganizManageForm('AddOrganizManageForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import skip from '@/utils/skip'
import { updateData, submitCancelCallback } from '@/utils/changeData'
import { actionReminder } from '@/utils/reminder'
export default {
  name: 'Emendation',
  props: ['rules', 'typeOptions', 'changeTipListCallback'],
  data() {
    return {
      addOrganizManageFormVisible: false,
      isSubmitError: false,
      hasErrorMessage: false,
      errorMessage: '',
      disableParent: true, // 当选择组织类型后才可以选择上级组织
      showGrade: false, // 当组织类型为班级后必选年级
      parentIdListCopy: [], // 新增组织时上级组织提示列表复制版
      addOrganizManageForm: {
        name: '',
        type: null,
        parent_id: null,
        value: ''
      },
      organizRules: {
        name: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        type: [{ validator: this.rules.checkType, trigger: 'blur' }],
        parent_id: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        value: [{ validator: this.rules.checkContent, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // ========新增组织模块=========
    submitAddOrganizManageForm(formName, that) {
      that || (that = this)
      updateData(formName, that, true).then((res) => {
        if (res.code || res.code === 0) {
          actionReminder(res, this)
          if (res.code === 0 && this.showGrade === true) {
            this.showGrade = false
          }
          this.$store.commit('organizManage/set_goreset')
        } else {
          that.isSubmitError = res
          that.hasErrorMessage = false
          that.errorMessage = ''
        }
      })
    },

    // 更改提示列表和选择列表
    changeTipList() {
      if (this.addOrganizManageForm.type === 0) {
        this.showGrade = false
        this.disableParent = true
        this.parentIdListCopy = [
          {
            label: '二级管理员机构',
            value: 4
          }
        ]
        this.addOrganizManageForm.parent_id = 4
      } else {
        this.addOrganizManageForm.parent_id = null
        const result = this.changeTipListCallback(this.addOrganizManageForm.type)
        this.parentIdListCopy = result.parentIdListCopy
        console.log(this.parentIdListCopy)
        this.disableParent = result.disableParent
        this.showGrade = result.showGrade
      }
    },

    // 取消新增页面
    submitCancel(formName) {
      submitCancelCallback(formName, this)
      this.disableParent = true
      this.showGrade = false
    },
    // ========新增组织模块完=========

    // 用户填写表单按下enter时的回调
    skipInput(e) {
      skip.skipInput(e, this)
    }
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

    // 编辑框样式
    .el-dialog {
        width: 40%;

        .submitErrorTransition-enter-active,
        .submitErrorTransition-leave-active {
            transition: opacity 0.5s;
        }

        .submitErrorTransition-enter,
        .submitErrorTransition-leave-to {
            opacity: 0;
        }

        .el-form-item {
            margin-bottom: 20px;
        }

        .input-point {
            ::v-deep {
                display: inline-block;
                width: 45%;
            }
        }
    }

    .submitError {
        position: absolute;
        top: 40px;
        left: 160px;
        color: rgba(255, 0, 0, 0.8);
    }

    .courseInfoModal::v-deep {

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    }

    .courseInfoModal::v-deep input[type="number"] {
        -moz-appearance: textfield;
    }

    // 导入课表对话框样式
    .import-modal .course-upload {
        text-align: center;
    }
}
</style>
