<template>
  <div class="app-container">
    <el-button v-show="createPower" type="primary" @click="handleAddAgency('agency')">新建机构</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
    <!-- <el-button @click="clearFilter">显示全部</el-button> -->
    <el-button v-show="deletePower" type="warning" @click="deleteSelection()">删除所选</el-button>
    <el-button v-show="queryPower" type="info" style="float:right;margin-left:0" @click="clearSearch">重置</el-button>
    <el-button v-show="queryPower" type="danger" style="float:right;margin-right:10px" @click="searchId">搜索</el-button>
    <el-input
      v-show="queryPower"
      v-model="search"
      style="float:right;width:20%"
      placeholder="按机构id查找"
    />
    <el-table
      v-show="queryPower"
      ref="agencylist"
      v-loading="loading"
      :data="agencyList"
      style="width: 100%;margin-top:30px;"
      height="545"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="head-center" label="机构id" width="120">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="机构名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="父级机构id">
        <template slot-scope="scope">
          {{ scope.row.parent_id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-show="updatePower" type="primary" size="small" @click="handleEdit(scope,'agency')">编辑 </el-button>
          <el-button v-show="deletePower" type="danger" size="small" @click="handleDelete(scope)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      v-if="componentShow"
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑机构':'新建机构'">
      <el-form ref="agency" :model="agency" label-width="120px" :rules="rules" label-position="left">
        <el-form-item hide-required-asterisk="true" prop="name" label="机构名字">
          <el-input v-model="agency.name" placeholder="机构名称" />
        </el-form-item>
        <el-form-item hide-required-asterisk="true" prop="parent_id" label="上级机构">
          <el-select v-model="agency.parent_id" class="selector" clearable placeholder="请选择">
            <el-option v-for="(item,key) in agencyIdList" :key="key" :value="item.id" :label="item.name">
              <span style="float: left; font-size: 13px;">{{ item.name }}</span>
              <span style="float: right; font-size: 13px;">{{ item.id }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="备注">
          <el-input v-model="agency.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('agency')">确定</el-button>
        <div slot="tip" class="el-confirm__tip">带*号为必填项</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
// import store from '@/store'
import baseUrl from '@/store/modules/api'
import { getAgency, updateAgency, deleteAgency, addAgency } from '@/api/agency'
import success from '@/utils/operation-message'
import { getRoles } from '@/api/role'

const defaultAgency = {
  name: '',
  parent_id: '',
  remark: ''
}

export default {
  data() {
    return {
      agency: Object.assign({}, defaultAgency),
      rules: {
        parent_id: [{ required: true, message: '请选择上级机构', trigger: 'change' }],
        name: [{ required: true, message: '请填写机构名称', trigger: 'blur' }]
      },
      agencyList: [],
      roleList: [],
      agencyIdList: [],
      // 权限
      createPower: false,
      deletePower: false,
      updatePower: false,
      queryPower: false,
      search: '',
      componentShow: true,
      counts: 10, // 用户条数,先随便给，防止报错
      baseUrl: baseUrl.baseUrl,
      currentPage: 1, // 当前页面
      limit: 10, // 每页限制的条数
      dialogVisible: false,
      dialogType: 'new',
      multipleSelection: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'fileUpload',
      'token'])
  },
  created() {
    this.getAgency()
    this.powerSet()
    // this.getRoles()
  },
  methods: {
    async getAgency(IdVal) {
      this.loading = true
      this.saveAgencyIds()
      if (IdVal) {
        const res = await getAgency({ limit: this.limit, page: this.currentPage, id: Number(IdVal) })
        this.agencyList = res.data.rows
        this.counts = res.data.count
        this.loading = false
      } else {
        const res = await getAgency({ limit: this.limit, page: this.currentPage })
        this.agencyList = res.data.rows
        this.counts = res.data.count
        this.loading = false
      }
    },
    async getRoles() {
      const res = await getRoles({ limit: this.limit, page: this.currentPage })
      this.roleList = res.data.rows
    },
    async saveAgencyIds() {
      this.agencyIdList = []
      const res = await getAgency()
      this.agencyList = res.data.rows
      for (const i in this.agencyList) {
        this.agencyIdList.push({ name: this.agencyList[i].name, id: this.agencyList[i].id })
      }
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
    handleAddAgency(formName) {
      this.agency = Object.assign({}, defaultAgency)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
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
      this.agency = deepClone(scope.row)
      this.imageUrl = this.baseUrl + scope.row.avatar
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该机构吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteAgency({ id: scope.row.id })
          this.getAgency()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(err => { console.log(err) })
    },
    // 提交新增,上传
    async handleConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        const isEdit = this.dialogType === 'edit'
        const agency = this.agency
        if (valid) {
          if (isEdit) {
            await updateAgency({
              id: agency.id,
              name: agency.name,
              parent_id: agency.parent_id,
              remark: agency.remark || ''
            })
          } else {
            await addAgency(
              {
                name: agency.name,
                parent_id: agency.parent_id,
                remark: agency.remark || ''
              }
            )
          }
          this.getAgency()
          this.dialogVisible = false
          success()
          const { remark, parent_id, name } = this.agency
          this.dialogVisible = false
          this.$notify({
            title: isEdit ? '修改成功' : '新建成功',
            dangerouslyUseHTMLString: true,
            message: `
                <div>机构名: ${name}</div>
                <div>上级机构id: ${parent_id}</div>
                <div>备注: ${remark || '无'}</div>
              `,
            type: 'success'
          })
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
    filterList(val) {
      if (val !== '') {
        this.componentShow = false
      } else {
        this.getAgency()
        this.componentShow = true
      }
    },
    clearFilter() {
      this.loading = true
      this.$refs.agencylist.clearFilter()
      this.componentShow = true
      this.search = ''
      this.loading = false
    },
    handleSizeChange(val) {
      this.limit = val
      this.getAgency()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getAgency()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.agencylist.toggleRowSelection(row)
        })
      } else {
        this.$refs.agencylist.clearSelection()
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
              await deleteAgency({ id: item.id })
            })
            this.getAgency()
            success()
          })
          .catch(err => { console.error(err) })
      } else {
        this.$notify({
          title: '删除失败',
          dangerouslyUseHTMLString: true,
          message: `
              <div>请选择需要删除的机构</div>
              `,
          type: 'error'
        })
        return
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    searchId() {
      if (this.search) {
        this.getAgency(this.search)
      }
    },
    clearSearch() {
      this.getAgency()
      this.search = ''
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
 .avatar-uploader .el-upload{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: absolute;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover{
        border-color: #409eff;
    }
    .avatar-uploader-icon{
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar{
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
