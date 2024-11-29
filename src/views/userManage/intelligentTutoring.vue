<template>
  <div ref="intelligentTutoring" class="intelligentTutoring">
    <NavMenu
      :section-height="sectionHeight"
      :refresh-tabel="refreshTabel"
      @setLoading="setLoading"
      @setCurrentPage="setCurrentPage"
      @setAgencyId="setAgencyId"
    />
    <div id="right-box" ref="rightBox">
      <Search
        ref="searchRef"
        :agency-id="agencyId"
        :user-type-options="userTypeOptions"
        @setLoading="setLoading"
      />
      <Emendation
        v-if="agencyId !== null && rules.checkContent"
        :rules="rules"
        :agency-id="agencyId"
        :agency-name="agencyName"
        :current-page="currentPage"
        :user-type-options="userTypeOptions"
        :upload-pic-url="uploadPicUrl"
        :refresh-tabel="refreshTabel"
        @setLoading="setLoading"
      />
      <Table
        v-if="agencyId !== null"
        :rules="rules"
        :agency-id="agencyId"
        :user-type-options="userTypeOptions"
        :upload-pic-url="uploadPicUrl"
        :loading="loading"
        :refresh-tabel="refreshTabel"
        @setCurrentPage="setCurrentPage"
        @fetchTable="fetchTable"
      />
    </div>
  </div>
</template>

<script>
import baseUrl from '@/store/modules/api'
import NavMenu from './ITComponents/NavMenu'
import Search from './ITComponents/Search'
import Emendation from './ITComponents/Emendation'
import Table from './ITComponents/Table'
export default {
	name: 'IntelligentTutoring',
	components: { NavMenu, Search, Emendation, Table },
	data() {
		return {
			rules: {
				checkContent: (rule, val, callback) => {
					if (!val) {
						callback(new Error('内容不能为空'))
					} else {
						callback()
					}
				},
				checkNewPassword: (rule, val, callback) => {
					if (!val) {
						callback(new Error('内容不能为空'))
					} else if (val && val.length < 6) {
						callback(new Error('密码不能小于6位或大于12位'))
					} else {
						callback()
					}
				},
				checkUpdatePassword: (rule, val, callback) => {
					if (val && val.length < 6) {
						callback(new Error('密码不能小于6位或大于12位'))
					} else {
						callback()
					}
				},
				checkNumber: (rule, val, callback) => {
					if (!val) {
						callback(new Error('内容不能为空'))
					} else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
						callback(new Error('值必须为不小于0的数字'))
					} else {
						callback()
					}
				},
				checkTel: (rule, val, callback) => {
					if (!val) {
						// callback(new Error('内容不能为空'))
						callback()
					} else if (!/^0?1[3|4|5|6|7|8][0-9]\d{8}$/.test(val)) {
						callback(new Error('格式错误'))
					} else {
						callback()
					}
				},
				checkEmail: (rule, val, callback) => {
					if (val === '' || val == null) {
						// callback(new Error('内容不能为空'))
						callback()
					} else if (
						!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,}){1,})$/.test(
							val
						)
					) {
						callback(new Error('格式错误'))
					} else {
						callback()
					}
				}
			},
			sectionHeight: null,
			// uploadPicUrl: `${baseUrl.baseUrl}/user/userCtr/uploadPicture`,
			uploadPicUrl: `${baseUrl.baseUrl}/manager/prod-api/user/userCtr/uploadPicture`,
			// uploadPicUrl: `${baseUrl.baseUrl}/user/userCtr/uploadPicture`,
			agencyId: null, // 当前展示的机构的id
			agencyName: '智能工程学院', // 当前展示的机构的名称
			currentPage: 1, // 当前页
			loading: 0, // 使表格处于加载状态
			userTypeOptions: [
				// 新增或更新用户时的用户类型选项
				{ value: 3, label: '教师' },
				{ value: 4, label: '学生' },
				{ value: 5, label: '助教' }
			]
		}
	},
	mounted() {
		this.sectionHeight = document.body.scrollHeight
		window.onresize = () => {
			this.sectionHeight = document.body.clientHeight - 10
		}
	},
	beforeDestroy() {
		window.onresize = null
	},
	methods: {
		// 设置表格加载状态
		setLoading() {
			this.loading = this.loading === 0 ? 1 : 0
		},

		// 保存当前展示的机构的id
		setAgencyId(val) {
			if (val && val.id) {
				this.agencyId = val.id
				this.agencyName = val.name
			} else {
				// 当没有机构时不能添加用户与导入表格
				this.agencyId = NaN
			}
		},

		// 保存当前页码
		setCurrentPage(val) {
			this.currentPage = val
		},

		// 根据机构的id刷新用户展示列表
		refreshTabel(val) {
			return new Promise((resolve) => {
				this.$store
					.dispatch('userManage/getITUserListWithAgencyAction', val)
					.then((res) => {
						if (res.code === 0) {
							this.$store.commit('userManage/set_goresetIT')
						}
						resolve(false)
					})
			})
		},
		fetchTable() {
			this.$refs.searchRef.searchTarget('searchForm', this.currentPage)
		}
	}
}
</script>

<style lang="scss" scoped>
.intelligentTutoring {
	display: flex;

	#right-box {
		display: inline-block;
		width: 85%;
	}
}
</style>
