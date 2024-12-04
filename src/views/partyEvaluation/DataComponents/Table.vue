<template>
  <div class="user-table">
    <!-- isLoading -->
	 <!--  @selection-change="userSelectionsChange" -->
	<el-table
      v-loading="false"
      :data="userDataList"
     
      style="width: 99%; font-size: 13px"
      row-key="id"
	
      border
    >
	 
      <!-- <el-table-column type="selection" align="center" /> -->
	  <!-- <el-table-column type="index" width="40"  label="序号" align="center" /> -->
	
	 
	 
      <el-table-column  width="200"  label="基本信息" align="center" style="position: relative;">
		<template #default="props">
			<div style="z-index: 1999; position: absolute;top: 10%;width: 100vw;height: 30px;background-color: red;">1</div>
			<div style="text-align: left;margin-top: 30px;">
				<p>
					培养阶段：{{props.row.data_3}}
				</p>
				<p>
					申请入党时间：{{props.row.data_1}}
				</p>
				<p>
					入党时间：{{props.row.data_2}}
				</p>
			</div>
		</template>
		 
	  </el-table-column>
      <el-table-column prop="isBraCommittee" label="是否担任支委" align="center" />
      <el-table-column prop="educationTime" width="120" label="继续教育学时" align="center" />
      <el-table-column prop="volunteer" label="志愿时长" width="60" align="center" />
      <el-table-column prop="publishThesis" label="发表论文情况" width="70" align="center" />
       
     
      <el-table-column prop="award" label="获奖情况" align="center" />
      <el-table-column prop="score" label="绩点" align="center" />
      <el-table-column prop="scholarship" label="奖学金" align="center" />
      <el-table-column prop="ExcelGraduate" width="70" label="优秀毕业生"  align="center" />
      <el-table-column prop="outstandParty" label="优秀党员" width="80" align="center" />
      <el-table-column prop="demoEvaluation" label="民主评议" width="80" align="center" />
      <el-table-column prop="rating" label="评级" width="150" align="center" />
	  

	  

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showUpdateUserForm(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="block">
      <el-pagination
        :page-size="8"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        background
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div> -->

    <!-- 编辑用户信息弹出框 -->
    <!-- <el-dialog
      class="userModal"
      title="编辑用户信息"
      :visible.sync="updateUserManageFormVisible"
      center
      width="40%"
      @close="submitCancel('UpdateUserManageForm')"
    >
      <el-form
        ref="UpdateUserManageForm"
        v-loading="isUpdateLoading"
        name="UpdateUserManageForm"
        :model="updateUserManageForm"
        :rules="userRules"
        label-width="120px"
        label-position="right"
        size="small"
        status-icon
      >
        <transition-group name="submitErrorTransition">
          <p v-show="isSubmitError" key="1" class="submitError">
            提交失败，请检查表格
          </p>
          <p v-show="hasErrorMessage" key="2" class="submitError">
            {{ errorMessage }}
          </p>
        </transition-group>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            ref="avatarUpload"
            class="avatar-uploader"
            :action="uploadPicUrl"
            :headers="myHeader"
            accept=".jpg, .jpeg, .png, .JPG"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="margin-left: 10px; width: 80%"
          >
            <img
              v-if="this.updateUserManageForm.avatar"
              :src="this.updateUserManageForm.avatar"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户类型" prop="s_role_id">
          <el-select
            v-model="updateUserManageForm.s_role_id"
            placeholder="请选择搜索类型"
            style="margin-left: 10px; width: 80%"
            @focus="isSubmitError = false"
          >
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input
            v-model.trim="updateUserManageForm.name"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="工号/学号" prop="member_no">
          <el-input
            v-model.trim="updateUserManageForm.member_no"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录账号" prop="login_code">
          <el-input
            v-model.trim="updateUserManageForm.login_code"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model.trim="updateUserManageForm.password"
            placeholder="请输入新密码，空则默认为原密码"
            style="margin-left: 10px; width: 80%"
            show-password
            minlength="6"
            maxlength="12"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input
            v-model.trim="updateUserManageForm.mobile"
            style="margin-left: 10px; width: 80%"
            oninput="value=value.replace(/[^0-9.]/g,'')"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="updateUserManageForm.email"
            style="margin-left: 10px; width: 80%"
            @keydown.enter.native="skipInput"
            @focus="isSubmitError = false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isUpdateLoading" @click="submitCancel('UpdateUserManageForm')">取 消</el-button>
        <el-button
          type="primary"
          :disabled="isUpdateLoading"
          @click="submitUpdateUserManageForm('UpdateUserManageForm')"
        >确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 确认删除 -->
    <!-- <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delIndeed">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import {ref,watch,computed,onMounted,nextTick} from "vue"
import {useStore} from "vuex"
 

const store = useStore()
const props = defineProps(['rules','periodId','loading','refreshTabel'])
const emit = defineEmits(["fetchTable"])

const isLoading = ref(true)
const userDataList = ref([])
 
const currentPage = ref(1)
const total = ref(0)
const updateUserManageFormVisible = ref(false)
const delRowId = ref(null)
const isSubmitError = ref(false)
const hasErrorMessage = ref(false)
const errorMessage = ref('')
const isUpdateLoading = ref(false)

const goresetPerioadCtrList = computed(() => store.state.dataManage.perioadCtrList);
const goresetuserDataList = computed(()=>store.state.dataManage.userDataList )
 

watch(goresetuserDataList,(newValue)=>{
	userDataList.value = newValue
    console.log(userDataList.value,"表格数据");
	console.log('调用了');
})

watch(goresetPerioadCtrList,()=>{
	changePerioadCtrList()
})
 
 // 控制单元格合并的方法
const spanMethod=function({ rowIndex, columnIndex }) {
	console.log(rowIndex);
	
	if ( columnIndex === 0) {
    if (  rowIndex % 2 === 0) {
      return {
        rowspan: 1,
        colspan: 2,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

 
 
 

// const refreshUserDataList =async ()=>{
// 	emit('fetchTable')
// 	await props.refreshTabel(props.periodId)
// 	console.log('user',userDataList.value);
	
// }

const changePerioadCtrList = ()=>{
	userDataList.value = store.getters["dataManage/getUserDataList"]
	console.log(userDataList.value,'2');
	
}

</script>

<style lang="less" scoped>
.user-table {
	// height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	// margin-left: 1%;
	width: 100%;
 
	margin-top: 10px;
    border-radius: 5px;
    
   

	.el-pagination {
		margin: 10px auto;
	}
}

// .el-avatar {
// 	:deep {
// 		display: flex;
// 		justify-content: center;
// 	}
// }

.submitError {
	// position: absolute;
	// top: 40px;
	// left: 160px;
	text-align: center;
    color: rgba(255, 0, 0, 0.8);
}

// 上传头像样式
.avatar-uploader {
	:deep(.el-upload) {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	:deep(.el-upload:hover) {
			border-color: #409eff;
		}
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 58px;
	height: 58px;
	line-height: 58px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
