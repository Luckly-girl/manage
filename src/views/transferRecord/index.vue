<template>
  <div>
    <el-table
      class="mt-18"
      :data="list"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe >
      <el-table-column prop="productName" label="转移产品" align="center" min-width="130">
        <template slot-scope="scope">
          <div v-if="scope.row.productName">
            <span>{{ scope.row.productName }}</span>
          </div>
          <div v-else>
            <span>相关产品</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nodeName" label="被转移节点" align="center" min-width="130"></el-table-column>
      <el-table-column prop="transferNodeName" label="转移节点" align="center" min-width="130"></el-table-column>
      <el-table-column prop="time" label="转移时间" align="center" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.time | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="res" label="转移结果" align="center" min-width="536">
        <template slot-scope="scope">
          <div v-if="scope.row.res == '1'">
            <span style="font-size: 14px; color:#15b64e;">转移成功</span>
          </div>
          <div v-else-if="scope.row.res == '0'">
            <span style="font-size: 14px; color:#ffae00;">转移中</span>
          </div>
          <div v-else>
            <span style="font-size: 14px; color:#fa4c4c;">转移失败: {{scope.row.errorMsg}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>

  </div>
</template>

<script>
import { getTransferList } from "@/api/record";

export default {
  data() {
    return {
      list: [],
      tableLoading: false,
      total: 0 // 总记录数
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getTransferList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize
      ).then(res => {
        this.tableLoading = false
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    }
  }
};
</script>




