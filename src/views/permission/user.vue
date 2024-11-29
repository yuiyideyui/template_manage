<template>
  <div class="app-container">
    <el-button v-show="createPower" type="primary" @click="handleAddUser()">新建用户</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
    <el-button v-show="deletePower" type="danger" @click="deleteSelection()">删除所选</el-button>
    <el-button v-show="queryPower" type="info" style="float:right;margin-left:0" @click="clearSearch">重置</el-button>
    <el-button v-show="queryPower" type="primary" style="float:right;;margin-right:10px" @click="searchVal">搜索</el-button>
    <el-input
      v-show="queryPower"
      v-model="search"
      style="float:right;width:20%"
      placeholder="查找"
    />
    <el-select v-show="queryPower" v-model="selectVal" style="float:right;;margin-right:10px" placeholder="请选择搜索条件">
      <el-option
        v-for="selectItem in selectList"
        :key="selectItem.value"
        :label="selectItem.label"
        :value="selectItem.value"
      />
    </el-select>
    <el-table ref="userlist" v-loading="loading" :data="userList" style="width: 100%;margin-top:30px;" height="62vh" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="head-center" label="用户名id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="登录账号" width="150">
        <template slot-scope="scope">
          {{ scope.row.login_code }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="角色头像" width="150">
        <template slot-scope="scope">
          <img :src="baseUrl + scope.row.avatar" alt="" style="width:4em;">
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="电话号码">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button v-show="updatePower" type="primary" size="small" @click="handleEdit(scope,'user')">编辑 </el-button>
          <el-button v-show="deletePower" type="danger" size="small" @click="handleDelete(scope)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="limit"
      hide-on-single-page
      :total="counts"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'">
      <el-form ref="user" :model="user" :rules="rules" :inline="true" label-width="120px" label-position="right">
        <el-form-item v-if="dialogType==='new'" v-model="user.avatar" prop="avatar" label="插入头像" class="avatar-uploader">
          <el-upload
            v-if="dialogType==='new'"
            class="el-upload"
            :action="fileUpload"
            :headers="{ authorization:'Bearer ' + token }"
            :limit="uploadLimit"
            :show-file-list="true"
            :file-list="fileList"
            :on-success="handleAvatarSuccessSet"
            :http-request="submitUpload"
            :on-remove="handleRemove"
            :on-exceed="exceedAlert"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item v-else v-model="user.avatar" prop="avatar" label="插入头像" class="avatar-uploader">
          <el-upload
            hide-required-asterisk="true"
            class="el-upload"
            :action="fileUpload"
            :headers="{ authorization:'Bearer ' + token }"
            :show-file-list="false"
            :on-success="handleAvatarSuccessSet"
            :http-request="submitUpload"
            :on-remove="handleRemove"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload></el-form-item>
        <el-form-item hide-required-asterisk="true" prop="login_code" label="登录账号">
          <el-input v-model="user.login_code" placeholder="登录账号" />
        </el-form-item>
        <el-form-item v-if="dialogType==='edit'" label="密码">
          <el-input v-model="user.password" placeholder="密码,默认为原密码" @input="change($event)" />
        </el-form-item>
        <el-form-item v-else hide-required-asterisk="true" prop="password" label="密码">
          <el-input v-model="user.password" autocomplete="on" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item hide-required-asterisk="true" prop="name" label="用户名">
          <el-input v-model="user.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="所属角色" prop="s_role_id">
          <el-select v-model="user.s_role_id" class="selector" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="手机号码" prop="mobile">
          <el-input v-model="user.mobile" placeholder="手机号码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('user')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import { handleAvatarSuccess } from '@/api/fileUpload'
// import store from '@/store'
import baseUrl from '@/store/modules/api'
import { getUsers, addSUser, deleteUser, updateUser } from '@/api/user'
import success from '@/utils/operation-message'
import { getRoles } from '@/api/role'

const defaultUser = {
  username: '',
  name: '',
  mobile: '',
  password: '',
  s_role_id: ''
}

export default {
  data() {
    var checkmobile = (rule, value, callback) => {
      const phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!(phoneReg.test(value))) {
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    var checkLoginCode = (rule, value, callback) => {
      const loginCodeReg = /[\u4E00-\u9FA5]/g
      if (value === '') {
        callback(new Error('请输入登录账号'))
      } else if (loginCodeReg.test(value)) {
        callback(new Error('登录账号不能带有中文!'))
      } else {
        callback()
      }
    }
    return {
      user: Object.assign({}, defaultUser),
      rules: {
        login_code: [{ required: true, validator: checkLoginCode, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        s_role_id: [{ required: true, message: '请选择所属角色', trigger: 'blur' }],
        mobile: [{ required: true, validator: checkmobile, trigger: 'blur' }]
      },
      userList: [],
      roleList: [],
      fileList: [],
      // 权限
      createPower: false,
      deletePower: false,
      updatePower: false,
      queryPower: false,
      avatar: '',
      dialogImageUrl: '',
      imageUrl: '',
      passwordStore: '',
      search: '',
      counts: 10, // 用户条数,先随便给，防止报错
      baseUrl: baseUrl.baseUrl,
      currentPage: 1, // 当前页面
      limit: 10, // 每页限制的条数
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      password_hint: '密码',
      nextProjectForm: {
        publicWelfareUrl: ''
      },
      errMsg: '',
      loading: false,
      uploadLimit: 1,
      multipleSelection: [],
      selectList: [
        {
          label: '用户名',
          value: 'name'
        },
        {
          label: 'Id',
          value: 'id'
        },
        {
          label: '角色',
          value: 's_role_id'
        },
        {
          label: '登录名',
          value: 'login_code'
        }
      ],
      selectVal: ''
    }
  },
  computed: {
    ...mapGetters([
      'fileUpload',
      'token',
      'roles'])
  },
  created() {
    this.getUsers()
    this.getRoles()
    this.powerSet()
  },
  methods: {
    async getUsers(Val) {
      this.loading = true
      const selectVal = this.selectVal
      let res = ''
      const RoleItem = this.roleList.find(i => i.name === Val)
      switch (selectVal) {
        case 'name':
          res = await getUsers({ limit: this.limit, page: this.currentPage, name: Val })
          break
        case 's_role_id':
          if (RoleItem) {
            res = await getUsers({ limit: this.limit, page: this.currentPage, s_role_id: Number(RoleItem.id) })
          } else {
            res = await getUsers({ limit: this.limit, page: this.currentPage })
            this.$message({
              type: 'info',
              message: '未找到该角色'
            })
          }
          break
        case 'id':
          res = await getUsers({ limit: this.limit, page: this.currentPage, id: Number(Val) })
          break
        case 'login_code':
          res = await getUsers({ limit: this.limit, page: this.currentPage, login_code: Val })
          break
        // 条件不足尚不能完全模糊
        // case 'all':
        //   if ((Val !== '' || Val !== null) && !isNaN(Val)) {
        //     res = await getUsers({ limit: this.limit, page: this.currentPage, id: Number(Val) })
        //   } else {
        //     res = await getUsers({ limit: this.limit, page: this.currentPage, name: Val })
        //   }
        //   break
        case '':
          res = await getUsers({ limit: this.limit, page: this.currentPage })
          break
      }
      this.userList = res.data.rows
      this.counts = res.data.count
      this.loading = false
    },
    async getRoles() {
      this.loading = true
      const res = await getRoles({ limit: this.limit, page: this.currentPage })
      this.roleList = res.data.rows
      this.loading = false
    },
    async powerSet() {
      const powers = this.$route.meta.powers
      console.log('powers', powers)
      if (powers || powers !== undefined) {
        powers.forEach(i => {
          switch (i.fields) {
            case 'create':
              this.createPower = true
              break
            case 'update':
              this.updatePower = true
              break
            case 'delete':
              this.deletePower = true
              break
            case 'query':
              this.queryPower = true
              break
          }
        })
      }
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.fileList = []
      this.imageUrl = ''
    },
    handleEdit(scope, formName) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.password_hint = '不填写代表不修改'
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.user = deepClone(scope.row)
      this.imageUrl = this.baseUrl + scope.row.avatar
      this.fileList = [{ name: scope.row.name, url: this.imageUrl }]
      this.passwordStore = this.user.password
      this.user.password = ''
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该用户吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser({ id: scope.row.id })
          this.getUsers()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(err => { console.log(err) })
    },
    // 图片上传
    async submitUpload(content) {
      const url = content.file
      const formData = new FormData()
      formData.append('file', url)
      formData.append('name', 'avatar')
      await handleAvatarSuccess(formData).then(res => {
        const fileUrl = res.data.url
        this.avatar = fileUrl
        this.user.avatar = fileUrl
        // store.dispatch('user/resetAvatar', fileUrl)
        return this.avatar
      })
    },
    handleAvatarSuccessSet(res, file) {
      this.imageUrl = this.avatar ? this.baseUrl + this.avatar : URL.createObjectURL(file.raw)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      const formData = new FormData()
      formData.append('file', '')
      formData.append('name', 'avatar')
      handleAvatarSuccess(formData).then(res => {
        const fileUrl = res.data.url
        this.avatar = fileUrl
        // store.dispatch('user/resetAvatar', fileUrl)
        return this.avatar
      })
      this.imageUrl = ''
    },
    // 提交新增,上传
    handleConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        const isEdit = this.dialogType === 'edit'
        const user = this.user
        let res = ''
        if (user.avatar === '') { user.avatar = this.avatar }
        if (valid) {
          if (isEdit) {
            res = await updateUser({
              id: user.id,
              name: user.name,
              login_code: user.login_code,
              password: user.password ? user.password : this.passwordStore,
              avatar: this.avatar ? this.avatar : '/upload/avatar/default.png',
              mobile: user.mobile,
              s_role_id: user.s_role_id
            })
          } else {
            res = await addSUser({
              name: user.name,
              login_code: user.login_code,
              password: user.password,
              avatar: this.avatar ? this.avatar : '',
              mobile: user.mobile,
              s_role_id: user.s_role_id
            })
          }
          console.log(res)
          this.getUsers()
          this.dialogVisible = false
          success()
          this.passwordStore = ''
          this.avatar = ''
          const { mobile, login_code, name } = this.user
          this.dialogVisible = false
          this.$notify({
            title: isEdit ? '修改成功' : '新建成功',
            dangerouslyUseHTMLString: true,
            message: `
            <div>用户登录名: ${login_code}</div>
            <div>用户账户名: ${name}</div>
            <div>手机号: ${mobile}</div>
          `,
            type: 'success'
          })
        } else {
          console.log('error submit!')
          this.$notify({
            title: isEdit ? '修改失败' : '新建失败',
            dangerouslyUseHTMLString: true,
            message: `
                  <div>有内容未填或格式错误</div>
                `,
            type: 'error'
          })
          return false
        }
      })
    },
    exceedAlert() {
      this.$notify({
        title: '上传失败',
        dangerouslyUseHTMLString: true,
        message: `
                  <div>头像只能提交一个</div>
                `,
        type: 'error'
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUsers()
    },
    change(e) {
      this.$forceUpdate(e)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.userlist.toggleRowSelection(row)
        })
      } else {
        this.$refs.userlist.clearSelection()
      }
    },
    deleteSelection() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('确定删除' + this.multipleSelection.length + '条记录？', 'Warning', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            this.multipleSelection.forEach(async item => {
              await deleteUser({ id: item.id })
            })
            this.getUsers()
            success()
          })
          .catch(err => { console.error(err) })
      } else {
        this.$notify({
          title: '删除失败',
          dangerouslyUseHTMLString: true,
          message: `
              <div>请选择需要删除的用户</div>
              `,
          type: 'error'
        })
        return
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchVal() {
      if (this.search) {
        this.getUsers(this.search)
      }
    },
    clearSearch() {
      this.getUsers()
      this.search = ''
      this.selectVal = ''
    }
  }
}
</script>

<style lang="css" scoped>
.el-confirm__tip{
    display: block;
    float: left;
    }
.pagination{
  margin-top: .75em;
}
.avatar-uploader{
  float:left;
  margin-top:2em;
  height: 100%;
}
 .avatar-uploader .el-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover{
        border-color: #409eff;
    }
    .avatar-uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 170px;
        height: 170px;
        line-height: 170px;
        text-align: center;
    }
    .avatar{
        width: 170px;
        height: 170px;
        display: block;
    }
</style>
