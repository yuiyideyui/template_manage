<!--分页组件-->
<template>
  <div class="pagBox">
    <el-pagination :small="small" :layout=layout :pager-count="pagercount" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="paginationObj.limit" :total="paginationObj.total" :page-count="Math.ceil(paginationObj.total / paginationObj.limit)"
      background>
      <span class="el-pagination__total">共 {{ Math.ceil(paginationObj.total / paginationObj.limit) }} 页</span>
    </el-pagination>
  </div>
  <!-- :hide-on-single-page="true"  只有一页时隐藏配置-->
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  /**
   * pagesizes==>[5,10,15,20,25]
   * dateSource ==> 数据源
   */
  props: {
    paginationObj: {
      //每页显示多少条数据
      type: Object,
      default: () => { },
    },
    pagesizes: {
      type: Array,
      default() {
        return [10, 30, 50, 70, 90];
      },
    },
    layout: {
      type: String,
      default: "prev, pager, next, slot"
    },
    pagercount: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      small: true, // 开启分页小状态
    };
  },
  // 使用监听的方式，监听数据的变化
  /**
   * vue父组件异步获取动态数据传递给子组件 获取不到值的问题已完美解决
   * eg:https://www.jianshu.com/p/4450b63a27fe
   */
  watch: {},
  methods: {
    // 每页条数
    handleSizeChange(val) {
      //   this.sizeChange = val;
      // eslint-disable-next-line vue/no-mutating-props
      this.paginationObj.limit = val;
      this.handleCurrentChange(this.currentPage);
      // console.log("dateSource", this.dateSource);
      // console.log("每页条数", val);
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log("当前页", val);
      //   this.showPagination(this.paginationObj.limit)
      // eslint-disable-next-line vue/no-mutating-props
      this.paginationObj.page = val;
      this.$emit("showDate", this.paginationObj);
    },
  },
  setup() { },
});
</script>

<style lang="less">
.pagBox {
  position: relative;
  z-index: 2;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.is-last {
  cursor: pointer;
}

.el-pagination {
  white-space: break-spaces !important;

  .number {
    font-size: 12px;
    font-family: 'webfont-regular';
    font-weight: 400;
    color: #FFFFFF;
  }
}

.el-pagination.is-background .el-pager li:not(.disabled) {
  background-color: #5D6772 !important;
  color: #DDDDDD !important;
  // width: 18px !important;
  height: 18px;
  line-height: 18px;
  min-width: 18px !important;
}

.btn-prev {
  background-color: #5D6772 !important;
  color: #fff !important;
  width: 18px !important;
  height: 18px !important;
  line-height: 18px;
  min-width: 18px !important;

  .el-icon {
    font-size: 10px !important;
  }
}

.btn-next {
  background-color: #5D6772 !important;
  color: #fff !important;
  width: 18px !important;
  height: 18px !important;
  line-height: 18px;
  min-width: 18px !important;

  .el-icon {
    font-size: 10px !important;
  }
}

.el-pagination.is-background .el-pager li:not(.disabled).is-active {
  background-color: #00BECA !important;
  color: #fff !important;
}

.el-pagination__total {
  font-size: 12px;
  font-family: "webfont-regular";
  font-weight: 400;
  color: #DDDDDD !important;
  margin-left: 5px;
}

//jumper
.el-pagination__jump {
  color: rgba(187, 187, 187, 1);
  margin-left: 0;

  .el-input.el-pagination__editor.is-in-pagination {
    width: 34px;

    .el-input__inner {
      width: 20px;
      height: 20px;
      border: 0px solid;
      background: rgba(9, 76, 138, 1);
      color: white;
    }
  }
}
</style>
