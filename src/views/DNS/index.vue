<template>
  <div class="DNS">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="searchBtn" type="text" @click="handlerAdd" label="添加DNS"></bx-button>
      </el-form-item>

      <el-form-item label="域名" prop="domin">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input class="input" @keyup.enter="fetchData" v-model="searchMap.domin" placeholder="请输入域名" />
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      :data="list"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
    >
      <el-table-column prop="domin" label="域名" align="center"></el-table-column>
      <el-table-column prop="account" label="登录账号" align="center"></el-table-column>
      <el-table-column prop="apiToken" label="KEY" align="center" width="420px"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" v-if="btnAuthority($route.path, 1)">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-color="theme.backgroundColor"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="btnAuthority($route.path, 1) || btnAuthority($route.path, 2)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.dominId)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.dominId)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @close="init()"
      class="dialog-input-250"
      :close-on-click-modal="false"
    >
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        :active-text-color="theme.backgroundColor"
      >
        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加DNS</el-menu-item>
        </div>

        <div class="edit" v-else>
          <el-menu-item index="1">编辑DNS</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)">DNS分配</el-menu-item>
        </div>
      </el-menu>

      <div class="content" v-if="activeIndex == 1">
        <el-form
          :rules="rules"
          ref="addDNSForm"
          :model="addDNSForm"
          label-width="150px"
          label-position="left"
        >
          <el-form-item label="DNS登录账户" prop="account">
            <el-input v-model="addDNSForm.account"></el-input>
          </el-form-item>

          <el-form-item label="DNS密钥(Api-Token)" prop="apiToken">
            <el-input v-model="addDNSForm.apiToken"></el-input>
          </el-form-item>

          <div class="dns-tail">Tip：完成的Api-Token由ID，Token组合而成的，用英文的逗号分割</div>

          <el-form-item label="对应域名" prop="domin">
            <el-input v-model="addDNSForm.domin"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="addDNSForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- 分配节点 -->
      <div class="allocation" v-else>
        <div class="select">
          <span class="label">分配组织架构</span>
          <el-cascader
            v-model="pgNumCode"
            :options="options"
            collapse-tags
            clearable
            :props="{ multiple: true, expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="resetForm()">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="submitClick"
          label="提交"
        ></bx-button>
      </div>

      <div slot="footer" class="dialog-footer" v-else>
        <bx-button class="save" type="primary" @click="submitSave" label="保存"></bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDominList,
  addDomin,
  getDominInfo,
  updateDomin,
  delDomin,
  updateDnsStatus
} from "@/api/dns";
import { allocationPowerData, getAllocationPowerData } from "@/api/auth.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import { getPowerGroup } from "@/api/user.js";
import valid from "@/utils/validcode.js";
export default {
  data() {
    return {
      activeIndex2: "1",
      list: [],
      total: 0, // 总记录数
      searchMap: {
        domin: ""
      },
      activeIndex: "1",
      dialogVisible: false,
      addDNSForm: {
        id: null,
        account: "",
        apiToken: "",
        domin: "",
        remark: ""
      },
      id: "",
      addClick: false, // 添加对话框标题：true   编辑对话框标题： false
      users: [],
      show: "", // 是否显示 分配人员列表
      dataList: new Set(), // 存储选中的人员
      options: [], // 选择框 分配人员名单
      arrIndex: [], // 删除的元素
      isDisable: false, // 是否禁用
      rules: {
        account: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        apiToken: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        domin: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.validcodehost, trigger: "blur" }
        ],
        remark: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
      },
      pgNumCode: "", // 组织架构人员
      testNode: []
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  },
  methods: {
    handleChange(node) {
      this.pgNumCode = distributionDepartment(
        this.testNode,
        node,
        this.pgNumCode
      );
      this.testNode = this.pgNumCode;
    },
    clearInput() {
      this.searchMap.domin = "";
    },
    fetchData() {
      getDominList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.domin
      ).then(res => {
        this.list = res.data.rows;
        this.total = res.data.total;
      });
    },
    changeSwitch(row) {
      updateDnsStatus(row.dominId).then(res => {
        this.clearInput();
        this.fetchData();
      });
      // 如果status 状态为1 时，禁用
      row.status === 0 ? (this.isDisable = false) : (this.isDisable = true);
    },
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
      getAllocationPowerData(this.id, getRouterId(this.$route.path)).then(
        res => {
          // let _pgNumCode = res.data.map(ele => {
          //   return ele.slice(1)
          // })
          // this.pgNumCode = _pgNumCode;
          this.pgNumCode = res.data;
        }
      );
    },
    // 获取组织架构分配人员
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },
    init() {
      this.addDNSForm = {
        id: null,
        account: "",
        apiToken: "",
        domin: "",
        remark: ""
      };
      this.id = "";
      if (this.activeIndex == 1) {
        this.$nextTick(() => {
          this.$refs["addDNSForm"].resetFields();
        })
        
      }
      this.testNode = [];
    },
    handlerAdd() {
      this.dialogVisible = true;
      this.addClick = true;
      this.init();
      this.handleSelect("1");
    },
    resetForm() {
      this.$refs["addDNSForm"].resetFields();
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
    submitClick() {
      this.$refs["addDNSForm"].validate(valid => {
        if (valid) {
          if(this.addDNSForm.id === null) {
            this.submitAdd()
          } else {
            this.submitEdit()
          }
        } else {
          return false;
        }
      });
    },
    submitAdd(formName) {
      addDomin({
        account: this.addDNSForm.account,
        apiToken: this.addDNSForm.apiToken,
        domin: this.addDNSForm.domin,
        remark: this.addDNSForm.remark
      }).then(res => {
        this.dialogVisible = false;
        this.clearInput();
        this.fetchData();
      });
    },
    submitEdit(formName) {
      updateDomin({
        dominId: this.addDNSForm.id,
        account: this.addDNSForm.account,
        apiToken: this.addDNSForm.apiToken,
        domin: this.addDNSForm.domin,
        remark: this.addDNSForm.remark
      }).then(res => {
        this.dialogVisible = false;
        this.clearInput();
        this.fetchData();
      });
    },
    
    handlerEdit(id) {
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.$refs["addDNSForm"].resetFields();
      });

      // 获取 dns 回显
      this.getDominInfo()
    },
    getDominInfo() {
      getDominInfo(this.id).then(res => {
        this.addDNSForm.id = res.data.dominId;
        this.addDNSForm.account = res.data.account;
        this.addDNSForm.apiToken = res.data.apiToken;
        this.addDNSForm.domin = res.data.domin;
        this.addDNSForm.remark = res.data.remark;
      });
    },

    handlerDelete(dominId) {
      this.$confirm("此操作将永久该DNS, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delDomin(dominId).then(res => {
          this.clearInput();
          this.fetchData();
        });
      })
    }
  }
};
</script>

<style scpoed>
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
</style>

