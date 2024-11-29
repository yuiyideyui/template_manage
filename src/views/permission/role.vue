<template>
  <div class="app-container">
    <el-button v-show="createPower" type="primary" @click="handleAdd('role')">新建角色</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
    <el-button v-show="deletePower" type="danger" @click="deleteSelection()">删除所选</el-button>
    <el-button v-show="queryPower" type="info" style="float:right;margin-left:0" @click="clearSearch">重置</el-button>
    <el-button v-show="queryPower" type="primary" style="float:right;margin-right:10px" @click="getRoles()">搜索</el-button>
    <el-input
      v-show="queryPower"
      v-model="search"
      style="float:right;width:20%"
      placeholder="按角色名称搜索"
    />
    <el-select v-show="queryPower" v-model="selectVal" style="float:right;margin-right:10px" placeholder="请选择所属机构" @change="selectChange">
      <el-option
        v-for="selectItem in selectList"
        :key="selectItem.id"
        :label="selectItem.name"
        :value="selectItem.id"
      />
    </el-select>
    <el-table ref="rolelist" v-loading="loading" empty-text="-" :data="rolesList" style="width: 100%;margin-top:30px;" height="62vh" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="head-center" label="角色id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="角色权重">
        <template slot-scope="scope">
          {{ scope.row.menu_weight }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="所属机构">
        <template slot-scope="scope">
          {{ matchAgencyName(scope.row.agency_id) }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="包含的菜单和功能权限" width="520">
        <template slot-scope="scope">
          <ul v-for="(i,index) in scope.row.contain_menu_names" :key="index" class="text item">
            <li>{{ i.menuName }}</li>
            <ul v-for="(j,Inde) in i.power" :key="Inde" class="text item PowerItemText">
              <li>{{ j.name }}</li>
            </ul>
          </ul>
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="备注" width="150">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-show="updatePower" type="primary" size="small" @click="handleEdit(scope,'role')">编辑</el-button>
          <el-button v-show="deletePower" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          <!-- <el-button type="warning" size="small" @click="handleConfig(scope)">权限配置 </el-button> -->
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
    <el-dialog width="40%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form ref="role" :rules="rules" :inline="false" :model="role" label-width="100px" label-position="right">
        <el-form-item hide-required-asterisk="true" prop="name" label="角色名称">
          <el-input v-model="role.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="role.sort" prop="sort" type="number" placeholder="权重，比如:80" />
        </el-form-item>
        <el-form-item label="包含的菜单和功能权限" width="100">
          <el-cascader-panel v-model="role.contain_menu" :show-all-levels="false" :options="menusList" :props="props" clearable>
            <template slot-scope="{ node, data }">
              <span> {{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader-panel>
        </el-form-item>
        <el-form-item hide-required-asterisk="true" prop="menu_weight" label="角色权重">
          <el-input v-model="role.menu_weight" type="number" placeholder="角色权重，比如100" />
        </el-form-item>
        <el-form-item label="角色登录权重">
          <el-input v-model="role.login_weight" type="number" placeholder="角色登录权重,默认1000" />
        </el-form-item>
        <el-form-item label="所属部门" prop="agency_id">
          <el-select v-model="role.agency_id" class="selector" clearable placeholder="请选择角色所在机构">
            <el-option v-for="(item,key) in agencyIdList" :key="key" :value="item.id" :label="item.name">
              <span style="float: left; font-size: 13px;">{{ item.name }}</span>
              <span style="float: right; font-size: 13px;">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="role.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('role')">确定</el-button>
        <!-- <el-button type="warning" @click="resetForm">重置</el-button> -->
        <div slot="tip" class="el-confirm__tip">带*号为必填项</div>
      </div>
    </el-dialog>
    <!-- <el-dialog :visible.sync="ConfigDialogVisible" title="权限配置">

    </el-dialog> -->
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { getMenus, getPowerList } from '@/api/menu'
import { getAgency } from '@/api/agency'
import i18n from '@/lang'
// import { MessageBox, Message, Notification } from 'element-ui'
import success from '@/utils/operation-message'

const defaultRole = {
  name: '',
  contain_menu: '', // [3,4,5]
  contain_menuName: '',
  sort: '',
  agency_id: '',
  menu_weight: '',
  login_weight: '',
  remark: ''
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      agencyIdList: [],
      counts: 10,
      props: { multiple: true, checkStrictly: true, emitPath: false },
      rules: {
        name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        agency_id: [{ required: true, message: '请选择角色所在机构', trigger: 'change' }],
        menu_weight: [{ required: true, message: '请填写角色权重', trigger: 'blur' }]
      },
      menusList: [],
      // 权限
      createPower: false,
      deletePower: false,
      updatePower: false,
      queryPower: false,
      currentPage: 1, // 当前页面
      limit: 10, // 每页限制的条数
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      loading: false,
      multipleSelection: [],
      search: '',
      selectList: [],
      selectVal: '',
      powerList: [],
      powerSelectList: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoles()
    this.getPowerList()
    this.getAllMenus()
    this.powerSet()
    // this.getMenus()
  },
  methods: {
    async getRoles(Val) {
      console.log(Val)
      this.saveAgencyIds()
      this.loading = true
      let all = ''
      let res = ''
      let searchVal = ''
      all = await getRoles()
      const searchTarget = all.data.rows.filter(i => { return i.name === this.search })
      searchTarget.length !== 0 ? searchVal = searchTarget[0].id : ((this.search && !Val) ? this.$message({ message: '输入内容不符或没有对应角色名称', type: 'error' }) : searchVal = '')
      if (searchVal && !Val) {
        res = await getRoles({ limit: this.limit, page: this.currentPage, id: searchVal })
      } else if (Val && Val !== 'all') {
        res = await getRoles({ limit: this.limit, page: this.currentPage, agency_id: Val })
      } else {
        res = await getRoles({ limit: this.limit, page: this.currentPage })
      }
      this.rolesList = res.data.rows
      this.counts = res.data.rows.length
      this.loading = false
    },
    async getAllMenus() {
      this.loading = true
      const res = await getMenus()
      // this.menusList = res.data
      const data = res.data.rows
      for (const i in data) {
        this.menusList.push({ label: data[i].name, value: data[i].id, disabled: false, children: [] })
        const childrenContent = data[i].children
        if (childrenContent !== undefined && childrenContent.length !== 0) {
          const menusChildrenList = this.menusList[i]
          for (const j in childrenContent) {
            menusChildrenList.children.push({ label: childrenContent[j].name, value: childrenContent[j].id, disabled: false })
          }
        } else if (childrenContent === undefined) {
          const menusChildrenList = this.menusList[i]
          for (const i in this.powerSelectList) {
            menusChildrenList.children.push(
              this.powerSelectList[i]
            )
          }
        }
      }
      this.loading = false
    },
    async saveAgencyIds() {
      this.agencyIdList = []
      this.selectList = []
      const res = await getAgency()
      const agencyList = res.data.rows
      for (const i in agencyList) {
        this.agencyIdList.push({ name: agencyList[i].name, id: agencyList[i].id })
        this.selectList.push({ name: agencyList[i].name, id: agencyList[i].id })
      }
      // 最后设置<全部>选项
      this.selectList.push({ name: '全部', id: 'all' })
    },
    async getMenus() {
      this.loading = true
      const res = await getMenus()
      const data = res.data.rows
      for (const i in data) {
        this.menusList.push({ name: data[i].name, id: data[i].id, disabled: false })
      }
      this.loading = false
    },
    async getPowerList() {
      this.powerSelectList = []
      const res = await getPowerList()
      const data = res.data.rows
      this.powerList = data
      data.forEach(i => {
        this.powerSelectList.push({
          label: i.name,
          value: i.fields,
          disabled: false
        })
      })
    },
    async powerSet() {
      const powers = this.$route.meta.powers
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
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    handleAdd(formName) {
      this.role = Object.assign({}, defaultRole)
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.dialogType = 'new'
      this.dialogVisible = true
      for (const j in this.menusList) this.menusList[j].disabled = false
    },
    handleEdit(scope, formName) {
      this.dialogType = 'edit'
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.role = deepClone(scope.row)
    },
    // 显示包含菜单id的时候做去重
    uniq(cont) {
      if (cont.length !== 0) {
        cont = cont.toString()
        const arr = cont.split(',')
        const array = []
        for (var i = 0; i < arr.length; i++) {
          if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
          }
        }
        return array
      }
    },
    matchAgencyName(item) {
      if (item) {
        const AgencyName = this.agencyIdList.find(i => i.id === item)
        if (!AgencyName) return
        const name = AgencyName.name
        return name
      } else {
        return ''
      }
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除角色吗', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole({ id: scope.row.id })
          this.getRoles({ page: this.limit, limit: this.currentPage })
          success()
        })
        .catch(err => { console.error(err) })
    },
    async handleConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        const isEdit = this.dialogType === 'edit'
        this.role.menu_id = []
        this.role.menuGroup = []
        const role = this.role
        const splitItem = role.contain_menu
        const menu_id = role.menu_id
        splitItem.forEach(item => {
          if (!isNaN(item) && menu_id.indexOf(item) === -1) {
            role.menu_id.push(item); role.menuGroup.push({
              'menu_id': item,
              'powers': []
            })
          } else if (isNaN(item)) {
            const selectArr = this.powerList.filter(i => { return i.fields === item })
            // const targetId = selectArr[0].id
            // const targetGroup = role.menuGroup[role.menuGroup.length - 1]
            // if (targetGroup.length > 0 && targetGroup[targetGroup.length = 1] > targetId) return
            // if (targetGroup[targetGroup.length = 1] < targetId) {
            role.menuGroup[role.menuGroup.length - 1].powers.push(selectArr[0].id)
            // }
          }
        })
        for (const i in role.menuGroup) {
          this.uniq(role.menuGroup[i].powers)
        }
        if (valid) {
          if (isEdit) {
            await updateRole({
              id: role.id,
              name: role.name,
              contain_menu: role.menuGroup,
              sort: role.sort,
              agency_id: role.agency_id,
              menu_weight: role.menu_weight,
              login_weight: role.login_weight,
              remark: role.remark
            })
          } else {
            await addRole({
              name: role.name,
              contain_menu: role.menuGroup,
              sort: role.sort,
              agency_id: role.agency_id,
              menu_weight: role.menu_weight,
              login_weight: role.login_weight,
              remark: role.remark
            })
            this.getRoles()
            this.dialogVisible = false
            success()
            const { remark, id, name } = this.role
            this.dialogVisible = false
            this.$notify({
              title: isEdit ? '修改成功' : '新建成功',
              dangerouslyUseHTMLString: true,
              message: `
              <div>角色id: ${id || '无'}</div>
              <div>角色名: ${name}</div>
              <div>备注: ${remark || '无'}</div>
            `,
              type: 'success'
            })
          }
        } else {
          console.log('error submit!!')
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
    selectAvailble(val) {
      console.log(this.menusList, val, '对比')
      if (val) {
        for (const j in this.menusList) {
          for (const i in val) {
            const targetChildren = this.menusList[j].children
            if (val[i] === this.menusList[j].value) {
            // if (this.menusList[j].children !== [] && this.menusList[j] === val[i]) {
              for (const k in targetChildren) {
                targetChildren[k].disabled = false
              }
              console.log(targetChildren, '目标子集')
              return
            } else {
              for (const j in targetChildren) {
                targetChildren[j].disabled = true
              }
            }
          }
        }
      }
      // this.$forceUpdate()
    },
    handleSizeChange(val) {
      this.limit = val
      this.getRoles()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRoles()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.rolelist.toggleRowSelection(row)
        })
      } else {
        this.$refs.rolelist.clearSelection()
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
              await deleteRole({ id: item.id })
            })
            this.$nextTick(() => {
              this.getRoles()
            })
            success()
          })
          .catch(err => { console.error(err) })
      } else {
        this.$notify({
          title: '删除失败',
          dangerouslyUseHTMLString: true,
          message: `
              <div>请选择需要删除的角色</div>
              `,
          type: 'error'
        })
        return
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectChange() {
      if (this.selectVal) this.getRoles(this.selectVal)
    },
    clearSearch() {
      this.getRoles()
      this.search = ''
      this.selectVal = ''
    }
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
  }
}
</script>

<style lang="css" scoped>
.app-container .roles-table{
    margin-top: 30px;
}
.app-container .permission-tree {
    margin-bottom: 30px;
}
.el-confirm__tip{
    display: block;
    float: left;
}
.pagination{
  margin-top: .75em;
}
.PowerItemText{
  display: inline-block;
  /* width: 100%; */
  /* float: right; */
}
.selector{
  width:100%;
}
</style>
