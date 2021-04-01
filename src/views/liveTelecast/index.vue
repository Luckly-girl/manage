<template>
  <div class="production">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <!-- <el-form-item v-if="btnAuthority($route.path, 0)"> -->
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="handlerAdd(false)" label="添加域名"></bx-button>
      </el-form-item>
      <el-form-item label="域名" prop="realmName">
        <input
          maxlength="27"
          class="input"
          v-model="searchMap.realmName"
          placeholder="请输入域名"
        />
      </el-form-item>
      <el-form-item label="产品" prop="productName">
        <input
          maxlength="27"
          class="input"
          v-model="searchMap.productName"
          placeholder="请输入产品名称"
        />
      </el-form-item>
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="searchData()" label="搜索"></bx-button>
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      :data="list"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
      @filter-change="statusFilter"
    >
      <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="pushName" label="推流域名" align="center"></el-table-column>
      <el-table-column prop="pullName" label="拉流域名" align="center"></el-table-column>
      <el-table-column prop="cname" label="cname" align="center"></el-table-column>
      <el-table-column prop="appName" label="AppName" align="center"></el-table-column>
      <el-table-column prop="streamName" label="StreamName" align="center"></el-table-column>
      <el-table-column
        prop="deployStatus"
        :label="deployStatusText"
        align="center"
        min-width="125"
        :filters="deployStatusList"
        column-key="deployStatus"
        :filter-multiple="false"
        :filter-method="filterTag"
        :filtered-value="searchMap.deployStatus=='' ? [] : [searchMap.deployStatus]"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.deployStatus == '2'">
            <span style="color:#15b64e">部署成功</span>
          </div>
          <div
            v-else-if="scope.row.deployStatus == '3'"
            class="act-img-btn"
            @click="deployTable(scope.row.id)"
          >
            <span style="color:#fa4c4c;padding: 0 3px 3px 0;border-bottom: 1px solid #fa4c4c;">部署失败</span>
          </div>
          <div v-else-if="scope.row.deployStatus == '1'">
            <span style="color:#ffae00">部署中</span>
          </div>
          <div class="act-img-btn" v-else>
            <span @click="deployNginxFile(scope.row.id)" style="color:#999999;border-bottom: 1px solid #999;">未部署</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作"
        align="center"
        min-width="130"
        fixed="right"
        v-if="btnAuthority($route.path, 0) && btnAuthority($route.path, 1)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.id)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.id)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.liveBroadId)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.liveBroadId)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
    <el-dialog :visible.sync="dialogVisible" width="826px" @closed="init()" :close-on-click-modal="false">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :active-text-color="theme.backgroundColor">
        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加产品</el-menu-item>
        </div>
        <div class="edit" v-else>
          <el-menu-item index="1">编辑产品</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)">产品分配</el-menu-item>
        </div>
      </el-menu>

      <el-form
        v-if="activeIndex == 1"
        :model="liveBroadInfo"
        :rules="rules"
        ref="liveBroadInfo"
        :inline="true"
        label-width="120px"
        label-position="left"
        class="live-broad-form"
      >
        <el-row>
          <el-col :span="18">
            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="liveBroadInfo.productId"
                filterable
                placeholder="请选择产品名称"
                :disabled="id!==''"
              >
                <el-option
                  v-for="(item, index) of productArr"
                  :key="index"
                  :value="item.id"
                  :label="item.productName"
                  :disabled="item.type==0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="播流域名" prop="pullName">
              <el-input v-model="liveBroadInfo.pullName" placeholder="请填写播流域名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="推流域名" prop="pushName">
              <el-input v-model="liveBroadInfo.pushName" placeholder="请填写推流域名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="15">
            <el-form-item label="AppName" prop="portNum">
              <el-input v-model="addForm.appName" placeholder="请填写AppName"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="18">
            <el-form-item label="StreamName" prop="streamName">
              <el-input v-model="liveBroadInfo.streamName" placeholder="请填写StreamName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <ul class="live-url" v-if="id!==''">
          <li>
            <h3>推流地址</h3>
            <el-row>
              <el-col>
                <el-form-item label="推流地址" prop="portNum">
                  <p>{{liveBroadInfo.pushUrl}}</p>
                </el-form-item>
              </el-col>
            </el-row>
          </li>
          <li>
            <h3>播放地址 - 原画</h3>
            <el-row>
              <el-col>
                <el-form-item label="RTMP" prop="portNum">
                  <p>{{liveBroadInfo.rtmpUrl}}</p>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col>
                <el-form-item label="FLV" prop="portNum">
                  <p>{{liveBroadInfo.flvUrl}}</p>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col>
                <el-form-item label="M3U8" prop="portNum">
                  <p>{{liveBroadInfo.m3u8Url}}</p>
                </el-form-item>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-form>

      <!-- 分配组织架构 -->
      <div class="allocation" v-else-if="activeIndex == 2">
        <div class="select">
          <span class="label">分配组织架构</span>
          <el-cascader
            v-model="pgNumCode"
            :options="options"
            collapse-tags
            clearable
            filterable
            @change="handleChange"
            :props="{ multiple: true, expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
          ></el-cascader>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="init()" v-if="!id">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          v-if="!id"
          @click="!id ? submitAdd() : submitEdit()"
          label="提交"
        ></bx-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else-if="activeIndex == 2">
        <bx-button class="save" type="primary" @click="submitSave" label="保存"></bx-button>
      </div>
    </el-dialog>

    <el-dialog
      :inline="true"
      center
      :visible.sync="dialogDeploy"
      width="1000px"
      :close-on-click-modal="false"
      @closed="resetDialogDeploy"
    >
      <el-menu :default-active="1" mode="horizontal">
        <el-menu-item index="1">
          部署失败
          <!-- <bx-button
            v-if="deployStatusAll"
            type="primary"
            @click="updateNginxAllDeployStatus"
            label="一键部署"
          ></bx-button> -->
        </el-menu-item>
      </el-menu>
      <div class="deploy-msg">
        <el-table
          :data="deployList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '60px' }"
          :row-style="{ height: '56px' }"
          stripe
        >
          <el-table-column prop="nodeName" label="节点名称" align="center" min-width="125"></el-table-column>
          <el-table-column label="部署状态" align="center" min-width="600">
            <template slot-scope="scope">
            <el-steps :active="scope.row.tableStep" align-center finish-status="success">
              <el-step title="下发消息" :class="[(scope.row.step == 1 && scope.row.state == 0)?'nginx-step':'']"></el-step>
              <el-step title="部署" :class="[(scope.row.step == 2 && scope.row.state == 0)?'nginx-step':'']"></el-step>
              <el-step title="解析" :class="[(scope.row.step == 3 && scope.row.state == 0)?'nginx-step':'']"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.step!=4&&scope.row.state == 0">{{scope.row.errorMsg}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 0">
                <bx-button
                  type="primary"
                  @click="updateNginxDeployStatus(scope.row)"
                  label="重新部署"
                ></bx-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryLiveBroadcast, querySiteInfoByStreamName, delLiveBroadcast, createLiveBroadURL, saveLiveBroadInfo, lbAllocationPowerData } from "@/api/liveTelecast";
