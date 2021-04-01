<template>
  <div class="node-list">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="searchBtn" type="text" @click="handlerAdd" label="添加节点"></bx-button>
      </el-form-item>
      <el-form-item label="IP" prop="host">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.host"
          placeholder="请输入IP"
        />
      </el-form-item>
      <!-- <el-form-item>
        <bx-button class="searchBtn" type="text" @click="fetchData" label="搜索"></bx-button>
      </el-form-item> -->
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
      <el-table-column prop="name" label="名称" align="center" min-width="100"></el-table-column>
      <el-table-column prop="host" label="IP" align="center" min-width="150"></el-table-column>
      <el-table-column prop label="监控" align="center" min-width="80">
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_trend act-img-btn"
            @click="controlShowClick(scope.row.host)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="port" label="SSH端口" align="center" min-width="80"></el-table-column>
      <!-- <el-table-column prop="type" label="类型" align="center" min-width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 1">
            <span>普通节点</span>
          </div>
          <div v-else>
            <span>备用节点</span>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column prop="nodeState" :label="searchStatusText" align="center" min-width="80"
        :filters="searchStatusList"
        column-key="searchStatus"
        :filter-multiple="false"
        :filter-method="filterTag"
        :filtered-value="searchMap.status=='' ? [] : [searchMap.status]"
      >
        <template slot-scope="scope">
          <div @click="showStatusList(scope.row.id)" class="pointer">
            <span style="color:#fa4c4c;border-bottom:1px solid #fa4c4c; padding-bottom:3px;" v-if="scope.row.nodeState === 0">异常</span>
            <span style="color: #15b64e;border-bottom:1px solid #15b64e; padding-bottom:3px;" v-else>正常</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productNum" label="对应数" align="center" min-width="80">
        <template slot-scope="scope">
          <span
            style="color:#4d71ee; border-bottom:1px solid #4d71ee; padding-bottom:3px;"
            @click="productNumClick(scope.row.id)"
            class="pointer"
          >{{ scope.row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="spareDomains" label="转移站点" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.spareDomains.length>0"
            style="color:#4d71ee; border-bottom:1px solid #4d71ee; padding-bottom:3px;"
            @click="spareDomainsList=scope.row.spareDomains,dialogVisibleSpareDomains=true"
            class="pointer"
          >{{scope.row.count}}</span>
          <!-- <div v-if="scope.row.spareNode == '成功'">
            <span
              style="color:#15b64e; border-bottom:1px solid #15b64e; padding-bottom:3px;"
            >{{ scope.row.spareNode }}</span>
          </div>
          <div v-else-if="scope.row.spareNode == '失败'">
            <span
              style="color:#fa4c4c; border-bottom:1px solid #fa4c4c; padding-bottom:3px;"
            >{{ scope.row.spareNode }}</span>
          </div>
          <div v-else-if="scope.row.spareNode == '申请中'">
            <span
              style="color:#ffae00; border-bottom:1px solid #ffae00; padding-bottom:3px;"
            >{{ scope.row.spareNode }}</span>
          </div>
          <div v-else>
            <span
              style="color:#999999; border-bottom:1px solid #999999; padding-bottom:3px;"
            >{{ scope.row.spareNode }}</span>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column prop="versionNum" label="最近一次更新" align="center" min-width="120"></el-table-column>
      <el-table-column prop="updateVersionState" label="版本更新状态" align="center" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.updateVersionState === 2" @click="updateVersion(scope.row.id)">
            <span style="color:#fa4c4c; border-bottom:1px solid #fa4c4c;padding-bottom: 3px;" class="pointer">异常</span>
          </div>
          <div v-else-if="scope.row.updateVersionState === 1">
            <span style="color: #15b64e;">正常</span>
          </div>
          <div v-else>
            <span style="color: #ffae00;">更新中</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="initStatus" label="初始化状态" align="center" min-width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.initStatus == 2">
            <span style="color: #15b64e;">成功</span>
          </div>
          <div v-else-if="scope.row.initStatus == 3">
            <span style="color: #fa4c4c; padding-right: 4px;">失败</span>
          </div>
          <div v-else-if="scope.row.initStatus == 1">
            <span style="color: #ffae00;">初始化中</span>
          </div>
          <div v-else>
            <span style="color: #999999;">未初始化</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="ipTableState" label="防火墙" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.ipTableState===2" style="color: #ffae00;">切换中</span>
          <el-switch
            v-else
            class="product-switch"
            v-model="scope.row.ipTableState"
            :active-value="1"
            :inactive-value="0"
            :active-color="theme.backgroundColor"
            disabled
            @click.native="changeSwitch(scope.row.id, scope.row.ipTableState, scope.$index)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="130"
        fixed="right"
        v-if="btnAuthority($route.path, 1) || btnAuthority($route.path, 2)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handleEdit(scope.row.id)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.id)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
    
    <el-dialog
      :visible.sync="dialogVisibleAdd"
      width="1180px"
      :close-on-click-modal="false"
    >
      <el-menu
        :active-text-color="theme.backgroundColor"
      >
        <div class="add">
          <el-menu-item index="1">添加节点</el-menu-item>
        </div>
      </el-menu>
      <div class="node-body">
        <div class="highlight">
			    <b>linux安装:</b><span style="margin-left:20px;">系统要求:<code>Centos-6.x 64位</code><code>Centos-7.x 64位</code></span>
			    <br>
			    <b>安装命令:</b>（<i class="icon-hand-down"></i>复制下面命令到服务器上运行）
			    <br>
          <div class="alert alert-success">
            <code class="ng-binding"> yum -y install wget;wget {{baseUrl}}/download/bx/install1/bx.sh;sh ./bx.sh {{userInfo.id}}</code>
          </div>
        </div>
        <div class="highlight">安装成功后，节点会出现在节点列表</div>
        <!-- <div class="highlight">安装成功后，节点会出现在待初始化列表,可点击初始化</div> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <bx-button class="save" type="primary" @click="dialogVisibleAdd=false" label="我知道了"></bx-button>
      </div>
    </el-dialog>


    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @close="init()"
      :close-on-click-modal="false"
    >
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        :active-text-color="theme.backgroundColor"
      >
        <div class="edit">
          <el-menu-item index="1">编辑节点</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)">节点分配</el-menu-item>
        </div>
      </el-menu>

      <el-form
        v-if="activeIndex == 1"
        :inline="true"
        :rules="rules"
        label-position="left"
        label-width="80px"
        ref="addNodeForm"
        :model="addNodeForm">
        <div class="list-product form-flex">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addNodeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="IP" prop="host">
            <el-input v-model="addNodeForm.host"></el-input>
          </el-form-item>
          <el-form-item label="SSH用户名" prop="username">
            <el-input v-model="addNodeForm.username"></el-input>
          </el-form-item>
          <el-form-item label="SSH密码" prop="password">
            <el-input v-model="addNodeForm.password"></el-input>
          </el-form-item>
          <el-form-item label="SSH端口" prop="port">
            <el-input v-model="addNodeForm.port"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addNodeForm.remark"></el-input>
          </el-form-item>

          <!-- <el-form-item label="节点类型" prop="type">
            <el-radio-group v-model="addNodeForm.type">
              <el-radio label="1">普通节点</el-radio>
              <el-radio label="2">备用节点</el-radio>
            </el-radio-group>
          </el-form-item>-->
        </div>
      </el-form>

      <div class="allocation" v-else>
        <div class="select">
          <span class="label">分配组织架构</span>
          <el-cascader
            v-model="pgNumCode"
            collapse-tags
            filterable
            :options="options"
            clearable
            @change="handleChange"
            :props="{ multiple: true, expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
          ></el-cascader>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="resetForm('addNodeForm')">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="checkAndConfirmNginxNode()"
          label="确认"
        ></bx-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <bx-button class="save" type="primary" @click="submitSave" label="保存"></bx-button>
      </div>
    </el-dialog>

    <!-- 状态列表展示 -->
    <el-dialog :visible.sync="dialogVisibleStatusList" width="626px" :close-on-click-modal="false" @closed="statusList=[]">
      <div style="padding: 0px 40px 20px;">
        <el-table
          :data="statusList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '50px' }"
          :row-style="{ height: '45px' }"
          stripe
        >
          <el-table-column prop="name" label="状态名称" align="center" width="200"></el-table-column>
          <el-table-column label="状态" align="center" width="60">
            <template slot-scope="scope">
              <div>
                <span style="color:#fa4c4c" v-if="scope.row.type === 0">异常</span>
                <span style="color: #15b64e;" v-else>正常</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="errorMsg" label="状态信息" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 对应产品展示 -->
    <el-dialog :visible.sync="dialogVisibleProductNum" width="626px" :close-on-click-modal="false">
      <div style="padding: 0px 40px 20px;">
        <el-table
          :data="productInfoList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '50px' }"
          :row-style="{ height: '45px' }"
          stripe
        >
          <el-table-column prop="name" label="对应产品" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 对应已转移站点 -->
    <el-dialog :visible.sync="dialogVisibleSpareDomains" width="626px" :close-on-click-modal="false" @closed="spareDomainsList=[]">
      <div style="padding: 0px 40px 20px;">
        <el-table
          :data="spareDomainsList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '50px' }"
          :row-style="{ height: '45px' }"
          stripe
        >
          <el-table-column label="已转移站点" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="$router.push({path: '/site', query: {id: scope.row.id}})">{{scope.row.remark}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 性能 监控 cpu/网络-->
    <transition name="slide">
      <div class="control" v-if="controlShow" @click.self="canclePop">
        <div class="control-show" v-if="controlShow">
          <div class="title unCopy">
            测试产品
            <i class="el-dialog__close el-icon el-icon-close closeBtn" @click="canclePop"></i>
          </div>
          <div style="display: flex; justify-content: flex-end; padding: 0 20px;">
            <span class="font unCopy pointer" @click="checkedMore">查看内存等更多指标</span>
            <!-- <span class="font unCopy">设置报警规则</span> -->
            <el-date-picker
              v-model="dateSearch"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <img
              @click="searchBtn"
              class="time-search"
              src="@/assets/images/cdn/button_search_2.png"
            />
          </div>

          <div class="control-show-body">
            <cpu
              v-if="controlShow"
              :chartId="'CPU'"
              :dataX="dataX"
              :dataYCPU="dataYCPU"
              class="echarts2"
            ></cpu>
            <network
              v-if="controlShow"
              :chartId="'network'"
              :dataX="dataX"
              :dataYRecvTotal="dataYRecvTotal"
              :dataYSendTotal="dataYSendTotal"
              class="echarts2"
            ></network>
          </div>
        </div>
      </div>
    </transition>

    <!-- 性能 监控 cpu/内存/负载/硬盘/网络-->
    <transition name="slide">
      <div class="control-more" v-if="controlMore">
        <div class="control-more-header">
          <div class="title-left">
            <!-- 时间按钮 -->
            <ul>
              <li
                v-for="(item, index) of btnList"
                :key="index"
                class="timeBtn unCopy"
                :class="{ bgColor: index === mark ? true : false}"
                @click="handlerTimeBtn(index, item.value)"
              >{{ item.label }}</li>
            </ul>
            <span class="time-sel">选择时间范围：</span>
            <el-date-picker
              v-model="dateSearch"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <img
              @click="searchBtn"
              class="time-search"
              src="@/assets/images/cdn/button_search_2.png"
            />
          </div>
          <div>
            <ul>
              <li class="renovateBtn unCopy" @click="searchBtn">刷新</li>
              <li class="returnBtn unCopy" @click="backControl">返回</li>
            </ul>
          </div>
        </div>
        <div class="space"></div>

        <div class="control-more-body1">
          <div style="background: #8693f3; height: 40px; border-radius: 4px 4px 0 0">
            <span class="performance-parameter">CPU/内存/负载</span>
          </div>
          <div class="body1">
            <cpu
              v-if="controlMore"
              :chartId="'CPU2'"
              :dataX="dataX"
              :dataYCPU="dataYCPU"
              class="echarts3"
            ></cpu>
            <memory
              v-if="controlMore"
              :chartId="'memory'"
              :dataX="dataX"
              :dataYMemory="dataYMemory"
              class="echarts3"
            ></memory>
            <average
              v-if="controlMore"
              :chartId="'average'"
              :dataX="dataX"
              :dataYOneMin="dataYOneMin"
              :dataYFiveMin="dataYFiveMin"
              :dataYFifteen="dataYFifteen"
              class="echarts3"
            ></average>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between">
          <div class="control-more-body2 border-right">
            <div style="background: #bc8dee; height: 40px; border-radius: 4px 4px 0 0">
              <span class="performance-parameter">硬盘使用率</span>
            </div>
            <div class="body2">
              <disk
                v-if="controlMore"
                :chartId="'disk'"
                :dataX="dataX"
                :dataYDisk="dataYDisk"
                class="echarts4"
              ></disk>
            </div>
          </div>

          <div class="control-more-body2">
            <div style="background: #ffa897; height: 40px; border-radius: 4px 4px 0 0">
              <span class="performance-parameter">网络流入流出速率（bps）</span>
            </div>
            <div class="body2">
              <network
                v-if="controlMore"
                :chartId="'network2'"
                :dataX="dataX"
                :dataYRecvTotal="dataYRecvTotal"
                :dataYSendTotal="dataYSendTotal"
                class="echarts4"
              ></network>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getNodeList,
  getIpNodeInfo,
  addNginxNode,
  getNodeInfo,
  checkNginxNode,
  delNginxNode,
  updateNodeIpTablesOpenStatus,
  getNodeStatusById,
  updateVersion
} from "@/api/nodeList";
import Bus from "@/utils/bus"
import { encrypt, decrypt } from "@/utils/encryption";
import { getPowerGroup } from "@/api/user.js";
import { allocationPowerData, getAllocationPowerData } from "@/api/auth.js";
import { getRouterId, distributionDepartment, baseBus } from "@/utils/filter";
import { toCascadeSelectorFormat } from "@/utils/pub";
import valid from "@/utils/validcode.js";
import cpu from "./components/cpu";
import network from "./components/network";
import memory from "./components/memory";
import disk from "./components/disk";
import average from "./components/average";
import { baseUrl } from "@/utils/env.js"

export default {
  computed: {
    baseUrl() {
      return baseUrl
    },
    theme() {
      return this.$store.state.theme;
    },
    searchStatusList() {
      return this.$store.state.searchStatusList;
    },
    searchStatusText() {
      if (this.searchMap.status === '') {
        return '状态'
      } else {
        return this.$store.state.searchStatusList[this.searchMap.status].text
      }
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  components: {
    cpu,
    network,
    memory,
    disk,
    average,
  },
  data() {
    let validcodeport = (rule, value, callback) => {
      const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (!value && !this.addNodeForm.username && !this.addNodeForm.password) {
        callback();
      } else if (!value && (this.addNodeForm.username !== '' || this.addNodeForm.password !== '')) {
        return callback(new Error('请输入SSH端口号'))
      } else if (value !== '' && !this.addNodeForm.username && !this.addNodeForm.password) {
        if (!this.addNodeForm.username) {
          this.$refs.addNodeForm.validateField("username")
        }
        if (!this.addNodeForm.password) {
          this.$refs.addNodeForm.validateField("password")
        }
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的SSH端口号'))
        }
      } else {
        callback();
      }
    }
    let validusername = (rule, value, callback) => {
      if (!value && !this.addNodeForm.port && !this.addNodeForm.password) {
        callback();
      } else if (!value && (this.addNodeForm.port !== '' || this.addNodeForm.password !== '')) {
        return callback(new Error('请输入SSH用户名'))
      } else if (value !== '' && !this.addNodeForm.port && !this.addNodeForm.password) {
        if (!this.addNodeForm.port) {
          this.$refs.addNodeForm.validateField("port")
        }
        if (!this.addNodeForm.password) {
          this.$refs.addNodeForm.validateField("password")
        }
        callback();
      } else {
        callback();
      }
    }
    let validpassword = (rule, value, callback) => {
      if (!value && !this.addNodeForm.port && !this.addNodeForm.username) {
        callback();
      } else if (!value && (this.addNodeForm.port !== '' || this.addNodeForm.username !== '')) {
        return callback(new Error('请输入SSH密码'))
      } else if (value !== '' && !this.addNodeForm.port && !this.addNodeForm.username) {
        if (!this.addNodeForm.port) {
          this.$refs.addNodeForm.validateField("port")
        }
        if (!this.addNodeForm.username) {
          this.$refs.addNodeForm.validateField("username")
        }
        callback();
      } else {
        callback();
      }
    }
    return {
      ph: "请输入IP",
      list: [],
      total: 0, // 总记录数
      searchMap: {
        host: "",
        status: ""
      },
      dialogVisible: false,
      dialogVisibleAdd: false,
      dialogVisibleProductNum: false, // 对应节点数对话框
      dialogVisibleSpareDomains: false,// 已转移站点对话框
      dialogVisibleStatusList: false,// 状态列表对话框
      spareDomainsList: [],
      statusList: [],
      activeIndex: "1",
      radio: "0",
      addNodeForm: {
        id: null,
        name: "",
        host: "",
        username: "",
        password: "",
        port: "",
        remark: ""
        // type: "1"
      },
      pgNumCode: [], // 分配组织架构
      rules: {
        name: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.nameEmptyValue, trigger: "blur" }
        ],
        username:[{ validator: validusername, trigger: "blur" }],
        password:[{ validator: validpassword, trigger: "blur" }],
        host: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.validcodeip, trigger: "blur" }
        ],
        port: [{ validator: validcodeport, trigger: "blur" }]
      },
      addClick: false, // 添加对话框：true， 编辑对话框：false
      options: [], // 选择框 分配组织架构
      users: [],
      id: "", // 当前点击节点的id
      dateSearch: [
        // [开始时间, 结束时间]
        new Date(new Date().getTime() - 3600 * 1000),
        new Date()
      ],
      tableLoading: false,
      controlShow: false,
      controlMore: false,
      dataX: [], // echarts x轴
      dataYCPU: [], // echarts y轴  CPU
      dataYRecvTotal: [], // echarts y轴  网络接受
      dataYSendTotal: [], // echarts y轴  网络发送
      dataYMemory: [], // echarts y轴  内存
      dataYDisk: [], // echarts y轴  硬盘
      dataYOneMin: [], // echarts y轴  系统 1min
      dataYFiveMin: [], // echarts y轴  系统 5min
      dataYFifteen: [], // echarts y轴  系统 15min
      mark: 2, // 默认下标
      btnList: [
        { label: "10分钟", value: 600000 },
        { label: "30分钟", value: 1800000 },
        { label: "1小时", value: 3600000 },
        { label: "6小时", value: 21600000 }
      ],
      timer: null,
      productInfoList: [], // 产品对应数
      testNode: []
    };
  },
  created() {
    if (this.$route.query.status) {
      this.searchMap.status = Number(this.$route.query.status);
    }
    let that = this;
    this.$nextTick(() => {
      this.fetchData();
      document.onkeydown = function(e) {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];
        if (e1 && e1.keyCode == 27) {
          that.canclePop();
          that.backControl();
        }
      };
    });
  },
  mounted() {
    baseBus("nodeList", () => {
      this.fetchData()
    })
  },
  beforeDestroy() {
    document.onkeydown = null;
  },
  methods: {
    updateVersion(id) {
      this.$confirm("是否更新版本?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateVersion(id).then(res => {
            this.fetchData()
            Bus.$emit("refushPage", 'versionNum')
          });
        })
        .catch(() => {});
    },
    changeSwitch(id, ipTableState, index) {
      this.$confirm("是否切换防火墙状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateNodeIpTablesOpenStatus(id, ipTableState == 0 ? 1 : 0).then(res => {
            // if (ipTableState == 0) {
            //   this.list[index].ipTableState = 1;
            // } else {
            //   this.list[index].ipTableState = 0;
            // }
            this.fetchData()
          });
        })
        .catch(() => {});
    },
    statusFilter (filter) {
      if (filter.searchStatus) {
        if (filter.searchStatus.length === 1) {
          this.searchMap.status = filter.searchStatus[0]
        } else {
          this.searchMap.status = ''
        }  
      }
      this.fetchData()
    },
    filterTag() {
      return true
    },
    handleChange(node) {
      this.pgNumCode = distributionDepartment(
        this.testNode,
        node,
        this.pgNumCode
      );
      this.testNode = this.pgNumCode;
    },
    showStatusList(id) {
      this.dialogVisibleStatusList = true
      this.getNodeStatusById(id)
    },
    getNodeStatusById(id) {
      getNodeStatusById(id).then(res => {
        this.statusList = res.data.rows
      })
    },
    // 产品对应数
    productNumClick(id) {
      this.dialogVisibleProductNum = true;
      let index = this.list.findIndex(item => item.id == id);
      let productNames = this.list[index].productName
        ? this.list[index].productName
        : "暂无对应产品";
      this.productInfoList = productNames.split(",").map((item, index) => {
        return {
          name: item
        };
      });
    },

    // 返回 cpu/网络
    backControl() {
      this.controlMore = false;
    },

    // 点击性能  时间
    handlerTimeBtn(index, timeValue) {
      this.mark = index;
      this.$set(this.dateSearch, 1, new Date());
      this.$set(this.dateSearch, 0, new Date(this.dateSearch[1] - timeValue));
      this.searchBtn();
    },

    // 获取 各项性能 数据
    getIpNodeInfo() {
      getIpNodeInfo(
        this.id,
        parseInt(this.dateSearch[0].getTime() / 1000),
        parseInt(this.dateSearch[1].getTime() / 1000)
      ).then(res => {
        for (let item of res.data.rows) {
          // 计算内存使用率
          let memoryUsage = (item.used / item.total) * 100;

          this.dataX.push(this.formateTime(item.recordTime * 1000));
          this.dataYCPU.push(item.us.toFixed(2));
          this.dataYRecvTotal.push(item.recvTotal.toFixed(2));
          this.dataYSendTotal.push(item.sendTotal.toFixed(2));
          this.dataYMemory.push(memoryUsage.toFixed(2));
          this.dataYDisk.push(item.disk.toFixed(2));
          this.dataYOneMin.push(item.oneMin.toFixed(2));
          this.dataYFiveMin.push(item.fiveMin.toFixed(2));
          this.dataYFifteen.push(item.fifteen.toFixed(2));
        }
      });
    },

    // 性能查询
    searchBtn() {
      // 获取指定的服务器性能的消息
      this.dataX = [];
      this.dataYCPU = [];
      this.dataYRecvTotal = [];
      this.dataYSendTotal = [];
      this.dataYMemory = [];
      this.dataYDisk = [];
      this.dataYOneMin = [];
      this.dataYFiveMin = [];
      this.dataYFifteen = [];
      // 一次只能查询一整天的数据
      let timeRange =
        this.dateSearch[1].getTime() - this.dateSearch[0].getTime();
      if (this.dateSearch[1].getTime() > new Date().getTime()) {
        this.$message({
          message: "只能查询当前时间之前的数据，请重新输入时间",
          type: "warning"
        });
      } else if (timeRange <= 24 * 60 * 60 * 1000) {
        this.getIpNodeInfo();
      } else {
        this.$message({
          message: "一次最多查询一天的数据，请重新输入时间",
          type: "warning"
        });
      }
    },

    //时间格式化 hh:mm:ss  params   time:时间戳
    formateTime(time) {
      let h =
        new Date(time).getHours() <= 9
          ? "0" + new Date(time).getHours()
          : new Date(time).getHours();
      let m =
        new Date(time).getMinutes() <= 9
          ? "0" + new Date(time).getMinutes()
          : new Date(time).getMinutes();
      let s =
        new Date(time).getSeconds() <= 9
          ? "0" + new Date(time).getSeconds()
          : new Date(time).getSeconds();
      return h + ":" + m + ":" + s;
    },

    fetchData() {
      this.tableLoading = true
      getNodeList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.host,
        this.searchMap.status
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },

    // 点击监控
    controlShowClick(id) {
      this.controlShow = true;
      this.id = id;
      this.$set(
        this.dateSearch,
        0,
        new Date(new Date().getTime() - 3600 * 1000)
      );
      this.$set(this.dateSearch, 1, new Date());
      this.searchBtn();
    },

    // 关闭抽屉
    canclePop() {
      this.controlShow = false;
      this.dateSearch = [
        new Date(new Date().getTime() - 3600 * 1000),
        new Date()
      ];
      // 清除定时器
      clearTimeout(this.timer);
      // 动画滚动时，隐藏滚动条
      this.timer = setTimeout(() => {
        let main = document.getElementsByClassName("container")[0];
        main.style.overflow = "auto";
      }, 900);
    },

    // 查看内存等 更多性能
    checkedMore() {
      this.controlMore = true;
      this.$set(
        this.dateSearch,
        0,
        new Date(new Date().getTime() - 3600 * 1000)
      );
      this.$set(this.dateSearch, 1, new Date());
    },

    // 对话框关闭时 初始化
    init() {
      this.addNodeForm = {
        id: null,    
        name: "",
        host: "",
        username: "",
        password: "",
        port: "",
        remark: ""
        // type: "1"
      };
      this.productInfoList = [];
      this.id = "";
      if (this.activeIndex == 1) {
        this.$refs["addNodeForm"].resetFields();
      }
      this.testNode = [];
    },

    clearInput() {
      this.searchMap.host = "";
      this.searchMap.status = "";
    },

    // 添加节点
    handlerAdd() {
      this.dialogVisibleAdd = true;
      // this.init();
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
    },

    // 重置 按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 弹出框 导航
    handleSelect(index) {
      this.activeIndex = index;
      if (this.activeIndex == 2) {
        this.testNode = [];
        // 获取 分配组织架构 选择项内容
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

    // 点击编辑 获取节点详情
    getNodeInfo() {
      getNodeInfo(this.id).then(res => {
        if (!res.data.password || !res.data) {
        } else {
          res.data.password = decrypt(res.data.password)
        }
        this.addNodeForm = res.data
      });
    },

    // 获取 分配组织架构
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },

    // 编辑
    handleEdit(id) {
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");

      // 回显 表单数据
      this.getNodeInfo();
    },

    // 检测 并提交节点
    checkAndConfirmNginxNode() {
      this.$refs["addNodeForm"].validate(valid => {
        if(valid) {
          let _addNodeForm = {
            id: this.addNodeForm.id,
            name: this.addNodeForm.name,
            host: this.addNodeForm.host,
            username: this.addNodeForm.username,
            password: !this.addNodeForm.password ? '' : encrypt(this.addNodeForm.password),
            port: this.addNodeForm.port,
            remark: this.addNodeForm.remark
          }
          if (!_addNodeForm.username && !_addNodeForm.password && !_addNodeForm.port) {
            this.submitEdit(_addNodeForm);
          } else if (_addNodeForm.username!==''&&_addNodeForm.password!==''&&_addNodeForm.port!=='') {
            checkNginxNode(_addNodeForm).then(res => {
              this.submitEdit(_addNodeForm);
            })
          }
        } else {
          return false
        }
      })
    },

    submitAdd(addNodeForm) {
      addNginxNode(addNodeForm).then(res => {
        this.clearInput();
        this.fetchData();
        this.dialogVisible = false;
      });
    },

    submitEdit(addNodeForm) {
      addNginxNode(addNodeForm).then(res => {
        this.clearInput();
        this.fetchData();
        this.dialogVisible = false;
      });
    },

    submitSave() {
      let _pgNumCode = this.pgNumCode
        .map(ele => {
          return ele[ele.length - 1];
        })
        .join(",");

      allocationPowerData(
        _pgNumCode,
        this.id,
        getRouterId(this.$route.path)
      ).then(res => {
        this.dialogVisible = false;
      });
    },

    handlerDelete(id) {
      this.$confirm("此操作将永久删除该节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delNginxNode(id).then(res => {
          this.clearInput();
          this.fetchData();
        });
      })
    }
  }
};
</script>

