<template>
  <div class="personalDetails">
    <el-form
      ref="newUserInfo"
      :rules="newUserInfoRules"
      :model="newUserInfo"
      label-width="0"
      label-position="left"
    >
      <ul class="user-info-ul">
        <li>
          <div class="portrait">
            <img src="@/assets/images/login/user.jpg" alt />
            <span>账号： {{userInfo.username}}</span>
          </div>
          <el-form-item label>
            <div>
              <p>用户名</p>
              <el-input v-model="nickName" :disabled="true"></el-input>
            </div>
          </el-form-item>
          <el-form-item label prop="nickname">
            <div>
              <p>更改</p>
              <el-input v-model="newUserInfo.nickname" placeholder="请输入新用户名"></el-input>
            </div>
          </el-form-item>
        </li>
        <li>
          <el-form-item label prop="oldPwd">
            <div>
              <p>当前密码</p>
              <el-input
                v-model="newUserInfo.oldPwd"
                show-password
                auto-complete="new-password"
                placeholder="请输入当前密码"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label prop="pwd">
            <div>
              <p>更改密码</p>
              <el-input
                v-model="newUserInfo.pwd"
                show-password
                auto-complete="new-password"
                placeholder="请输入更改密码"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label prop="isPwd">
            <div>
              <p>确认密码</p>
              <el-input
                v-model="newUserInfo.isPwd"
                show-password
                auto-complete="new-password"
                placeholder="请输入确认密码"
              ></el-input>
            </div>
          </el-form-item>
        </li>
        <li>
          <!--          <el-form-item label prop="mobile">-->
          <el-form-item label>
            <div>
              <p>手机号</p>
              <el-input
                v-model="newUserInfo.mobile"
                placeholder="请输入手机号"
                maxlength="11"
                :disabled="true"
              ></el-input>
            </div>
          </el-form-item>
          <!--          <el-form-item label prop="email">-->
          <el-form-item label>
            <div>
              <p>邮箱</p>
              <el-input v-model="newUserInfo.email" placeholder="请输入邮箱" :disabled="true"></el-input>
            </div>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="passBut-bg">
      <el-button class="buts passBut" @click="SET_setPwd" :disabled="subDisable">确认</el-button>
    </div>
  </div>
</template>


<script>
import { setPwdAndNickName } from "../../api/user.js";

