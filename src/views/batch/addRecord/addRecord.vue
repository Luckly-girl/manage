<template>
  <div class="addRecord">
    <div class="add_top">
      <p>搜索域名</p>
      <div class="add_btn">
        <el-input v-model="search" placeholder="请输入要搜索的域名"></el-input>
        <bx-button
          class="okBtn a"
          type="primary"
          label="搜索"
          @click="searchHandle"
        ></bx-button>
      </div>
    </div>
    <div class="table_a" v-if="vvl === true">
      <div class="tab_top">
        <span>选择域名</span>
        <span
          >最近添加的域名可能未包含在搜索范围中，如未搜索到请稍后重试。</span
        >
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55px"></el-table-column>
        <el-table-column prop="domain" label="域名"> </el-table-column>
      </el-table>
    </div>
    <el-form :model="tableFrom" ref="tableFrom">
      <div class="table_b" v-show="flag == true">
        <span class="sdd">添加记录</span>
        <el-table :data="tableFrom.formData" style="width: 100%">
          <el-table-column label="主机记录" width="150">
            <template slot-scope="scope">
              <!-- <el-input v-model="searchMap.record" placeholder=""></el-input> -->
              <el-input
                v-model="scope.row.hostRecord"
                placeholder=""
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="记录类型" width="180">
            <template slot-scope="scope">
              <!-- <el-select
                v-model="searchMap.recordValue"
                filterable
                placeholder=""
                @change="reChange"
              >
                <el-option
                  v-for="item in record"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
              <!-- :prop="'formData.' + scope.$index + '.recordType'"
                :rules="rules.recordType" -->
              <el-form-item label="" style="margin-top: 23px">
                <el-select
                  v-model="scope.row.recordType"
                  filterable
                  placeholder=""
                >
                  <el-option
                    v-for="item in record"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="线路类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.lineType" filterable placeholder="">
                <el-option
                  v-for="item in line"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="记录值">
            <!-- :rules="fromaRules.rember" -->
            <template slot-scope="scope">
              <!-- <el-input v-model="searchMap.rember" placeholder=""></el-input> -->
              <el-form-item
                label=""
                :prop="'formData.' + scope.$index + '.recordValue'"
                :rules="createValidator(scope.$index)"
                style="margin-top: 23px"
              >
                <el-input
                  v-model="scope.row.recordValue"
                  placeholder=""
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mx" label="MAX优先级">
            <template>
              <span class="mx" style="color: #bbb">-</span>
            </template>
          </el-table-column>
          <el-table-column label="TTL(秒)">
            <template slot-scope="scope">
              <!-- <el-input v-model="searchMap.ttl" placeholder=""></el-input> -->
              <el-input v-model="scope.row.ttl" placeholder=""></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                :disabled="scope.$index < 1"
                :class="[scope.$index < 1 ? 'btn_active' : '']"
                @click="deleteOneLine(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="addLine">
          <span class="sadd" @click="addOneLine">添加一行</span>
        </div>
      </div>
      <bx-button
        class="searchBtn moreBtn"
        v-show="flag == true"
        label="批量添加"
        @click="submit"
      ></bx-button>
    </el-form>
  </div>
