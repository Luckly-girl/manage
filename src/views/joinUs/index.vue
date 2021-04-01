<template>
  <div class="node-list">
    <!-- <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
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
    </el-form> -->

    <el-table
      class="mt-18"
      v-loading="tableLoading"
      :data="list"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe >
      <el-table-column prop="name" label="用户名" align="center"></el-table-column>
      <el-table-column prop="company" label="公司" align="center"></el-table-column>
      <el-table-column prop="email" label="电子邮件" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="telPhone" label="电话号码" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
  </div>
</template>

<script>
import { getContactUsList } from "@/api/joinUs.js";

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
      getContactUsList(
        // this.searchMap.name,
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        
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




