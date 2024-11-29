<template>
  <div class="organiz-table">
    <el-table
      v-loading="isLoading"
      :data="organizList"
      :tree-props="{ children: 'subArr', hasChildren: 'hasChildren' }"
      :cell-style="organizNameStyle"
      style="width: 100%; font-size: 13px"
      row-key="id"
      border
      :default-expand-all="false"
    >
      <el-table-column prop="name" label="组织名称" header-align="center" />
      <el-table-column prop="created_at" label="创建时间" width="800" align="center" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showUpdateOrganizManageForm(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delOrganizLib(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑组织弹出框 -->
    <el-dialog
      class="organiz-modal"
      title="编辑组织"
      :visible.sync="updateOrganizManageFormVisible"
      width="40%"
      center
      @close="submitCancel('UpdateOrganizManageForm')"
    >
      <el-form
        ref="UpdateOrganizManageForm"
        name="UpdateOrganizManageForm"
        :model="updateOrganizManageForm"
        :rules="organizRules"
        label-width="120px"
        label-position="right"
        size="small"
        status-icon
        center
      >
        <transition-group name="submitErrorTransition">
          <p v-show="isSubmitError" key="1" class="submitError">
            提交失败，请检查表格
          </p>
          <p v-show="hasErrorMessage" key="2" class="submitError">
            {{ errorMessage }}
          </p>
        </transition-group>
        <el-form-item label="组织名称" prop="name">
          <el-input
            v-model.trim="updateOrganizManageForm.name"
            placeholder="请输入组织名称"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="组织类型" prop="type">
          <el-select
            v-model="updateOrganizManageForm.type"
            placeholder="请选择组织类型"
            style="width: 86%"
            disabled
            @change="changeTipList"
          >
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级组织" prop="parent_id">
          <el-select
            v-model="updateOrganizManageForm.parent_id"
            filterable
            placeholder="请选择上级组织"
            style="width: 86%"
            :disabled="disableParent"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          >
            <el-option v-for="item in parentIdListCopy" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showGrade" label="年级" prop="value">
          <el-date-picker
            v-model="updateOrganizManageForm.value"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            style="width: 86%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitCancel('UpdateOrganizManageForm')">取 消</el-button>
        <el-button type="primary" @click="submitUpdateOrganizManageForm('UpdateOrganizManageForm')">确 定</el-button>
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
import { mapState } from 'vuex'
import skip from '@/utils/skip'
import { updateData, submitCancelCallback } from '@/utils/changeData'
import { dateToString } from '@/utils/changeDataForm'
import { actionReminder } from '@/utils/reminder'
export default {
  name: 'Table',
  props: [
    'rules',
    'typeOptions',
    'parentIdList',
    'loading',
    'changeTipListCallback'
  ],
  data() {
    return {
      isLoading: true,
      organizList: [],
      updateOrganizManageFormVisible: false,
      isSubmitError: false,
      hasErrorMessage: false,
      errorMessage: '',
      delDialogVisible: false,
      disableParent: true, // 当选择组织类型后才可以选择上级组织
      showGrade: false, // 当组织类型为班级后必选年级
      parentIdListCopy: [], // 新增组织时上级组织提示列表复制版
      delRowId: null, // 要删除的行id
      updateOrganizManageForm: {
        id: null,
        name: '',
        parent_id: null,
        type: null,
        value: ''
      },
      organizRules: {
        name: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        type: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        parent_id: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        value: [{ validator: this.rules.checkContent, trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 外界操作后表格进入加载状态
    loading() {
    //   this.isLoading = !this.isLoading
    },
    goupdate() {
      this.searchOrganiz()
    },
    // 新增操作后刷新列表
    goreset() {
      console.log('in Component\'s watch')
      this.refreshOrganizList()
    },
    // 新增组织后重新获取提示列表
    gorefresh() {
      this.refreshOrganizList()
    }
  },
  created() {
    this.refreshOrganizList()
    this.parentIdListCopy = [...this.parentIdList]
  },
  methods: {
    // 组织名称列的样式
    organizNameStyle({ columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:30px'
      }
    },

    // 刷新组织列表
    refreshOrganizList() {
      console.log('in Component\'s method')
      this.$store.dispatch('organizManage/getOrganizListAction').then(() => {
        this.organizList = this.$store.getters['organizManage/getOrganizList']
        console.log('refreshOrganizList', this.organizList)
        this.handleListContent()
        this.isLoading = false
      })
    },

    // 搜索组织
    searchOrganiz() {
      const newOrganizList =
        this.$store.getters['organizManage/getOrganizList']
      this.organizList = newOrganizList
      console.log(this.organizList)
      this.handleListContent()
      this.isLoading = false
    },

    // 修改班级名称和日期格式
    handleListContent() {
      for (let i = 0, len = this.organizList.length; i < len; i++) {
        this.organizList[i].created_at = dateToString(
          this.organizList[i].created_at
        )
        if (this.organizList[i].subArr[0]) {
          const major = this.organizList[i].subArr
          for (let j = 0, mlen = major.length; j < mlen; j++) {
            major[j].created_at = dateToString(major[j].created_at)
            if (major[j].subArr[0]) {
              const subClass = major[j].subArr
              for (let k = 0, clen = subClass.length; k < clen; k++) {
                subClass[k].created_at = dateToString(subClass[k].created_at)
                subClass[k].name = subClass[k].grade + '级' + subClass[k].name
              }
            }
          }
        }
      }
    },

    // 弹出删除对话框
    delOrganizLib(target) {
      this.delDialogVisible = true
      this.delRowId = target.id
    },

    // 确认删除
    delIndeed() {
      const val = { id: this.delRowId }
      this.isLoading = true
      this.$store
        .dispatch('organizManage/delOrganizManageAction', val)
        .then((res) => {
          this.refreshOrganizList()
          this.delDialogVisible = false
          this.delRowId = null
          actionReminder(res, this)
        })
    },

    // 弹出组织更新表单
    showUpdateOrganizManageForm(target) {
      console.log('target', target)

      this.changeTipList(target)
      this.disableParent = true
      this.showGrade = false
      for (const v in this.updateOrganizManageForm) {
        switch (v) {
          case 'name':
            if (target.type === 2) {
              this.updateOrganizManageForm.name = target.name.substring(5)
              this.showGrade = true
            } else {
              this.updateOrganizManageForm.name = target.name
            }
            break
          case 'value':
            if (target.grade) {
              this.updateOrganizManageForm.value = target.grade
            } else {
              continue
            }
            break
          case 'parent_id':
            this.updateOrganizManageForm.parent_id = target.parent_id
            if (target.type !== 0) this.disableParent = false
            break
          default:
            this.updateOrganizManageForm[v] = target[v]
            break
        }
      }
      this.updateOrganizManageFormVisible = true
    },

    // 提交组织更新表单
    submitUpdateOrganizManageForm(formName, that) {
      that || (that = this)
      that.isLoading = true
      updateData(formName, that, true).then((res) => {
        if (res.code || res.code === 0) {
          actionReminder(res, this)
        } else {
          that.isSubmitError = res
          that.hasErrorMessage = false
          that.errorMessage = ''
        }
      })
      that.isLoading = false
    },

    // 更改提示列表和选择列表
    changeTipList(target) {
      console.log('target', target)
      if (target.type === 0) {
        this.parentIdListCopy = [
          {
            label: '二级管理员机构',
            type: '-1',
            value: target.parent_id
          }
        ]
        this.disableParent = true
      } else {
        const result = this.changeTipListCallback(target.type)
        this.parentIdListCopy = result.parentIdListCopy
        this.disableParent = result.disableParent
        this.showGrade = result.showGrade
      }
    },

    // 取消表单
    submitCancel(formName) {
      submitCancelCallback(formName, this)
      this.disableParent = true
      this.showGrade = false
      this.parentIdListCopy = [...this.parentIdList]
    },

    // 用户填写表单按下enter时的回调
    skipInput(e) {
      skip.skipInput(e, this)
    }
  },
  computed: {
    ...mapState('organizManage', ['goupdate', 'goreset'])
  }
}
</script>

<style lang="scss" scoped>
.organiz-table {
  ::v-deep .el-table__expand-icon {
    .el-icon-arrow-right:before {
      content: "\e791";
    }
  }
}

.submitError {
  position: absolute;
  top: 40px;
  left: 160px;
  color: rgba(255, 0, 0, 0.8);
}
</style>
