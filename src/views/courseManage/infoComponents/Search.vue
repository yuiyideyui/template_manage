<template>
  <div class="search-container">
    <el-card>
     <el-form  :inline="true" class="search-form">

        <el-form-item label="用户名称">
          <el-input  />
        </el-form-item>

        <el-form-item label="登录账号">
          <el-input   />
        </el-form-item>

        <el-form-item label="用户类型">
          <el-select
           
            placeholder="please select your zone"
          >
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
           
            type="date"
            placeholder="Pick a date"
            clearable
          />
        </el-form-item>

        <div  class="el-form-item-button"   >
            <el-button type="danger">搜索</el-button>
            <el-button>重置</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.search-container {
  
  max-width: 100%;
   
  .search-form{
    .el-input{
        --el-input-width: 220px;
    }
    .el-select{
        --el-select-width:220px
    }
    .el-form-item-button{
       display: flex;
        width: 100%;
        justify-content: center;
 
    }
  }
}
</style>
