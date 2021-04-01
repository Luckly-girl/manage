<template>
  <div class="node-list">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item prop="name" label="用户名">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.name"
          placeholder="请输入用户名"
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
      stripe >
      <el-table-column prop="username" label="用户" align="center"></el-table-column>
      <el-table-column prop="operateName" label="操作名称" align="center"></el-table-column>
      <el-table-column prop="url" label="访问路径" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusCode" label="http code" align="center"></el-table-column>
      <el-table-column prop="method" label="请求类型" align="center"></el-table-column>
      <el-table-column label="请求参数" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title
            width="600"
            trigger="hover"
            :content="scope.row.params"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{scope.row.params}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="operateIp" label="操作IP" align="center"></el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operateTime | dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
  </div>
</template>

<script>
import { queryOperateLog } from "@/api/auth.js";

export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0, // 总记录数
      searchMap: {
        name: ""
      }
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
      queryOperateLog(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.name
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },

    clearInput() {
      this.searchMap.name = "";
    },
    
  }
};
</script>




