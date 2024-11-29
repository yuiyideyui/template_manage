<template>
  <div class="search">
    <el-form
      ref="searchForm"
      name="searchForm"
      class="input-wrap"
      :model="searchForm"
    >
      <el-form-item label="菜单名称">
        <el-input
          v-model.trim="searchForm.name"
          placeholder="请输入菜单名称"
          size="small"
        />
      </el-form-item>

      <el-form-item label="创建时间">
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
      <span>该菜单不存在，请检查所输入内容是否错误。</span>
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
  data() {
    return {
      type: 'menuManage',
      errorTipVisible: false,
      searchTimer: null, // 搜索防抖
      resetTimer: null, // 重置防抖
      searchForm: {
        name: '',
        time: ''
      }
    }
  },
  methods: {
    searchTarget(formName) {
      this.$emit('setLoading') // 表格进入加载状态
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        const val = {
          name: this.searchForm.name
        }
        if (this.searchForm.time !== '' && this.searchForm.time !== null && this.searchForm.time !== null) {
            if (typeof this.searchForm.time == 'object' && this.searchForm.time.length > 0) {
                val.startTime = this.searchForm.time[0]
                val.endTime = this.searchForm.time[1]
            }
        }
        searchTargetCallback(formName, this.type, val, this)
      }, 500)
    },

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
      this.searchForm.time = ''
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
      rows: repeat(2, 1fr);
      columns: repeat(3, 1fr);
      areas: "a b c" "e e e";
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
      grid-area: e;

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
