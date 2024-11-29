<template>
  <div class="menu-table">
    <el-table
      v-loading="isLoading"
      :data="menuManageList"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%; font-size: 13px"
      row-key="id"
      default-expand-all
      border
    >
      <el-table-column prop="name" label="菜单名称" align="center" />
      <el-table-column prop="id" label="菜单序号" align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" />
    </el-table>
  </div>
</template>

<script>
import { dateToString } from '@/utils/changeDataForm'
import { mapState } from 'vuex'
export default {
  name: 'Table',
  props: ['loading'],
  data() {
    return {
      isLoading: true,
      menuManageList: []
    }
  },
  watch: {
    // 外界操作后表格进入加载状态
    loading() {
        this.isLoading = true
    //   console.log('---loading---', this.isLoading)
    //   console.log()
    //   this.isLoading = !this.isLoading
    //   console.log('---loading---', this.isLoading)
      this.isLoading = false
    },
    goupdate() {
      this.searchMenuManage()
    },
    goreset() {
      this.refreshMenuManageList()
    }
  },
  created() {
    this.refreshMenuManageList()
  },
  methods: {
    // 刷新菜单列表
    refreshMenuManageList() {
      this.$store.dispatch('menuManage/getMenuListAction').then(() => {
        const newMenuList = this.$store.getters['menuManage/getMenuList']
        const list = this.listHandler(newMenuList)
        this.menuManageList = list
        this.isLoading = false
      })
    },

    // 处理数据创建时间格式
    listHandler(list) {
      for (let i = 0, len = list.length; i < len; i++) {
        list[i].created_at = dateToString(list[i].created_at)
        if (list[i].children[0]) {
          this.listHandler(list[i].children)
        }
      }
      return list
    },

    // 搜索菜单
    searchMenuManage() {
      const newMenuList = this.$store.getters['menuManage/getMenuList']
      const list = this.listHandler(newMenuList)
      this.menuManageList = list
      this.isLoading = false
      console.log('###searchMenuManage###')
    }
  },
  computed: {
    ...mapState('menuManage', ['goupdate', 'goreset'])
  }
}
</script>

<style lang="scss" scoped>
.menu-table {
  margin-top: 40px;
}
</style>
