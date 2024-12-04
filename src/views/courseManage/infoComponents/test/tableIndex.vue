<template>
  <div>
    <!-- background: '#1031A6', -->
    <el-table ref="tableRef" class="tableBox"
      :class="[cellbgStyle == 1 ? 'one' : '', cellbgStyle == 2 ? 'two' : '', cellBottom ? 'showBottom' : '', listLoading ? 'tableLodingHei' : '']"
      v-loading="listLoading" :data="tableData" element-loading-text="Loading" :header-cell-style="{
        color: theadColor,
        height: theadHeight,
        padding: '0',
        lineHeight: theadHeight,
        fontSize: fontSize,
        fontFamily: 'webfont-regular',
        border: 'none',
      }" :cell-style="{ borderColor: 'none' }" :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName" :highlight-current-row="rowClick" :height="tableHeight" :max-height="maxHeight"
       @sort-change="sortChange"
      @select="handleSelectionChange" @select-all="headerSelectionChange" :row-key="getRowKey" @row-click="rowClickFn"
      lazy :load="loadChildren" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column v-if="indexColumn" label="序号" type="index" width="60" align="center" header-align="center" />
      <el-table-column v-if="selection" type="selection" width="40" />
      <el-table-column v-for="(item, index) in bindTableColumns" :key="index" :prop="item.prop"
        :align="item.align || 'left'" :fixed="item.fixed" :label="item.label" :min-width="item.minWidth"
        :show-overflow-tooltip="showOverflowTooltip" :sortable="item.sortable">
        <template #default="scope">
          <div v-if="item.btn">
            <div class="test">
              <slot :item="scope.row" name="btn"></slot>
            </div>
            <!-- 操作栏的按钮判断 -->
            <el-button v-for="(k, index_1) in checkbtn(item.btn, scope.row)" :key="index_1"
              :style="{ color: k.color || 'rgba(0, 224, 255, 1)', fontFamily: 'webfont-medium' }"
              :class="{ underlineOptItem: k.underline }" :plain="k.isPlain || false" size="default" link
              @click="k.func(scope.$index, scope.row)">
              {{ k.name }}
            </el-button>
            <el-dropdown v-if="item.dropdownBtn" @command="item.dropdownFunc">
              <el-button size="default" style="margin-left: 12px">
                更多
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(k, index_2) in item.dropdownBtn" :key="index_2"
                    :command="{ name: k.name, row: scope.row }">{{ k.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else-if="item.color">
            <div v-if="item.color === 'defaultColor'">
              <!-- 同一页面不同状态 -->
              <slot name="status" :item="scope.row"></slot>
            </div>
            <!-- 同一页面相同状态 -->
            <span v-else>{{ scope.row.status }}</span>
          </div>
          <!-- 不是按钮，接口数据有对应的key 下划线设置 @ underlineOpt:{ color :'' , click:(val)=>{} } -->
          <div v-else-if="item.underlineOpt">
            <div v-if="typeof scope.row[item.prop] == 'string'">
              <span class="underlineOptItem" :class="{ underlineHide: item.underlineOpt.isShow }"
                :style="{ color: item.underlineOpt.color || 'rgba(0, 224, 255, 1)' }"
                @click="item.underlineOpt.click ? item.underlineOpt.click(scope.row) : ''">{{ scope.row[item.prop]
                }}</span>
            </div>
            <div v-else>
              <span v-for="(underlineItem, index_3) in scope.row[item.prop]" :key="index_3" class="underlineOptItem"
                :class="{ underlineHide: underlineItem.isShow }" :style="{
                  color: item.underlineOpt.color || 'rgba(0, 224, 255, 1)',
                  marginRight: (item.underlineOpt.marginRight || 0) + 'px',
                }" @click="item.underlineOpt.click ? item.underlineOpt.click(underlineItem) : ''">
                {{ underlineItem }}
              </span>
            </div>
          </div>
          <div v-else-if="item.custom" class="customClass">
            <slot name="custom" :item="scope.row"></slot>
            <div v-if="item.custom.html ? true : false" v-html="item.custom.html(scope.row[item.prop],scope.row)" @click.stop="item.custom.click ? item.custom.click(scope.row) : ''"></div>
            <div v-if="item.custom.html_2 ? true : false" v-html="item.custom.html_2(scope.row)" @click.stop="item.custom.click ? item.custom.click_2(scope.row) : ''"></div>
            <div v-if="item.custom.html_3 ? true : false" v-html="item.custom.html_3(scope.row)" @click.stop="item.custom.click ? item.custom.click_3(scope.row) : ''"></div>
            <!-- 多个自定义  underlineItem.isShowUnderLine控制下划线是否显示 -->
            <div v-if="item.custom.htmlList" class="customUnderlineOptBox">
              <span v-for="(underlineItem, index_3) in item.custom.htmlList" :key="index_3" class="underlineOptItem"
                :class="{ underlineHide: underlineItem.isShowUnderLine }" :style="{
                  color: underlineItem.color || 'rgba(0, 224, 255, 1)',
                  marginRight: (underlineItem.marginRight || 0) + 'px',
                }" @click="underlineItem.click ? underlineItem.click(underlineItem, scope.row) : ''">
                <div v-if="underlineItem.html(underlineItem, scope.row) ? true : false"
                  v-html="underlineItem.html(underlineItem, scope.row)"></div>
              </span>
            </div>
          </div>
          <div v-else-if="item.brand">
            <p style="text-align: center;" :class="itemClass(scope.row[item.brand])">{{ scope.row[item.prop] }}</p>
          </div>
          <div v-else-if="item.icon" class="folder_name">
            <div>
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </div>
          <div v-else-if="item.prop == 'carNumber'" class="car_number">
            <div>
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </div>
          <div v-else>
            <span v-if="!item.formatData">
              <!-- /日期拼接并且只显示年月日 -->
              <span v-if="item.isDate == true">{{ repString(scope.row[item.prop[0]]) }}-{{
                repString(scope.row[item.prop[1]])
              }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </span>
            <span v-else>
              <!-- 根据不同状态显示不同的文字颜色 -->
              <el-link v-if="item.isline == true" :type="item.lineType(scope.row[item.prop])" :underline="false">{{
                item.formatData(scope.row[item.prop])
              }}</el-link>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </span>
          </div>
        </template>
      </el-table-column>

      <template #empty>
        <div v-show="!listLoading && showempty" class="emptyBox">
          {{ emptyData || '暂无数据' }}
        </div>
      </template>
    </el-table>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
    <!-- 分页 -->
    <div v-if="isPage && tableData && tableData.length > 0">
      <Pagination @showDate="showDate" :paginationObj="paginationObj" :pagesizes="pagesizes" :pagAglin="pagAglin" />
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, defineExpose, watch, computed } from 'vue';
import Pagination from './paginationCom.vue';
// import store from '@/store/index'
// const showempty = ref(false)
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [
  {
    id: 1,
    name: '张三',
    age: 28,
    gender: '男',
    status: '正常',
    date: '2024-12-01',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    gender: '女',
    status: '异常',
    date: '2024-12-02',
  },
  {
    id: 3,
    name: '王五',
    age: 45,
    gender: '男',
    status: '正常',
    date: '2024-12-03',
  },
],
  },
  selectedData: {
    type: Array,
    default: () => [],
  },
  tableDataAll: {
    type: Array,
    default: () => [],
  },
  childrenData: {
    type: Array,
    default: () => [],
  },
  tableHeader: {
    type: Array,
    default: () => [ { prop: 'name', label: '姓名', minWidth: '100' },
  { prop: 'age', label: '年龄', minWidth: '80', align: 'center' },
  { prop: 'gender', label: '性别', minWidth: '80', align: 'center' },
  { prop: 'status', label: '状态', minWidth: '100', align: 'center' },
  { prop: 'date', label: '日期', minWidth: '120', align: 'center', isDate: true },],
  },
  listLoading: {
    type: Boolean,
    default: false,
  },
  indexColumn: {
    type: Boolean,
    default: false,
  },
  selection: {
    type: Boolean,
    default: false,
  },
  isPage: {
    type: Boolean,
    default: true,
  },
  //表格高度
  tableHeight:{
    type:String
  },
  maxHeight: {
    type: String,
    default: '1080px',
  },
  paginationObj: {
    type: Object,
    default: () => { },
  },
  pagesizes: {
    type: Array,
  },
  pagAglin: {
    type: String,
  },
  roleField: {
    type: String,
  },
  rowKey: {
    type: String,
    default: '',
  },
  showempty: {
    type: Boolean,
    default: true,
  },
  emptyData: {
    type: String,
    default: '',
  },
  rowClick: {
    type: Boolean,
    default: false,
  },
  /**
   * @abstract 表单颜色
   */
  cellbgStyle: {
    type: Number,
    default: 1,
  },
  /**
   * @abstract 表单cell下划线
   */
  cellBottom: {
    type: Boolean,
    default: true,
  },
  /**
   * @abstract 每行高度
   */
  rowheight: {
    type: String,
    default: '50px',
  },
  theadHeight: {
    type: String,
    default: '50px',
  },
  theadColor: {
    type: String,
    default: '#fff',
  },
  fontSize: {
    type: String,
    default: '14px',
  },
  /**
   * @abstract 是否裁剪超出的文字...
   */
  showOverflowTooltip: {
    type: Boolean,
    default: true,
  },
});
const bindTableColumns = computed(() => props.tableHeader.filter((column) => !column.isHide));