<style scoped>

.el-dialog .el-form {
  margin: 40px 40px 0;
}
.el-dialog .el-form-item {
  margin: 0 0 40px;
}

.allocation {
  min-height: 340px;
}

/* 滑动 */
.slide-enter,
.slide-leave-to {
  transform: translateY(100%);
  bottom: -100%;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.8s ease;
}
.slide-enter-to,
.slide-leave {
  transform: translateY(0px);
  bottom: 0;
}

/* echarts 图表 */
.control {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.control-show {
  position: absolute;
  border: 1px solid #dddddd;
  border-radius: 4px;
  bottom: 20px;
  right: 40px;
  left: 40px;
  background-color: #fff;
  z-index: 50 !important;
}

.control-more {
  position: absolute;
  border-radius: 4px;
  top: 20px;
  bottom: 20px;
  right: 20px;
  left: 20px;
  background-color: #fff;
  overflow: auto;
  z-index: 101;
}

/* 隐藏滚动条 但可以滚动 */
.control-more::-webkit-scrollbar {
  display: none;
}

.control-show .title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666666;
  background-color: #f7f7f7;
  padding: 10px 24px;
  margin-bottom: 12px;
}

.time-search {
  padding-left: 12px;
}

.closeBtn {
  z-index: 100px;
}

