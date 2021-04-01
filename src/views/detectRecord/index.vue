<template>
  <div class="log-storage-record">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      @submit.native.prevent
    >
      <el-form-item label="IP" prop="nodeHost">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          class="input"
          maxlength="27"
          @keyup.enter="fetchData"
          v-model="searchMap.nodeHost"
          placeholder="请输入ip"
        />
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      v-loading="tableLoading"
      :data="list"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
    >
      <el-table-column
        prop="nodeHost"
        label="检测IP"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="detectionCount"
        label="检测次数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="failCount"
        label="失败次数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="detectIp"
        label="代理IP"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="insertTime"
        label="检测时间"
        align="center"
      ></el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination ref="pagination" :total="total"></pagination>
  </div>
</template>

<script>
import { getNodeDetectRecord } from "@/api/record";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      tableLoading: false,
      searchMap: {
        // 条件查询绑定的条件值
        nodeHost: "",
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    fetchData() {
      this.tableLoading = true;
      getNodeDetectRecord(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.nodeHost
      )
        .then((res) => {
          this.tableLoading = false;
          this.list = res.data.rows;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 170px;
}
</style>

<style>
.log-storage-record .form .el-input__inner {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 260px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  padding: 0 30px 0 20px;
  border: none;
  background-color: #f7f7f7;
  border-radius: 4px;
  outline: 0;
}
</style>