const tableRef = ref(null);
const { tableData, selectedData, tableDataAll, roleField, childrenData, paginationObj } = toRefs(props);
const emits = defineEmits(['pagData', 'handleSelectionChange', 'getChildrenData', 'headerSelectionChange', 'rowClickFn','sortChange']);

/**排序发生变化 */
const sortChange = (data)=>{
    emits('sortChange',data)
} 
// const headerCellStyle = ({ row, column, rowIndex, columnIndex }) => {
//   if (rowIndex === 0) return "backgroundColor:#1031A6;";
// };

const tableRowClassName = () => {
  return 'rowName';
};
const tableCellClassName = () => {
  return 'cellName';
};

// 对日期进行截取
function repString(val) {
  return val.substr(0, 10);
}

const getSelectionRows = () => {
return tableRef.value.getSelectionRows()
}
// const state = reactive({
//   emptyText: "暂无数据",
// });

// function matchAgencyName(type) {
//   let color = null;
//   switch (type) {
//     case "primary":
//       color = "primary";
//       break;
//     case "success":
//       color = "success";
//       break;
//     case "info":
//       color = "info";
//       break;
//     case "warning":
//       color = "warning";
//       break;
//     case "danger":
//       color = "danger";
//       break;
//     default:
//       color = "default";
//       break;
//   }
//   return color;
// }