.control span.font,
.control-more span.font {
  font-size: 14px;
  color: #3c57bd;
  margin-right: 16px;
  height: 28px;
  line-height: 28px;
}

.control-show-body {
  display: flex;
  padding: 32px 0px 32px 20px;
}

.body1 {
  display: flex;
  padding: 20px 0 20px 20px;
  border-bottom: 20px solid #f7f7f7;
}

.control-show-body .echarts2,
.body1 .echarts3 {
  flex: 1;
  height: 260px;
  border-radius: 4px;
  margin-right: 20px;
  border: 1px solid #dddddd;
}

.body2 .echarts4 {
  height: 260px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.control-more-header {
  padding: 20px 32px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-bottom: 20px solid #f7f7f7;
}

.title-left {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.control-more-header ul {
  display: flex;
  display: -webkit-flex;
}

/* 性能指标 按钮 */
.returnBtn,
.renovateBtn,
.control-more-header ul > li.timeBtn {
  box-sizing: border-box;
  width: 60px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  font-weight: 500px;
  color: #606266;
  background: #f4f4f4;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  border-radius: 4px;
  margin-right: 12px;
}

.returnBtn,
.control-more-header ul > li.timeBtn.bgColor {
  background: #4d71ee;
  color: #fff;
}

.returnBtn,
.renovateBtn {
  margin: 0 0 0 20px;
}

.control-more .performance-parameter {
  font-size: 14px;
  color: #fff;
  padding-left: 12px;
  line-height: 40px;
}

.control-more-body2 {
  flex: 1;
}

.body2 {
  padding: 24px 32px;
}

.control-more-body2.border-right {
  border-right: 20px solid #f7f7f7;
}

.control-more .time-sel {
  font-size: 14px;
  text-align: center;
  padding-left: 8px;
}
.node-body{
  padding: 50px;
}
.highlight{
  background-color: #f7f7f9;
  border: 1px solid #e1e1e8;
  border-radius: 4px;
  margin-bottom: 14px;
  padding: 9px 14px;
  line-height: 30px;
}
.highlight code{
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  white-space: nowrap;
  background-color: #f9f2f4;
  border-radius: 4px;
  font-family: Monaco,Menlo,Consolas,"Courier New",monospace;
}
.highlight .alert-success {
  color: #468847;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}
.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  font-size: 14px;
}
</style>

<style>
.control .el-input__icon,
.control .el-input__prefix,
.control .el-input__inner,
.control .el-input--suffix .el-date-editor--datetime,
.control .el-range-separator,
.control-more .el-input__icon,
.control-more .el-input__prefix,
.control-more .el-input__inner,
.control-more .el-input--suffix .el-date-editor--datetime,
.control-more .el-range-separator {
  height: 28px;
  line-height: 28px;
}

.el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--datetime {
  width: 195px;
}
</style>
