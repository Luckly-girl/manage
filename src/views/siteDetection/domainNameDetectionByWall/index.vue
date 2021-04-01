<template>
  <div class="country-wall">
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 30px" @submit.native.prevent >
      <el-form-item prop="domin" label="域名">
        <input class="input" maxlength="27" @keyup.enter="fetchData" v-model="searchMap.domin" placeholder="请输入域名" />
      </el-form-item>
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="fetchData" :loading="btnLoading" label="检测">检测</bx-button>
      </el-form-item>
    </el-form>
    <div class="tip">
      检测域名规则 例: 检测www.baidu.com 则输入框输入 baidu.com
    </div>

    <el-dialog :visible.sync="dominDialogVisible" width="400px" :close-on-click-modal="false">
      <el-menu :default-active="activeIndex" mode="horizontal">
        <el-menu-item index="1">检测结果</el-menu-item>
      </el-menu>
      <div class="content1">
        <div class="result-dialog" v-if="this.status === 1">
          <p>
            <span>检测域名：</span>
            <span class="ml">{{ domin }}</span>
          </p>
          <p>
            <span>检测结果：</span>
            <span class="ml">正常</span>
          </p>
        </div>

        <div class="result-dialog" v-else-if="this.status === 0">
          <p>
            <span>检测域名：</span>
            <span class="ml">{{ domin }}</span>
          </p>
          <p>
            <span>检测结果：</span>
            <span style="color: #fa4c4c; margin-left:15px">被墙</span>
          </p>
        </div>

        <div class="result-dialog" v-else-if="this.status === 2">
          <p>
            <span>检测超时，请稍后重试</span>
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer foot-btn">
        <bx-button class="searchBtn" type="primary" @click.native="dominDialogVisible = false" label="确认"></bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import siteDetection from "@/api/siteDetection.js";

export default {
  data() {
    return {
      dominDialogVisible: false,
      btnDisabled: false,
      searchMap: { // 条件查询绑定的条件值
        domin: ""
      },
      domin: "", // 存储后台返回的域名
      status: 2, // 后台返回的 状态 响应状态 0.被墙 1.正常 2.检测超时
      btnLoading: false,
      activeIndex: "1"
    };
  },
  created() {},
  methods: {
    checkFireWall() {
      this.btnLoading = true
      siteDetection.checkFireWall(this.searchMap.domin).then(res => {
        this.btnLoading = false
        this.dominDialogVisible = true;
        this.domin = res.data.domin;
        this.status = res.data.status
      }).catch(err => {
        this.btnLoading = false
      })
    },
    fetchData() {
      if (this.searchMap.domin) {
        this.checkFireWall()
      } else {
        this.$message({
          type: "warning",
          message: "请输入域名"
        });
      }
    },
  }
};
</script>


<style scoped>
.content1 {
  height: 200px;
  display: flex;
  justify-content: center;
}
.content1 .result-dialog {
  font-size: 14px;
  margin-top: 18px;
  height: max-content;
}
.content1 .result-dialog > p {
  margin: 32px;
}
.el-form-item {
  margin-bottom: 0;
}
.foot-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ml {
  margin-left: 15px;
}
</style>


<style>
.country-wall .el-menu-item.is-active {
  border-bottom: none;
}
</style>

