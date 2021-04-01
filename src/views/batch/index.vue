
<template>
  <div class="addDomainName">
    <el-form :model="addDomain" :rules="addRules" ref="ruleForm">
      <el-form-item class="add_radio" prop="radio">
        <!-- <el-radio v-model="addDomain.radio" label="1">输入域名</el-radio> -->
        <!-- <el-radio v-model="addDomain.radio" label="2">取回域名</el-radio> -->
      </el-form-item>
      <el-form-item class="add_p" v-show="addDomain.radio == '2'">
        <p>如果您的域名可能被其他账号添加，可通过该功能批量取回。</p>
      </el-form-item>
      <el-form-item prop="realmName" class="ipt">
        <el-input
          type="textarea"
          placeholder="输入一级域名，每行一个，最多可输入500个域名。例如：
qcloud.com 
qq.com  "
          v-model="addDomain.realmName"
          :class="{ err: errDomainArr.length != 0 }"
          @change="domainChange"
          show-word-limit
        >
          <!-- @keyup.enter.native="descInput" -->
        </el-input>
      </el-form-item>
      <p class="numLen" v-if="arFlag">{{ this.list.length }}/500</p>
      <p class="domainerr" v-if="errDomainArr.length != 0">
        域名{{ errDomainArr.join("、") }}格式有误
      </p>
      <!-- <el-form-item class="add_select" v-show="addDomain.radio == '2'">
        <span>同时将取回域名放至该分组：</span>
        <el-select v-model="value" placeholder="默认分组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item class="add_news" v-show="addDomain.radio == '2'">
        <p>设置记录</p>
        <div>
          请为以上所有域名添加如下 TXT 记录值, 便于系统验证域名权限。
          注意这需要在域名当前其他解析商处进行设置。 如果域名未在其他账号下,
          则无需取回, 将直接添加成功
        </div>
      </el-form-item> -->
      <!-- <el-form-item v-show="addDomain.radio == '2'">
        <div class="add_some">
          <div class="so_a">
            <span>主机记录</span>
            <span>quhui</span>
          </div>
          <div class="so_a">
            <span>记录值</span>
            <span> 32547253d3a5416f64086ee5dec892e0 </span>
          </div>
        </div>
      </el-form-item> -->
      <el-form-item class="add_check" prop="checked">
        <el-checkbox v-model="addDomain.checked" @change="checkChange"
          >同时为新域名添加 @ 和 www 的 A 记录</el-checkbox
        >
      </el-form-item>
      <el-form-item
        class="add_check"
        prop="input"
        v-show="addDomain.radio == '1'"
      >
        <el-input
          v-show="addDomain.checked"
          v-model="addDomain.input"
          placeholder="请输入记录值，如1.1.3.4"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <bx-button
          class="searchBtn"
          label="批量添加"
          v-show="addDomain.radio == '1'"
          @click="addDomainChange"
        ></bx-button>
        <!-- <el-button v-show="addDomain.radio == '2'" @click="dialogVisible = true">批量取回</el-button> -->
      </el-form-item>
    </el-form>
    <!-- <div class="remark">
      <el-dialog title="取回域名" :visible.sync="dialogVisible">
        <div class="con">
          <img src="../../../assets/images/DNS/tip.png" alt="" />
          <span>
            请确定已经为所有域名添加TXT记录，并且已经生效
            否则将导致域名取回失败。
          </span>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div> -->
  </div>
