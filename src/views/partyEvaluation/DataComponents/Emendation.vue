<template>
  <div class="emendation">
    <!-- <el-button type="primary" @click="addUserManageFormVisible = true">
      新增用户
    </el-button>-->
    <el-button
      type="primary"
      :disabled="agencyId !== agencyId"
      @click="showAddUserManageFormDialog"
    >新增用户</el-button>
    <el-button
      type="warning"
      :disabled="agencyId !== agencyId"
      @click="importDialogVisible = true"
    >导入表格</el-button>
    <el-button type="info" @click="exportSchedul">导出表格</el-button>
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
        v-loading="isAddLoading"
        name="AddUserManageForm"
        style="padding: 10px"
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
            accept=".jpg, .jpeg, .png, .JPG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="margin-left: 10px; width: 80%"
          >
            <img
              v-if="addUserManageForm.avatar"
              :src="addUserManageForm.avatar"
              class="avatar"
            >
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
        <el-form-item label="工号/学号" prop="member_no">
          <el-input
            v-model.trim="addUserManageForm.member_no"
            placeholder="请输入工号或学号"
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
        <el-button
          :disabled="isAddLoading"
          @click="submitCancel('AddUserManageForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          :disabled="isAddLoading"
          @click="submitAddUserManageForm('AddUserManageForm')"
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
        <p v-show="hasImportErrorMessageImport" class="submitError">
          {{ importErrorMessage }}
        </p>
      </transition>
      <el-upload
        ref="fileUpload"
        class="course-upload"
        accept=".csv"
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
        <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
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
	props: {
		rules: {
			type: Object,
			required: true,
			default: () => {}
		},
		agencyId: {
			type: Number
		},
		agencyName: {
			type: String
		},
		currentPage: {
			type: Number
		},
		userTypeOptions: {
			type: Array
		},
		uploadPicUrl: {
			type: String
		},
		refreshTabel: {
			type: Function
		}
	},
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
			organizNav: [], // 导出或导入表格时处理数据用的机构列表
			addUserManageFormVisible: false,
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
			DLTimer: null, // 模板下载防抖
			exportTimer: null, // 导出表格防抖
			addTimer: null, // 新增用户防抖
			isAddLoading: false, // 新增用户加载
			addUserManageForm: {
				agency_id: null,
				avatar: '', // 用户上传后返回的头像路径
				member_no: '', // 工号或学号
				s_role_id: '', // 角色类型
				name: '',
				login_code: '',
				password: '',
				mobile: '',
				email: ''
			},
			userRules: {
				// avatar: [{ validator: this.rules.checkContent, trigger: "blur" }],
				member_no: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				s_role_id: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				name: [
					{
						required: true,
						validator: validateName,
						trigger: 'blur'
					}
				],
				login_code: [
					{
						required: true,
						validator: this.rules.checkContent,
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						validator: this.rules.checkNewPassword,
						trigger: 'blur'
					}
				],
				mobile: [
					{
						validator: this.rules.checkTel,
						trigger: 'blur'
					}
				],
				email: [
					{
						validator: this.rules.checkEmail,
						trigger: 'blur'
					}
				]
			}
		}
	},
	computed: {
		...mapState('userManage', ['goabled']),
		...mapGetters(['myHeader'])
	},
	watch: {
		goabled() {
			this.isDisabled = this.$store.state.userManage.goabled
		}
	},
	mounted() {
		this.getTipList()
		this.uploadUrl =
			process.env.VUE_APP_BASE_API + '/courseLibrary/courseLibrary/upload'
	},
	methods: {
		// ========新增用户模块========
		showAddUserManageFormDialog() {
			this.addUserManageForm.agency_id = this.agencyId
			this.addUserManageFormVisible = true
		},

		submitAddUserManageForm(formName, that) {
			this.isAddLoading = true
			if (this.addTimer) {
				clearTimeout(this.addTimer)
			}
			this.addTimer = setTimeout(() => {
				that || (that = this)
                // 第四的true是为了给后端判断是否必填工号--前面的不知道
				updateData(formName, that, true, true).then((res) => {
					if (res.code || res.code === 0) {
						actionReminder(res, that)
						console.log(' that.addUserManageForm?.s_role_id', that.addUserManageForm?.s_role_id)

						if (res.code === 0) {
							const val = {
								agency_id: that.agencyId,
								currentPage: that.currentPage,
								roleIdList: [that.addUserManageForm?.s_role_id] || [3, 4, 5]
							}
							that.refreshTabel(val)
						}
					} else {
						that.isSubmitError = res
						that.hasErrorMessage = false
						that.errorMessage = ''
					}
					this.isAddLoading = false
				})
			}, 500)
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

		// ========导入表格模块========
		// 导入表格
		fileUpload(val) {
			const filename = {
				name: val.data,
				type: 3
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

		// 导入的表格添加到库中
		async batchAdd() {
			this.$emit('setLoading') // 表格进入加载状态
			for (
				let i = 0, count = 0, val = this.uploadExcel, len = val.length;
				i < len;
				i++
			) {
				const addForm = {}
				for (const v in val[i]) {
					addForm[v] = val[i][v]
				}
				addForm.agency_id = this.agencyId
				await this.$store
					.dispatch(`userManage/addUserManageAction`, addForm)
					.then((res) => {
						if (res.code === 0) {
							count++
							if (count === len) {
								this.$store.commit(`userManage/set_goresetIT`) // 更新页面
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

		// 取消上传表格
		cancelUpload() {
			this.importDialogVisible = false
			this.$refs['fileUpload'].clearFiles()
			this.hasImportErrorMessageImport = false
			this.importErrorMessage = ''
			this.removeExcel()
		},
		// ========导入课表模块完========

		// ========导出课表模块========
		// 导出课表
		exportSchedul() {
			if (this.exportTimer) {
				clearTimeout(this.exportTimer)
			}
			const val = {
				agency_id: this.agencyId,
				currentPage: undefined,
				roleIdList: [3, 4, 5]
			}
			this.exportTimer = setTimeout(() => {
				this.$store
					.dispatch('userManage/getITUserListWithAgencyAction', val)
					.then((res) => {
						this.exportExcel(res.data.pageUser)
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
					case 'avatar':
						this.deleteCol(worksheet, range, i)
						break
					case 'password':
						this.deleteCol(worksheet, range, i)
						break
					case 'createdAt':
						this.deleteCol(worksheet, range, i)
						break
					case 'updatedAt':
						this.deleteCol(worksheet, range, i)
						break
				}
				// 更改表中内容
				switch (worksheet[`${col}1`].v) {
					case 'agency_id':
						worksheet[`${col}1`].v = '所属机构'
						// 转化所属机构
						for (let row = 2; row < range.e.r + 2; row++) {
							for (let j = 0, len = this.organizNav.length; j < len; j++) {
								if (worksheet[`${col}${row}`].v === this.organizNav[j].value) {
									worksheet[`${col}${row}`].v = this.organizNav[j].label
								}
							}
						}
						break
					case 'email':
						worksheet[`${col}1`].v = '邮箱'
						break
					case 'mobile':
						worksheet[`${col}1`].v = '电话号码'
						break
					case 'login_code':
						worksheet[`${col}1`].v = '登录账号'
						break
					case 's_role_id':
						worksheet[`${col}1`].v = '角色类型'
						// 转化所属机构
						for (let row = 2; row < range.e.r + 2; row++) {
							switch (worksheet[`${col}${row}`].v) {
								case 3:
									worksheet[`${col}${row}`].v = '教师'
									break
								case 4:
									worksheet[`${col}${row}`].v = '学生'
									break
                                case 5:
                                    worksheet[`${col}${row}`].v = '助教'
                                    break
							}
						}
						break
					case 'name':
						worksheet[`${col}1`].v = '用户姓名'
						break
					case 'member_no':
						worksheet[`${col}1`].v = '工号/学号'
						break
					case 'id':
						worksheet[`${col}1`].v = '序号'
						// 转化序号格式
						for (let row = 2; row < range.e.r + 2; row++) {
							worksheet[`${col}${row}`].v = row - 1
						}
						break
				}
			}
			// 添加worksheet
			XLSX.utils.book_append_sheet(workbook, worksheet, 'result')
			const wbout = XLSX.write(workbook, {
				// bookType: 'xlsx',
				bookType: 'csv',
				bookSST: true,
				type: 'array'
			})
			// exportFile(wbout, `${this.agencyName}.xlsx`) // 下载
			exportFile(wbout, `${this.agencyName}.csv`) // 下载
		},

		// 删除列
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

		// 获取机构线性列表
		getTipList() {
			this.$store
				.dispatch('organizManage/getOrganizLinearListAction')
				.then(() => {
					const agencyList =
						this.$store.getters['organizManage/getOrganizLinearList']
					for (let i = agencyList.length - 1, counter = 0; i >= 0; i--) {
						if (agencyList[i].type === 2) {
							this.organizNav[counter] = {
								label: agencyList[i].grade + '级' + agencyList[i].name,
								value: agencyList[i].id
							}
							counter++
						} else if (agencyList[i].type > 0 || agencyList[i].type === 0) {
							this.organizNav[counter] = {
								label: agencyList[i].name,
								value: agencyList[i].id
							}
							counter++
						} else {
							continue
						}
					}
					this.flag = true
				})
		},
		// ========导出课表模块完========

		// 批量删除
		delIndeed() {
			this.$store.commit('userManage/set_godelete')
			this.batchDelDialogVisible = false
		},

		// 下载模板
		DLTemplate() {
			const val = {
				name: '虚拟仿真教学平台-用户模板.csv'
			}
			this.$store.dispatch('courseLib/DLTemplateAction', val).then((res) => {
				exportFile(res, '智能教学平台表格模板.csv')
			})
		},

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

		::v-deep .el-dialog__body {
			padding: 0;
		}

		.submitErrorTransition-enter-active,
		.submitErrorTransition-leave-active {
			transition: opacity 0.5s;
		}

		.submitErrorTransition-enter,
		.submitErrorTransition-leave-to {
			opacity: 0;
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

		.user-modal::v-deep input[type='number'] {
			-moz-appearance: textfield;
		}
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
