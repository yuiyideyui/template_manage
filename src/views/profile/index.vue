<template>
  <div class="app-container">
    <div v-if="user">
      <el-row>
        <p
          style="
            margin-left: 24px;
            font: normal bolder 40px/0px arial, sans-serif;
          "
        >
          您好，{{ user.name }}
        </p>
      </el-row>
      <el-row :gutter="20" style="margin-top: 40px;">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人信息" name="个人信息">
                <UserInfo :user="user" />
              </el-tab-pane>
              <el-tab-pane label="密码修改" name="密码修改">
                <Updatepassword :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
 
</template>

<script>
import { mapGetters } from 'vuex'
import Updatepassword from './components/Updatepassword.vue'
import UserInfo from './components/UserInfo.vue'
export default {
  name: 'Profile',
  components: { Updatepassword, UserInfo },
  data() {
    return {
      user: {},
      activeTab: '个人信息'
    }
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles,
        avatar: this.avatar
      }
    }
  }
}
</script>
