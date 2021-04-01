<template>
  <div class="regist">
    <div class="regist-header-bg">
      <div class="regist-header">
        <div class="regist-header-left">
          <h1><img src="../../assets/images/login/logo.png" alt=""></h1>
          <span>欢迎注册</span>
        </div>
        <div class="regist-header-right">已有帐号？ <span class="tologin" @click="$router.push('login')">请登录></span></div>
      </div>
    </div>
    
    <el-form ref="userInfo" :model="userInfo" class="regist-content" label-width="98px" label-position="left" :rules="registRules">
      <input type="password" class="hide" id="passWord"/>
      <input type="text" class="hide" id="userName"/>
      <el-form-item prop="userName" label="用户名">
        <el-input autocomplete="off" v-model="userInfo.userName" placeholder="请输入英文及数字"></el-input>
      </el-form-item>

      <el-form-item prop="passWord" label="设置密码">
        <el-input show-password autocomplete="off" v-model="userInfo.passWord" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item prop="isPassWord" label="确认密码">
        <el-input show-password  autocomplete="off" v-model="userInfo.isPassWord" placeholder="请再次输入密码"></el-input>
      </el-form-item>

      <el-form-item prop="email" label="邮箱">
        <el-input v-model="userInfo.email" placeholder="请输入邮箱号"></el-input>
      </el-form-item>

      <el-form-item prop="qqNumber" label="QQ">
        <el-input v-model="userInfo.qqNumber" placeholder="请输入QQ号码"></el-input>
      </el-form-item>

      <el-form-item prop="phoneNumber" label="手机号码" class="phoneNumberItem">
        <el-input v-model="userInfo.phoneNumber" placeholder="建议使用常用的手机号" maxlength="11"></el-input>
        <button @click.prevent="getCode()" class="code-btn" :disabled="!codeShow">
            <span v-show="codeShow">获取验证码</span>
            <span v-show="!codeShow" class="count">重新获取（{{count}} s）</span>
        </button>
      </el-form-item>

      <el-form-item prop="mcode" label="手机验证码">
        <el-input v-model="userInfo.mcode" placeholder="请输入手机验证码" maxlength="6"></el-input>
      </el-form-item>

      
      <el-button class="submitBtn" @click="handlerSubmitBtn">注册</el-button>

    </el-form>
  </div>
</template>

