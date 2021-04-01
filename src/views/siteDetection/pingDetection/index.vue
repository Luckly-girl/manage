<template>
  <div class="white-list">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 30px"
      @submit.native.prevent
    >
      <el-form-item prop="domin" label="域名">
        <input
          class="input"
          maxlength="27"
          @keyup.enter="fetchData"
          v-model="searchMap.domin"
          placeholder="请输入域名"
        />
      </el-form-item>
      <el-form-item>
        <bx-button
          class="searchBtn"
          type="text"
          @click="fetchData"
          label="ping检测"
        ></bx-button>
      </el-form-item>
    </el-form>

    <div v-show="isShow" class="mt-10">
      <div class="show-font">
        <span>最快：{{ minSpeed }}ms</span>
        <span>最慢：{{ maxSpeed }}ms</span>
        <span>平均：{{ averageSpeed }}ms</span>
      </div>

      <el-table
        :data="list"
        :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
        :header-row-style="{ height: '60px' }"
        :row-style="{ height: '56px' }"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="ip"
          label="响应IP"
          align="center"
        ></el-table-column>
        <el-table-column label="响应时间" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.time" style="color: #fa4c4c">无法连接</span>
            <span v-else>{{ scope.row.time + " ms" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ttl"
          label="TTL"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="响应状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status">
              <span style="font-size: 14px; color: #15b64e">连接成功</span>
            </div>
            <div v-else>
              <span style="font-size: 14px; color: #fa4c4c">连接超时</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import cdn from "@/api/cdn";
import siteDetection from "@/api/siteDetection.js";

export default {
  data() {
    return {
      list: [],
      speedList: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示10条数据
      searchMap: {
        domin: "",
      },
      isShow: false,
    };
  },
  created() {},
  computed: {
    maxSpeed() {
      if (this.speedList.length > 0) {
        return Math.max(...this.speedList);
      } else {
        return 0;
      }
    },
    averageSpeed() {
      if (this.speedList.length > 0) {
        let _sum = this.speedList.reduce(function (num, item) {
          return num + item;
        });
        return (_sum / this.speedList.length).toFixed(1);
      } else {
        return 0;
      }
    },
    minSpeed() {
      if (this.speedList.length > 0) {
        return Math.min(...this.speedList);
      } else {
        return 0;
      }
    },
  },
  methods: {
    pingDomin() {
      for (let i = 0; i < 10; i++) {
        siteDetection.pingDomin(this.searchMap.domin).then((res) => {
          this.list.push(res.data);
          this.speedList.push(Number(res.data.time));
        });
      }
      console.log(this.speedList);
    },

    fetchData() {
      this.isShow = true;
      this.list = [];
      this.speedList = [];
      if (this.searchMap.domin) {
        this.pingDomin();
      } else {
        this.$message({
          type: "warning",
          message: "请输入域名",
        });
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.fetchData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.fetchData();
    },
  },
};
</script>

<style scpoed>
.el-form-item {
  margin-bottom: 32px;
}
</style>