// -------------按钮处理---------------

function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
}

// 检查是否符合当前行数据的状态
function checkStatus(statusRequire, rowStatus) {
  if (statusRequire === undefined) return true;
  if (isArray(statusRequire)) {
    for (let i = 0, len = statusRequire.length; i < len; i++) {
      if (statusRequire[i] === rowStatus) return true;
    }
    return false;
  } else {
    return statusRequire === rowStatus;
  }
}

// 检查是否符合当前账号的角色
function checkRole(roleRequire, thisRole) {
  if (!roleRequire) return true;
  if (isArray(roleRequire)) {
    for (let i = 0, len = roleRequire.length; i < len; i++) {
      if (roleRequire[i] === thisRole) return true;
    }
    return false;
  } else {
    return roleRequire === thisRole;
  }
}

function checkbtn(btns, row) {
  return btns.filter((item) => {
    let judge = checkStatus(item.status, row.status) && checkRole(item.role, roleField.value);
    if (!item.existJudge) {
      return judge;
    }
    return item.existJudge(item, row) && judge;
  });
}
// -----------------------------------

// 行唯一标识
function getRowKey(row) {
  return row[`${props.rowKey}`];
}

//表单点击
const rowClickFn = (val) => {
  emits('rowClickFn', val);
};

watch(() => props.tableData, (newval, oldValue) => {
  if (paginationObj.value) {
    if (newval.length == 0 && oldValue.length != 0) {
      showDate({
        page: 1,
        limit: paginationObj.value.limit,
        total: paginationObj.value.total
      })
    }
  }
})
// 显示界面数据(点击分页按钮)
function showDate(response) {
  // console.log("点击分页1", response);
  emits('pagData', response);
}

function loadChildren(tree, treeNode, resolve) {
  //   console.log("触发懒加载", tree);
  emits('getChildrenData', tree);
  setTimeout(() => {
    tree.children = childrenData.value;
    // console.log("触发懒加载数据", tree, childrenData.value);
    checkedJudgment(tree);
    resolve(childrenData.value);
  }, 1000);
  // 将当前选中节点存
}

function checkedJudgment(arr) {
  setTimeout(() => {
    // console.log("arr", arr);
    arr.children.forEach((item) => {
      if (arr.is_checked) {
        item.is_checked = true;
        tableRef.value.toggleRowSelection(item, true);
      } else {
        item.is_checked = false;
        tableRef.value.toggleRowSelection(item, false);
      }
    });
  });
}

// 当用户手动勾选数据行的 Checkbox 时触发的事件
async function handleSelectionChange(selection, row) {
  console.log('当前row', selection, row);
  // row.is_checked = !row.is_checked
  // tableRef.value.toggleRowSelection(row, row.is_checked)
  emits('handleSelectionChange', selection, row);
  return;
}