</template>
<script>
import { batchSaveDomain } from "@/api/domain.js";
export default {
  data() {
    return {
      addDomain: {
        radio: "1",
        realmName: "",
        checked: false,
        input: "",
      },
      domainArr: [],
      errDomainArr: [],
      list: [],
      doFlag: false,
      errFlag: false,
      arFlag: false,
      number: "500",
      options: [
        {
          value: 1,
          label: "分组一",
        },
        {
          value: 2,
          label: "分组二",
        },
      ],
      value: "",
      dialogVisible: false,
      addRules: {
        input: [
          {
            required: true,
            message: "请填写您服务器Ipv4地址",
            trigger: "blur",
          },
        ],
        // realmName: [
        //   { required: true, validator: addRealmNameRule, trigger: "change" },
        // ],
      },
    };
  },
  methods: {
    domainChange() {
      const arr = this.addDomain.realmName.split("\n");
      this.domainArr = [];
      this.errDomainArr = [];
      this.list = [];
      arr.forEach((domain) => {
        domain = domain.trim();
        if (domain !== "") {
          this.list.push(domain);
          if (this.list.length != 0) {
            this.arFlag = true;
          } else {
            this.arFlag = false;
          }
          this.checkDomain(domain)
            ? this.domainArr.push(domain)
            : this.errDomainArr.push(domain);
        }
      });
    },
    checkDomain(url) {
      var strRegex = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
      var re = new RegExp(strRegex);
      return re.test(url);
    },
    checkChange(val) {
      // console.log(val);
      this.addDomain.checked = val;
    },
    //点击批量添加
    addDomainChange() {
      if (this.addDomain.realmName == "") {
        this.$message({
          message: "请输入要添加的域名",
          type: "warning",
          offset: 60,
        });
      } else {
        if (this.addDomain.checked == false) {
          this.addDomain.checked = 0;
        } else if (this.addDomain.checked == true) {
          this.addDomain.checked = 1;
        }
        let info = {
          addRecord: this.addDomain.checked,
          domains: this.domainArr.join(","),
          recordValue: this.addDomain.input,
        };
        batchSaveDomain(info).then((res) => {
          if (res.code === 200) {
            setTimeout(() => {
              this.$router.push({
                path: "/batch/operateLog/operDomain",
                query: { data: res.data },
              });
            }, 2000);
          }
        });
      }
    },
  },
};
</script>


<style lang="stylus">
.addDomainName {
  .el-textarea {
    width: 440px;
    border: 1px solid #eee;
    border-radius: 3px;
  }

  .el-textarea__inner {
    width: 438px;
    height: 200px;
    background-color: #fff;
  }

  .el-textarea__inner:focus {
  }

  .el-input {
    display: block;
    width: 440px;
    padding-bottom: 15px;
  }

  .el-input_inner {
    width: 440px;
  }

  .el-select {
    .el-input {
      width: 160px;
    }

    .el-input__inner {
      width: 160px;
      border: none;
      outline: 0;
      background-color: #E6ECF6;
      margin-top: 15px;
    }
  }

  .el-button {
    background-color: #4D71EE;
  }

  .el-dialog {
    width: 500px;
    height: 240px;

    .el-dialog__header {
      height: 55px;
    }

    .el-dialog__title {
      line-height: 55px;
      padding-left: 30px;
    }
  }

  .el-dialog__footer {
    .el-button:nth-child(1) {
      background-color: #fff !important;
      color: #606266;
    }

    .el-button--primary {
      background: #66B1FF;
    }
  }
}
</style>
<style lang="stylus" scoped>
.addDomainName {
  padding: 0 0 20px 50px;

  .add_radio {
    padding: 20px 0 0 0;
  }

  .el-button {
    color: #fff;
    margin: 20px 0 0 0;
  }

  .add_p {
    color: #8B9DB6;
  }

  .ipt {
    margin-bottom: 10px;
  }

  .err {
    border: 1px solid #EE0000;
  }

  .domainerr {
    font-size: 14px;
    color: #EE0000;
    margin-bottom: 10px;
  }

  .numLen {
    font-size: 14px;
    color: #ccc;
    margin: 5px 0 15px 0;
  }

  .add_news {
    p {
      font-size: 15px;
      font-weight: 600;
      color: #000;
    }

    div {
      width: 400px;
      color: #8B9DB6;
    }
  }

  .add_some {
    width: 440px;
    height: 100px;
    background-color: #EFF3FA;
    padding-top: 15px;

    .so_a {
      display: flex;

      span:nth-child(1) {
        width: 100px;
        padding-right: 20px;
        text-align: center;
        color: #AEBBCC;
      }
    }
  }

  .remark {
    .el-dialog {
      .con {
        padding: 20px 10px 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;

        span {
          line-height: 2;
        }

        img {
          display: inline-block;
          width: 40px;
          height: 40px;
          padding: 5px 15px;
        }
      }

      .dialog-footer {
        text-align: right;

        .el-button {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
