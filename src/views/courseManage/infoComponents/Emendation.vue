<template>
  <div class="emendation">
    <el-button
      type="primary"
      @click="addCourseInfoFormVisible = true"
    >新增课程</el-button>
    <el-button
      type="warning"
      @click="importDialogVisible = true"
    >导入课表</el-button>
    <el-button type="info" @click="exportSchedul">导出课表</el-button>
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

    <!-- test新增课程 -->
    <div class="courseInfoModalDialog">
      <el-dialog
        title="新增课程"
        top="10vh"
        :visible.sync="addCourseInfoFormVisible"
        width="50%"
        center
        @close="submitCancel('AddCourseInfoForm')"
        @closed="addCourseClosed"
      >
        <div class="addcourseInfoModalDialogBody">
          <div class="addcourseInfoModalDialogBody_left">
            <div class="addcourseInfoModalDialogBody_left_head title">
              基本信息
            </div>
            <div class="addcourseInfoModalDialogBody_left_content">
              <el-form
                ref="AddCourseInfoForm"
                name="AddCourseInfoForm"
                :model="addCourseInfoForm"
                :rules="courseInfoRules"
                label-width="120px"
                size="small"
                label-position="right"
                status-icon
              >
                <el-form-item label="课程名称" prop="course_id">
                  <el-select
                    v-model="addCourseInfoForm.course_id"
                    filterable
                    placeholder="请选择课程名称"
                    style="width: 86%"
                    @keydown.enter.native="skipInput"
                    @focus="isSubmitError = false"
                  >
                    <el-option
                      v-for="item in courseNumList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <!-- prop="semester" -->
                <el-form-item label="开课学期">
                  <div class="block" style="display: flex">
                    <el-col :span="10">
                      <el-form-item prop="year">
                        <el-date-picker
                          v-model="addCourseInfoForm.year"
                          type="year"
                          value-format="yyyy"
                          placeholder="选择年"
                          style="width: 95%"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item prop="semester">
                        <el-select
                          v-model="addCourseInfoForm.semester"
                          placeholder="请选择学期"
                          style="width: 97%"
                        >
                          <el-option
                            v-for="item in semesterOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </div>
                </el-form-item>

                <el-form-item label="授课老师" prop="teacherIdList">
                  <el-select
                    v-model="addCourseInfoForm.teacherIdList"
                    multiple
                    filterable
                    placeholder="请选择授课老师"
                    style="width: 86%"
                    @keydown.enter.native="skipInput"
                    @focus="isSubmitError = false"
                  >
                    <el-option
                      v-for="item in teacherList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                  <el-switch
                    v-model="addCourseInfoForm.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="停用"
                    :active-value="1"
                    :inactive-value="0"
                    style="margin-left: 2%; "
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="addcourseInfoModalDialogBody_right">
            <div class="addcourseInfoModalDialogBody_right_head title">
              上课学生名单
            </div>
            <div class="addcourseInfoModalDialogBody_right_content">
              <div class="searchContent">
                <el-input
                  v-model="addCourseSearchValue"
                  placeholder="请输入搜索班级、学生"
                  prefix-icon="el-icon-search"
                  clearable
                  @input="addCourseSearch"
                />
              </div>
              <div class="treeAndTable">
                <div v-loading="updateCourseLoading" class="treeAndTable_tree">
                  <el-tree
                    v-show="!updateCourseLoading"
                    ref="tree"
                    class="tree"
                    :data="addCourseTreeData"
                    :props="defaultProps"
                    :highlight-current="true"
                    @node-click="addCourseTreeNodeClick"
                  >
                    <span slot-scope="{ data }" class="custom-tree-node">
                      <span>{{ data.name }}</span>
                      <span
                        style="margin-left: 15px"
                      >{{ `(${data.existNum}/${data.stuNum})` }}
                      </span>
                    </span>
                  </el-tree>
                </div>

                <div class="treeAndTable_table">
                  <el-table
                    ref="multipleTable"
                    size="medium"
                    height="499"
                    :data="addCourseTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="selectAddCourseStuLIst"
                    @select-all="selectfloatCarAll"
                    @selection-change="tableSelectionChange"
                  >
                    <el-table-column type="selection" />
                    <el-table-column prop="name" label="全选" />
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" center class="dialog-footer">
          <el-button
            @click="submitCancel('AddCourseInfoForm')"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="submitAddCourseInfoForm('AddCourseInfoForm')"
          >确认添加</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新增课程 -->
    <!-- <el-dialog
      class="courseInfoModal"
      title="新增课程"
      :visible.sync="addCourseInfoFormVisible"
      center
      width="40%"
      @close="submitCancel('AddCourseInfoForm')"
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
      <el-form
        ref="AddCourseInfoForm"
        name="AddCourseInfoForm"
        :model="addCourseInfoForm"
        :rules="courseInfoRules"
        label-width="120px"
        size="small"
        label-position="right"
        status-icon
      >
        <el-form-item
          label="课程名称"
          prop="course_id"
        >
          <el-select
            v-model="addCourseInfoForm.course_id"
            filterable
            placeholder="请选择课程名称"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in courseNumList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开课班级"
          prop="class_id"
        >
          <el-select
            v-model="addCourseInfoForm.class_id"
            filterable
            placeholder="请选择开课班级"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in classList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="授课老师"
          prop="teacherIdList"
        >
          <el-select
            v-model="addCourseInfoForm.teacherIdList"
            multiple
            filterable
            placeholder="请选择授课老师"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开课学期">
          <div
            class="block"
            style="display: flex"
          >
            <el-col :span="10">
              <el-form-item prop="year">
                <el-date-picker
                  v-model="addCourseInfoForm.year"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                  style="width: 95%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="semester">
                <el-select
                  v-model="addCourseInfoForm.semester"
                  placeholder="请选择学期"
                  style="width: 97%"
                >
                  <el-option
                    v-for="item in semesterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="addCourseInfoForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="停用"
            :active-value="1"
            :inactive-value="0"
            style="margin-left: 2%; width: 40%"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="submitCancel('AddCourseInfoForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAddCourseInfoForm('AddCourseInfoForm')"
        >确 定</el-button>
      </span>
    </el-dialog> -->

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
        <p v-show="hasImportErrorMessageImport" class="submitError">
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
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button
          type="primary"
          :disabled="cannotAdd"
          @click="batchAdd"
        >确 定</el-button>
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
import { mapState, mapGetters } from 'vuex'
import skip from '@/utils/skip'
import { updateData, submitCancelCallback } from '@/utils/changeData'
import { exportFile } from '@/utils/exportFile'
import * as XLSX from 'xlsx'
import { actionReminder } from '@/utils/reminder'
export default {
	name: 'Emendation',
	props: [
		'rules',
		'semesterOptions',
		'courseNumList',
		'classList',
		'teacherList',
		'getTipList'
	],
	data() {
		return {
			// ========2023.1.5 新增课程需求=========
			node: null,

			updateCourseLoading: false,
			addCourseSearchValue: '',
			addCourseTreeData: [],
			defaultProps: {
				children: 'subArr',
				label: 'name'
			},
			addCourseTableData: [],

			addCourseTableDataChecked: [],
			// ========2023.1.5 新增课程需求 完=========

			addCourseInfoFormVisible: false,
			importDialogVisible: false,
			isDisabled: true, // 批量删除按钮是否禁用
			batchDelDialogVisible: false,
			isSubmitError: false,
			hasErrorMessage: false,
			errorMessage: '',
			DLTimer: null, // 模板下载防抖
			exportTimer: null, // 导出课表防抖
			uploadExcel: null, // 保存用户传入的课表
			uploadUrl: '', // 上传路径
			cannotAdd: true, // 上传页面是否可以进行添加
			hasImportErrorMessageImport: false,
			importErrorMessage: '',
			addCourseTimer: null, // 新增课程定时器
			addCourseInfoForm: {
				// 原来的class_id不需要，改为stuList数组
				// class_id: [],
				stuList: [],
				course_id: null,
				year: '',
				semester: null,
				teacherIdList: [],
				status: 1
			},
			courseInfoRules: {
				course_id: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				class_id: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				teacherIdList: [
					{
						required: true,
						validator: this.rules.checkArr,
						trigger: 'blur'
					}
				],
				year: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				semester: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				status: [
					{ required: true }
				]
			}
		}
	},
	watch: {
		goabled() {
			this.isDisabled = this.$store.state.courseInfo.goabled
		},
		addCourseSearchValue(val) {
			if (val == '') {
				this.getAddCourseTreeData()
			}
		}
	},
	created() {
		this.getAddCourseTreeData()
	},
	mounted() {
		this.uploadUrl =
			process.env.VUE_APP_BASE_API + '/courseLibrary/courseLibrary/upload'
	},
	methods: {
		// ========2023.1.5 新增课程需求=========
		// 关闭时需要让el-tree table为空
		addCourseClosed() {
			this.addCourseSearchValue = ''
			this.addCourseInfoForm.stuList = []
			// 关闭后会保留搜索数据 要重新获取
			this.getAddCourseTreeData()
		},

		// 新增弹窗 学生table 单选
		selectAddCourseStuLIst(selection, row) {
            // console.log('123', 123)
			// 获取在所有勾选id数组的下标
			const index = this.addCourseTableDataChecked.findIndex((item) => {
				return item == row.id
			})
			if (this.addCourseTableDataChecked.includes(row.id)) {
				this.addCourseTableDataChecked.splice(index, 1)
			} else {
				this.addCourseTableDataChecked.push(row.id)
			}

			// 动态改变班级节点 existNum

			this.node.data.existNum = selection.length
			// console.log(this.node,'第一处变化--------------------------------');

			const inUpdateCourseTableDataIndex = this.addCourseTableData.findIndex(
				(item) => {
					return item.id == row.id
				}
			)
			// 点击勾选的变为未勾选
			console.log(row, 'row') // {checked:false}
			console.log(row.checked, row) // true

			if (row.checked == true) {
				// console.log(this.node,'1111');

				this.node.parent.data.existNum--
				// console.log(this.node,'第二处变化--------------------------------');

				// this.node.parent.data.existNum = -110
				// console.log(this.node.parent,'未勾选');

				this.addCourseTableData[inUpdateCourseTableDataIndex].checked = false
			} else {
				// 点击未勾选的变成勾选
				this.node.parent.data.existNum++
				// console.log(this.node,'第三处变化--------------------------------');
				// this.node.parent.data.existNum = 110
				//  console.log(this.node.parent,'勾选');

				this.addCourseTableData[inUpdateCourseTableDataIndex].checked = true
			}
		},
		// 新增弹窗 学生table 全选
		selectfloatCarAll(selection) {
            // console.log('123', 123)
			if (selection.length == 0) {
				// 取消全选操作
				// console.log('取消全选操作');
				const updateCourseTableDataOfIdArr = []
				this.addCourseTableData.map((item) => {
					updateCourseTableDataOfIdArr.push(item.id)
					item.checked = false
					return item
				})
				updateCourseTableDataOfIdArr.forEach((item) => {
					this.addCourseTableDataChecked.splice(
						this.addCourseTableDataChecked.indexOf(item),
						1
					)
				})
				this.node.parent.data.existNum -= this.addCourseTableData.length
				// console.log(this.node,'第四处变化--------------------------------');
			} else {
				// 全选操作
				// console.log('全选操作')
				// 全选之前保存已经勾选几个

				let currentCheckNum = 0
				this.addCourseTableData.forEach((item) => {
					if (item.checked == true) {
						currentCheckNum++
					}
				})

				const updateCourseTableDataOfIdArr = []
				this.addCourseTableData.map((item) => {
					updateCourseTableDataOfIdArr.push(item.id)
					item.checked = true
					return item
				})
				let concatArr = []
				concatArr = Array.from(
					new Set(
						updateCourseTableDataOfIdArr.concat(this.addCourseTableDataChecked)
					)
				)
				this.addCourseTableDataChecked = concatArr
				this.node.parent.data.existNum =
					this.node.parent.data.existNum -
					currentCheckNum +
					this.addCourseTableData.length
					// console.log(this.node,'第五处变化--------------------------------');
			}
            // console.log('123', 123)
			this.node.data.existNum = selection.length
			// console.log(this.node,'第六处变化--------------------------------');
			// console.log('全选', this.addCourseTableData);
		},

		// 编辑弹窗 学生table 勾选改变
		tableSelectionChange(selection) {
            // console.log('selection',this.node.parent.data.existNum)

			this.node.parent.parent.data.existNum = 0
			// console.log(this.node,'第七处变化--------------------------------');
			this.$nextTick(() => {
				// this.node.parent.parent.data.existNum =
				// 	this.addCourseTableDataChecked.length
				 console.log(this.node.parent.parent.data.existNum, 'this.node.parent.parent.data.existNum')

				 // 计算所有 childNodes 中 existNum 的总和
				 const totalExistNum = this.node.parent.parent.childNodes.reduce((sum, child) => {
					// console.log(sum,child);

					// 确保每个 child 存在 data 和 existNum
					return sum + (child.data && child.data.existNum ? child.data.existNum : 0)
				}, 0)

				// 你可以在这里更新父节点的数据
				console.log(totalExistNum, '赋值了')

				this.node.parent.parent.data.existNum = totalExistNum
			})
		},

		// 处理 搜索 数据
		traverse(obj) {
			const objArr = obj
			for (var i in objArr) {
				if (objArr[i].subArr) {
					this.traverse(objArr[i].subArr)
				}
				if (objArr[i].type == 2) {
					objArr[i].subArr = []
				}
			}
			return objArr
		},

		decorateClassArr(arr) {
			console.log('decorateClassArr', arr)
			for (let i = 0, len = arr.length; i < len; i++) {
				if (arr[i].subArr[0]) {
					const major = arr[i].subArr
					for (let j = 0, mlen = major.length; j < mlen; j++) {
						if (major[j].subArr[0]) {
							const subClass = major[j].subArr
							for (let k = 0, clen = subClass.length; k < clen; k++) {
								subClass[k].name = subClass[k].grade + '级' + subClass[k].name
							}
						}
					}
				}
			}
			return arr
		},

		// 新增课程 el-tree搜索
		addCourseSearch(keyword) {
			const param = {
				keyword: keyword
			}
			this.$store
				.dispatch('courseInfo/searchAgencyAndStuAction', param)
				.then((res) => {
					console.log('新增课程查询res.data', res)
					this.addCourseTreeData = this.decorateClassArr(
						this.traverse(res.data)
					)
					// 搜索成功后避免右边table数据还是未搜索之前的所以要置空
					this.addCourseTableData = []
					this.addCourseTableDataChecked = []
					console.log(this.addCourseTableDataChecked,'清空添加选中的');
					
					
				})
			
		},

		// 获取AddCourseTreeData
		getAddCourseTreeData() {
			this.updateCourseLoading = true
			this.$store.dispatch('organizManage/getOrganizListAction').then(() => {
				this.addCourseTreeData = this.decorateClassArr(
					this.$store.getters['organizManage/getOrganizList']
				)
				this.updateCourseLoading = false
			})
		},

		// 点击el-tree节点发起请求
		async addCourseTreeNodeClick(data, node, self) {
			// console.log('触发了addCourse',node.parent,this.addCourseTreeData);
			// console.log('数据比较',node.parent === data);
			
            // console.log('data,node,self', data, node, self)
			this.node = node
			// console.log(this.node,'第八处变化--------------------------------');
			// console.log('点击el-tree节点data', data);
			// console.log('点击el-tree节点node', node);
			const findAllStuParam = {
				agency_id: data.id
			}
			if (Array.isArray(data.rightTable)) {
				// 右边table数据请求过就不再请求
				this.addCourseTableData = data.rightTable
			} else {
				// 发起请求查找所有的学生 右边table数据获取
				await this.$store
					.dispatch(
						'courseInfo/findCurrentCourseAllStuListAction',
						findAllStuParam
					)
					.then((res) => {
						res.data.map((item) => {
							item.checked = false
							return item
						})

						this.addCourseTableData = res.data
						// 右边数据放进左边
						this.node.data.rightTable = res.data
					})
			}

			this.$nextTick(() => {
				// console.log('后触发',this);

				for (let i = 0; i < this.addCourseTableData.length; i++) {
					if (
						this.addCourseTableDataChecked.includes(
							this.addCourseTableData[i].id
						)
					) {
						this.addCourseTableData[i].checked = true
						this.$refs.multipleTable.toggleRowSelection(
							this.addCourseTableData[i]
						)
					}
				}
				console.log(
					'击el-tree节点this.addCourseTableData------>',
					this.addCourseTableData
				)
			})
			// 重新赋值 清空上次选中的数据
			this.addCourseTableData = this.addCourseTableData.map(item => {
				// console.log('先触发,',item);

				return {
					...item,
					checked: false
				}
			})
			//console.log(this.node, '添加结束后')
		},

		showaddCourseMessage() {
			this.$message('没有勾选学生，无法新增')
		},
		// ========2023.1.5 新增课程需求 完=========

		// ========新增课程模块=========
		submitAddCourseInfoForm(formName, that) {
			
			
			this.addCourseInfoForm.stuList = this.addCourseTableDataChecked
			console.log('需要添加数据的id',this.addCourseInfoForm.stuList);
			// console.log(
			// 	'this.addCourseInfoForm.stuList',
			// 	this.addCourseInfoForm.stuList
			// )
			if (this.addCourseTimer) {
				clearTimeout(this.addCourseTimer)
			}
			this.addCourseTimer = setTimeout(() => {
				that || (that = this)
				updateData(formName, that).then((res) => {
					if (res == null) {
						this.addCourseTableData = []
					this.addCourseTableDataChecked = []
						return
					}
					if (res.code || res.code === 0) {
						actionReminder(res, this)

						
					} else {
						that.isSubmitError = res
						that.hasErrorMessage = false
						that.errorMessage = ''
					}
				}).finally(()=>{
					this.addCourseTableData = []
					this.addCourseTableDataChecked = []
				})
			}, 500)
		},

		// 取消新增页面
		submitCancel(formName) {
			this.addCourseTableData = []
			this.addCourseTableDataChecked = []
			submitCancelCallback(formName, this)
		},
		// ========新增课程模块完=========

		// ========导入课表模块========
		// 导入课表
		fileUpload(val) {
			const filename = {
				name: val.data,
				type: 2
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
			for (let i = 0, count = 0, len = this.uploadExcel.length; i < len; i++) {
				const addForm = {
					course_id: this.uploadExcel[i].course_id,
					year: this.uploadExcel[i].year,
					semester: this.uploadExcel[i].semester,
					class_id: this.uploadExcel[i].class,
					teacherIdList: this.uploadExcel[i].teacherIdList,
					status: 1
				}
				const val = {
					list: [addForm]
				}
				await this.$store
					.dispatch(`courseInfo/addCourseInfoAction`, val)
					.then((res) => {
						console.log(res)
						if (res.code === 0) {
							count++
							if (count === len) {
								this.$store.commit(`courseInfo/set_goreset`) // 更新页面
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
				this.$store
					.dispatch('courseInfo/getCourseInfoListAction')
					.then((res) => {
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
				// 处理列
				switch (worksheet[`${col}1`].v) {
					case 'updated_at':
						this.deleteCol(worksheet, range, i)
						break
					case 'end_time':
						this.deleteCol(worksheet, range, i)
						break
					case 'start_time':
						this.deleteCol(worksheet, range, i)
						break
					case 'class_id':
						this.deleteCol(worksheet, range, i)
						break
					case 'course_id':
						this.deleteCol(worksheet, range, i)
						break
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
					case 'courseName':
						worksheet[`${col}1`].v = '课程名称'
						break
					case 'semester':
						worksheet[`${col}1`].v = '开课学期'
						break
					case 'classObjList':
						worksheet[`${col}1`].v = '开课班级'
						// 转化班级格式
						for (let row = 2; row < range.e.r + 2; row++) {
							worksheet[`${col}${row}`].v =
								worksheet[`${col}${row}`][0].value +
								'级' +
								worksheet[`${col}${row}`][0].name
						}
						break
					case 'teacherNameList':
						worksheet[`${col}1`].v = '授课老师'
						// 转化老师格式
						for (let row = 2; row < range.e.r + 2; row++) {
							worksheet[`${col}${row}`].v = worksheet[`${col}${row}`].join()
						}
						break
					case 'status':
						worksheet[`${col}1`].v = '课程状态'
						// 转化课程状态格式
						for (let row = 2; row < range.e.r + 2; row++) {
							switch (worksheet[`${col}${row}`].v) {
								case 1:
									worksheet[`${col}${row}`].v = '启用'
									break
								case 0:
									worksheet[`${col}${row}`].v = '停用'
									break
							}
						}
						break
				}
			}
            console.log('workbook', workbook)
			// 添加worksheet
			XLSX.utils.book_append_sheet(workbook, worksheet, 'result')
			const wbout = XLSX.write(workbook, {
				bookType: 'xlsx',
				bookSST: true,
				type: 'array'
			})
			exportFile(wbout, '课程信息.xlsx') // 下载
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
			return XLSX.utils.encode_cell({
				r,
				c
			})
		},
		// ========导出课表模块完========

		// 批量删除
		delIndeed() {
			this.$store.commit('courseInfo/set_godelete')
			this.batchDelDialogVisible = false
		},

		// 下载模板
		DLTemplate() {
			if (this.DLTimer) {
				clearTimeout(this.DLTimer)
			}
			this.DLTimer = setTimeout(() => {
				const val = {
					name: '虚拟仿真教学平台-课程信息表模板.xlsx'
				}
				this.$store.dispatch('courseLib/DLTemplateAction', val).then((res) => {
					exportFile(res, '课程信息模板.xlsx')
				})
			}, 500)
		},

		// 用户填写表单按下enter时的回调
		skipInput(e) {
			skip.skipInput(e, this)
		}
	},
	computed: {
		...mapState('courseInfo', ['goabled']),
		...mapGetters(['myHeader'])
	}
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
	width: 4px;
}

::-webkit-scrollbar-thumb {
	background-color: rgba(215, 215, 215, 1);
}

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
			// margin-bottom: 20px;
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

	.courseInfoModal::v-deep input[type='number'] {
		-moz-appearance: textfield;
	}

	// 导入课表对话框样式
	.import-modal .course-upload {
		text-align: center;
	}

	//新增课程-----------
	.courseInfoModalDialog {
		::v-deep .el-dialog {
			margin-top: 10vh;
			border-radius: 5px;
			// height: 400px;
			width: 50%;
			min-width: 700px;

			.el-dialog__header {
				border-radius: 5px 5px 0 0;
				background-color: #304156;
				height: 45px;
				display: flex;
				align-items: center;

				.el-dialog__title {
					margin-left: 45%;
					color: white;
				}

				.el-dialog__headerbtn {
					top: 10px;
					right: 10px;

					.el-dialog__close {
						color: white;
						font-size: 26px;
						font-weight: bold;
					}
				}
			}

			.el-dialog__body {
				width: 100%;
				// height: 700px;
				// overflow: auto;
				// padding-left: 40px;
				// padding-right: 25px;
			}

			//自己后面添加的样式
			.addcourseInfoModalDialogBody {
				// width: 600px;
				height: 600px;
				// border: 1px solid red;
				display: flex;

				.el-dialog {
					margin-top: 5vh;
				}

				.title {
					height: 35px;
					line-height: 35px;
					font-family: 'å¾®è½¯é›…é»‘ Bold', 'å¾®è½¯é›…é»‘ Regular',
						'å¾®è½¯é›…é»‘';
					font-weight: 700;
					font-style: normal;
					font-size: 20px;
					color: #000000;
				}

				.addcourseInfoModalDialogBody_left_head {
					margin-left: 50px;
				}

				.addcourseInfoModalDialogBody_left,
				.addcourseInfoModalDialogBody_right {
					width: 50%;
				}

				.addcourseInfoModalDialogBody_left_content {
					margin-top: 20px;

					.el-tree {
						padding: 10px;
					}

					.el-form-item--small.el-form-item {
						margin-bottom: 15px;
					}
				}

				.addcourseInfoModalDialogBody_right_content {
					margin-top: 20px;

					.searchContent {
						height: 36px;
					}

					.treeAndTable {
						height: 500px;
						margin-top: 5px;
						// padding: 5px;
						display: flex;
						border: 1px solid rgba(220, 223, 230, 1);

						.treeAndTable_tree {
							width: 60%;
							overflow-x: hidden;
							overflow-y: scroll;
							border-right: 1px solid rgba(220, 223, 230, 1);
						}

						.treeAndTable_table {
							width: 40%;

							.gutter {
								border-bottom: 1px solid #dfe6ec;
							}

							.el-table td {
								border-bottom: 0px;
							}

							.el-table__body-wrapper::-webkit-scrollbar {
								width: 4px; // 横向滚动条 y
								height: 4px; // 纵向滚动条 x
							}

							.el-table__body-wrapper::-webkit-scrollbar-thumb {
								background-color: rgba(215, 215, 215, 1);
							}
						}
					}
				}
			}
		}
	}
}
</style>