// function filterParent(row, id) {
//   return new Promise((resolve) => {
//     row.forEach((item) => {
//       if (item.code === id) resolve(item);
//       if (item.children) {
//         filterParent(item.children, id);
//       }
//     });
//   });
// }

// function parentNode(row) {
//   let is_checked = true;
//   // if (is_checked) {
//   //   tableRef.value.toggleRowSelection(row, true);
//   // }
//   row.children.forEach((item, index) => {
//     if (!item.is_checked) {
//       is_checked = false;
//     }
//     console.log(1111, item.is_checked);
//     tableRef.value.toggleRowSelection(item, item.is_checked); // 回显
//   });
//   if (!is_checked) {
//     console.log(3333);
//     tableRef.value.toggleRowSelection(row, false); // 回显
//     row.children.forEach((item) => {
//       tableRef.value.toggleRowSelection(item, item.is_checked); // 回显
//     });
//   } else {
//     tableRef.value.toggleRowSelection(row, true); // 回显
//   }
// }

// let isFirst = false;

function headerSelectionChange(response) {
  console.log('点击复选框', response);
  console.log('tableData.value', tableData.value);
  // isFirst = !isFirst
  // tableData.value.forEach((item) => {
  //   console.log('item.is_checked', isFirst)
  //   item.is_checked = isFirst
  //   tableRef.value.toggleRowSelection(item, item.is_checked)
  //   if (item.children) {
  //     recursiveChildren(item.children, isFirst)
  //   }
  // })
  emits('headerSelectionChange', response, tableData.value);
}

//递归子节点-----处理复选框用
// function recursiveChildren(rowArr, status) {
//   console.log("status", status);
//   rowArr.forEach((item) => {
//     item.is_checked = status;
//     tableRef.value.toggleRowSelection(item, status);
//     if (item.children) {
//       recursiveChildren(item.children, status);
//     }
//   });
// }

/* function changeStatus(status) {
  let color = null
  switch (status) {
      case '未发布':
          color = '#bb1a1a'
          break
      case '已发布':
          color = '#21c01c'
          break
  }
  return color
} */

// 数据回显
function checkArr(selectedData) {
  tableRef.value.clearSelection();
  if (!tableData.value) return;
  tableDataAll.value.forEach((item) => {
    selectedData.forEach((item_2) => {
      if (item.id === item_2.id) {
        tableRef.value.toggleRowSelection(item, true); // 回显
      }
    });
  });
}
//取消高亮
function clearCurrentRow() {
  tableRef.value.setCurrentRow();
}

//车牌

const greenClassBox = ['绿色1325农用车', '黄色1225农用车', '民航车牌类型']
const nowGreenClassBox = ['临时行驶车']
const tempEntry = ['临时入境车']
const newEnergy = ['新能源车牌']
const yellowClassBox = ['挂牌', '教练车', '黄色双行尾牌', '摩托车']
const blackClassBox = ['领馆汽车', '使馆车', '港澳入出车']
const whiteClassBox = ['警车', '92式武警车', '一行结构的新武警车', '两行结构的新武警车', '04式新军车', '左右军车', '上下军车']
const typeClassBox = ['02式个性化车']
const blueClassBox = ['92式民用车']
function itemClass(item) {
  // console.log('item',item)
  if (greenClassBox.includes(item)) {
    return 'greenClassBox'
  } else if (nowGreenClassBox.includes(item)) {
    return 'nowGreenClassBox'
  } else if (tempEntry.includes(item)) {
    return 'tempEntry'
  } else if (newEnergy.includes(item)) {
    return 'newEnergy'
  } else if (yellowClassBox.includes(item)) {
    return 'yellowClassBox'
  } else if (blackClassBox.includes(item)) {
    return 'blackClassBox'
  } else if (whiteClassBox.includes(item)) {
    return 'whiteClassBox'
  } else if (typeClassBox.includes(item)) {
    return 'typeClassBox'
  } else if (blueClassBox.includes(item)) {
    return 'blueClassBox'
  }
}

watch(
  () => selectedData.value,
  (newValue, oldValue) => {
    console.log('basicInfoData?.value.appId变化了', newValue, oldValue);
    checkArr(newValue);
  },
  { immediate: false, deep: true },
);

onMounted(() => {
  // roleField.value = store.state.user.roleField
  // 特定是弹框选择数据
  if (selectedData.value) checkArr(selectedData.value);
});

defineExpose({ checkArr, clearCurrentRow,getSelectionRows });
</script>

