<template>
  <div class="table">
    <el-table
      v-loading="isLoading"
      :data="courseInfoList"
      :tree-props="{ children: 'partitions', hasChildren: 'hasChildren' }"
      style="width: 100%; font-size: 13px"
      row-key="id"
      border
      @selection-change="courseInfoSelectionsChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column
        prop="course_no"
        width="100"
        label="课程编号"
        align="center"
      />
      <el-table-column prop="courseName" label="课程名称" align="center" />
      <el-table-column prop="semester" label="开课学期" align="center" />
      <el-table-column prop="stuNum" label="上课人数" align="center" />
      <el-table-column prop="teacherNameList" label="授课老师" align="center" />

      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span
            :style="{
              color: scope.row.status == '启用' ? '#25B26E' : '#999999',
            }"
          >
            {{ scope.row.status }}
          </span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="status" label="状态" align="center" /> -->

      <el-table-column prop="updated_at" label="更新时间" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="showUpdateCourseInfoForm(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="delCourseInfo(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑课程信息弹出框 test-->
    <!-- test编辑课程 -->
    <div class="courseInfoModalDialog">
      <el-dialog
        title="编辑课程信息"
        top="10vh"
        :visible.sync="updateCourseInfoFormVisible"
        width="50%"
        center
        @open="updateCourseopen"
        @close="submitCancel('UpdateCourseInfoForm')"
        @closed="updateCourseClosed"
      >
        <div class="addcourseInfoModalDialogBody">
          <div class="addcourseInfoModalDialogBody_left">
            <div class="addcourseInfoModalDialogBody_left_head title">
              基本信息
            </div>
            <div class="addcourseInfoModalDialogBody_left_content">
              <el-form
                ref="UpdateCourseInfoForm"
                name="UpdateCourseInfoForm"
                :model="updateCourseInfoForm"
                :rules="courseInfoRules"
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
                <el-form-item label="课程名称" prop="course_id">
                  <el-select
                    v-model="updateCourseInfoForm.course_id"
                    filterable
                    placeholder="请选择课程名称"
                    style="width: 86%"
                    @keydown.enter.native="skipInput"
                    @focus="
                      hasErrorMessage
                        ? (hasErrorMessage = false)
                        : (isSubmitError = false)
                    "
                  >
                    <el-option
                      v-for="item in courseNumList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <!-- <el-form-item label="开课班级" prop="class_id">
                  <el-select v-model="updateCourseInfoForm.class_id" filterable placeholder="请选择开课班级" style="width: 86%"
                    @keydown.enter.native="skipInput" @focus="isSubmitError = false">
                    <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item> -->

                <el-form-item label="授课老师" prop="teacherIdList">
                  <el-select
                    v-model="updateCourseInfoForm.teacherIdList"
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
                <el-form-item label="开课学期" prop="semester">
                  <div class="block" style="display: flex">
                    <el-date-picker
                      v-model="updateCourseInfoForm.year"
                      type="year"
                      value-format="yyyy"
                      placeholder="选择年"
                      style="width: 45%"
                      :clearable="false"
                    />
                    <el-select
                      v-model.number="updateCourseInfoForm.semester"
                      placeholder="请选择"
                      style="margin-left: 1%; width: 40%"
                    >
                      <el-option
                        v-for="item in semesterOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-switch
                    v-model="updateCourseInfoForm.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="关闭"
                    style="margin-left: 2%;"
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
                  v-model="updateCourseSearchValue"
                  placeholder="请输入搜索班级、学生"
                  prefix-icon="el-icon-search"
                  clearable
                  @input="updateCourseSearch"
                />
              </div>
              <div class="treeAndTable">
                <div v-loading="updateCourseLoading" class="treeAndTable_tree">
                  <el-tree
                    v-show="!updateCourseLoading"
                    ref="tree"
                    class="filter-tree"
                    :data="updateCourseTreeData"
                    :props="defaultProps"
                    @node-click="updateCourseTreeNodeClick"
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
                    :data="updateCourseTableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @select="selectUpdateCourseStuLIst"
                    @select-all="selectUpdateCourseStuLIstAll"
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
            @click="submitCancel('UpdateCourseInfoForm')"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="submitUpdateCourseInfoForm('UpdateCourseInfoForm')"
          >确认</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 编辑课程信息弹出框 -->
    <el-dialog
      class="courseModal"
      title="编辑课程信息"
      visible.sync="false"
      center
      width="40%"
      @close="submitCancel('UpdateCourseInfoForm')"
    >
      <el-form
        ref="UpdateCourseInfoForm"
        name="UpdateCourseInfoForm"
        :model="updateCourseInfoForm"
        :rules="courseInfoRules"
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
        <el-form-item label="课程名称" prop="course_id">
          <el-select
            v-model="updateCourseInfoForm.course_id"
            filterable
            placeholder="请选择课程名称"
            style="width: 86%"
            @keydown.enter.native="skipInput"
            @focus="
              hasErrorMessage
                ? (hasErrorMessage = false)
                : (isSubmitError = false)
            "
          >
            <el-option
              v-for="item in courseNumList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开课班级" prop="class_id">
          <el-select
            v-model="updateCourseInfoForm.class_id"
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
        <el-form-item label="授课老师" prop="teacherIdList">
          <el-select
            v-model="updateCourseInfoForm.teacherIdList"
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
        <el-form-item label="开课学期" prop="semester">
          <div class="block" style="display: flex">
            <el-date-picker
              v-model="updateCourseInfoForm.year"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
              style="width: 45%"
            />
            <el-select
              v-model.number="updateCourseInfoForm.semester"
              placeholder="请选择"
              style="margin-left: 1%; width: 40%"
            >
              <el-option
                v-for="item in semesterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="updateCourseInfoForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="关闭"
            style="margin-left: 2%;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="submitCancel('UpdateCourseInfoForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitUpdateCourseInfoForm('UpdateCourseInfoForm')"
        >确 定</el-button>
      </span>
    </el-dialog>

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
	props: [
		'rules',
		'semesterOptions',
		'courseNumList',
		'classList',
		'teacherList',
		'loading',
		'getTipList'
	],
	data() {
		return {
			// ========2023.1.5 编辑课程需求=========
			node: null,

			updateCourseLoading: false,
			currentUpdateCourseId: null,
			updateCourseSearchValue: '',
			updateCourseTreeData: [],
			defaultProps: {
				children: 'subArr',
				label: 'name'
			},
			updateCourseTableData: [],
			updateCourseTableDataChecked: [],
			updateCourseTableDataChecked_old: [],
			// ========2023.1.5 编辑课程需求 完=========
			isLoading: true,
			courseInfoList: [], // 展示表格
			currentPage: 1, // 当前页
			total: 1, // 总条目数
			updateCourseInfoFormVisible: false,
			delDialogVisible: false,
			delRowId: null, // 要删除的行id
			isSubmitError: false,
			hasErrorMessage: false,
			errorMessage: '',
			courseInfoSelections: [],
			updateCourseInfoForm: {
				// 原来的class_id不需要，改为stuList数组
				// class_id: [],
				stuList: [],
				id: null,
				course_id: null,
				year: '',
				semester: null,
				teacherIdList: [],
				status: null
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
		// 外界操作后表格进入加载状态
		loading() {
			this.isLoading = !this.isLoading
		},
		// 展示搜索结果
		goupdate() {
			this.searchCourseInfo()
		},
		// 刷新页面
		goreset() {
			this.refreshCourseInfoList()
		},
		// 批量删除
		godelete() {
			this.delSelection()
		}
	},
	created() {
		this.refreshCourseInfoList()
	},
	methods: {
		// ========2023.1.5 编辑课程需求=========
		// 打开编辑弹窗时获取el-tree数据
		updateCourseopen() {
			this.updateCourseLoading = true
			const param = {
				course_semester_id: this.currentUpdateCourseId
			}
			this.$store
				.dispatch('organizManage/getOrganizListAction', param)
				.then((res) => {
					console.log('编辑课程信息res', res)
					// this.updateCourseTreeData = res.subArr
					this.updateCourseTreeData = this.decorateClassArr(
						this.traverse(res.subArr)
					)
					this.updateCourseLoading = false
				})
		},
		// 关闭时需要让el-tree table为空
		updateCourseClosed() {
			this.updateCourseSearchValue = ''
			this.updateCourseTreeData = []
			this.updateCourseTableData = []
			this.updateCourseInfoForm.stuList = []
		},

		// 编辑弹窗 学生table 单选
		selectUpdateCourseStuLIst(selection, row) {
			// 获取在所有勾选id数组的下标
			const index = this.updateCourseTableDataChecked.findIndex((item) => {
				return item == row.id
			})
			if (this.updateCourseTableDataChecked.includes(row.id)) {
				this.updateCourseTableDataChecked.splice(index, 1)
			} else {
				this.updateCourseTableDataChecked.push(row.id)
			}

			// 动态改变班级节点 existNum
			this.node.data.existNum = selection.length

			const inUpdateCourseTableDataIndex = this.updateCourseTableData.findIndex(
				(item) => {
					return item.id == row.id
				}
			)
			// 点击勾选的变为未勾选
			if (row.checked == true) {
				this.node.parent.data.existNum--
				this.updateCourseTableData[inUpdateCourseTableDataIndex].checked = false
			} else {
				// 点击未勾选的变成勾选
				this.node.parent.data.existNum++
				this.updateCourseTableData[inUpdateCourseTableDataIndex].checked = true
			}
		},

		// 编辑弹窗 学生table 全选
		selectUpdateCourseStuLIstAll(selection) {
			if (selection.length == 0) {
				// 取消全选操作
				console.log('取消全选操作')
				const updateCourseTableDataOfIdArr = []
				this.updateCourseTableData.map((item) => {
					updateCourseTableDataOfIdArr.push(item.id)
					item.checked = false
					return item
				})
				updateCourseTableDataOfIdArr.forEach((item) => {
					this.updateCourseTableDataChecked.splice(
						this.updateCourseTableDataChecked.indexOf(item),
						1
					)
				})
				this.node.parent.data.existNum -= this.updateCourseTableData.length
			} else {
				// 全选之前保存已经都选几个
				let currentCheckNum = 0
				this.updateCourseTableData.forEach((item) => {
					if (item.checked == true) {
						currentCheckNum++
					}
				})

				// 全选操作
				console.log('全选操作')
				const updateCourseTableDataOfIdArr = []
				this.updateCourseTableData.map((item) => {
					updateCourseTableDataOfIdArr.push(item.id)
					item.checked = true
					return item
				})
				let concatArr = []
				concatArr = Array.from(
					new Set(
						updateCourseTableDataOfIdArr.concat(
							this.updateCourseTableDataChecked
						)
					)
				)
				this.updateCourseTableDataChecked = concatArr
				this.node.parent.data.existNum =
					this.node.parent.data.existNum -
					currentCheckNum +
					this.updateCourseTableData.length
			}

			this.node.data.existNum = selection.length
			console.log('全选', this.updateCourseTableData)
		},

		// 编辑弹窗 学生table 勾选改变
		tableSelectionChange(selection) {
			this.$nextTick(() => {
				// this.node.parent.parent.data.existNum =
				// 	this.updateCourseTableDataChecked.length
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

		// 处理搜索数据
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

		// 编辑课程弹窗 el-tree搜索
		updateCourseSearch(keyword) {
			//
			this.updateCourseTableData = []
			this.updateCourseTableDataChecked = this.updateCourseTableDataChecked_old

			const param = {
				keyword: keyword,
				course_semester_id: this.currentUpdateCourseId
			}
			this.$store
				.dispatch('courseInfo/searchAgencyAndStuAction', param)
				.then((res) => {
					const arr = this.decorateClassArr(this.traverse(res.data))
					console.log('decorateClassArr', arr)
					this.updateCourseTreeData = arr
				})
		},

		// 点击el-tree节点发起请求
		async updateCourseTreeNodeClick(data, node, self) {
			this.node = node
			// console.log('点击el-tree节点data', data);
			// console.log('点击el-tree节点node', node);
			const findAllStuParam = {
				agency_id: data.id
			}
			if (Array.isArray(data.rightTable)) {
				// 右边table数据请求过就不再请求
				this.updateCourseTableData = data.rightTable
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

						this.updateCourseTableData = res.data
						// 右边数据放进左边
						this.node.data.rightTable = res.data
					})
			}

			this.$nextTick(() => {
				for (let i = 0; i < this.updateCourseTableData.length; i++) {
					if (
						this.updateCourseTableDataChecked.includes(
							this.updateCourseTableData[i].id
						)
					) {
						this.updateCourseTableData[i].checked = true
						this.$refs.multipleTable.toggleRowSelection(
							this.updateCourseTableData[i]
						)
					}
				}
				console.log(
					'击el-tree节点this.updateCourseTableData------>',
					this.updateCourseTableData
				)
			})
		},

		// ========2023.1.5 编辑课程需求 完=========
		// 刷新课程信息列表
		refreshCourseInfoList() {
			this.$emit('fetchTable')
			// const val = {
			// 	currentPage: this.currentPage
			// }
			// this.$store
			// 	.dispatch('courseInfo/getCourseInfoListAction', val)
			// 	.then(() => {
			// 		this.courseInfoList =
			// 			this.$store.getters['courseInfo/getCourseInfoList']
			// 		this.total = this.$store.getters['courseInfo/getCourseCount']
			// 		this.handleList()
			// 		this.isLoading = false
			// 	})
		},

		// 切换页码
		handleCurrentChange(val) {
			this.isLoading = true
			this.currentPage = val
			this.refreshCourseInfoList()
			this.$emit('setCurrentPage', val)
		},

		// 搜索回调课程信息
		searchCourseInfo() {
			this.courseInfoList = this.$store.getters['courseInfo/getCourseInfoList']
			this.total = this.$store.getters['courseInfo/getCourseCount']
			this.handleList()
			this.isLoading = false
		},

		// 处理表格内容
		handleList() {
			for (let i = 0, len = this.courseInfoList.length; i < len; i++) {
				// 处理开课班级
				if (
					this.courseInfoList[i].classObjList &&
					this.courseInfoList[i].classObjList[0]
				) {
					this.courseInfoList[i].classObjList =
						this.courseInfoList[i].classObjList[0].value +
						'级' +
						this.courseInfoList[i].classObjList[0].name
				}

				// 处理授课老师
				if (this.courseInfoList[i].teacherNameList[0]) {
					const teachers = this.courseInfoList[i].teacherNameList.join()
					this.courseInfoList[i].teacherNameList = teachers
				}

				// 处理时间格式
				this.courseInfoList[i].updated_at = dateToString(
					this.courseInfoList[i].updated_at
				)

				// 处理课程状态
				switch (this.courseInfoList[i].status) {
					case 1:
						this.courseInfoList[i].status = '启用'
						break
					case 0:
						this.courseInfoList[i].status = '停用'
				}
			}
		},

		// 删除课程信息
		delCourseInfo(target) {
			this.delDialogVisible = true
			this.delRowId = target.id
		},

		// 确认删除
		delIndeed() {
			this.isLoading = true
			const val = {
				list: [this.delRowId]
			}
			this.$store
				.dispatch('courseInfo/delCourseInfoAction', val)
				.then((res) => {
					this.refreshCourseInfoList()
					this.delDialogVisible = false
					this.delRowId = null
					actionReminder(res, this)
				})
		},

		// ========更新课程模块========
		// 弹出课程信息更新表单
		showUpdateCourseInfoForm(target) {
			console.log('点击了编辑课程', target)
			this.currentUpdateCourseId = target.id
			const findAllCheckStuParam = {
				course_semester_id: target.id
			}
			// 查找所有勾选的学生
			this.$store
				.dispatch(
					'courseInfo/findCurrentCourseAllCheckStuAction',
					findAllCheckStuParam
				)
				.then((res) => {
					this.updateCourseTableDataChecked = res.data
					this.updateCourseTableDataChecked_old = res.data
					// this.updateCourseInfoForm.stuList = res.data
				})

			for (const v in this.updateCourseInfoForm) {
				switch (v) {
					case 'year':
						this.updateCourseInfoForm[v] = target.semester.slice(0, 4)
						break
					case 'semester':
						this.updateCourseInfoForm.semester = target.semester.charAt(6)
						break
					case 'teacherIdList':
						this.listHandler(target)
						break
					case 'status':
						this.updateCourseInfoForm.status = target.status == '启用' ? 1 : 0
						break
					default:
						this.updateCourseInfoForm[v] = target[v]
						break
				}
			}
			this.updateCourseInfoFormVisible = true
		},

		// 处理教师数据格式
		listHandler(target) {
			this.updateCourseInfoForm.teacherIdList = []
			console.log('target', target)

			const IdList = target?.teacherNameList.length > 0 ? target?.teacherNameList.split(',') : []
			if (!IdList[0]) {
				this.updateCourseInfoForm.teacherIdList = null
			} else {
				for (let i = 0, len = IdList.length; i < len; i++) {
					for (let j = 0, jlen = this.teacherList.length; j < jlen; j++) {
						if (IdList[i] === this.teacherList[j].label) {
							this.updateCourseInfoForm.teacherIdList[i] =
								this.teacherList[j].value
						}
					}
				}
			}
		},

		// 提交课程信息更新表单
		submitUpdateCourseInfoForm(formName, that) {
			that || (that = this)
			this.updateCourseInfoForm.stuList = this.updateCourseTableDataChecked
			console.log(this.updateCourseInfoForm)
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
			submitCancelCallback(formName, this)
		},

		// 更新多选
		courseInfoSelectionsChange(val) {
			this.courseInfoSelections = val
			this.$store.commit('courseInfo/set_isDisabled', val)
		},

		// 批量删除选中课程信息
		delSelection() {
			// this.isLoading = true;
			const that = this
			batchDel('courseInfo', that)
		},

		// 用户填写表单按下enter时的回调
		skipInput(e) {
			skip.skipInput(e, this)
		}
	},
	computed: {
		...mapState('courseInfo', ['goupdate', 'goreset', 'godelete'])
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

//自己后面添加的样式 点击表格编辑课程
::-webkit-scrollbar {
	width: 4px;
}

::-webkit-scrollbar-thumb {
	background-color: rgba(215, 215, 215, 1);
}

//编辑课程-----------
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
		}

		//自己后面添加的样式
		.addcourseInfoModalDialogBody {
			height: 600px;
			display: flex;

			.el-dialog {
				margin-top: 5vh;
			}

			.title {
				height: 35px;
				line-height: 35px;
				font-family: 'å¾®è½¯é›…é»‘ Bold', 'å¾®è½¯é›…é»‘ Regular', 'å¾®è½¯é›…é»‘';
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
</style>
