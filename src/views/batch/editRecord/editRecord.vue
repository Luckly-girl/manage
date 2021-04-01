<template>
  <div class="editRecord">
    <div class="edit_top">
      <p>搜索记录</p>
      <div class="edit_select">
        <el-select
          v-model="searchMap.record"
          placeholder=""
          @change="selectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchMap.dataValue"
          placeholder=""
          v-show="flag == true"
        >
          <el-option
            v-for="item in options1"
            :key="item.value + '1'"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchMap.lineValue"
          placeholder=""
          v-show="flagMo == true"
        >
          <el-option
            v-for="item in options2"
            :key="item.value + '2'"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          type="text"
          v-model="searchMap.searchValue"
          placeholder="请输入检索关键字"
          v-show="flagEv == true"
        ></el-input>
        <bx-button
          class="okBtn a"
          type="primary"
          label="搜索"
          @click="searchBtn"
        ></bx-button>
      </div>
    </div>
    <div class="table">
      <div class="tab_top">
        <span>选择记录</span>
        <span
          >最近添加的记录可能未包含在搜索范围中，如未搜索到请稍后重试。</span
        >
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        row-key="domainId"
        :default-expand-all="true"
        :tree-props="{
          hasChildren: 'hasChildren',
          children: 'domainInfoLists',
        }"
      >
        <el-table-column width="105">
          <template slot="header" slot-scope="scope">
            <el-checkbox
              v-model="checkouts"
              style="padding-left: 10px"
              @change="checkAllIn(scope)"
            />
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checks"
              style="padding-left: 10px"
              @change="checkChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableList"
          :key="index + 'a'"
          :label="item.label"
          :prop="item.prop"
          align="right"
        ></el-table-column>
      </el-table>
    </div>
    <!-- <cdn-view></cdn-view> -->

    <div class="amend" v-show="mag == true">
      <span class="am_a">修改记录</span>
      <div class="am_edit">
        <span>将</span>
        <el-select
          v-model="searchMap.recordData"
          placeholder=""
          @change="handleChange"
        >
          <el-option
            v-for="item in options3"
            :key="item.value + ''"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span>修改为</span>
        <el-select
          v-model="searchMap.recordType"
          placeholder="请选择"
          v-show="flagv == true"
        >
          <el-option
            v-for="item in options1"
            :key="item.value + 'b'"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="searchMap.recordLine"
          placeholder=""
          v-show="flagVo == true"
        >
          <el-option
            v-for="item in options2"
            :key="item.value + 'c'"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span v-show="flagv == true">记录值</span>
        <el-input
          v-model="searchMap.inputVal"
          placeholder=""
          v-show="flagv == true"
        ></el-input>
        <el-input
          v-model="searchMap.hostVal"
          placeholder="请输入主机记录"
          v-show="flagWo == true"
        ></el-input>
        <el-input
          v-model="searchMap.reValue"
          placeholder="请输入记录值"
          v-show="flaglg == true"
        ></el-input>
        <el-input
          v-model="searchMap.ttlValue"
          maxlength="5"
          placeholder="请输入TTL值"
          v-show="flagdt == true"
        ></el-input>
      </div>
    </div>
    <bx-button
      class="searchBtn moreBtn"
      v-show="mag == true"
      label="批量修改"
      @click="submit"
    ></bx-button>
  </div>
</template>