</template>
<script>
import { getDomainByDomainName, saveBatchDomainInfo } from "@/api/domain.js";
export default {
  data() {
    return {
      search: "",
      tableData: [],
      vvl: false,
      ruleName: "A",
      recordValue: "",
      tableFrom: {
        formData: [
          {
            hostRecord: "",
            recordType: "0",
            lineType: "0",
            recordValue: "",
            mx: "-",
            ttl: "600",
          },
        ],
      },
      domainInfoLists: [],
      searchMap: {
        hostRecord: "",
        recordType: "0",
        lineType: "0",
        recordValue: "",
        mx: "-",
        ttl: "600",
        domainIds: [],
      },
      // domainRecord: true,
      recordType: "A",
      lineType: "0",
      record: [
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
      line: [
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
      flag: false, //控制添加记录和按钮的显示隐藏
      select: "", //选择域名选中状态
    };
  },
  created() {},
  mounted() {
    // this.$set(this.tableFrom, "formData", this.tableFrom.formData);
  },
  //搜索域名框做模糊查询
  // computed: {
  //   tables() {
  //     const search = this.search;
  //     if (search) {
  //       return this.tableData.filter((data) => {
  //         return Object.keys(data).some((key) => {
  //           return String(data[key]).toLowerCase().indexOf(search) > -1;
  //         });
  //       });
  //     }
  //     return this.tableData;
  //   },
  // },
  methods: {
    createValidator(index) {
      const reg1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
      const reg2 = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
      const reg3 = /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/;
      const validator = (rule, value, callback) => {
        // 拿到当前行数据
        const row = this.tableFrom.formData[index];
        // console.log(row);
        if (value == "") {
          callback(new Error("内容不能为空"));
        } else {
          if (row.recordType === "0") {
            if (!reg1.test(value)) {
              callback(new Error("请输入您服务器的IPV4地址"));
            }
          } else if (row.recordType == "1") {
            if (!reg2.test(value)) {
              callback(new Error("请填写一个域名，如：cloud.tencent.com"));
            }
          } else if (row.recordType == "2") {
            if (!reg3.test(value)) {
              callback(new Error("请输入您服务器的IPV6服务器地址"));
            }
          }
        }
        callback();
      };
      return [
        {
          require: true,
          validator,
          trigger: "blur",
        },
      ];
    },
    //搜索域名
    searchHandle() {
      getDomainByDomainName(this.search).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.vvl = true;
        }
      });
    },
    //选择域名---控制添加table
    handleSelectionChange(val) {
      this.searchMap.domainIds = [];
      if (val == []) {
        this.flag = false;
      } else {
        val.forEach((el) => {
          this.searchMap.domainIds.push(el.id);
          // console.log(el.id, this.searchMap.domainIds);
        });
        this.flag = true;
      }
    },
    //单击行选中
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    //新增一行
    addOneLine() {
      var list = {
        hostRecord: this.searchMap.hostRecord,
        recordType: this.searchMap.recordType,
        lineType: this.searchMap.lineType,
        recordValue: this.searchMap.recordValue,
        mx: this.searchMap.mx,
        ttl: this.searchMap.ttl,
      };
      this.tableFrom.formData.push(list);
    },
    //删除一行
    deleteOneLine(index, row) {
      this.tableFrom.formData.splice(index, 1);
    },

    //批量添加
    submit() {
      this.tableFrom.formData.forEach((val) => {
        // console.log(val);
        if (val.hostRecord == "") {
          val.hostRecord = "@";
        }
      });
      this.$refs["tableFrom"].validate((valid) => {
        if (valid) {
          var params = {
            domainIds: this.searchMap.domainIds,
            domainInfoLists: this.tableFrom.formData,
          };
          saveBatchDomainInfo(params)
            .then((res) => {
              if (res.code === 200) {
                // console.log(res);
                setTimeout(() => {
                  this.$router.push({
                    path: "/batch/operateLog/operRecord",
                    query: { data: res.data },
                  });
                }, 2000);
              }
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>


<style lang='stylus'>
.addRecord {
  .add_top {
    .add_btn {
      .el-input {
        width: 300px;
      }

      .el-input__inner {
        width: 300px;
        background-color: #F7F7F7;
        outline: 0;
        border: none;
      }
    }
  }

  .table_a, .table_b {
    .el-table {
      width: 100%;
      border: none;
    }

    .el-table td, .el-table th.is-leaf {
      height: 55px;
      text-align: left;
      font-size: 14px;
      color: #717171;
      border-bottom: 1px solid #e7e7e7;
      padding: 0;
    }

    .el-table th {
      background-color: #F7F7F7;
    }

    .el-select {
      .el-input__inner {
        border: 0;
      }
    }

    .el-button {
      background-color: #6780A4;
      border: 0;
    }
  }

  .table_b {
    .el-table .cell {
      height: 90px;
      line-height: 90px;
    }
  }
}
</style>
<style lang='stylus' scoped>
.addRecord {
  .add_top {
    padding: 20px 0 40px 50px;

    p {
      padding: 10px 0 20px 0;
      font-size: 16px;
      font-weight: 700;
      color: #333333;
    }

    .add_btn {
      width: 400px;
      display: flex;
      justify-content: space-around;

      .a {
        font-size: 16px;
      }
    }
  }

  .none {
    width: 100%;
    padding: 10px 0;
    background-color: #F6F6F6;
  }

  .table_a {
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

  .table_b {
    border-top: 2px solid #F6F6F6;
    border-bottom: 2px solid #F6F6F6;
    padding: 20px 0 0 50px;

    .sdd {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #333333;
      padding: 10px 0 30px 0;
    }

    .addLine {
      width: 100%;
      border-top: 1px solid #F7F7F7;

      .sadd {
        display: block;
        width: 70px;
        height: 50px;
        margin: 0 auto;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        color: #4D71EE;
        cursor: pointer;
      }
    }

    .btn_active {
      background-color: #E3E3E3;
    }
  }

  .moreBtn {
    border-radius: 5px;
    margin: 15px 0 0 50px;
    cursor: pointer;
  }
}
</style>