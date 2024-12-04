<template>
  <div class="search">
    <el-form
      ref="searchForm"
      name="searchForm"
      class="input-wrap"
      :inline="true"
      :model="searchData"
    >

    <el-form-item label="所在党支部">
        <el-select 
        placeholder="请选择所在党支部"
        v-model="searchData.partyBranch"
        >
          <el-option
            v-for="item in partyBranchList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="学生姓名">
        <el-input 
        v-model.trim="searchData.stuName"
          placeholder="请输入学生姓名"
          size="small"
        
        />
      </el-form-item>

      <el-form-item label="学工号">
        <el-input
        v-model.trim="searchData.agency_id"
        placeholder="请输入学工号"
        />
      </el-form-item>
      

      <el-form-item class="submit">
        <el-button @click="searchTarget('searchForm')" color="#A51E07"
          >查 询</el-button
        >
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-dialog
      title="提示"
      :visible.sync="errorTipVisible"
      width="30%"
      :before-close="clearInput"
    >
      <span>该用户不存在，请检查所输入内容是否错误。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorTipVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->

    <div class="handle">
      <el-button color="#A51E07">批量导入</el-button>
      <el-button color="#A51E07">生成图表</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {useStore} from "vuex";

const store = useStore()
const prop = defineProps(["periodId", "partyBranchList"]);
const emit = defineEmits(["setLoading"])
const errorTipVisible = ref(false);
const searchTimer = ref(0);
const resetTimer = ref(null);
const searchData = ref({
  stuName: "",
  partyBranch: "",
  agency_id: null,
  
});
const searchForm:any = ref(null)
const searchTarget= function(formName,currentPage=1){
 
  if (searchTimer.value) {
    
    
    clearTimeout(searchTimer.value)
  }
  searchTimer.value = setTimeout(()=>{
    
    
    const val= {
      form:{
        name:searchData.value.stuName,
        periodId:prop.periodId,
        // agency_id:searchData.value.agency_id,
        sortWay: "desc",
        sortKey: "data_7"
      }
    }
    searchForm.value.validate((valid:any)=>{
      if(!valid){
        return
      }
      console.log('有触发?');
  
      store.dispatch('dataManage/searchUserDataListAction',val.form).then((res)=>{
        console.log(res,'触发了');
        console.log(store.state.dataManage.userDataList,'表格数据');
        
        if(res[0]){
          return
        }
      }).catch(e=>console.log(e,'错误'))
    })
  },500)
  
}
defineExpose({searchTarget})
</script>

<style lang="less" scoped>
.search {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .input-wrap {
    justify-items: center;
    align-items: center;

    grid-template-areas: "a b c" "d e f" "g g g";
    padding-left: 20px;

    .el-form-item {
      margin-bottom: 0;
      width: 25%;
      margin-top: 20px;
      margin-right: -10px !important;
      .el-input,
      .el-select {
        width: 80%;
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

    // .submit {
    //   border: none;
    //   grid-area: g;

    //   button {
    //     padding: 0;
    //     width: 100px;
    //     height: 30px;
    //     line-height: 30px;
    //     font-size: 13px;
    //   }
    // }
  }
  .handle {
    padding: 20px;
    width: 100%;
  }
}
</style>