<script>
import { getDomainInfo, updateBatchDomainInfo } from "@/api/domain.js";
export default {
  // components:{
  //   "cdn-view":() => import('./cdn')
  // },
  data() {
    return {
      searchMap: {
        record: "记录类型",
        searchValue: "",
        dataValue: "A",
        lineValue: "默认",
        recordType: "",
        recordLine: "默认",
        recordData: "记录类型",
        inputVal: "",
        hostVal: "",
        reValue: "",
        ttlValue: "",
        domainInfoIds: [],
      },
      type: 0,
      quDataValue: "A",
      queryType: 0,
      queryValue: "A",
      options: [
        {
          value: "0",
          label: "记录类型",
        },
        {
          value: "1",
          label: "线路类型",
        },
        {
          value: "2",
          label: "主机记录",
        },
        {
          value: "3",
          label: "记录值",
        },
      ],
      options1: [
        {
          value: "0",
          label: "A",
        },
        {
          value: "1",
          label: "CNAME",
        },
        {
          value: "2",
          label: "AAAA",
        },
      ],
      options2: [
        {
          value: "0",
          label: "默认",
        },
        {
          value: "1",
          label: "境内",
        },
        {
          value: "2",
          label: "境外",
        },
      ],
      mag: false,
      flag: true,
      flagMo: false,
      flagEv: false,
      flagv: true,
      flagVo: false,
      flagWo: false,
      flaglg: false,
      flagdt: false,
      options3: [
        {
          value: "0",
          label: "记录类型",
        },
        {
          value: "1",
          label: "线路类型",
        },
        {
          value: "2",
          label: "主机记录",
        },
        {
          value: "3",
          label: "记录值",
        },
        {
          value: "4",
          label: "TTL",
        },
      ],
      tableData: [],
      domainInfoLists: [],
      mapData: [],
      haschild: true,
      checkouts: false,
      tableList: [
        {
          label: "",
          prop: "domain",
        },
        {
          label: "主机记录",
          prop: "hostRecord",
        },
        {
          label: "记录类型",
          prop: "recordType",
        },
        {
          label: "线路类型",
          prop: "line",
        },
        {
          label: "记录值",
          prop: "recordValue",
        },
        {
          label: "MX优先级",
          prop: "mx",
        },
        {
          label: "ttl(秒)",
          prop: "ttl",
        },
      ],
    };
  },
  created() {
    // console.log(this.typeValue, 565);
  },

  methods: {
    //搜索记录类型
    selectChange(val) {
      // console.log(val);
      if (val == 0) {
        this.flag = true;
        this.flagMo = false;
        this.flagEv = false;
        this.type = 0;
        this.quDataValue = this.options1[0].label;
        this.searchMap.dataValue = this.options1[0].label;
      } else if (val == 1) {
        this.flagMo = true;
        this.flag = false;
        this.flagEv = false;
        this.type = 1;
        this.searchMap.lineValue = this.options2[0].label;
        this.quDataValue = this.options2[0].value;
      } else if (val == 2) {
        this.flagEv = true;
        this.flag = false;
        this.flagMo = false;
        this.type = 2;
        this.quDataValue = "";
        this.searchMap.searchValue = "";
      } else {
        this.type = 3;
        this.quDataValue = "";
        this.searchMap.searchValue = "";
      }
    },
    //修改记录类型
    handleChange(val) {
      // console.log(val);
      if (val == 0) {
        this.flagv = true;
        this.flagVo = false;
        this.flagWo = false;
        this.flaglg = false;
        this.flagdt = false;
        this.queryType = 0;
        this.queryValue = this.options1[0].label;
        this.searchMap.recordType = this.options1[0].label;
        this.searchMap.inputVal = "";
      } else if (val == 1) {
        this.flagVo = true;
        this.flagv = false;
        this.flagWo = false;
        this.flaglg = false;
        this.flagdt = false;
        this.queryType = 1;
        this.queryValue = this.options2[0].value;
        this.searchMap.recordLine = this.options2[0].label;
        this.searchMap.inputVal = "";
      } else if (val == 2) {
        this.flagWo = true;
        this.flagv = false;
        this.flagVo = false;
        this.flaglg = false;
        this.flagdt = false;
        this.queryType = 2;
        this.queryValue = "";
        this.searchMap.hostVal = "";
        this.searchMap.inputVal = "";
      } else if (val == 3) {
        this.flaglg = true;
        this.flagWo = false;
        this.flagv = false;
        this.flagVo = false;
        this.flagdt = false;
        this.queryType = 3;
        this.queryValue = "";
        this.searchMap.reValue = "";
        this.searchMap.inputVal = "";
      } else if (val == 4) {
        this.flagdt = true;
        this.flaglg = false;
        this.flagWo = false;
        this.flagv = false;
        this.flagVo = false;
        this.queryType = 4;
        this.queryValue = "";
        this.searchMap.ttlValue = "";
        this.searchMap.inputVal = "";
      }
    },
    //修改记录搜索
    searchBtn() {
      let params = {
        queryType: this.type,
        queryValue: this.quDataValue,
      };
      getDomainInfo(params)
        .then((res) => {
          // console.log(res);
          this.tableData = res.data;
          this.checkouts = false;
          this.tableData.map((items) => {
            this.$set(items, "checks", false);
            this.domainInfoLists = items.domainInfoLists;
            items.domainInfoLists.map((ite) => {
              this.$set(ite, "checks", false);
            });
          });
        })
        .catch((err) => {});
    },
    updateBatchDomainInfo() {
      let prams = {
        domainInfoIds: this.searchMap.domainInfoIds,
        queryType: this.queryType,
        queryValue: this.queryValue,
        recordValue: this.searchMap.inputVal,
      };
      updateBatchDomainInfo(prams)
        .then((res) => {
          if (res.code === 200) {
            setTimeout(() => {
              this.$router.push({
                path: "/batch/operateLog/operRecord",
                query: { data: res.data },
              });
            }, 2000);
          }
          // console.log(res);
        })
        .catch((err) => {});
    },
    //修改记录提交
    submit() {
      if (this.flagv === true) {
        if (this.searchMap.recordType == "") {
          this.$message({
            message: "修改内容不能为空",
            type: "warning",
            offset: 60,
          });
        } else if (this.queryValue == "A") {
          if (this.searchMap.inputVal !== "") {
            const reg = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
            if (!reg.test(this.searchMap.inputVal)) {
              this.$message({
                message: "请输入您服务器的IPV4地址",
                type: "warning",
                offset: 60,
              });
            } else {
              this.updateBatchDomainInfo();
            }
          } else {
            this.$message({
              message: "修改内容不能为空",
              type: "warning",
              offset: 60,
            });
          }
        } else if (this.queryValue == "CNAME") {
          if (this.searchMap.inputVal !== "") {
            const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
            if (!reg.test(this.searchMap.inputVal)) {
              this.$message({
                message: "请填写一个域名，如：cloud.tencent.com",
                type: "warning",
                offset: 60,
              });
            } else {
              this.updateBatchDomainInfo();
            }
          } else {
            this.$message({
              message: "修改内容不能为空",
              type: "warning",
              offset: 60,
            });
          }
        } else if (this.queryValue == "AAAA") {
          if (this.searchMap.inputVal !== "") {
            const reg = /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/;
            if (!reg.test(this.searchMap.inputVal)) {
              this.$message({
                message: "请输入您服务器的IPV6地址",
                type: "warning",
                offset: 60,
              });
            } else {
              this.updateBatchDomainInfo();
            }
          } else {
            this.$message({
              message: "修改内容不能为空",
              type: "warning",
              offset: 60,
            });
          }
        }
      } else if (this.flagWo === true) {
        if (this.searchMap.hostVal == "") {
          this.$message({
            message: "修改内容不能为空",
            type: "warning",
            offset: 60,
          });
        } else {
          this.updateBatchDomainInfo();
        }
      } else if (this.flaglg === true) {
        if (this.searchMap.reValue == "") {
          this.$message({
            message: "修改内容不能为空",
            type: "warning",
            offset: 60,
          });
        } else {
          this.updateBatchDomainInfo();
        }
      } else if (this.flagdt === true) {
        let reg = /^[0-9]+.?[0-9]*/;
        if (!reg.test(this.searchMap.ttlValue)) {
          this.$message({
            message: "请输入数字",
            type: "warning",
            offset: 60,
          });
        } else {
          this.updateBatchDomainInfo();
        }
      } else {
        this.updateBatchDomainInfo();
      }
    },
    //总全选
    checkAllIn() {
      this.$refs.multipleTable.data.map((items) => {
        this.$set(items, "checks", this.checkouts);
        if (items.domainInfoLists) {
          items.domainInfoLists.forEach((item) => {
            this.$set(item, "checks", this.checkouts);
            this.mag = this.checkouts;
          });
        }
      });
    },
    //插槽复选框逻辑
    checkChange(row) {
      // 父选子
      this.searchMap.domainInfoIds = [];
      if (row.domainInfoLists) {
        if (row.checks) {
          row.domainInfoLists.map((item) => {
            this.$set(item, "checks", true);
          });
          this.$set(row, "checks", true);
          this.mag = true;
        } else {
          row.domainInfoLists.map((item) => {
            this.$set(item, "checks", false);
          });
          this.$set(row, "checks", false);
        }
      }

      // 子带父
      this.mapData = [];
      this.tableData.map((items) => {
        let sonData = [];
        items.domainInfoLists.map((val) => {
          if (val.checks === true) {
            this.mag = true;
            sonData.push(val);
            this.searchMap.domainInfoIds.push(val.domainId);
            if (sonData.length === items.domainInfoLists.length) {
              this.$set(items, "checks", true);
              if (items.checks) {
                this.mag = true;
                this.mapData.push(items);
                // console.log(this.mapData, "选中的数组");
                if (this.mapData.length === this.tableData.length) {
                  this.checkouts = true;
                }
              }
            }
          }
        });
      });

      //子空父空
      if (!row.checks) {
        this.checkouts = false;
        this.tableData.map((ite) => {
          if (ite.domainInfoLists) {
            ite.domainInfoLists.map((items) => {
              if (!items.checks) {
                this.$set(ite, "checks", false);
              }
            });
          }
        });
        this.tableData.every((ite) => {
          if (ite.domainInfoLists) {
            ite.domainInfoLists.every((items) => {
              if (!items.checks) {
                this.mag = false;
              }
            });
          }
        });
      }
    },
  },
  computed: {
    dataValue() {
      return this.searchMap.dataValue;
    },
    lineValue() {
      return this.searchMap.lineValue;
    },
    searchValue() {
      return this.searchMap.searchValue;
    },
    recordType() {
      return this.searchMap.recordType;
    },
    recordLine() {
      return this.searchMap.recordLine;
    },
    hostVal() {
      return this.searchMap.hostVal;
    },
    reValue() {
      return this.searchMap.reValue;
    },
    ttlValue() {
      return this.searchMap.ttlValue;
    },
  },
  watch: {
    //记录类型
    dataValue(newVal) {
      // console.log(newVal, 6666);
      if (this.flag === true || this.type === 0) {
        if (newVal === "0") {
          this.quDataValue = "A";
          // console.log(this.typeValue,565)
        } else if (newVal === "1") {
          this.quDataValue = "CNAME";
        } else if (newVal === "2") {
          this.quDataValue = "AAAA";
        }
      }
    },
    //线路类型
    lineValue(kVal) {
      // console.log(tVal, 22);
      this.typeValue = this.options2[0].value;
      if (this.flagMo === true || this.type === 1) {
        if (kVal === "默认") {
          this.quDataValue = "0";
        } else {
          this.quDataValue = kVal;
        }
      }
    },
    //主机记录   记录值
    searchValue(vVal) {
      // console.log(vVal, 111);
      if (this.flagEv === true || (this.type === 2 && this.type === 3)) {
        this.quDataValue = vVal;
      }
    },
    //修改---记录类型
    recordType(qVal) {
      if (this.flagv === true || this.queryType === 0) {
        if (qVal === "0") {
          this.queryValue = "A";
          // console.log(this.typeValue,565)
        } else if (qVal === "1") {
          this.queryValue = "CNAME";
        } else if (qVal === "2") {
          this.queryValue = "AAAA";
        }
      }
    },
    //修改---线路类型
    recordLine(rVal) {
      if (this.flagVo === true || this.queryType === 1) {
        this.queryValue = rVal;
      }
    },
    //修改---主机记录
    hostVal(hVal) {
      if (this.flagWo === true || this.queryType === 2) {
        this.queryValue = hVal;
      }
    },
    //修改---记录值
    reValue(aVal) {
      if (this.flaglg === true || this.queryType === 3) {
        this.queryValue = aVal;
      }
    },
    //修改---ttl秒
    ttlValue(tVal) {
      if (this.flagdt === true || this.queryType === 4) {
        this.queryValue = tVal;
      }
    },
  },
};
</script>

