<template>
  <div class="operRecord">
    <div class="oper_top">
      {{ operationLog.insertTime }}{{operationLog.operationValue}}：共<span
        style="color: #436eee"
        >{{ operationLog.total }}</span
      >条操作，当前成功<span style="color: #76ee00">{{
        operationLog.successNum
      }}</span
      >条，失败<span style="color: #ee2c2c">{{ operationLog.errorNum }}</span
      >条
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
        row-key="id"
        :default-expand-all="true"
        :tree-props="{
          hasChildren: 'hasChildren',
          children: 'operationLogInfos',
        }"
      >
        <el-table-column prop="domainName" label="" width="180">
        </el-table-column>
        <el-table-column prop="hostRecord" label="主机记录" width="180">
        </el-table-column>
        <el-table-column prop="recordType" label="记录类型"> </el-table-column>
        <el-table-column prop="line" label="线路类型"> </el-table-column>
        <el-table-column prop="recordValue" label="记录值"> </el-table-column>
        <el-table-column prop="mx" label="MX优先级"> </el-table-column>
        <el-table-column prop="ttl" label="ttl(秒)"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1" style="color: #00cd00"
              >成功</span
            >
            <span class="opt" v-if="scope.row.state === 2"
              >失败
              <el-tooltip
                effect="dark"
                :content="scope.row.errorMsg"
                popper-class="atooltip"
                placement="top-end"
              >
                ><img src="../../../../assets/images/DNS/faild.png" />
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="btn" @click="goTo">返回操作日志</el-button>
    </div>
  </div>
</template>

<script>
import { getOperationLogInfo } from "@/api/domain.js";
export default {
  data() {
    return {
      id: "",
      tableData: [],
      operationLog: {},
      cont: "",
      tableLoading: false,
    };
  },
  created() {
    this.id = this.$route.query.data;
    this.getOperationLogInfo();
  },
  methods: {
    getOperationLogInfo() {
      this.tableLoading = true;
      getOperationLogInfo(this.id)
        .then((res) => {
          this.tableLoading = false;
          // console.log(res);
          this.tableData = res.data.recordList;
          this.operationLog = res.data.operationLog;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    goTo() {
      this.$router.push("/batch/operateLog");
    },
  },
};
</script>

<style lang='stylus'>
.operRecord {
  .oper_top {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 1px;

    span {
      padding: 0 5px;
    }
  }

  .table {
    margin-top: 35px;

    .el-table {
      width: 100%;
    }

    .el-table th > .cell, .el-table td > .cell {
      height: 40px;
      text-align: center;
      font-size: 14px;
      color: #717171;
      line-height: 40px;
    }

    .el-table th {
      background-color: #F7F7F7;
    }

    .btn {
      margin-top: 30px;
      background-color: #6780A4;
      color: #fff;
    }

    .opt {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FF3030;

      img {
        width: 18px;
        height: 18px;
        margin-left: 15px;
      }
    }
  }
}
</style>