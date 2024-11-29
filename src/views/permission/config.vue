<template>
  <div class="app-container">
    <el-button v-show="createPower" type="primary" @click="handleAddConfig">添加系统配置</el-button>

    <el-table :data="configList" style="width: 100%;margin-top:30px;" height="545" stripe>
      <el-table-column align="head-center" label="主键id">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="配置中文名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="分组名字">
        <template slot-scope="scope">
          {{ scope.row.group_name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="配置生效状态" width="120">
        <template slot-scope="scope">
          {{ scope.row.status==1?'生效':'不生效' }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="配置的字段名" width="120">
        <template slot-scope="scope">
          {{ scope.row.filed }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="配置的值" width="100">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </el-table-column>
      <el-table-column align="head-center" label="备注" width="150">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-show="updatePower" type="primary" size="small" @click="handleEdit(scope,'conf')">编辑 </el-button>
          <el-button v-show="deletePower" type="danger" size="small" @click="handleDelete(scope)">删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="limit"
      :page-sizes="[2,5,7,10]"
      hide-on-single-page
      :total="counts"
      layout="sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑配置':'新建配置'">
      <el-form ref="conf" :model="conf" label-width="120px" label-position="left">
        <el-form-item v-if="dialogType==='edit'" label="主键id" label-width="220">
          {{ conf.id }}
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="配置中文名" required>
          <el-input v-model="conf.name" placeholder="配置中文名" />
        </el-form-item>
        <el-form-item label="配置生效状态">
          <el-select v-model="conf.status" class="selector" placeholder="请选择,默认不生效">
            <el-option label="生效" value="1" />
            <el-option label="不生效" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="配置的字段名" prop="filed">
          <el-input v-model="conf.filed" placeholder="配置的值" />
        </el-form-item>
        <el-form-item hide-required-asterisk="true" label="配置的值" prop="value">
          <el-input v-model="conf.value" placeholder="配置的值" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="conf.remark" type="textarea" :rows="2" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm('conf')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import { getConfig, addConfig, deleteConfig, updateConfig } from '@/api/Config'
import { getRoles } from '@/api/role'
import success from '@/utils/operation-message'

const defaultConfig = {
  name: '',
  filed: '',
  value: '',
  group_name: '',
  status: '请选择',
  remark: ''
}

export default {
  data() {
    return {
      conf: Object.assign({}, defaultConfig),
      rules: {
        id: [{ required: true, message: '请输入主键id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入配置的中文名', trigger: 'blur' }],
        filed: [{ required: true, message: '请输入配置的字段名', trigger: 'blur' }],
        value: [{ required: true, message: '请输入配置的值', trigger: 'blur' }]
      },
      configList: [],
      roleList: [],
      // 权限
      createPower: false,
      deletePower: false,
      updatePower: false,
      queryPower: false,
      counts: 10,
      currentPage: 1, // 当前页面
      limit: 10, // 每页限制的条数
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      loading: false
    }
  },
  created() {
    this.getConfig()
    this.getRoles()
    this.powerSet()
  },
  methods: {
    async getConfig() {
      this.loading = true
      const res = await getConfig({ page: this.currentPage, limit: this.limit })
      this.configList = res.data.rows
      this.counts = res.data.count
      this.loading = false
    },
    async getRoles() {
      this.loading = true
      const res = await getRoles({ page: this.currentPage, limit: this.limit })
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
    handleAddConfig() {
      this.conf = Object.assign({}, defaultConfig)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope, formName) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
      this.conf = deepClone(scope.row)
      // 状态值置空，默认不生效
      this.conf.status = ''
    },
    handleDelete(scope) {
      this.$confirm('您确定要删除该配置吗？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteConfig({ id: scope.row.id })
          this.getConfig()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(err => { console.log(err) })
    },
    handleConfirm(formName) {
      this.$refs[formName].validate(async(valid) => {
        const isEdit = this.dialogType === 'edit'
        const conf = this.conf
        if (valid) {
          if (isEdit) {
            await updateConfig({
              id: conf.id,
              name: conf.name,
              value: conf.value,
              filed: conf.filed,
              group_name: conf.group_name,
              status: conf.status,
              remark: conf.remark
            })
          } else {
            await addConfig(
              {
                name: conf.name,
                filed: conf.filed,
                value: conf.value,
                group_name: conf.group_name,
                status: conf.status,
                remark: conf.remark
              }
            )
          }
          this.getConfig()
          this.dialogVisible = false
          success()
          const { value, remark, group_name, id, name } = conf
          this.dialogVisible = false
          this.$notify({
            title: isEdit ? '修改成功' : '新建成功',
            dangerouslyUseHTMLString: true,
            message: `
              <div>主键id: ${id || '-'}</div>
              <div>配置中文名: ${name}</div>
              <div>配置的值: ${value}</div>
              <div>配置的字段名: ${group_name}</div>
              <div>备注: ${remark || '无'}</div>
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
    handleSizeChange(val) {
      this.limit = val
      this.getConfig()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getConfig()
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
</style>