<style lang='stylus'>
.editRecord {
  .edit_top, .amend {
    .edit_select, .am_edit {
      .el-select {
        width: 120px;
        padding: 10px 0 10px 0;

        .el-input__inner {
          width: 120px;
          background-color: #E6ECF6;
          border: 0;
        }
      }

      .el-select:nth-child(2) {
        padding: 10px;
      }

      .el-select:nth-child(3) {
        padding: 10px;
      }
    }
  }

  .table {
    .el-table td, .el-table th.is-leaf {
      text-align: center;
      font-size: 12px;
      color: #717171;
      border-bottom: 1px solid #e7e7e7;
    }
  }

  .am_edit {
    .el-input {
      width: 200px;

      .el-input__inner {
        width: 200px;
      }
    }

    .el-input__icon {
      width: 180px;
    }
  }

  .table {
    .el-table {
      width: 100%;
      border: none;
    }

    .el-table th > .cell, .el-table td > .cell {
      height: 40px;
      text-align: left;
      font-size: 14px;
      color: #717171;
      line-height: 40px;
    }

    .el-table th {
      background-color: #F7F7F7;
    }
  }
}
</style>
<style lang='stylus' scoped>
.editRecord {
  .edit_top {
    padding: 20px 0 40px 50px;

    p {
      padding: 10px 0 20px 0;
      font-size: 16px;
      font-weight: 700;
      color: #333333;
    }

    .edit_select {
      .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 200px;
        padding-right: 10px;

        .el-input__inner {
          width: 200px;
        }
      }

      .btnSearch {
        margin-left: 20px;
      }

      .a {
        font-size: 16px;
      }
    }
  }

  .table {
    border-top: 2px solid #F6F6F6;
    padding: 20px 10px 10px 50px;

    .tab_top {
      padding: 10px 0 30px 0;
      display: flex;
      justify-content: space-between;

      span:nth-child(1) {
        font-size: 16px;
        font-weight: 700;
        color: #333333;
      }

      span:nth-child(2) {
        font-size: 13px;
        color: #8B9DB6;
      }
    }
  }

  .amend {
    width: 100%;
    border-top: 2px solid #F6F6F6;

    .am_a {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #333333;
      padding: 20px 0 30px 50px;
    }

    .am_edit {
      padding-left: 30px;

      span {
        font-size: 14px;
        padding: 0 20px;
      }
    }
  }

  .moreBtn {
    margin: 30px 0 0 50px;
    cursor: pointer;
  }
}
</style>