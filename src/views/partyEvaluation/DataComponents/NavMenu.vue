<template>
  <div
    class="NavMenu"
    :style="{ height: sectionHeight + 'px', width: 15 + '%' }"
  >
    <h3 style="text-align: center;padding: 10px; ">评价时段</h3>
    <!-- <div style="display: flex; margin-top: 10px; justify-content: center">
     
      <el-autocomplete
        v-model.trim="organizName"
        class="inline-input"
        value-key="name"
        :fetch-suggestions="querySearch"
        placeholder="请输入机构名称"
        :trigger-on-focus="false"
        clearable
        @select="handleSelect"
        @change="changeNav"
      />
    </div> -->
    <div class="my_table" style="height: 100vh">
      <el-scrollbar style="height: 100%">
        <el-table
          ref="PerioadCtrTable"
          v-loading="isLoading"
          :data="perioadNav"
          style="width: 100%; margin-bottom: 20px; font-size: 10px"
          row-key="id"
          
          :style="{cursor: 'pointer',fontSize:'14px'}"
          default-expand-all
          highlight-current-row
          @row-click="showTable"
        >
          <el-table-column prop="name" :show-overflow-tooltip="true" />
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import {watch,onMounted,ref,nextTick} from 'vue'
import {useStore} from 'vuex'
const prop =defineProps(['sectionHeight','refreshTabel']);
const store = useStore()
const isLoading = ref(true)
const PerioadCtrTable:any= ref(null)
const perioadNav=ref([])
const organizs = ref([])
const organizName =  ref('')
watch(()=>perioadNav.value,()=>{
    nextTick(()=>{
        console.log('不执行？');
        console.log(perioadNav.value[0]);
        
        PerioadCtrTable.value?.setCurrentRow(perioadNav.value[0])
    })
})
const emit = defineEmits(['setPeriodId','setCurrentPage',
'setLoading','setAgencyId'
])
onMounted(()=>{
    getPerioadNav()
    // getTipList()
})
const getPerioadNav =function() {
    store.dispatch('dataManage/getPerioadCtrListAction').then(() => {
        const newOrganizList = store.getters['dataManage/getPerioadCtrList']
        perioadNav.value = newOrganizList
        console.log(perioadNav,'侧边栏数据');
        
        isLoading.value = false
        emit('setPeriodId', perioadNav.value[0]) // 打开页面时的agency_id
        prop.refreshTabel( perioadNav.value[0])
    })
}

 // 搜索输入时返回提示
const querySearch=function(queryString, cb) {
    var organizs = organizs.value
    var results = queryString ? organizs.filter(createFilter(queryString))
        : organizs
    // 调用 callback 返回建议列表的数据
    cb(results)
}

const createFilter=function(queryString) {
    return (organiz) => {
        // return organiz.name.indexOf(queryString) === 0;
        return organiz.name.includes(queryString)
    }
}

const handleSelect=function(item) {
    isLoading.value = true
    console.log('触发了这个')
    changeNav()
}

 

const changeNav=function() {
    // 搜索框内无内容时恢复全部列表
    if (!organizName.value) {
        getPerioadNav()
        // this.isLoading = false;
        return
    }
    let val = {}
    val = {
        name: organizName.value
    }
             
}

 // 点击行时显示相对应的用户列表
const showTable=function(row) {

    const val = { agency_id: row.id, currentPage: 1, roleIdList: [3, 4, 5] }
    console.log(prop,'prop数据');
    prop.refreshTabel(row)
    emit('setCurrentPage', 1) // 初始化当前页
    emit('setLoading') // 表格进入加载状态
    emit('setPeriodId', row) // 更改新增时的agency_id
}
</script>

<style lang="less" scoped>
.NavMenu {
  display: inline-block;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

  .my_table {
    width: 100%;

    /* 正确使用 :deep(<inner-selector>) */
:deep(.el-table__expand-icon) {
  .el-icon-arrow-right:before {
    content: "\e791";
  }
}

:deep(.el-table__row > td) {
  /* 去除表格线 */
  border: none;
}

:deep(.el-table th.is-leaf) {
  /* 去除上边框 */
  border: none;
}

:deep(.el-table::before) {
  /* 去除下边框 */
  height: 0;
}

:deep(.el-table__body tr),
:deep(.el-table__body td) {
  padding: 0;
  height: 30px;
}

:deep(.el-table__row--level-0) {
  font-size: 14px;
  font-weight: bolder;
}

:deep(.el-table__row--level-1) {
  font-weight: bold;
}

  }

 /* 使用 :deep() 来穿透样式 */
:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
  width: 110%; /* 隐藏侧边默认滚动条 */
}

}
</style>