import {
  deployNginxFile,
  getProductList,
  dialogDeploy,
  updateNginxDeployStatus,
  getNginxState
} from "@/api/site";
import { getPowerGroup } from "@/api/user.js";
import { getAllocationPowerData } from "@/api/auth.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import { toCascadeSelectorFormat } from "@/utils/pub.js";
import valid from "@/utils/validcode.js";
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    deployStatusText() {
      if (this.searchMap.deployStatus === "") {
        return "部署状态";
      } else {
        return this.$store.state.liveDeployStatusList[this.searchMap.deployStatus].text;
      }
    },
    deployStatusList() {
      return this.$store.state.liveDeployStatusList;
    }
  },
  data() {
    const realmNameReg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    const realmNameRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写域名"));
      } else {
        if (!realmNameReg.test(value) && value != "") {
          callback(new Error("请输入正确的域名"));
        } else {
          callback();
        }
      }
    };
    let streamNameRule = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]{6,15}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入6-15位的英文及数字"));
      } else {
        callback();
      }
    };
    return {
      id: '',
      list: [],
      total: 0, // 总记录数
      showTabPart: false, // 查看节点信息展示部分
      searchMap: {
        realmName: '',
        productName: '',
        deployStatus: ''
      },
      tableLoading: false,
      dialogVisible: false,
      dialogDeploy: false,
      activeIndex: "1",
      productArr: [],
      liveBroadInfo: {
        productId: '',
        productName: "",
        pullName: "",
        pushName: "",
        appName: "",
        productGroup: "",
        streamName: "",
        pushUrl: '',
        rtmpUrl: '',
        m3u8Url: ''
      },
      rules: {
        productId: [
          { required: true, message: "请选择产品", trigger: "change" }
        ],
        pullName: [{ required: true, validator: realmNameRule, trigger: "blur" }],
        pushName: [{ required: true, validator: realmNameRule, trigger: "blur" }],
        streamName: [{ required: true, validator: streamNameRule, trigger: "blur" }]
      },
      domin: [], // 选择 DNS 解析
      deployList: [],
      nodeList: [], // 节点 集合
      addClick: false, // 添加: true  编辑: false
      options: [], // 分配人员名单
      users: [],
      nginxList: [],
      nodeInfoList: [], // 节点信息列表 显示数据
      productSelectIds: [], // 产品列表多选框选中的单个 id 值
      isFilebeat: 0, // 日志采集
      pgNumCode: "", // 组织架构人员
      testNode: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    // 关闭重置部署失败弹窗提示
    resetDialogDeploy() {
      this.id = "";
      this.deployList = [];
    },
     // 单个重新部署
    updateNginxDeployStatus(data) {
      updateNginxDeployStatus(this.id, data.id).then(res => {
        this.deployTable(this.siteId);
        this.fetchData();
      });
    },
    deployTable(id) {
      this.id = id;
      this.dialogDeploy = true;
      getNginxState(id).then(res => {
        this.deployList = res.data.rows.map(item => {
          return { ...item, tableStep: item.step == 4 ? 4 : item.step - 1 }
        })
      })
    },
    // 预部署状态部署
    deployNginxFile(id) {
      deployNginxFile(id).then(res => {
        this.fetchData();
      });
    },
    // 新增查询产品列表
    getProductList() {
      getProductList(1).then(res => {
        this.productArr = res.data.rows;
      });
    },
    // 查询直播详情
    querySiteInfoByStreamName(liveBroadId) {
      querySiteInfoByStreamName(liveBroadId).then(res => {
        this.liveBroadInfo = res.data
      })
    },
    filterTag() {
      return true;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.deployStatus == 0) {
        return "warning-row"
      } else {
        return '';
      }
    },
    searchData() {
      this.$refs.pagination.currentPage = 1;
      this.fetchData();
    },
    statusFilter(filter) {
      if (filter.deployStatus) {
        if (filter.deployStatus.length === 1) {
          this.searchMap.deployStatus = filter.deployStatus[0];
        } else {
          this.searchMap.deployStatus = "";
        }
      }
      this.searchData();
    },
    changeSwitch(id, isFilebeat, index) {
      this.$confirm("是否切换日志采集状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          openFilebeat(id, isFilebeat == 0 ? 1 : 0).then(res => {
            // if (isFilebeat == 0) {
            //   this.list[index].isFilebeat = 1;
            // } else {
            //   this.list[index].isFilebeat = 0;
            // }
            this.fetchData()
          });
        })
        .catch(() => {});
    },
    init() {
      this.liveBroadInfo = {
        productName: "",
        pullName: "",
        pushName: "",
        appName: "",
        productGroup: "",
        streamName: "",
        pushUrl: '',
        rtmpUrl: '',
        m3u8Url: ''
      }
      if (this.activeIndex == 1) {
        this.$refs["liveBroadInfo"].resetFields();
      }
      this.id = "";
    },
    clearInput() {
      this.searchMap.productName = "";
    },
    handleChange(node) {
      this.pgNumCode = distributionDepartment(
        this.testNode,
        node,
        this.pgNumCode
      );
      this.testNode = this.pgNumCode;
    },
    fetchData() {
      this.tableLoading = true
      queryLiveBroadcast(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.realmName,
        this.searchMap.productName,
        this.searchMap.deployStatus
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },
    handleSelect(index) {
      this.activeIndex = index;
      if (this.activeIndex == 2) {
        this.testNode = [];
        // 获取 分配人员 选择项内容
        this.getPowerGroup();
        // 点击编辑回显 分配组织架构
        this.getAllocationPowerData();
      }
    },

    // 点击编辑回显 分配组织架构
    getAllocationPowerData() {
      getAllocationPowerData(this.id, getRouterId(this.$route.path)).then(res => {
        // let _pgNumCode = res.data.map(ele => {
        //   return ele.slice(1)
        // })
        // this.pgNumCode = _pgNumCode;
        this.pgNumCode = res.data;
      });
    },

    handlerAdd() {
      this.dialogVisible = true;
      this.addClick = true;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.getProductList();
    },
    submitAdd() {
      this.$refs["liveBroadInfo"].validate(valid => {
        if (valid) {
          saveLiveBroadInfo({
            productId: this.liveBroadInfo.productId,
            pullName: this.liveBroadInfo.pullName,
            pushName: this.liveBroadInfo.pushName,
            streamName: this.liveBroadInfo.streamName
          }).then(res => {
            this.clearInput();
            this.fetchData();
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    submitEdit() {
      this.$refs["liveBroadInfo"].validate(valid => {
        if (valid) {

        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.liveBroadInfo.productId = ''
      this.$refs['liveBroadInfo'].resetFields()
    },
    getAllNode() {
      getAllNode("1").then(res => {
        this.nodeList = res.data.rows;
      });
    },
    // 获取 分配人员 选择项内容
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },
    handlerEdit(liveBroadId) {
      this.id = liveBroadId
      this.addClick = false
      this.dialogVisible = true;

      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.$refs["liveBroadInfo"].resetFields();
      });
      this.getProductList();
      this.querySiteInfoByStreamName(liveBroadId)
    },
    // 保存节点分配人员信息
    submitSave() {
      // 返回code字符串 （最后一个元素，用逗号分割）
      let _pgNumCode = this.pgNumCode.map(ele => ele[ele.length - 1]).join(",");
      lbAllocationPowerData(
        this.id,
        _pgNumCode
      ).then(res => {
        this.dialogVisible = false;
      });
    },
    handlerDelete(id) {
      this.$confirm("此操作将永久删除该直播, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delLiveBroadcast(id).then(res => {
          this.clearInput();
          this.fetchData();
        });
      })
      .catch(() => {});
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-menu-item {
  width: 208px;
}

.el-dialog .el-form {
  padding: 32px 40px 0;
}
.el-dialog .live-url .el-form-item{
  margin: 0;
}
.el-dialog .el-form-item {
  margin: 0 0 32px;
}

.el-dialog .el-form-item .el-select {
  width: 180px;
}

.allocation {
  height: 304px;
}

.node-info {
  height: 322px;
  padding: 32px 40px 20px;
  overflow: auto;
}
.form-flex{
  justify-content: flex-start;
  .el-form-item{
    margin-right: 50px;
  }
}
.live-url{
  padding: 16px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.13);
  h3{
    margin-bottom: 12px;
    color: #111;
    font-size: 14px;
    line-height: 32px;
  }
  li:first-child{
    padding-bottom: 16px;
    border-bottom: 1px solid #dedede;
  }
  li:last-child{
    padding-top: 16px;
  }
  p{
    color: #333;
  }
}
</style>


<style>
/* 弹框里， 两列输入框 */
.live-broad-form .el-form-item__content{
  width: 70%;
}
.live-url .el-form-item__label{
  color: #555;
}
.live-broad-form .el-form-item, .live-broad-form .el-input__inner {
  width: 100%;
}
.normalinner .el-form-item__content {
  width: 65% !important;
}
.normalinner .el-select {
  width: 100% !important;
}
</style>