<script>
import { register, checkMcode, sendMsg } from "@/api/login";
import CryptoJS from "crypto-js";
export default {
  data() {
    let pwd = (rule, value, callback) => {
      if (value === "" && this.userInfo.isisPassWordPwd !== "") {
        callback(new Error("请输入新密码"));
      } else if (value === "" && this.userInfo.isPassWord === "") {
        callback();
      } else {
        if (value.length < 6) {
          callback(new Error("请输入6位以上的密码"));
        } else {
          if (this.userInfo.isPassWord !== "") {
            this.$refs.userInfo.validateField("isPassWord");
          }
          callback();
        }
      }
    };
    let isPwd = (rule, value, callback) => {
      if (value === "" && this.userInfo.passWord !== "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.userInfo.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    let mobile = (rule, value, callback) => {
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
    };
    let email = (rule, value, callback) => {
      const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确格式的邮箱"));
      } else {
        callback();
      }
    };
    let qqNumber = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg = /^[1-9][0-9]{4,9}$/gim;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的qq号"));
        } else {
          callback();
        }
      }
    };
    let mcode = (rule, value, callback) => {
      const reg = /^\d{6}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的短信验证码"));
      } else {
        callback();
      }
    };
    let userName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{4,16}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入4-16位的英文及数字"));
      } else {
        callback();
      }
    };
    return {
      codeShow: true,
      userInfo: {
        userName: "",
        passWord: "",
        isPassWord: "",
        email: "",
        qqNumber: "",
        phoneNumber: "",
        mcode: ""
      },
      timer: null,
      count: 60,
      registRules: {
        userName: [
          { required: true, validator: userName, trigger: "blur" }
        ],
        passWord: [{ required: true, validator: pwd, trigger: "blur" }],
        isPassWord: [
          { required: true, validator: isPwd, trigger: "blur" }
        ],
        email: [{ required: true, validator: email, trigger: "blur" }],
        qqNumber: [
          { validator: qqNumber, trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, validator: mobile, trigger: "blur" }
        ],
        mcode: [
          { required: true, validator: mcode, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (localStorage.getItem("codeTime")) {
      this.count = 120 - parseInt((new Date().getTime() - localStorage.getItem("codeTime")) / 1000);
      this.codeShow = false;
      this.timer = setInterval(() => {
        if (this.count > 0 && this.count <= 120) {
          this.count--;
        } else {
          localStorage.removeItem("codeTime")
          this.codeShow = true;
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000)
    }
  },
  methods: {
    getCode() {
      this.$refs.userInfo.validateField('phoneNumber', (err) => {
        if (err) {
        } else {
          sendMsg(this.userInfo.phoneNumber).then(res => {
            if (!this.timer) {
              localStorage.setItem("codeTime", new Date().getTime())
              this.count = 120;
              this.codeShow = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= 120) {
                  this.count--;
                } else {
                  localStorage.removeItem("codeTime")
                  this.codeShow = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          });
        }
      })
       //axios请求
     
    },
    isRemember() {
      this.isActive = !this.isActive;
    },
    handlerSubmitBtn() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          checkMcode(this.userInfo.phoneNumber, this.userInfo.mcode).then(res => {
            let _userInfo = {
              userName: this.userInfo.userName,
              passWord: CryptoJS.MD5(this.userInfo.passWord).toString(),
              isPassWord: CryptoJS.MD5(this.userInfo.isPassWord).toString(),
              email: this.userInfo.email,
              qqNumber: this.userInfo.qqNumber,
              phoneNumber: this.userInfo.phoneNumber,
              mcode: this.userInfo.mcode
            }
            register(_userInfo).then(res => {
              localStorage.setItem("registUserInfo", JSON.stringify({
                userName: this.userInfo.userName,
                passWord: this.userInfo.passWord
              }))
              this.$router.push({
                path: "/login"
              });
            });
          })
        }
      })
    }
  }
};
</script>


<style lang="stylus" scoped>
.hide{
  width: 0;
  position: absolute;
  border 0
}
.regist-header-bg{
  position fixed
  top 0
  left 0
  background #fff
  width: 100%;
  z-index 999
  min-width: 1400px
  box-sizing: border-box;
  height: 100px;
  box-shadow: 0px 3px 18px 0px 	rgba(0, 0, 0, 0.1);
}
.regist-header{
  width 1200px
  height 100%
  margin 0 auto
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.regist-header>div{
  display: flex;
  align-items: center;
}
.regist-header-left{
  font-size: 24px;
	color: #333333;
  h1{
    margin-right: 24px;
  }
}
.regist-header-right{
  font-size: 16px;
	color: #a1a1a1;
  span{
    color: #ef3434;
    cursor pointer
  }
}
.regist-content{
  width 480px
  margin 0 auto
  padding-top 200px 
  .el-form-item{
    display flex
    border 1px solid #dddddd
    padding-left 16px
    box-sizing border-box
  }
}
.submitBtn{
  width 100%
  height: 52px;
	background-color: #4d71ee;
  font-size 18px
  color #fff
  margin-top 90px
}
.code-btn{
  position absolute;
  top -1px;
  right -1px;
  cursor pointer
  outline none;
  width: 168px;
  height 42px
	background-color: #f5f5f5;
	border: solid 1px #dddddd;
}
</style>
<style>
.phoneNumberItem .el-form-item__content{
  position: relative;
}
.regist-content .el-form-item__label{
    position: relative;
    padding: 0;
    font-size: 16px;
    color: #333;
  }
  .regist-content .el-form-item__content{
    margin-left: 0!important;
    width: 100%;
  }
  .regist-content .el-form-item__content .el-input__inner{
    border: 0;
  }
  .regist-content .el-form-item{
    margin-bottom: 32px;
  }
</style>
