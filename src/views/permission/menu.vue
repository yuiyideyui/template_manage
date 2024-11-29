<template>
  <div class="app-container">
    <el-button v-show="createPower" type="primary" @click="handleAdd('menu')">添加菜单</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
    <el-button v-show="deletePower" type="danger" @click="deleteSelection()">删除所选</el-button>
    <el-table ref="ShowMenu" v-loading="loading" :data="menuList" max-height="1000" style="width:100%;margin-top:15px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="head-center" label="主键id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="菜单名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="菜单性质">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="上级菜单">
        <template slot-scope="scope">
          {{ changeParentMenuProperty(scope.row.parent_id) }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="图标">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
          <!-- <div v-html="scope.row.icon" /> -->
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="备注" width="220">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="更新日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.updatedAt }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-show="updatePower" type="primary" size="small" @click="handleEdit(scope,'menu')">编辑</el-button>
          <el-button v-show="deletePower" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="limit"
      :page-sizes="[2,5,7,10]"
      hide-on-single-page
      :total="counts"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog width="30%" :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑菜单':'新建菜单'">
      <el-form ref="menu" :rules="rules" :model="menu" :inline="false" label-width="100px" label-position="left">
        <el-form-item hide-required-asterisk="true" label="菜单名称" prop="name">
          <el-input v-model="menu.name" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="菜单性质" prop="path">
          <el-select v-model="menu.path" style="width:100%" class="selector" clearable placeholder="请选择">
            <el-option v-for="(item,key) in routesList" :key="key" :value="item.value" :label="item.name">
              <span style="float: left; font-size: 13px;">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重定向地址">
          <el-input v-model="menu.redirect" placeholder="重定向地址" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="menu.parent_id" style="width:100%" class="selector" clearable placeholder="请选择,默认为最顶级">
            <el-option v-for="(item,key) in menuIdList" :key="key" :value="item.id" :label="item.name">
              <span style="float: left; font-size: 13px;">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="menu.parent_id ===0 || !menu.parent_id" hide-required-asterisk="true" label="客户端组件" class="block" required>
          <div>最顶级默认Layout</div>
        </el-form-item>
        <el-form-item v-else hide-required-asterisk="true" label="客户端组件" label-width="300" prop="component">
          <el-input v-model="menu.component" placeholder="客户端组件">
            <template slot="prepend">() => import('@/views</template>
            <template slot="append">')</template>
          </el-input>
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="菜单权重" prop="weight">
          <el-input v-model="menu.weight" type="number" placeholder="菜单权重" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-select v-model="menu.icon" style="width:100%" clearable filterable>
            <el-option v-for="(item,key) in iconList" v-show="item.value" :key="key" :value="item.name" :label="item.name">
              <svg-icon class="selectSvgIcon" :icon-class="item.value" />
              <span style="float: right; font-size: 13px;">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-select v-model="menu.hidden" style="width:100%" class="selector" placeholder="请选择,默认不隐藏" @change="change($event)">
            <el-option label="隐藏" value="1" />
            <el-option label="不隐藏" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="menu.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('menu')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import { getMenus, createMenu, deleteMenu, updateMenu } from '@/api/menu'
import success from '@/utils/operation-message'
import { getRoles } from '@/api/role'
import { mapGetters } from 'vuex'
import SvgIcon from '@/views/icons/svg-icons'
import { defaultroutes } from '@/router'
// import SvgIcons from '../icons/svg-icons'
const defaultMenu = {
  name: '',
  path: '',
  roles: '',
  parent_id: 0, // 权限管理
  hidden: '',
  component: '',
  redirect: 'noRedirect',
  weight: 100
}

export default {
  data() {
    return {
      menu: Object.assign({}, defaultMenu),
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请选择菜单性质', trigger: 'change' }],
        component: [{ required: true, message: '请输入客户端组件', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入菜单权重', trigger: 'blur' }]
      },
      menuList: [],
      menuTSList: [],
      roleList: [],
      iconList: [],
      menuIdList: [],
      routesList: [],
      // 权限
      createPower: false,
      deletePower: false,
      updatePower: false,
      queryPower: false,
      height: '63vh',
      search: '',
      counts: 10, // 菜单条数,先随便给
      currentPage: 1, // 当前页面
      limit: 10, // 每页限制的条数
      menuOptions: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      config: { checkStrictly: false, emitPath: false },
      loading: false,
      multipleSelection: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    },
    ...mapGetters(['roles', 'routes'])
  },
  created() {
    this.powerSet()
    this.saveIcons()
    this.Saveasyncroutes()
    this.getMenus()
    this.getRoles()
    // this.getMenuNodes()
  },
  methods: {
    async getMenus() {
      this.loading = true
      this.menuList = []
      this.menuTSList = []
      const res = await getMenus({ page: this.currentPage, limit: this.limit })
      console.log('menulist', res)
      // setTimeout(() => {
      this.saveMenuIds(res)
      this.menuList = res.data.rows
      this.counts = res.count
      this.loading = false
      // }, 500)
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
    // async getMenuNodes() {
    //  if (this.isAdmin()) {
    //     const res = await this.getAllMenus()
    //     const rows = res.data
    //     for (const i in rows) {
    //       this.menuOptions.push({ id: rows[i].id, component: rows[i].component })
    //     }
    //   } else {
    //     const res = await this.getMenus()
    //     const rows = res.data.rows
    //     for (const i in rows) {
    //       this.menuOptions.push({ id: rows[i].id, component: rows[i].component })
    //     }
    //   }
    // },
    async getRoles() {
      this.loading = true
      const res = await getRoles({ limit: this.limit, page: this.currentPage })
      this.roleList = res.data.rows
      this.loading = false
    },
    // 存入默认图标
    // <div class="icon-item">
    //             <svg-icon :icon-class="item" class-name="disabled" />
    //             <span>{{ item }}</span>
    //           </div>
    async Saveasyncroutes(children = defaultroutes) {
      console.log('astncroute', defaultroutes)
      children.forEach(i => {
        this.routesList.push({ name: i.meta.title, value: i.path })
        if (i.children) {
          this.Saveasyncroutes(i.children)
        }
      })
    },
    async saveIcons() {
      this.iconList = []
      for (const i in SvgIcon) {
        this.iconList.push({ name: SvgIcon[i], value: SvgIcon[i] })
      }
    },
    // 存入所有id
    async saveMenuIds(res) {
      this.menuTSList = res.data.rows
      for (const i in this.menuTSList) {
        this.menuIdList.push({ name: this.menuTSList[i].name, id: this.menuTSList[i].id })
      }
      console.log('menuid', this.menuIdList)
      this.menuTSList = []
    },
    // 判断是否为管理员来选择渲染页面
    // isAdmin() {
    //   if (this.roles === '系统管理员') {
    //     return true
    //   } else {
    //     return false
    //   }
    handleAdd(formName) {
      this.menu = Object.assign({}, defaultMenu)
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope, formName) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      // 将上级菜单id转为名称
      const parentName = this.changeParentMenuProperty(scope.row.parent_id)
      this.menu = deepClone(scope.row)
      this.menu.parent_id = parentName
      if (scope.row.component !== 0 && scope.row.component !== 'Layout') {
        const component = scope.row.component
        this.menu.component = component.substring(component.indexOf('/', 21), component.indexOf('")', 0))
      }
      if (scope.row.parent_id === 0) {
        this.menu.parent_id = ''
      }
      // 后置空，默认不隐藏
      this.menu.hidden = ''
    // 同上
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该菜单吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteMenu(scope.row.id)
        this.getMenus()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    handleConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        const isEdit = this.dialogType === 'edit'
        const menu = this.menu
        if (valid) {
          if (isEdit) {
            await updateMenu({
              id: menu.id,
              name: menu.name,
              path: menu.path,
              icon: menu.icon,
              component: menu.component === '' ? 'Layout' : '() => import("@/views' + menu.component + ' ")', // () => import('@/views/permission/config')
              parent_id: this.changeParentMenuProperty(menu.parent_id),
              redirect: menu.redirect,
              weight: menu.weight,
              hidden: Number(menu.hidden),
              remark: menu.remark
            })
          } else {
            await createMenu({
              name: menu.name,
              path: menu.path,
              icon: menu.icon,
              component: typeof (menu.component) === 'undefined' ? 'Layout' : '() => import("@/views' + menu.component + ' ")',
              parent_id: this.changeParentMenuProperty(menu.parent_id),
              redirect: menu.redirect,
              weight: menu.weight,
              hidden: menu.hidden,
              remark: menu.remark
            })
          }
          this.getMenus()
          this.dialogVisible = false
          const { hidden, remark, weight, path, name } = menu
          this.dialogVisible = false
          if (!weight && !name && !path) {
            this.$notify({
              title: isEdit ? '修改失败' : '新建失败',
              dangerouslyUseHTMLString: true,
              message: `
              <div>有内容未填</div>
            `,
              type: 'error'
            })
          } else {
            success()
            this.$notify({
              title: isEdit ? '修改成功' : '新建成功',
              dangerouslyUseHTMLString: true,
              message: `
              <div>菜单路径: ${path}</div>
              <div>角色名: ${name}</div>
              <div>是否隐藏: ${hidden === 1 ? '隐藏' : '不隐藏'}</div>
              <div>菜单权重: ${weight || '未设置'}</div>
              <div>备注: ${remark || '无'}</div>
            `,
              type: 'success'
            })
          }
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
    handleSelectionChange(val) {
      if (val) this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.limit = val
      this.getMenus()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMenus()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.ShowMenu.toggleRowSelection(row)
        })
      } else {
        this.$refs.ShowMenu.clearSelection()
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
              await deleteMenu({ id: item.id })
            })
            this.getMenus()
            success()
          })
          .catch(err => { console.error(err) })
      } else {
        this.$notify({
          title: '删除失败',
          dangerouslyUseHTMLString: true,
          message: `
              <div>请选择需要删除的菜单</div>
              `,
          type: 'error'
        })
        return
      }
    },
    changeParentMenuProperty(item) {
      console.log('item', item)
      if (item && !isNaN(item)) {
        const targetArr = this.menuIdList.filter(i => { return i.id === item })
        if (targetArr.length !== 0) {
          return targetArr[0].name
        } else {
          return '无'
        }
      } else {
        const targetArr = this.menuIdList.filter(i => { return i.name === item })
        if (targetArr.length !== 0) {
          return targetArr[0].id
        } else if (item === 0) {
          return '无'
        } else {
          return '0'
        }
      }
    },
    change(e) {
      this.$forceUpdate(e)
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
.selectSvgIcon{
  float: left;
  width:10px;
  height:10px;
  font-size:20px;
  margin-top:15px
}
</style>
