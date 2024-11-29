<template>
  <div class="login-container">
    
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          <p>中山大学</p>
          <p>党建AI管理系统</p>
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <el-icon class="icon"><User /></el-icon>
        </span> 
 
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on" 
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <el-icon class="icon"><Lock /></el-icon>
        </span>
        <el-input
          ref="password"
          :key="passwordType"
          v-model="loginForm.password"
          name="password"
          :type="passwordType"
          placeholder="密码"
          tabindex="2"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
    
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
 import { useStore } from 'vuex'
console.log("进入登录");
const loginFormRef = ref(null)
const loginForm = ref({
  username: "",
  password: "",
});
const store = useStore()
const loginRules = ref({
  password: [{ required: true, trigger: "blur" }],
});

const passwordType = ref("password");

const capsTooltip = ref(false);
const loading = ref(false);
const showDialog = ref(false);
const redirect = ref(undefined);
const otherQuery = ref({});

const router = useRouter();
const checkCapslock = function (e: any) {
  const { key } = e;
  capsTooltip.value = key && key.length === 1 && key >= "A" && key <= "Z";
};

const handleLogin = function () {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
       store
        .dispatch("user/login", loginForm.value)
        .then(() => {
          console.log(redirect.value);
          console.log(otherQuery.value);
          router.push({
            path: redirect.value || "/",
            query: otherQuery.value,
          });
          loading.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
  // router.push('/')
};
</script>

<style lang="less">
@bg: #283443;
@light_gray: #fff;
@cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: @cursor)) {
  .login-container .el-input input {
    color: @cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__wrapper {
      background-color: red;
      all: unset; /* 重置所有样式 */
      /* 或者具体的属性 */
      padding: 0 !important;
      box-shadow: none !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      caret-color: @cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px;
  }
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    position: relative;

    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 10px;
    color: @dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;

    .icon {
      width: 3em;
      height: 1em;

      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;

      display: inline-block;
    }
  }

  .title-container {
    position: relative;

    .title {
      line-height: 1.8;
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
