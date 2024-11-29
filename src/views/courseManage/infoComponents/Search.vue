<template>
  <div class="search">
    <el-form
      ref="searchForm"
      name="searchForm"
      class="input-wrap"
      :model="searchForm"
    >
      <el-form-item label="课程名称">
        <el-input
          v-model.trim="searchForm.name"
          oninput="this.value=this.value.replace(/\s+/g,'')"
          placeholder="请输入课程名称"
          size="small"
        />
      </el-form-item>

      <el-form-item label="授课层次">
        <el-select
          v-model="searchForm.level"
          placeholder="请选择授课层次"
          size="small"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开课学年">
        <el-date-picker
          v-model="searchForm.year"
          type="year"
          value-format="yyyy"
          placeholder="请选择开课学年"
        />
      </el-form-item>

      <el-form-item label="开课学期">
        <el-select
          v-model="searchForm.semester"
          placeholder="请选择开课学期"
          size="small"
        >
          <el-option
            v-for="item in semesterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="授课老师">
        <el-input
          v-model.trim="searchForm.teacherName"
          oninput="this.value=this.value.replace(/\s+/g,'')"
          placeholder="请输入授课老师姓名"
          size="small"
        />
      </el-form-item>

      <el-form-item label="课程状态">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          size="small"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="更新时间" class="createTime">
        <div class="block">
          <el-date-picker
            v-model="searchForm.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          />
        </div>
      </el-form-item>

      <fieldset class="submit">
        <el-button @click="resetForm('searchForm')">重置</el-button>
        <el-button
          type="primary"
          @click="searchTarget('searchForm')"
        >确 定</el-button>
      </fieldset>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="errorTipVisible"
      width="30%"
      :before-close="clearInput"
    >
      <span>该课程不存在，请检查所输入内容是否错误。</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="errorTipVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchTargetCallback, resetFormCallback } from '@/utils/searchData'
export default {
  name: 'Search',
  props: ['semesterOptions'],
  data() {
    return {
      type: 'courseInfo',
      errorTipVisible: false,
      searchTimer: null, // 搜索防抖
      resetTimer: null, // 重置防抖
      levelOptions: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '本科生'
        },
        {
          value: '2',
          label: '硕士生'
        },
        {
          value: '3',
          label: '博士生'
        }
      ],
      statusOptions: [
        {
          value: 1,
          label: '启用'
        },
        {
          value: 0,
          label: '停用'
        }
      ],
      searchForm: {
        name: '',
        level: null,
        year: null,
        semester: null,
        time: '',
        teacherName: '',
        status: null
      }
    }
  },
  methods: {
    // ————搜索————
    searchTarget(formName, currentPage = 1) {
      this.$emit('setLoading') // 表格进入加载状态
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        const val = {
          name: this.searchForm.name,
          level: this.searchForm.level,
          year: this.searchForm.year,
          semester: this.searchForm.semester,
          teacherName: this.searchForm.teacherName,
          status: this.searchForm.status,
          currentPage: currentPage
        }
        if (this.searchForm.time !== '' && this.searchForm.time !== null) {
            if (typeof this.searchForm.time == 'object' && this.searchForm.time.length > 0) {
                val.startTime = this.searchForm.time[0]
                val.endTime = this.searchForm.time[1]
            }
        }

        console.log(this.searchForm)
        console.log(val)

        searchTargetCallback(formName, this.type, val, this)
      }, 500)
    },

    // 重置页面
    resetForm(formName) {
      this.$emit('setLoading') // 表格进入加载状态
      if (this.resetTimer) {
        clearTimeout(this.resetTimer)
      }
      this.resetTimer = setTimeout(() => {
        resetFormCallback(formName, this.type, this)
      }, 500)
    },

    showTip() {
      this.errorTipVisible = true
    },

    clearInput() {
      this.searchForm.name = ''
      this.searchForm.level = null
      this.searchForm.year = null
      this.searchForm.semester = null
      this.searchForm.time = ''
      this.searchForm.teacherName = ''
      this.searchForm.status = null
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .input-wrap {
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template: {
      rows: repeat(3, 1fr);
      columns: repeat(4, 1fr);
      areas: "a b c d" "e f g h" "i i i i";
    }
    padding-left: 20px;

    .el-form-item {
      margin-bottom: 0;
      width: 100%;
      margin-top: 20px;

      .el-input,
      .el-select {
        width: 70%;
      }

      .block {
        display: flex;
      }
    }
    .createTime {
      grid-column-start: 3;
      grid-column-end: 5;
    }

    label {
      font-size: 14px;
      margin-right: 10px;
    }

    input[type="text"],
    select {
      padding: 1px 2px;
      width: 240px;
      height: 20px;
      color: rgba(117, 117, 117, 0.5);
    }

    select {
      box-sizing: content-box;
    }

    .submit {
      border: none;
      grid-area: i;

      button {
        padding: 0;
        width: 100px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
      }
    }
  }
}
</style>
