<template>
  <div class="nginx">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent class="ip-checked-out">
      <el-form-item label="次数" prop="count">
        <input maxlength="9" class="input" v-model="searchMap.count" placeholder="请输入最小次数" />
      </el-form-item>
      <el-form-item label="IP" prop="count">
        <input maxlength="9" class="input" v-model="searchMap.ip" placeholder="请输入IP" />
      </el-form-item>
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="searchData()" label="搜索"></bx-button>
      </el-form-item>
      <el-form-item class="ip-checked">
        <el-badge :value="selectedList.length" class="item">
          <bx-button class="searchBtn" type="text" label="已选" @click="openDangerIpDrawer" @closed='blackInfoInit'></bx-button>
        </el-badge>
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      ref="multipleTable"
      :data="list"
      v-loading="tableLoading"
      @selection-change="detailCheck"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
    >
    <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="ip" label="高危IP" align="center"></el-table-column>
      <el-table-column prop="count" label="次数" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="最后一次访问时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <span class="table-node-info pointer" @click="getDetail(scope.row.ip)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="pagination" :total="total"></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="980px"
      @closed="init()"
      class="danger-dialog"
      :close-on-click-modal="false"
    >
      <el-menu :default-active="activeIndex" mode="horizontal" :active-text-color="theme.backgroundColor">
        <div class="add">
          <el-menu-item index="1">高危IP详情</el-menu-item>
        </div>
      </el-menu>
      <div class="table-bg">
        <el-table
          class="mt-18"
          :data="detailList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '60px' }"
          :row-style="{ height: '56px' }"
          stripe
        >
          <el-table-column prop="banIp" label="高危IP" align="center"></el-table-column>
          <el-table-column prop="realmName" label="访问域名" align="center"></el-table-column>
          <el-table-column prop="nodeName" label="访问节点" align="center"></el-table-column>
          <el-table-column prop="nodeHost" label="访问节点IP" align="center"></el-table-column>
          <el-table-column prop="productName" label="访问产品" align="center"></el-table-column>
          <el-table-column prop="insertTime" label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insertTime | dateFilter }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination ref="detailPagination" :total="detailTotal" :fn="'getLogBlockIpInfos'" @fatherMethod="getLogBlockIpInfos"></pagination>
      </div>
    </el-dialog>
    <el-drawer
      title="添加至黑名单组"
      :visible.sync="dangerIpDrawer"
      :with-header="false"
      @closed="initDrawer"
      size='600px'>
      <div class="black-out">
        <el-form
          :rules="rules"
          label-position="left"
          ref="addBlackList"
          :model="blackListForm"
        >
          <el-form-item prop="blackGroupName">
            <p class="lable-title">安全组组名</p>
            <el-input v-model="blackListForm.blackGroupName" placeholder="请输入黑名单安全组名" maxlength="20"></el-input>
          </el-form-item>

          <el-form-item prop="blackGroupIps">
            <p class="lable-title mar-t-20">黑名单IP</p>
            <el-input
              v-model="blackListForm.blackGroupIps"
              type="textarea"
              readonly
              class="height-area"
              :autosize="{ minRows: 2, maxRows: 8}"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <bx-button
            class="confirm"
            type="primary"
            @click="submitAdd"
            label="确认"
          ></bx-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  getLogBlockIps,
  getLogBlockIpInfos
} from "@/api/dangerIp";
import {
  saveBlackGroup
} from "@/api/security";
export default {
  data() {
    return {
      blackListForm: {
        blackGroupName: "",
        blackGroupIps: ""
      },
      tableLoading: true,
      rules: {
        blackGroupName: [
          { required: true, message: "请输入黑名单安全组名", trigger: "blur" }
        ]
      },
      cacheList: [],
      detailList: [],
      selectedList: [],
      list: [],
      total: 0, // 总记录数
      detailTotal: 0,
      searchMap: {
        count: "",
        ip: ''
      },
      dangerIp: '',
      activeIndex: "1",
      dangerIpDrawer: false,
      dialogVisible: false
    };
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  created() {
    let that = this;
    this.$nextTick(() => {
      this.fetchData();
      document.onkeydown = function(e) {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];
        if (e1 && e1.keyCode == 13) {
          that.fetchData()
        }
      };
    });
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  },
  methods: {
    initDrawer() {
      this.$refs['addBlackList'].resetFields();
    },
    blackInfoInit() {
      this.blackListForm = {
        blackGroupName: "",
        blackGroupIps: ""
      }
    },
    openDangerIpDrawer() {
      if (!this.selectedList.length) {
        this.$message({
          message: "请先选择高危IP",
          type: "warning"
        });
      } else {
        this.dangerIpDrawer = true
        this.blackListForm.blackGroupIps = this.selectedList.join(',')
      }
    },
    detailCheck(val) {
      let _cacheList = val.map(item => item.ip)
      if (this.cacheList.length < _cacheList.length) {
        this.selectedList = Array.from(new Set([...this.selectedList, ..._cacheList]))
      } else if (this.cacheList.length > _cacheList.length) {
        let del = this.cacheList.filter(item=>_cacheList.indexOf(item)==-1)
        del.forEach(item => {
          this.selectedList.splice(this.selectedList.indexOf(item), 1)
        })
      }
      this.cacheList = val.map(item => item.ip)
    },
    submitAdd() {
      this.$refs['addBlackList'].validate(valid => {
        if (valid) {
          saveBlackGroup({
            blackGroupName: this.blackListForm.blackGroupName,
            blackGroupIps: this.blackListForm.blackGroupIps
          }).then(res => {
            this.dangerIpDrawer = false;
            this.selectedList = [];
            this.fetchData()
          });
        } else {
          return false;
        }
      });
    },
    init() {
      this.detailList = []
      this.detailTotal = 0
      this.dangerIp = ''
      this.$refs.detailPagination.pageSize = 10
      this.$refs.detailPagination.currentPage = 1
    },
    searchData() {
      this.$refs.pagination.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      getLogBlockIps(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.count,
        this.searchMap.ip
      ).then(res => {
        this.cacheList = []
        this.list = res.data.rows
        if (this.selectedList.length > 0) {
          this.$nextTick(() => {
            for (let i = 0; i < this.list.length; i++) {
              if (this.selectedList.join(',').indexOf(this.list[i].ip) > -1) {
                this.$refs.multipleTable.toggleRowSelection(this.list[i], true)
              }
            }
          })
        }
        this.total = res.data.total;
        this.tableLoading = false
      }).catch(err => {
        this.tableLoading = false
      })
    },
    getDetail(ip) {
      this.dialogVisible = true
      this.dangerIp = ip
      this.$nextTick(() => {
        this.getLogBlockIpInfos(ip)
      })
    },
    getLogBlockIpInfos(ip) {
      getLogBlockIpInfos(
        this.$refs.detailPagination.currentPage,
        this.$refs.detailPagination.pageSize,
        ip ? ip : this.dangerIp
      ).then(res => {
        this.detailList = res.data.rows;
        this.detailTotal = res.data.total;
      })
    }
  }
};
</script>
<style>
.black-out .el-form-item__content{
  flex-direction: column;
  align-items: flex-start;
}
.ip-checked-out{
  position: relative;
}
.ip-checked-out .ip-checked{
  position: absolute;
  right: 0;
  margin-right: 0;
}
.ip-checked-out .ip-checked .searchBtn{
  margin-right: 0;
}
.black-out{
  padding: 40px;
}
.mar-t-20{
  margin-top: 20px;
}
.black-out .dialog-footer{
  padding-top: 140px;
}
.height-area textarea{
  height: 200px!important;
}
</style>

<style scoped>

.lable-title{
  margin-bottom: 20px;
}
.table-bg{
  padding: 0 20px 20px;
}
.el-dialog div.content {
  padding: 40px 40px 10px;
}
.el-dialog .el-form-item {
  margin-bottom: 26px;
}

.dns-tail {
  margin: -8px 0px 26px 150px;
  font-size: 12px;
  color: #999999;
}
.allocation {
  min-height: 330px;
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

