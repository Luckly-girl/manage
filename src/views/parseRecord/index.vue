<template>
  <div>
    <el-table
      v-loading="tableLoading"
      class="mt-18"
      :data="list"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe >
      <el-table-column label="站点域名" align="center" min-width="130">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title
            width="200"
            trigger="hover"
            :content="scope.row.realmName"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{scope.row.realmName}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="nodeHost" label="解析节点ip" align="center" min-width="130"></el-table-column>
      <el-table-column label="线路类型" align="center" min-width="90">
        <template slot-scope="scope">{{ scope.row.recordLine | recordLineFilter }}</template>
      </el-table-column>
      <el-table-column prop="domin" label="解析域名" align="center" min-width="130"></el-table-column>
      <el-table-column prop="dominName" label="解析cname" align="center" min-width="120"></el-table-column>
      <el-table-column prop="type" label="操作类型" align="center" min-width="90">
        <template slot-scope="scope">{{ scope.row.type | parseTypeFilter }}</template>
      </el-table-column>
      <el-table-column prop="insertTime" label="解析时间" align="center" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.insertTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态" align="center" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.status == '1'">
            <span style="color:#15b64e">{{ scope.row.errorMsg }}</span>
          </div>
          <div v-else-if="scope.row.status == '3'">
            <span style="color:#fa4c4c;">{{ scope.row.errorMsg }}</span>
          </div>
          <div v-else>
            <span style="color:#ffae00">解析中</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>

  </div>
</template>

<script>
import { getParseList } from "@/api/record";

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      tableLoading: false
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
      getParseList(
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




