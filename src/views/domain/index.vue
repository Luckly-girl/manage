<template>
  <div class="domain">
    <div class="do_topNav">
      <div class="do_top">
        <bx-button
          class="searchBtn"
          @click="tableDataClick"
          label="添加域名"
        ></bx-button>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <!-- <i class="el-icon-location"></i> -->
              <span>更多操作</span>
            </template>
            <el-menu-item @click="addDomain">批量添加域名</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="formInline.user"
              placeholder="请输入要搜索的域名"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <bx-button
              class="searchBtn"
              label="搜索"
              @click="search"
            ></bx-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tData"
        style="width: 100%"
        stripe
        :default-sort="{ prop: 'domain', order: 'ascending' }"
        @sort-change="sortChange"
        :span-method="arraySpanMethod"
      >
        <el-table-column align="right" width="60px">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">
              <img src="../../assets/images/DNS/out.jpg" alt="" />
            </span>
            <span v-if="scope.row.state === 1">
              <img src="../../assets/images/DNS/succes.jpg" alt="" />
            </span>
            <span v-if="scope.row.state === 2">
              <img src="../../assets/images/DNS/err.jpg" alt="" />
            </span>
            <div class="addInput" v-if="scope.row.type === '0'">
              <el-input
                placeholder="请输入您要解析的域名"
                type="text"
                v-model="scope.row.domainName"
              >
              </el-input>
              <bx-button
                class="okBtn"
                label="确定"
                @click="submit(scope.$index, scope.row.domainName)"
              ></bx-button>
              <el-button @click="cancle(scope.$index)">取消</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="domain"
          label="域名"
          sortable="custom"
          width="260"
          align="left"
        >
          <template slot-scope="scope">
            <span class="doName" @click="domainDetial(scope.row)">{{
              scope.row.domain
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          sortable="custom"
          width="180"
          align="left"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0" class="err">异常</span>
            <span v-else-if="scope.row.state === 1" class="succes">正常</span>
            <span v-else class="out">锁定</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="recordCount"
          sortable="custom"
          label="记录数"
        >
        </el-table-column>
        <el-table-column
          prop="lastUpdateTime"
          label="最后操作时间"
          sortable="custom"
          align="left"
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="scope.row.type !== '0'">
            <div class="do_edit">
              <el-tooltip
                class="item"
                effect="dark"
                content="点击添加备注"
                placement="top-end"
                popper-class="atooltip"
              >
                <img
                  src="../../assets/images/DNS/edit.png"
                  @click="editClick(scope.row, scope.$index)"
                  alt=""
                />
              </el-tooltip>

              <el-dropdown trigger="click" placement="bottom-start">
                <img src="../../assets/images/DNS/more.png" alt="" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="stopClick(scope.row)"
                    v-if="scope.row.openState === 0"
                  >
                    恢复解析
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="backClick(scope.row)" v-else>
                    暂停解析
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="nockClick(scope.row)"
                    v-if="scope.row.state === 2"
                    >域名开启</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="openClick(scope.row)" v-else
                    >域名锁定</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="deleteClick(scope.row)"
                    >删除域名</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
    <!-- 备注dialog -->
    <div class="remarks">
      <el-dialog title="备注" :visible.sync="dialogVisible">
        <el-input
          type="textarea"
          placeholder="填写该域名的备注信息，方便备忘查看。"
          v-model="domainStateVo.remark"
          maxlength="200"
          show-word-limit
        >
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="remarkBtn"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
    <!-- 暂停解析dialog -->
    <div class="remark">
      <el-dialog title="暂停解析" :visible.sync="dialogVisibleStop1">
        <div class="con">
          <img src="../../assets/images/DNS/tip.png" alt="" />
          <span>
            将{{ doName }}暂停解析，暂停后该域名下所有记录将停止生效，
            建议您再次开启解析。
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleStop1 = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="domainStop"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
    <!-- 开启解析dialog -->
    <div class="remark">
      <el-dialog title="恢复解析" :visible.sync="dialogVisibleStop2">
        <div class="con">
          <img src="../../assets/images/DNS/tip.png" alt="" />
          <span>
            将{{ doName }}开启解析，开启解析后该域名下所有记录将恢复正常，
            注意生效可能存在延迟时间。
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleStop2 = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="domainStop"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
    <!-- 锁定域名dialog -->
    <div class="remark">
      <el-dialog title="锁定域名" :visible.sync="dialogVisibleNock1">
        <!-- <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <div class="cont">
          <img src="../../assets/images/DNS/tip.png" alt="" />
          <span>
            将 {{ doName }} 在指定时间内锁定，锁定期间域名不可进行任何
            修改操作。
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleNock1 = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="domainNock"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
    <!-- 开启域名 -->
    <div class="remark">
      <el-dialog title="开启域名" :visible.sync="dialogVisibleNock2">
        <!-- <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <div class="cont">
          <img src="../../assets/images/DNS/tip.png" alt="" />
          <span>
            将要对已锁定域名{{ doName }}重新进行解除锁定，请确认是否是本人操作？
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleNock2 = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="domainNock"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
    <!-- 删除域名dialog -->
    <div class="remark">
      <el-dialog title="删除域名" :visible.sync="dialogVisibleDelete">
        <div class="con">
          <img src="../../assets/images/DNS/tip.png" alt="" />
          <span>
            该域名的 DNS 服务器已指向 DNSPod ，删除域名会导致 DNS
            解析服务中断，或可能被他人占用域名，请谨慎操作删除域名。
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDelete = false">取 消</el-button>
          <bx-button
            class="ok"
            type="primary"
            label="确定"
            @click="domainDelete"
          ></bx-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getDomainList,
  updateDomainState,
  lockDomain,
  delDomain,
  updateRemark,
  saveDomain,
  getDomainInfoList,
} from "@/api/domain.js";
export default {
  data() {
    return {
      formInline: {
        user: "",
      },
      domainStateVo: {
        lockState: null,
        openState: null,
        id: 0,
        remark: "",
        sortField: "",
        sortType: "",
        domainName: "",
      },
      index: null,
      total: 10,
      setData: [],
      tableData: [],
      doName: "",
      dialogVisible: false,
      dialogVisibleStop1: false,
      dialogVisibleStop2: false,
      dialogVisibleNock1: false,
      dialogVisibleNock2: false,
      dialogVisibleDelete: false,
      // options: [
      //   {
      //     value: "0",
      //     label: "1天",
      //   },
      //   {
      //     value: "1",
      //     label: "5天",
      //   },
      //   {
      //     value: "2",
      //     label: "15天",
      //   },
      //   {
      //     value: "3",
      //     label: "30天",
      //   },
      // ],
      // value: "",
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    tData() {
      // console.log([...this.setData, ...this.tableData]);
      return [...this.setData, ...this.tableData];
    },
  },
  methods: {
    //点击表格排序
    sortChange(column, prop, order) {
      if (column.order === null) {
        column.order = "ascending";
      }
      getDomainList(
        "",
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        column.prop,
        column.order
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data);
      });
      // console.log(column.prop); //prop标签 => nickname
      // console.log(column.order); //descending降序、ascending升序
    },

    //获取域名列表
    fetchData() {
      getDomainList(
        "",
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.domainStateVo.sortField,
        this.domainStateVo.sortType
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data);
      });
    },
    //搜索域名
    search() {
      getDomainList(
        this.formInline.user,
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.domainStateVo.sortField,
        this.domainStateVo.sortType
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data);
      });
    },
    //操作--备注
    remarkBtn() {
      let params = {
        domainId: this.domainStateVo.id,
        remark: this.domainStateVo.remark,
      };
      updateRemark(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
          this.domainStateVo.remark = this.tableData[this.index].remark;
        }
        // console.log(res.data);
      });
      this.dialogVisible = false;
    },
    //操作--暂停/恢复解析
    domainStop() {
      let params = {
        domainId: this.domainStateVo.id,
        openState: this.domainStateVo.openState,
      };
      updateDomainState(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
        // console.log(res.data);
      });
      this.dialogVisibleStop1 = false;
      this.dialogVisibleStop2 = false;
    },
    //操作--锁定/开启域名
    domainNock() {
      let params = {
        domainId: this.domainStateVo.id,
        lockState: this.domainStateVo.lockState,
      };
      lockDomain(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
        // console.log(res.data);
      });
      this.dialogVisibleNock1 = false;
      this.dialogVisibleNock2 = false;
    },

    //操作---删除域名
    domainDelete() {
      let params = {
        domainId: this.domainStateVo.id,
      };
      delDomain(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
        // console.log(res.data);
      });
      this.dialogVisibleDelete = false;
    },

    //添加域名往表格新增一行
    tableDataClick() {
      this.setData.push({
        name: "",
        status: "",
        number: null,
        address: "",
        time: "",
        type: "0",
      });
    },
    //更多操作---添加域名
    addDomain() {
      this.$router.push("/batch");
    },

    //添加域名确定
    submit(index, domain) {
      // console.log(domain);
      if (domain == "") {
        this.$message({
          message: "添加域名不能为空",
          type: "warning",
          offset: 60,
        });
      } else if (domain !== "") {
        const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
        if (!reg.test(domain)) {
          this.$message({
            message: "域名格式错误，请输入正确的主域名，如：baixun.cn",
            type: "error",
            offset: 60,
          });
        } else {
          let obj = {
            domain: domain,
          };
          saveDomain(obj).then(() => {
            this.fetchData();
          });
          this.setData.splice(index, 1);
        }
      }
    },
    //添加域名取消
    cancle(index) {
      this.setData.splice(index, 1);
      this.fetchData();
    },
    //表格内备注
    editClick(row, index) {
      this.index = index;
      this.domainStateVo.id = row.domainId;
      this.domainStateVo.remark = row.remark;
      this.dialogVisible = true;
    },
    //点击每一行，跳转详情页
    domainDetial(row) {
      // console.log(row);
      this.$router.push({
        path: "/domainDetial",
        query: { data: row.domain, id: row.domainId },
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.type === "0") {
        return [1, 6];
      }
    },
    //暂停解析
    stopClick(row) {
      this.domainStateVo.id = row.domainId;
      this.domainStateVo.openState = 1;
      this.dialogVisibleStop2 = true;
    },
    //恢复解析
    backClick(row) {
      this.doName = row.domain;
      this.domainStateVo.id = row.domainId;
      this.domainStateVo.openState = 0;
      this.dialogVisibleStop1 = true;
    },
    //锁定域名
    nockClick(row) {
      this.doName = row.domain;
      this.domainStateVo.id = row.domainId;
      this.domainStateVo.lockState = 1;
      this.dialogVisibleNock2 = true;
    },
    //开启域名
    openClick(row) {
      this.doName = row.domain;
      this.domainStateVo.id = row.domainId;
      this.domainStateVo.lockState = 0;
      this.dialogVisibleNock1 = true;
    },
    //删除域名
    deleteClick(row) {
      this.domainStateVo.id = row.domainId;
      this.dialogVisibleDelete = true;
    },
  },
};
</script>