export default {
  data() {
    let pwd = (rule, value, callback) => {
      if (value === "" && this.newUserInfo.isPwd !== "") {
        callback(new Error("请输入新密码"));
      } else if (value === "" && this.newUserInfo.isPwd === "") {
        callback();
      } else {
        if (value.length < 6) {
          callback(new Error("请输入6位以上的密码"));
        } else {
          if (this.newUserInfo.isPwd !== "") {
            this.$refs.newUserInfo.validateField("isPwd");
          }
          callback();
        }
      }
    };
    let isPwd = (rule, value, callback) => {
      if (value === "" && this.newUserInfo.pwd !== "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.newUserInfo.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let oldPwd = (rule, value, callback) => {
      if (
        value === "" &&
        (this.newUserInfo.pwd !== "" || this.newUserInfo.isPwd !== "")
      ) {
        callback(new Error("请输入当前密码"));
      } else {
        callback();
      }
    };
    let mobile = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (value.length < 11) {
          callback(new Error("请输入正确格式的手机号"));
        } else {
          const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正确格式的手机号"));
          } else {
            callback();
          }
        }
      }
    };
    let email = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的邮箱"));
        } else {
          callback();
        }
      }
    };
    return {
      newUserInfoRules: {
        pwd: [{ validator: pwd, trigger: "blur" }],
        isPwd: [{ validator: isPwd, trigger: "blur" }],
        oldPwd: [{ validator: oldPwd, trigger: "blur" }],
        mobile: [{ validator: mobile, trigger: "blur" }],
        email: [{ validator: email, trigger: "blur" }]
      },
      newUserInfo: {
        nickname: "", // 昵称
        oldPwd: "", // 旧密码
        pwd: "", // 新密码
        isPwd: "", // 确认新密码
        mobile: "", // 手机号
        email: "" // 邮箱
      },
      nickName: "",
      subDisable: true
    };
  },
  created() {
    this.$store.dispatch("GetUserInfo").then(res => {
      this.nickName = res.data.nickname;
      this.newUserInfo.email = res.data.email;
      this.newUserInfo.mobile = res.data.mobile;
    });
    // this.oldPassword = this.user.password.substring(0,6);
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    email() {
      return this.$store.state.userInfo.email;
    },
    mobile() {
      return this.$store.state.userInfo.mobile;
    },
    nickname() {
      return this.newUserInfo.nickname;
    },
    pwd() {
      return this.newUserInfo.pwd;
    },
    isPwd() {
      return this.newUserInfo.isPwd;
    },
    newEmail() {
      return this.newUserInfo.email;
    },
    newMbile() {
      return this.newUserInfo.mobile;
    }
  },
  watch: {
    nickname(val) {
      if (
        !val &&
        !this.newUserInfo.isPwd &&
        !this.newUserInfo.pwd &&
        this.newEmail === this.email &&
        this.newMbile === this.mobile
      ) {
        this.subDisable = true;
      } else {
        this.subDisable = false;
      }
    },
    pwd(val) {
      if (
        !val &&
        !this.newUserInfo.isPwd &&
        !this.newUserInfo.nickname &&
        this.newEmail === this.email &&
        this.newMbile === this.mobile
      ) {
        this.subDisable = true;
      } else {
        this.subDisable = false;
      }
    },
    isPwd(val) {
      if (
        !val &&
        !this.newUserInfo.pwd &&
        !this.newUserInfo.nickname &&
        this.newEmail === this.email &&
        this.newMbile === this.mobile
      ) {
        this.subDisable = true;
      } else {
        this.subDisable = false;
      }
    },
    newMbile(val) {
      if (
        val === this.mobile &&
        !this.newUserInfo.pwd &&
        !this.newUserInfo.nickname &&
        this.newEmail === this.email &&
        !this.newUserInfo.isPwd
      ) {
        this.subDisable = true;
      } else {
        this.subDisable = false;
      }
    },
    newEmail(val) {
      if (
        val === this.email &&
        !this.newUserInfo.pwd &&
        !this.newUserInfo.nickname &&
        !this.newUserInfo.isPwd &&
        this.newMbile === this.mobile
      ) {
        this.subDisable = true;
      } else {
        this.subDisable = false;
      }
    }
  },
  methods: {
    SET_setPwd() {
      this.$refs["newUserInfo"].validate(valid => {
        if (valid) {
          setPwdAndNickName(this.newUserInfo).then(res => {
            this.$store.dispatch("GetUserInfo").then(res => {
              if (
                this.newUserInfo.isPwd !== "" &&
                this.newUserInfo.pwd !== "" &&
                this.newUserInfo.oldPwd !== ""
              ) {
                this.$router.push("/");
              } else {
                this.nickName = res.data.nickname;
                this.$refs["newUserInfo"].resetFields();
                this.newUserInfo.email = res.data.email;
                this.newUserInfo.mobile = res.data.mobile;
              }
            });
          });
        }
      });
    },
    SET_getUserAndRoles() {
      getUserAndRoles(this.user.id).then(res => {
        this.$store.commit("SET_USERINFO", res.data.user);
        this.nickName = this.userInfo.nickname;
      });
    }
  }
};
</script>
<style>
.personalDetails .el-input__inner {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  padding: 0 30px 0 20px;
  border: none;
  width: 280px;
  background-color: #f7f7f7;
  border-radius: 4px;
  outline: 0;
}
.personalDetails .el-form-item {
  margin-top: 50px;
  margin-bottom: 0;
}
.buts.el-button--default.is-disabled.passBut {
  background: #ccc;
}
</style>
<style lang="less" scoped>
.personalDetails {
  .user-info-ul {
    display: flex;
    justify-content: space-around;
    p {
      color: #333;
      font-size: 14px;
      display: flex;
      margin-bottom: 20px;
      line-height: 14px;
    }
    li:nth-child(n + 2) {
      padding-top: 51px;
    }
  }
  .portrait {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    img {
      width: 140px;
      height: 140px;
      display: block;
      border-radius: 50%;
      margin-bottom: 16px;
    }
  }
  .passBut-bg {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
  }
  .buts {
    display: inline-block;
    height: 40px;
    width: 180px;
    text-align: center;
    line-height: 40px;
    margin: 0 auto;
    border: 0;
    padding: 0;
    background: #4d71ee;
    color: #fff;
    border-radius: 5px;
  }
}
</style>