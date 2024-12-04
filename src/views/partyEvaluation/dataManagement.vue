<template>
  <div class="dataMangement-container">
    <NavMenu :refreshTabel="refreshTabel" @setPeriodId="setPeriodId" />
    <div id="right-box" ref="rightBox">
      <Search :periodId="periodId" ref="searchRef" />
      <Table @fetchTable="fetchTable" :periodId="periodId" :refreshTabel="refreshTabel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import NavMenu from "./DataComponents/NavMenu.vue";
import Search from "./DataComponents/Search.vue";
import Table from "./DataComponents/Table.vue";
const periodId = ref("");
const searchRef: any = ref(null);
const store = useStore();
// 刷新表格
const refreshTabel = (val: any) => {
  // console.log(val.id, "属性");
  if(!val){
    return
  }
  return new Promise((resolve) => {
    store.dispatch("dataManage/searchUserDataListAction", {
      periodId: val.id,
      name: "",
      sortWay: "desc",
      sortKey: "data_7",
    }).then(res=>{
      if(res.code==0){
         store.commit('dataManage/set_goresetData')
      }
      resolve(false)
    });
  });
};
// 获取侧边栏周期id
const setPeriodId = (val: any) => {
  // console.log(val, 1111);

  if (val.id) {
    periodId.value = val.id;

  }
};
// 请求表格数据
const fetchTable = () => {
  console.log("触发的");

  searchRef.value.searchTarget();
};
</script>

<style lang="less" scoped>
.dataMangement-container {
  display: flex;

  #right-box {
    display: inline-block;
    width: 85%;
    margin-left: 10px;
  }
}
</style>
