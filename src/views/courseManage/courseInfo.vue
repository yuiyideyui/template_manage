<template>
  <div class="course-info">
    <Search ref="searchRef" :semester-options="semesterOptions" @setLoading="setLoading" />
    <Emendation
      :rules="rules"
      :semester-options="semesterOptions"
      :course-num-list="courseNumList"
      :class-list="classList"
      :teacher-list="teacherList"
      :get-tip-list="getTipList"
      @setLoading="setLoading"
    />
    <Table
      :rules="rules"
      :semester-options="semesterOptions"
      :course-num-list="courseNumList"
      :class-list="classList"
      :teacher-list="teacherList"
      :loading="loading"
      :get-tip-list="getTipList"
      @setLoading="setLoading"
      @setCurrentPage="setCurrentPage"
      @fetchTable="fetchTable"
    />
  </div>
</template>

<script>
import Search from './infoComponents/Search'
import Emendation from './infoComponents/Emendation'
import Table from './infoComponents/Table'
export default {
  name: 'CourseInfo',
  components: { Search, Emendation, Table },
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
        checkArr: (rule, val, callback) => {
          if (!val[0]) {
            callback(new Error('内容不能为空'))
          } else {
            callback()
          }
        }
      },
      semesterOptions: [
        {
          value: '1',
          label: '第一学期'
        },
        {
          value: '2',
          label: '第二学期'
        }
      ],
      courseNumList: [], // 新增或更新课程时课程编号的输入建议列表
      classList: [], // 新增或更新课程时开课班级的输入建议列表
      teacherList: [], // 新增或更新课程时开课授课老师的输入建议列表
      loading: 0, // 使表格处于加载状态
      currentPage: 1
    }
  },
  mounted() {
    this.getTipList()
  },
  methods: {
    // 设置表格加载状态
    setLoading() {
      this.loading = this.loading === 0 ? 1 : 0
    },

    // 获取新增或更新课程时的提示列表
    getTipList() {
      // 课程名称&编号
      this.$store.dispatch('courseLib/getCourseLibListAction').then(() => {
        const courseLibList = this.$store.getters['courseLib/getCourseLibList']
        for (let i = 0, len = courseLibList.length; i < len; i++) {
          this.courseNumList[i] = {
            label: courseLibList[i].course_no + ' ' + courseLibList[i].name,
            value: courseLibList[i].id
          }
        }
      })
      // 开课班级
      this.$store
        .dispatch('organizManage/getOrganizLinearListAction')
        .then(() => {
          const organizList =
            this.$store.getters['organizManage/getOrganizLinearList']
          for (let i = 0, counter = 0, len = organizList.length; i < len; i++) {
            if (organizList[i].type === 2) {
              this.classList[counter] = {
                label: organizList[i].grade + '级' + organizList[i].name,
                value: organizList[i].id
              }
              counter++
            }
          }
        })
      // 授课老师
      this.$store
        .dispatch('userManage/getUserListAction', { roleIdList: [3, 5] })
        .then(() => {
          const theteacherList = this.$store.getters['userManage/getUserList']
          for (let i = 0, len = theteacherList.length; i < len; i++) {
            this.teacherList[i] = {
              label: theteacherList[i].name,
              value: theteacherList[i].id
            }
          }
        })
    },
    // 保存当前页码
    setCurrentPage(val) {
      this.currentPage = val
    },

    fetchTable() {
      // console.log('this.currentPage', this.currentPage);
      setTimeout(() => {
        this.$refs.searchRef.searchTarget('searchForm', this.currentPage)
      })
    }

  }
}
</script>
