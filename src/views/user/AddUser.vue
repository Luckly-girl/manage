<template>
  <div class="add-user">
    <el-form
      :rules="rules"
      :inline="true"
      label-position="left"
      label-width="55px"
      ref="userFrom"
      :model="userFrom"
    >
      <div class="form-flex list-product">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userFrom.mobile" maxlength="11" :disabled="userFrom.id!=''"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <i class="icon-password"></i>
          <el-input v-model="userFrom.password"></el-input>
          <div class="password-font">请填写6位以上密码</div>
        </el-form-item>

        <el-form-item label="组织架构" prop="pgNumCode" label-width="70px">
          <el-cascader
            placeholder="请选择组织"
            v-model="userFrom.pgNumCode"
            :options="options"
            clearable
            filterable
            :props="{ expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="授予角色" label-width="70px" prop="roleIds">
          <el-select v-model="userFrom.roleIds" filterable clearable placeholder="请分配角色">
            <el-option
              v-for="item in roleIdsList"
              :key="item.id"
              :value="item.id"
              :label="item.roleName"
              :disabled="item.type==0"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getUsers, setUser, getUserAndRoles, getRoleList, getPowerGroup } from "@/api/user.js";
import { resetDataSpace } from "@/utils/filter";
import { getRoles, getRolesNew } from "@/api/auth.js";
import valid from "@/utils/validcode";

export default {
  props: ["parentmsg", "userID"],
  data() {
    let userName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{4,16}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入4-16位的英文及数字"));
      } else {
        callback();
      }
    };
    return {
      userFrom: {
        id: "", //	Integer	用户id(新增的时候不填,编辑必填)
        roleIds: "", //	String	角色id(用,隔开)
        username: "", //	String	用户名
        // nickname: "", // 昵称
        mobile: "", //	String	手机号
        email: "", //	String	邮箱
        password: "", //	String	密码
        version: "", //	String	版本
        pgNumCode: "",   // 组织结构编码
        // roleName: "",   // 角色名称
      },
      rules: {
        username: [
          { required: true, validator: userName, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.phoneNumber, trigger: "blur" }
        ],
        email: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.emailValue, trigger: "blur" }
        ],
        password: [
          { validator: valid.password, trigger: "blur" }
        ],
        pgNumCode: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        roleIds: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
      },
      value: [],
      options: [],
      roleIdsList: [],
    };
  },
  created() {
    getPowerGroup("", 2).then(res => {
      this.options = res.data[0].child;
      // this.options = res.data
    })
  },
  methods: {
    set_init() {
      this.userFrom = {
        id: '', 
        roleIds: "", 
        username: "", 
        mobile: "", 
        email: "", 
        password: "", 
        version: "", 
        pgNumCode: "",   
        // roleName: "",   
      };
      this.$nextTick(() => {
        this.$refs["userFrom"].resetFields();
      })
    },
    set_setUser() {
      this.$refs["userFrom"].validate(valid => {
        if (valid) {
          setUser({
            id: this.userFrom.id,
            roleIds: this.userFrom.roleIds,
            username: this.userFrom.username,
            mobile: this.userFrom.mobile,
            email: this.userFrom.email,
            password: this.userFrom.password,
            pgNumCode: this.userFrom.pgNumCode[this.userFrom.pgNumCode.length-1],
            version: this.userFrom.version
          }).then(res => {
            this.$emit("showbox", false)
          })
        }
      });
    },
    add_getUserAndRoles () {
      getRoles().then(res => {
        this.roleIdsList = res.data.rows;
      });
    },
    // 点击回显数据
    set_getUserAndRoles() {
      getUserAndRoles(this.userID).then(res => {
        if (this.parentmsg == "编辑账户") {
          this.userFrom.id = res.data.user.id;
          getRolesNew(this.userID).then(res => {
            this.roleIdsList = res.data;
          });
          this.userFrom.username = res.data.user.username;
          this.userFrom.mobile = res.data.user.mobile;
          this.userFrom.email = res.data.user.email;
          this.userFrom.password = "";
          this.userFrom.version = res.data.user.version;
          this.userFrom.pgNumCode = res.data.user.pgNumCodeList.slice(1);
          this.userFrom.roleIds = res.data.user.userRoles[0].roleId;
        }
      });
    },
    
  }
};
</script>

<style scpoed>
.add-user {
  padding: 40px 40px 0px;
}
.add-user .dialog-input {
  width: 180px;
}
.el-radio-group {
  padding: 9px;
}
.add-user .el-radio {
  display: block;
}
.add-user .form-flex .el-form-item {
  margin: 0 0 40px;
}
.add-user .form-flex .el-form-item:nth-child(4) {
  margin: 0 0 8px;
}
.password-font {
  font-size: 12px;
  color: #999999;
  line-height: 32px;
}
/* 密码背景图片 */
.icon-password {
  position: absolute;
  width: 24px;
  height: 17px;
  top: 8px;
  right: 8px;
  z-index: 100;
  background-image: url("../../assets/images/sys/button_keyboard.png");
  background-repeat: no-repeat;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<style>
.add-user .list-product .el-input__inner {
  width: 195px;
}
</style>

