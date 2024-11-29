<template>
  <div class="emendation">
    <el-button
      type="primary"
      @click="addCourseLibFormVisible = true"
    >新增课程</el-button>
    <el-button
      type="warning"
      @click="importDialogVisible = true"
    >导入课表</el-button>
    <el-button
      type="info"
      @click="exportSchedul"
    >导出课表</el-button>
    <el-button
      type="danger"
      :disabled="isDisabled"
      @click="batchDelDialogVisible = true"
    >批量删除</el-button>

    <el-button
      type="primary"
      plain
      style="float: right"
      @click="DLTemplate"
    >模板下载</el-button>

    <!-- 新增课程 -->
    <el-dialog
      class="courseLib-modal"
      title="新增课程"
      :visible.sync="addCourseLibFormVisible"
      center
      width="40%"
      @close="submitCancel('AddCourseLibForm')"
    >
      <el-form
        ref="AddCourseLibForm"
        name="AddCourseLibForm"
        :model="addCourseLibForm"
        :rules="courseLibRules"
        label-width="120px"
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
          label="课程编号"
          prop="course_no"
        >
          <el-input
            v-model="addCourseLibForm.course_no"
            style="margin-left: 10px; width: 80%"
            oninput="value=value.replace(/[^\a-\z\A-\Z0-9]/g, '')"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="name"
        >
          <el-input
            v-model.trim="addCourseLibForm.name"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item
          label="授课层次"
          prop="level"
        >
          <el-select
            v-model="addCourseLibForm.level"
            placeholder="请选择搜索类型"
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
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="submitCancel('AddCourseLibForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAddCourseLibForm('AddCourseLibForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 导入课表 -->
    <el-dialog
      class="import-modal"
      title="导入课表"
      :visible.sync="importDialogVisible"
      :before-close="cancelUpload"
      width="40%"
      center
    >
      <transition name="submitErrorTransition">
        <p
          v-show="hasImportErrorMessageImport"
          class="submitError"
        >
          {{ importErrorMessage }}
        </p>
      </transition>
      <el-upload
        ref="fileUpload"
        class="course-upload"
        accept=".xls, .xlsx"
        :limit="1"
        :headers="myHeader"
        :action="uploadUrl"
        :on-success="fileUpload"
        :before-remove="removeExcel"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div
          slot="tip"
          class="el-upload__tip"
        >只能上传xls/xlsx文件</div>
      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button
          type="primary"
          :disabled="cannotAdd"
          @click="batchAdd"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认批量删除 -->
    <el-dialog
      title="提示"
      :visible.sync="batchDelDialogVisible"
      width="30%"
    >
      <span>是否确认进行批量删除？</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="batchDelDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="delIndeed"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import skip from '@/utils/skip'
