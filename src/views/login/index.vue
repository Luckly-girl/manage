<template>
  <div class="login" id="loginSubmitBtn">
    <div class="login-container">
      <div class="login-manager-title">
        <img src="@/assets/images/login/zi.png" /><!-- cdn管理系统图片 -->
      </div>

      <div class="login-user">
        <div class="login-user-title">
          <img
            src="@/assets/images/login/yonhudenglu.png"
          /><!-- 用户登录图片 -->
        </div>

        <el-form :model="userInfo" @submit.native.prevent>
          <!-- 输入框 -->
          <input type="password" class="hide" id="password" />
          <input type="text" class="hide" id="username" />
          <el-form-item prop="username" class="input-bg">
            <img src="@/assets/images/login/yonhuming.png" alt />
            <el-input
              autocomplete="off"
              v-model="userInfo.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>

          <el-form-item class="input-bg">
            <img src="@/assets/images/login/mima.png" alt />
            <el-input
              autocomplete="off"
              v-model="userInfo.password"
              show-password
              placeholder="请输入密码"
              @keyup.enter.native="handlerSubmitBtn"
            ></el-input>
          </el-form-item>

          <div class="remember-me">
            <!-- <input type="checkbox" id="rememberme" /> -->
            <label
              for="rememberme"
              :class="{ right: isActive }"
              @click="isRemember"
              class="unCopy"
              >记住密码</label
            >
          </div>

          <el-form-item class="btn loginBtn">
            <el-button class="submitBtn" @click="handlerSubmitBtn"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item class="btn registerBtn">
            <el-button class="submitBtn" @click="$router.push('regist')"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { login } from "@/api/login";
import { type } from "os";
import CryptoJS from "crypto-js";
import { setCookie, getCookie, clearCookie } from "@/utils/encryption";
export default {
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      isActive: false,
    };
  },
  created() {
    if (!localStorage.getItem("registUserInfo")) {
      if (JSON.parse(localStorage.getItem("rememberPsw"))) {
        this.isActive = JSON.parse(localStorage.getItem("rememberPsw"));
        this.userInfo = getCookie();
      } else {
        this.userInfo = {
          username: "",
          password: "",
        };
        this.isActive = false;
      }
    } else {
      this.userInfo = {
        username: JSON.parse(localStorage.getItem("registUserInfo")).userName,
        password: JSON.parse(localStorage.getItem("registUserInfo")).passWord,
      };
    }

    let that = this;
    //当前页面监视键盘输入
    document.onkeydown = function (e) {
      //事件对象兼容
      let e1 =
        e || event || window.event || arguments.callee.caller.arguments[0];
      if (e1 && e1.keyCode == 13) {
        that.handlerSubmitBtn();
      }
    };
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
  methods: {
    isRemember() {
      this.isActive = !this.isActive;
    },
    handlerSubmitBtn() {
      login(
        this.userInfo.username,
        CryptoJS.MD5(this.userInfo.password).toString(),
        this.isActive
      ).then((res) => {
        if (this.isActive) {
          localStorage.setItem("rememberPsw", JSON.stringify(this.isActive));
          setCookie(this.userInfo.username, this.userInfo.password, 30);
        } else {
          localStorage.removeItem("rememberPsw");
          clearCookie();
        }
        this.$store.commit("SET_TOKEN", res.data.token);
        this.$router.push({
          path: "/home",
        });
        // 通过token去获取用户信息
        this.$store.commit("SET_USERINFO", res.data.user);
      });
    },
  },
};
</script>

<style>
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}

.input-bg .el-input__inner {
  background: transparent !important;
  border: none;
  color: #fff;
}

.input-bg .el-input__inner:focus::-webkit-input-placeholder {
  color: transparent;
}

.el-form-item__content {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

<style scoped>
.hide {
  width: 0;
  position: absolute;
  border: 0;
}
.login {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 800px;
  background: url("../../assets/images/login/login-bg.jpg") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}

.login-container {
  position: absolute;
  box-sizing: border-box;
  width: 600px;
  bottom: 25%;
  right: 8%;
  overflow: hidden;
}

.login-container .login-manager-title {
  text-align: center;
  padding: 50px;
  height: 30px;
}

.login-container .login-user {
  background: url("../../assets/images/login/beijingkuang.png") no-repeat;
  background-size: 100% 100%;
}

.login-user .login-user-title {
  text-align: center;
  padding-top: 30px;
  height: 36px;
}

.el-form {
  padding: 15px 30px;
}

.el-form-item {
  margin-bottom: 0;
}

.input-bg {
  height: 48px;
  margin: 15px 15px;
  padding-left: 20px;
  background-image: url("../../assets/images/login/shurukuang.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: left center;
}

.el-input {
  width: 400px;
  box-sizing: border-box;
  border: none;
  color: #fff;
  background: transparent;
  font-size: 20px;
  line-height: 30px;
  margin-left: 20px;
}

.remember-me {
  overflow: hidden;
  padding: 8px 30px 8px 15px;
}

.remember-me > input {
  display: none;
}

.remember-me > label {
  display: inline;
  padding-left: 35px;
  font-family: "Microsoft YaHei";
  color: rgb(46, 173, 250);
  font-size: 22px;
  background: url("../../assets/images/login/meigouxuan.png") no-repeat top 2px
    left 0px;
}

.remember-me > label.right {
  background: url("../../assets/images/login/gouxuan.png") no-repeat top 2px
    left 0px;
}

.el-button {
  border-radius: 0;
}

.btn {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 15px;
}
.btn.loginBtn {
  padding-top: 16px;
}
.btn.registerBtn {
  padding-bottom: 30px;
}
.btn.registerBtn .submitBtn {
  background: #1d4d80;
  color: #fff;
}
.submitBtn {
  border: none;
  width: 100%;
  height: 50px;
  font-size: 26px;
  color: #fff;
  line-height: 30px;
  background: url("../../assets/images/login/anniu_lan.png");
}
</style>
