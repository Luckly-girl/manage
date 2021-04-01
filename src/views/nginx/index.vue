<template>
  <div class="nginx">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item label="域名" prop="domain">
        <input class="input" v-model="searchMap.domain" placeholder="请输入域名" />
      </el-form-item>
      <el-form-item label="http状态" prop="httpStatus">
        <input class="input" v-model="searchMap.httpStatus" placeholder="请输入http状态码" />
      </el-form-item>
      <el-form-item label="请求类型" prop="requestMethod">
        <el-select class="status-sel" v-model="searchMap.requestMethod" placeholder="请选择请求类型" clearable>
          <el-option
            v-for="item of requestMethodList"
            :key="item.id"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dateSearch"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="fetchData()" label="搜索"></bx-button>
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      :data="list"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      v-infinite-scroll="load"
      infinite-scroll-delay="300"
      stripe
    >
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand" label-width="180px">
            <el-form-item label="serverAddr">
              <span>{{ props.row.serverAddr }}</span>
            </el-form-item>
            <el-form-item label="timeLocal">
              <span>{{ props.row.timeLocal }}</span>
            </el-form-item>
            <el-form-item label="remoteAddr">
              <span>{{ props.row.remoteAddr }}</span>
            </el-form-item>
            <el-form-item label="httpHost">
              <span>{{ props.row.httpHost }}</span>
            </el-form-item>
            <el-form-item label="httpXForwardedFor">
              <span>{{ props.row.httpXForwardedFor }}</span>
            </el-form-item>
            <el-form-item label="requestMethod">
              <span>{{ props.row.requestMethod }}</span>
            </el-form-item>
            <el-form-item label="requestUri">
              <span>{{ props.row.requestUri }}</span>
            </el-form-item>
            <el-form-item label="serverProtocol">
              <span>{{ props.row.serverProtocol }}</span>
            </el-form-item>
            <el-form-item label="status">
              <span>{{ props.row.status }}</span>
            </el-form-item>
            <el-form-item label="bodyBytesSent">
              <span>{{ props.row.bodyBytesSent }}</span>
            </el-form-item>
            <el-form-item label="httpReferer">
              <span>{{ props.row.httpReferer }}</span>
            </el-form-item>
            <el-form-item label="httpUserAgent">
              <span >{{ props.row.httpUserAgent }}</span>
            </el-form-item>
            <el-form-item label="requestTime">
              <span>{{ props.row.requestTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Time" prop="timeLocal" width="320px"></el-table-column>
      <el-table-column align="center" label="_source" prop="colsTotal"></el-table-column>
    </el-table>

    <p>
      <span v-show="loading"><i class="el-icon-loading"></i> 加载中...</span> 
      <span v-show="reloading" @click="searchBackgroundLog"><i class="el-icon-refresh"></i> 重新加载</span> 
      <span v-show="noMore">已全部加载完毕</span>
    </p>

  </div>
</template>

<script>
import { searchBackgroundLog } from "@/api/nginx"
import { dateFilter } from "@/filters"

export default {
  data() {
    return {
      list: [],
      tableLoading: false,
      loadCount: 1,   // 无限滚动加载次数
      loadSize: 10,   // 一次加载10条
      total: 0, // 总记录数
      searchMap: {
        domain: "",
        requestMethod: "",
        httpStatus: "",
        startTime: dateFilter(new Date().getTime() - 12*60*60*1000),
        endTime: dateFilter(new Date().getTime())
      },
      dateSearch: [dateFilter(new Date().getTime() - 12*60*60*1000), dateFilter(new Date().getTime())],
      requestMethodList: [
        { id: 0, label: "GET" },
        { id: 1, label: "POST" },
      ],
      loading: false,
      reloading: false,
      noMore: false
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  methods: {
    searchBackgroundLog() {
      if(this.loadCount == 1) {
        this.list = []
      }
      this.noMore = false;
      this.loading = false;
      this.reloading = false;
      searchBackgroundLog(
        this.loadCount,
        this.loadSize,
        this.searchMap.domain,
        this.searchMap.requestMethod,
        this.searchMap.httpStatus,
        this.searchMap.startTime,
        this.searchMap.endTime
      ).then(res => {
        this.tableLoading = false;
        this.list = this.list.concat(res.data.rows);
        this.total = res.data.total
        if(this.total/this.loadSize >= this.loadCount) {
          this.loadCount++;
        }
      }).catch(error => {
        this.tableLoading = false;
        this.noMore = false;
        this.loading = false
        this.reloading = true
      });
    },
    fetchData() {
      this.loadCount = 1;
      this.loadSize = 10;
      this.tableLoading = true
      this.searchBackgroundLog()
    },
    // 滑到底部加载
    load() {
      if(this.total/this.loadSize >= this.loadCount) {
        this.searchBackgroundLog()
        if(this.list.length > 0) {
          this.noMore = false;
          this.loading = true;
          this.reloading = false;
        }
      } else {
        if(this.list.length > 0) {
          this.noMore = true;
          this.loading = false;
          this.reloading = false;
        }
      }
    }
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.searchMap.startTime = dateFilter(val[0].getTime());
        this.searchMap.endTime = dateFilter(val[1].getTime());
      } else {
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
    }
  }
}
</script>

<style scpoed>
.el-dialog div.content {
  padding: 40px 40px 10px;
}
.el-dialog .el-form-item {
  margin-bottom: 26px;
}
.dns-tail {
  font-size: 12px;
  color: #999999;
}
.allocation {
  min-height: 330px;
}
.status-sel {
  width: 160px;
}
.demo-table-expand .el-form-item {
  margin-left: 40px;
  margin-bottom: 0;
}
.nginx>p {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fafafafa;
  text-align: center;
}

</style>

<style>
.nginx  .demo-table-expand .el-form-item__label {
  font-size: 14px;
  font-weight: 700;
}
</style>