<style lang='stylus'>
.domain {
  .do_topNav {
    .do_top {
      height: 40px;

      .el-menu-vertical-demo {
        width: 120px;
        border: 0;
        height: 100%;
        background-color: #E6ECF6;
        border-radius: 4px 4px;
        z-index: 5;

        .el-submenu__title {
          line-height: 40px;
          font-size: 16px;
        }

        .el-submenu__title:hover {
          background: 0;
        }

        .el-submenu__icon-arrow {
          position: absolute;
          top: 35%;
        }
      }

      .main .el-menu-item {
        text-align: initial;
      }

      .el-submenu .el-menu-item {
        font-size: 16px;
        padding-left: 0 !important;
        padding-right: 83px;
        background-color: #fff;
        border-radius: 3px;
        transition: none;
      }

      .el-submenu {
        width: 120px;
        height: 36px;

        .el-menu {
          width: 200px;
          box-shadow: 1px 2px 5px 5px #F2F2F2;
          border-radius: 4px 4px;
        }
      }
    }
  }

  .table {
    padding: 20px 0 30px;

    .el-table th > .cell, .el-table td > .cell {
      height: 40px;
      font-size: 14px;
      color: #717171;
      line-height: 40px;
    }

    .el-table th {
      background-color: #F7F7F7;
    }

    .el-table--enable-row-transition .el-table__body td {
      height: 55px;
    }

    .el-table__body tr.current-row > td {
      background-color: #eee !important;
    }
  }

  .remarks {
    .el-dialog {
      width: 500px;
      height: 240px;

      .el-dialog__header {
        height: 65px;
      }

      .el-dialog__title {
        line-height: 55px;
        padding-left: 30px;
      }

      .el-textarea {
        width: 440px;
        margin-left: 30px;
        border: 1px solid #eee;
        border-radius: 3px;
      }

      .el-textarea__inner {
        width: 438px;
        height: 100px;
        background-color: #fff;
      }

      .el-dialog__footer {
        padding-top: 20px;

        .el-button--primary {
          background: #66B1FF;
        }
      }
    }
  }

  .remark {
    .el-dialog {
      width: 500px;
      height: 240px;

      .el-dialog__header {
        height: 65px;
        line-height: 80px;
      }

      .el-dialog__title {
        line-height: 55px;
        padding-left: 30px;
      }

      .el-textarea {
        width: 440px;
        margin-left: 30px;
        border: 1px solid #eee;
        border-radius: 3px;
      }

      .el-textarea__inner {
        width: 438px;
        height: 100px;
        background-color: #fff;
      }

      .el-select {
        width: 160px;
        padding: 0;
        margin-left: 50%;
        transform: translateX(-50%);
      }

      .el-dialog__footer {
        padding-top: 50px;

        .el-button--primary {
          background: #66B1FF;
        }
      }
    }
  }
}
</style>
<style lang='stylus' scoped>
.domain {
  .do_topNav {
    display: flex;
    justify-content: space-between;

    .do_top {
      width: 250px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      div {
        height: 100%;
        width: 110px;
        background-color: #4D71EE;
        border-radius: 4px 4px;
        line-height: 36px;
        color: #fff;
        text-align: center;
        cursor: pointer;
      }
    }
  }

  .table {
    .addInput {
      display: flex;
      justify-content: space-between;
      width: 500px;
      padding-left: 30px;

      .el-input {
        width: 300px;
      }

      .el-input__inner {
        width: 300px;
      }

      .el-button:nth-child(3) {
        color: #fff;
        background-color: #6780A4;
      }
    }

    .doName {
      cursor: pointer;
    }

    .do_edit {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-top: 10px;

      img:nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 100%;
        margin-right: 20px;
      }

      .el-dropdown {
        width: 20px;

        img {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
      }
    }

    .err {
      color: #EE0000;
    }

    .succes {
      color: #32CD32;
    }

    .out {
      color: #FF7F00;
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
          width: 60px;
          height: 40px;
          padding: 5px 15px;
        }
      }

      .cont {
        padding: 15px 20px 0 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;

        span {
          line-height: 2;
        }

        img {
          display: inline-block;
          width: 60px;
          height: 40px;
          padding: 5px 15px;
        }
      }
    }
  }
}
</style>