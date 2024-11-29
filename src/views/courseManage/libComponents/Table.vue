<template>
  <div class="table">
    <el-table
      v-loading="isLoading"
      :data="courseLibList"
      style="width: 100%; font-size: 13px"
      row-key="id"
      border
      @selection-change="courseLibSelectionsChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="course_no" label="课程编号" align="center" />
      <el-table-column prop="name" label="课程名称" align="center" />
      <el-table-column prop="level" label="授课层次" align="center" />
      <el-table-column prop="time" label="开课次数" align="center" />
      <el-table-column prop="updated_at" label="更新时间" align="center" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showUpdateCourseLibForm(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="delCourseLib(scope.row)"
          >删除
          </el-button>
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

    <!-- 编辑课程库弹出框 -->
    <el-dialog
      class="courseLib-modal"
      title="编辑课程"
      :visible.sync="updateCourseLibFormVisible"
      width="40%"
      center
      @close="submitCancel('UpdateCourseLibForm')"
    >
      <el-form
        ref="UpdateCourseLibForm"
        name="UpdateCourseLibForm"
        :model="updateCourseLibForm"
        :rules="courseLibRules"
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
        <el-form-item label="课程编号" prop="course_no">
          <el-input
            v-model.number="updateCourseLibForm.course_no"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="
              hasErrorMessage
                ? (hasErrorMessage = false)
                : (isSubmitError = false)
            "
          />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input
            v-model.trim="updateCourseLibForm.name"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="授课层次" prop="level">
          <el-select
            v-model.trim="updateCourseLibForm.level"
            placeholder="请选择搜索类型"
            size="small"
            style="margin-left: 10px; width: 80%"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="(item, index) in levelOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="submitCancel('UpdateCourseLibForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpdateCourseLibForm('UpdateCourseLibForm')"
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
import { mapState } from 'vuex'
import skip from '@/utils/skip'
import { updateData, submitCancelCallback, batchDel } from '@/utils/changeData'
import { dateToString } from '@/utils/changeDataForm'
import { actionReminder } from '@/utils/reminder'
export default {
  name: 'Table',
  props: ['rules', 'loading', 'levelOptions'],
  data() {
    return {
      isLoading: true,
      courseLibList: [], // 展示表格
      currentPage: 1, // 当前页
      total: 1, // 总条目数
      updateCourseLibFormVisible: false,
      delDialogVisible: false,
      delRowId: null, // 要删除的行id
      isSubmitError: false,
      hasErrorMessage: false,
      errorMessage: '',
      courseLibSelections: [], // 选中的行
      updateCourseLibForm: {
        id: null,
        course_no: '',
        name: '',
        level: null
      },
      courseLibRules: {
        course_no: [{ validator: this.rules.checkNumber, trigger: 'blur' }],
        name: [{ validator: this.rules.checkContent, trigger: 'blur' }],
        times: [{ validator: this.rules.checkInt, trigger: 'blur' }],
        level: [{ validator: this.rules.checkLevel, trigger: 'blur' }]
      }
    }
  },
  watch: {
    // 外界操作后表格进入加载状态
    loading() {
      console.log('---loading---', this.isLoading)
      this.isLoading = !this.isLoading
      console.log('---loading---', this.isLoading)
    },
    goupdate() {
      this.searchCourseLib()
    },
    goreset() {
      this.refreshCourseLibList()
    },
    godelete() {
      this.delSelection()
    }
  },
  created() {
    this.refreshCourseLibList()
  },
  methods: {
    // 刷新课程列表
    refreshCourseLibList() {
      this.$emit('fetchTable')

      // const val = { currentPage: this.currentPage }
      // this.$store
      //   .dispatch('courseLib/getCourseLibListAction', val)
      //   .then((res) => {
      //     this.courseLibList =
      //       this.$store.getters['courseLib/getCourseLibList']
      //     this.total = this.$store.getters['courseLib/getCourseCount']
      //     this.handleList()
      //     this.isLoading = false
      //   })
    },

    // 切换页码
    handleCurrentChange(val) {
      this.isLoading = true
      this.currentPage = val
      this.refreshCourseLibList()
      this.$emit('setCurrentPage', val)
    },

    // 搜索回调课程
    searchCourseLib() {
      this.courseLibList = this.$store.getters['courseLib/getCourseLibList']
      console.log('this.courseLibList', this.courseLibList)

      this.total = this.$store.getters['courseLib/getCourseCount']
      this.handleList()
      this.isLoading = false
    },

    // 处理表格内容
    handleList() {
      for (let i = 0, len = this.courseLibList.length; i < len; i++) {
        this.courseLibList[i].updated_at = dateToString(
          this.courseLibList[i].updated_at
        )
        switch (this.courseLibList[i].level) {
          case 0:
            this.courseLibList[i].level = '全部'
            break
          case 1:
            this.courseLibList[i].level = '本科生'
            break
          case 2:
            this.courseLibList[i].level = '硕士生'
            break
          case 3:
            this.courseLibList[i].level = '博士生'
            break
        }
      }
    },

    // 弹出删除对话框
    delCourseLib(target) {
      this.delDialogVisible = true
      this.delRowId = target.id
    },

    // 确认删除
    delIndeed() {
      this.isLoading = true
      const val = { list: [this.delRowId] }
      this.$store.dispatch('courseLib/delCourseLibAction', val).then((res) => {
        this.refreshCourseLibList()
        this.delDialogVisible = false
        this.delRowId = null
        actionReminder(res, this)
      })
    },

    // 弹出课程更新表单
    showUpdateCourseLibForm(target) {
      for (const v in this.updateCourseLibForm) {
        if (v === 'level') {
          switch (target.level) {
            case '全部':
              this.updateCourseLibForm.level = 0
              break
            case '本科生':
              this.updateCourseLibForm.level = 1
              break
            case '硕士生':
              this.updateCourseLibForm.level = 2
              break
            case '博士生':
              this.updateCourseLibForm.level = 3
              break
          }
        } else {
          this.updateCourseLibForm[v] = target[v]
        }
      }
      this.updateCourseLibFormVisible = true
    },

    // 提交课程更新表单
    submitUpdateCourseLibForm(formName, that) {
      that || (that = this)
      updateData(formName, that).then((res) => {
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
      this.updateCourseLibForm.id = null
      this.updateCourseLibForm.course_no = null
      this.updateCourseLibForm.name = ''
      this.updateCourseLibForm.level = ''
      submitCancelCallback(formName, this)
    },

    // 更新多选
    courseLibSelectionsChange(val) {
      this.courseLibSelections = val
      this.$store.commit('courseLib/set_isDisabled', val)
    },

    // 删除选中课程
    delSelection() {
      this.isLoading = true
      const that = this
      batchDel('courseLib', that)
    },

    // 用户填写表单按下enter时的回调
    skipInput(e) {
      skip.skipInput(e, this)
    }
  },
  computed: {
    ...mapState('courseLib', ['goupdate', 'goreset', 'godelete'])
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
</style>
