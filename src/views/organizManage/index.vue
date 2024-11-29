<template>
  <div class="organiz-manage">
    <Search @setLoading="setLoading" />
    <Emendation
      :rules="rules"
      :type-options="typeOptions"
      :change-tip-list-callback="changeTipList"
      @setLoading="setLoading"
    />
    <Table
      v-if="flag"
      :rules="rules"
      :type-options="typeOptions"
      :parent-id-list="parentIdList"
      :loading="loading"
      :get-tip-list="getTipList"
      :change-tip-list-callback="changeTipList"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Search from './components/Search'
import Emendation from './components/Emendation'
import Table from './components/Table'

export default {
  name: 'OrganizManage',
  components: { Search, Emendation, Table },
  data() {
    return {
      rules: {
        checkContent: (rule, val, callback) => {
          if (val !== 0 && !val) {
            callback(new Error('内容不能为空'))
          } else {
            callback()
          }
        },
        checkType: (rule, val, callback) => {
          if (val !== 0 && !val) {
            callback(new Error('内容不能为空'))
          } else {
            callback()
          }
        }
      },
      parentIdList: [],
      parentIdListCopy: [],
      flag: false, // parentIdList数组填充完毕后再挂载Table组件
      loading: 1,
      // 上级组织提示列表
      typeOptions: [
        {
          value: 0,
          label: '学院'
        },
        {
          value: 1,
          label: '专业'
        },
        {
          value: 2,
          label: '班级'
        }
      ]
    }
  },
  watch: {
    gorefresh() {
      this.getTipList()
    }
  },
  created() {
    this.getTipList()
  },
  methods: {
    // 设置表格加载状态
    setLoading() {
      this.loading = this.loading === 0 ? 1 : 0
    },
    // 获取新增或更新组织时的提示列表
    getTipList() {
      const val = { typeList: [0, 1] }
      this.$store
        .dispatch('organizManage/getOrganizLinearListAction', val)
        .then(() => {
          const organizList =
            this.$store.getters['organizManage/getOrganizLinearList']
          console.log(organizList)
          for (let i = 0, len = organizList.length; i < len; i++) {
            this.parentIdList[i] = {
              label: organizList[i].name,
              value: organizList[i].id,
              type: organizList[i].type
            }
          }
          console.log(this.parentIdList)
          this.flag = true
        })
    },

    // 根据操作更改提示列表和选择列表
    changeTipList(type) {
      let disableParent = true
      let showGrade = false
      const parentIdListCopy = [...this.parentIdList]

      // 根据组织类型更改上级组织提示
      if (type === 1) {
        //  类型为专业时
        for (let i = parentIdListCopy.length - 1; i >= 0; i--) {
          if (parentIdListCopy[i].type !== 0) {
            parentIdListCopy.splice(i, 1)
          }
        }
        console.log(parentIdListCopy)
      } else if (type === 2) {
        //  类型为班级时
        for (let i = parentIdListCopy.length - 1; i >= 0; i--) {
          if (parentIdListCopy[i].type !== 1) {
            parentIdListCopy.splice(i, 1)
          }
        }
        console.log(parentIdListCopy)
      }

      // 组织类型选择后才能选上级组织
      if (type || type === 0) {
        disableParent = false
      }

      // 组织类型为班级才能选年级
      if (type === 2) {
        showGrade = true
      } else {
        showGrade = false
      }

      return {
        parentIdListCopy,
        disableParent,
        showGrade
      }
    }
  },
  computed: {
    ...mapState('organizManage', ['gorefresh'])
  }
}
</script>

<style>
</style>
