<template>
  <div class="backstage-manage">
    <Search @setLoading="setLoading" />
    <Emendation
      :rules="rules"
      :user-type-options="userTypeOptions"
      :upload-pic-url="uploadPicUrl"
      @setLoading="setLoading"
    />
    <Table
      :rules="rules"
      :user-type-options="userTypeOptions"
      :upload-pic-url="uploadPicUrl"
      :loading="loading"
      @setLoading="setLoading"
    />
  </div>
</template>

<script>
import baseUrl from '@/store/modules/api'
import Search from './BMComponents/Search'
import Emendation from './BMComponents/Emendation'
import Table from './BMComponents/Table'
export default {
  name: 'BackstageManage',
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
        checkNewPassword: (rule, val, callback) => {
          if (!val) {
            callback(new Error('内容不能为空'))
          } else if (val && val.length < 6) {
            callback(new Error('密码不能小于6位或大于12位'))
          } else {
            callback()
          }
        },
        checkUpdatePassword: (rule, val, callback) => {
          if (val && val.length < 6) {
            callback(new Error('密码不能小于6位或大于12位'))
          } else {
            callback()
          }
        },
        checkNumber: (rule, val, callback) => {
          if (!val) {
            callback(new Error('内容不能为空'))
          } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val)) {
            callback(new Error('值必须为不小于0的数字'))
          } else {
            callback()
          }
        },
        checkTel: (rule, val, callback) => {
          if (!val) {
            // callback(new Error('内容不能为空'))
            callback()
          } else if (!/^0?1[3|4|5|6|7|8][0-9]\d{8}$/.test(val)) {
            callback(new Error('格式错误'))
          } else {
            callback()
          }
        },
        checkEmail: (rule, val, callback) => {
          if (val === '' || val == null) {
            // callback(new Error('内容不能为空'))
            callback()
          } else if (
            !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
              val
            )
          ) {
            callback(new Error('格式错误'))
          } else {
            callback()
          }
        }
      },
      flag: false,
      // 上传头像路径/manager/prod-api
      // uploadPicUrl: `${baseUrl.baseUrl}/user/userCtr/uploadPicture`,
      uploadPicUrl: `${baseUrl.baseUrl}/manager/prod-api/user/userCtr/uploadPicture`,
      loading: 0, // 使表格处于加载状态
      userTypeOptions: [
        // 新增或更新用户时的用户类型选项
        { value: 1, label: '系统管理员', disabled: true },
        { value: 2, label: '二级管理员' }
      ]
    }
  },
  methods: {
    // 设置表格加载状态
    setLoading() {
      this.loading = this.loading === 0 ? 1 : 0
    }
  }
}
</script>

<style>
</style>
