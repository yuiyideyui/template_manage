<template>
  <div class="course-lib">
    <Search ref="searchRef" @setLoading="setLoading" />
    <Emendation :rules="rules" :level-options="levelOptions" @setLoading="setLoading" />
    <Table
      :rules="rules"
      :level-options="levelOptions"
      :loading="loading"
      @setLoading="setLoading"
      @setCurrentPage="setCurrentPage"
      @fetchTable="fetchTable"
    />
  </div>
</template>

<script>
import Search from './libComponents/Search'
import Emendation from './libComponents/Emendation'
import Table from './libComponents/Table'
export default {
  name: 'CourseLib',
  components: { Search, Emendation, Table },
  data() {
    return {
      // 新增或更新课程的输入框检测规则
      rules: {
        checkContent: (rule, val, callback) => {
          if (!val) {
            callback(new Error('内容不能为空'))
          } else {
            callback()
          }
        },
        checkInt: (rule, val, callback) => {
          if (!val && val != 0) {
            callback(new Error('内容不能为空'))
          } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
            callback(new Error('值必须为正整数'))
          } else if (val < 1) {
            callback(new Error('值必须为正整数'))
          } else {
            callback()
          }
        },
        checkNumber: (rule, val, callback) => {
          if (!val && val != 0) {
            callback(new Error('内容不能为空'))
          } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
            callback(new Error('值必须为不小于0的数字'))
          } else {
            callback()
          }
        },
        checkLevel: (rule, val, callback) => {
          if (val === '' || val == null) {
            callback(new Error('内容不能为空'))
          } else if (val < 0 || val > 3) {
            callback(new Error('值的范围为0~3的整数'))
          } else if (val > 0 && val < 1) {
            callback(new Error('值的范围为0~3的整数'))
          } else {
            callback()
          }
        }
      },
      // 授课层次选项
      levelOptions: [
        { value: 0, label: '全部' },
        { value: 1, label: '本科生' },
        { value: 2, label: '硕士生' },
        { value: 3, label: '博士生' }
      ],
      loading: 0,
      currentPage: 1
    }
  },
  methods: {
    // 设置表格加载状态
    setLoading() {
      console.log('set')
      this.loading = this.loading === 0 ? 1 : 0
    },

    // 保存当前页码
    setCurrentPage(val) {
      this.currentPage = val
    },

    fetchTable() {
      setTimeout(() => {
        console.log('this.currentPage', this.currentPage)
        this.$refs.searchRef.searchTarget('searchForm', this.currentPage)
      })
    }
  }
}
</script>