import { updateData, submitCancelCallback } from '@/utils/changeData'
import { exportFile } from '@/utils/exportFile'
import * as XLSX from 'xlsx'
import { actionReminder } from '@/utils/reminder'
export default {
    name: 'Emendation',
    props: ['rules', 'levelOptions'],
    data() {
        return {
            addCourseLibFormVisible: false,
            importDialogVisible: false,
            isDisabled: true, // 批量删除按钮是否禁用
            batchDelDialogVisible: false,
            isSubmitError: false,
            hasErrorMessage: false,
            errorMessage: '',
            uploadExcel: null, // 保存用户传入的课表
            uploadUrl: '', // 上传路径
            cannotAdd: true, // 只有上传的课表解析成功才能导入
            hasImportErrorMessageImport: false,
            importErrorMessage: '',
            addCourseTimer: null, // 新增课程定时器
            exportTimer: null, // 导出课表定时器
            DLTimer: null, // 模板下载定时器
            addCourseLibForm: {
                course_no: null,
                name: '',
                time: '',
                level: null,
                icon_url: '',
                desc: '',
                eval_method: '',
                Updated_at: null
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
        goabled() {
            this.isDisabled = this.$store.state.courseLib.goabled
        }
    },
    mounted() {
        this.uploadUrl =
            process.env.VUE_APP_BASE_API + '/courseLibrary/courseLibrary/upload'
    },
    methods: {
        // 新增课程
        submitAddCourseLibForm(formName, that) {
            if (this.addCourseTimer) {
                clearTimeout(this.addCourseTimer)
            }
            this.addCourseTimer = setTimeout(() => {
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
            }, 500)
        },

        // 取消新增页面
        submitCancel(formName) {
            submitCancelCallback(formName, this)
        },

        // ========导入课表模块========
        // 导入课表
        fileUpload(val) {
            const filename = {
                name: val.data,
                type: 1
            }
            this.$store
                .dispatch('courseLib/analyExcelAction', filename)
                .then((res) => {
                    this.uploadExcel = res.data
                    // 上传成功后才能进行添加
                    if (res.code === 0) {
                        this.cannotAdd = false
                    } else {
                        this.hasImportErrorMessageImport = true
                        this.importErrorMessage = res.msg
                    }
                })
        },

        // 导入的课表添加到库中
        async batchAdd() {
            this.$emit('setLoading') // 表格进入加载状态
            for (
                let i = 0, count = 0, len = this.uploadExcel.length;
                i < len;
                i++
            ) {
              const item = this.uploadExcel[i]
                const addForm = {
                    course_no: item.course_no,
                    name: item.name,
                    level: null,
                    time: '',
                    icon_url: '',
                    desc: '',
                    eval_method: '',
                    Updated_at: null
                }
                switch (item.level) {
                    case '本科':
                        addForm.level = 1
                        break
                    case '硕士研究生':
                        addForm.level = 2
                        break
                    case '博士研究生':
                        addForm.level = 3
                        break
                    default:
                        addForm.level = 0
                        break
                }
                const val = { list: [addForm] }
                await this.$store
                    .dispatch(`courseLib/addCourseLibAction`, val)
                    .then((res) => {
                        if (res.code === 0) {
                            count++
                            if (count === len) {
                                this.$store.commit(`courseLib/set_goreset`) // 更新页面
                                this.cancelUpload() // 清除已导入的课表
                                actionReminder(res, this) // 提示成功
                            }
                        } else if (!res) {
                            actionReminder(res, this)
                        }
                    })
            }
        },

        // 删除已上传的文件时关掉错误提示
        removeExcel() {
            this.cannotAdd = true
            if (this.hasImportErrorMessageImport) {
                this.hasImportErrorMessageImport = false
                this.importErrorMessage = ''
            }
        },

        // 取消上传课表
        cancelUpload() {
            this.importDialogVisible = false
            this.$refs['fileUpload'].clearFiles()
            this.removeExcel()
        },
        // ========导入课表模块完========

        // ========导出课表模块========
        // 导出课表
        exportSchedul() {
            if (this.exportTimer) {
                clearTimeout(this.exportTimer)
            }
            this.exportTimer = setTimeout(() => {
                this.$store.dispatch('courseLib/getCourseLibListAction').then((res) => {
                    this.exportExcel(res)
                })
            }, 500)
        },

        // 导出课表逻辑
        exportExcel(res) {
            const worksheet = XLSX.utils.json_to_sheet(res)
            const workbook = XLSX.utils.book_new()
            const range = XLSX.utils.decode_range(worksheet['!ref'])

            // 修改导出表格格式
            for (let i = range.e.c; i >= 0; i--) {
                const col = XLSX.utils.encode_col(i)
                // 删掉不必要的列
                switch (worksheet[`${col}1`].v) {
                    case 'updated_at':
                        this.deleteCol(worksheet, range, i)
                        break
                    case 'eval_method':
                        this.deleteCol(worksheet, range, i)
                        break
                    case 'desc':
                        this.deleteCol(worksheet, range, i)
                        break
                    case 'icon_url':
                        this.deleteCol(worksheet, range, i)
                        break
                    /* case "id":
                      this.deleteCol(worksheet, range, i);
                      break; */
                }
                // 更改表中内容
                switch (worksheet[`${col}1`].v) {
                    case 'id':
                        worksheet[`${col}1`].v = '序号'
                        // 转化序号格式
                        for (let row = 2; row < range.e.r + 2; row++) {
                            worksheet[`${col}${row}`].v = row - 1
                        }
                        break
                    case 'course_no':
                        worksheet[`${col}1`].v = '课程编号'
                        break
                    case 'name':
                        worksheet[`${col}1`].v = '课程名称'
                        break
                    case 'time':
                        worksheet[`${col}1`].v = '开课次数'
                        break
                    case 'level':
                        worksheet[`${col}1`].v = '授课层次'
                        // 转化授课层次格式
                        for (let row = 2; row < range.e.r + 2; row++) {
                            switch (worksheet[`${col}${row}`].v) {
                                case 0:
                                    worksheet[`${col}${row}`].v = '全部'
                                    break
                                case 1:
                                    worksheet[`${col}${row}`].v = '本科生'
                                    break
                                case 2:
                                    worksheet[`${col}${row}`].v = '硕士研究生'
                                    break
                                case 3:
                                    worksheet[`${col}${row}`].v = '博士研究生'
                                    break
                            }
                        }
                        break
                }
            }
            // 添加worksheet
            XLSX.utils.book_append_sheet(workbook, worksheet, 'result')
            const wbout = XLSX.write(workbook, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            })
            exportFile(wbout, '课程库.xlsx') // 下载
        },

        // 删除空列
        deleteCol(ws, range, index) {
            for (let col = index; col < range.e.c; col++) {
                for (let row = range.s.r; row <= range.e.r; row++) {
                    ws[this.encodeCell(row, col)] = ws[this.encodeCell(row, col + 1)]
                }
            }
            range.e.c--

            ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
        },

        // 转换单元格地址
        encodeCell(r, c) {
            return XLSX.utils.encode_cell({ r, c })
        },
        // ========导出课表模块完========

        // 批量删除
        delIndeed() {
            this.$store.commit('courseLib/set_godelete')
            this.batchDelDialogVisible = false
        },

        // 下载模板
        DLTemplate() {
            if (this.DLTimer) {
                clearTimeout(this.DLTimer)
            }
            this.DLTimer = setTimeout(() => {
                const val = {
                    name: '虚拟仿真教学平台-课程库表模板.xlsx'
                }
                this.$store.dispatch('courseLib/DLTemplateAction', val).then((res) => {
                    exportFile(res, '课程库模板.xlsx')
                })
            }, 500)
        },

        // 用户填写表单按下enter时的回调
        skipInput(e) {
            skip.skipInput(e, this)
        }
    },
    computed: {
        ...mapState('courseLib', ['goabled']),
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
    .el-dialog.courseLib-modal {

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

    .courseLib-modal::v-deep {

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    }

    .courseLib-modal::v-deep input[type="number"] {
        -moz-appearance: textfield;
    }

    // 导入课表对话框样式
    .import-modal .course-upload {
        text-align: center;
    }
}
</style>
