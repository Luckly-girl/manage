<template>
  <div class="operateLog">
    <div class="table">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        stripe
        style="width: 100%"
        @row-click="openDetails"
      >
        <el-table-column prop="operationValue" label="操作任务">
          <template slot-scope="scope">
            <div>
              {{ scope.row.operationValue }}：操作{{
                scope.row.total
              }}条，成功{{ scope.row.successNum }}条，失败{{
                scope.row.errorNum
              }}条
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="insertTime" label="操作时间"> </el-table-column>
      </el-table>
      <div class="operate_bot">
        <span>仅保留最近 1 个月的操作日志</span>

        <pagination ref="pagination" :total="total"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getOperationLogData } from "@/api/domain.js";
export default {
  data() {
    return {
      tableData: [],
      total: 10,
      type: "",
      tableLoading: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    //获取操作日志列表
    fetchData() {
      this.tableLoading = true;
      getOperationLogData(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize
      )
        .then((res) => {
          this.tableLoading = false;
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    //点击行查看详情
    openDetails(row) {
      // console.log(row);
      if (row.operationValue === "批量添加域名") {
        this.$router.push({
          path: "/batch/operateLog/operDomain",
          query: { data: row.id },
        });
      } else if (
        row.operationValue === "批量添加记录" ||
        row.operationValue === "批量修改记录"
      ) {
        this.$router.push({
          path: "/batch/operateLog/operRecord",
          query: { data: row.id },
        });
      }
    },
  },
};
</script>


<style lang='stylus'>
.operateLog {
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

    .el-table td:nth-child(1) {
      text-decoration: underline;
      cursor: pointer;
    }

    .el-table th {
      background-color: #F7F7F7;
    }
  }
}
</style>
<style lang='stylus' scoped>
.operateLog {
  .operate_bot {
    display: flex;
    justify-content: space-between;

    span {
      margin-top: 20px;
      font-size: 12px;
      color: #8B9DB6;
    }
  }
}
</style>