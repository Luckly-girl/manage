<template>
  <div class="log-storage-record">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item label="域名" prop="nginxName">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          class="input"
          maxlength="27"
          @keyup.enter="fetchData"
          v-model="searchMap.nginxName"
          placeholder="请输入域名"
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
      @filter-change="statusFilter"
    >
      <el-table-column prop="nginxName" label="域名" align="center"></el-table-column>
      <el-table-column prop="nodeIp" label="对应的节点IP" align="center"></el-table-column>
      <el-table-column prop="banIp" label="封禁IP" align="center"></el-table-column>
      <el-table-column prop="banType" :label="banTypeText" align="center"
        :filters="banTypeList"
        column-key="banType"
        :filter-multiple="false"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.banType == '1'">
            <span style="font-size: 14px; color:#999999;">永久封禁</span>
          </div>
          <div v-else>
            <span style="font-size: 14px; color:#4d71ee;">限时封禁</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="banStatus" :label="banStatusText" align="center"
        :filters="banStatusList"
        column-key="banStatus"
        :filter-multiple="false"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.banStatus == '1'">
            <span style="font-size: 14px; color:#15b64e;">已解封</span>
          </div>
          <div v-else>
            <span
              style="font-size: 14px; color:#fa4c4c;"
              class="pointer"
              @click="unBlockClick(scope.row.id)"
            >封禁中</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="banTime" label="封禁时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.banTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unblockTime" label="解禁时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unblockTime | dateFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination ref="pagination" :total="total"></pagination>
  </div>
</template>
<script>
import { getLogBanList, unBlock } from "@/api/record";
import { dateFilter } from "@/filters";

export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      tableLoading: false,
      searchMap: {
        // 条件查询绑定的条件值
        nginxName: "",
        banTypeValue: "",
        banStatusValue: ""
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    banStatusList() {
      return this.$store.state.banStatusList;
    },
    banTypeList() {
      return this.$store.state.banTypeList;
    },
    banStatusText() {
      if (this.searchMap.banStatusValue === '') {
        return '封禁状态'
      } else {
        return this.$store.state.banStatusList[this.searchMap.banStatusValue].text
      }
    },
    banTypeText() {
      if (this.searchMap.banTypeValue === '') {
        return '封禁类型'
      } else {
        return this.$store.state.banTypeList[this.searchMap.banTypeValue].text
      }
    }
  },
  methods: {
    statusFilter (filter) {
      if (filter.banType) {
        if (filter.banType.length === 1) {
          this.searchMap.banTypeValue = filter.banType[0]
        } else {
          this.searchMap.banTypeValue = ''
        }  
      }
      if (filter.banStatus) {
        if (filter.banStatus.length === 1) {
          this.searchMap.banStatusValue = filter.banStatus[0]
        } else {
          this.searchMap.banStatusValue = ''
        }  
      }
      this.fetchData()
    },
    filterTag() {
      return true
    },
    fetchData() {
      this.tableLoading = true;
      getLogBanList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.banTypeValue,
        this.searchMap.banStatusValue,
        this.searchMap.nginxName
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },

    clearInput() {
      this.searchMap.nginxName = "";
      this.searchMap.banTypeValue = "";
      this.searchMap.banStatusValue = "";
    },

    unBlockClick(id) {
      this.$confirm("是否确认解封?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          unBlock(id).then(res => {
            this.$message({
              type: "success",
              message: "解封成功!"
            });
            // 解封成功
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    // 封禁类型
    selectElement1(index) {
      this.banTypeValue = index;
    },
    // 封禁状态
    selectElement2(index) {
      this.banStatusValue = index;
    },
  }
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



