<template>
  <div class="white-list">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 30px"
      @submit.native.prevent >
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="addBtnSecurity" type="text" @click="handlerAdd" label="添加白名单安全组"></bx-button>
      </el-form-item>
      <el-form-item label="安全组" prop="conditions">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.conditions"
          placeholder="请输入安全组名称、IP"
        />
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#f9fafd', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe >
      <el-table-column prop="whiteGroupName" label="安全组名称" align="center" min-width="200"></el-table-column>
      <el-table-column label="白名单IP" align="center" min-width="750">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title
            width="700"
            trigger="hover"
            :content="scope.row.whiteGroupIps"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{scope.row.whiteGroupIps}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="130"
        v-if="btnAuthority($route.path, 1) || btnAuthority($route.path, 2)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.whiteGroupId)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.whiteGroupId)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total='total'></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @closed="init"
      class="dialog-input-250"
      :close-on-click-modal="false" >
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        :active-text-color="theme.backgroundColor" >
        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加白名单安全组</el-menu-item>
        </div>

        <div class="edit" v-else>
          <el-menu-item index="1">修改白名单组</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)">白名单分配</el-menu-item>
        </div>
      </el-menu>

      <div class="add-list" v-if="activeIndex == 1">
        <el-form
          :rules="rules"
          label-position="left"
          label-width="85px"
          ref="addWhiteList"
          :model="whiteListForm"
        >
          <el-form-item label="安全组组名" prop="whiteGroupName">
            <el-input v-model="whiteListForm.whiteGroupName" maxlength="20"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="24">
              <el-form-item label="白名单IP" prop="whiteGroupIps">
                <el-input
                  v-model="whiteListForm.whiteGroupIps"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入白名单IP，多个IP请用 '，' 隔开"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="!addClick" class="tip">Tip：更改安全组IP会同步更改使用该安全组的配置文件，请谨慎操作</div>
        </el-form>
      </div>

      <div class="allocation" v-else>
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
        <el-button class="reset" @click="resetForm('addWhiteList')">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="whiteListForm.id === null ? submitAdd('addWhiteList') : submitEdit('addWhiteList')"
          label="确认"
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
  getWhiteGroupList,
  saveWhiteGroup,
  getWhiteGroupInfo,
  updateWhiteGroup,
  delWhiteGroup
} from "@/api/security";
import { getPowerGroup } from "@/api/user.js";
import { allocationPowerDataNew, getAllocationPowerDataNew } from "@/api/auth.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import valid from "@/utils/validcode.js";
export default {
  data() {
    const ipRoles = (rule, value, callback) => {
      const reg = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
      const rege = /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/;
      if (!value) {
        callback(new Error("必填项不能为空"));
      } else {
        let _ips = value.split(",");
        if (
          _ips.every(item => {
            if (!reg.test(item)) {
              if (!rege.test(item)) {
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          })
        ) {
          callback();
        } else {
          callback(new Error("输入格式不合法"));
        }
      }
    };
    return {
      list: [],
      tableLoading: false,
      total: 0, // 总记录数
      id: "",
      searchMap: {
        conditions: ""
      },
      whiteListForm: {
        id: null,
        whiteGroupName: "",
        whiteGroupIps: ""
      },
      rules: {
        whiteGroupName: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.nameEmptyValue, trigger: "blur" }
        ],
        whiteGroupIps: [{ required: true, validator: ipRoles, trigger: "blur" }]
      },
      dialogVisible: false,
      activeIndex: "1",
      addClick: false, // 添加对话框：true， 编辑对话框：false
      options: [], // 选择框 分配人员名单
      pgNumCode: [], // 分配组织架构
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

    init() {
      if (this.activeIndex == 1) {
        this.$refs["addWhiteList"].resetFields();
      }
      this.whiteListForm = {
        id: null,
        whiteGroupName: "",
        whiteGroupIps: ""
      }
      this.testNode = []
    },

    clearInput() {
      this.searchMap.conditions = "";
    },

    fetchData() {
      this.tableLoading = true
      getWhiteGroupList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.conditions
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },

    // 获取 分配组织架构
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },

    // 点击编辑回显 分配组织架构
    getAllocationPowerData() {
      getAllocationPowerDataNew(this.id, getRouterId(this.$route.path), 1).then(
        res => {
          // let _pgNumCode = res.data.map(ele => {
          //   return ele.slice(1)
          // })
          // this.pgNumCode = _pgNumCode;
          this.pgNumCode = res.data;
        }
      );
    },

    handleSelect(index) {
      this.activeIndex = index;
      if (this.activeIndex == 2) {
        this.testNode = []
        // 获取 分配组织架构 选择项内容
        this.getPowerGroup();
        // 点击编辑回显 分配组织架构
        this.getAllocationPowerData();
      }
    },

    handlerAdd() {
      this.dialogVisible = true;
      this.addClick = true;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveWhiteGroup({
            whiteGroupName: this.whiteListForm.whiteGroupName,
            whiteGroupIps: this.whiteListForm.whiteGroupIps
          }).then(res => {
            this.dialogVisible = false;
            this.clearInput();
            this.fetchData();
          });
        } else {
          return false;
        }
      });
    },

    submitEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateWhiteGroup({
            whiteGroupId: this.whiteListForm.id,
            whiteGroupName: this.whiteListForm.whiteGroupName,
            whiteGroupIps: this.whiteListForm.whiteGroupIps
          }).then(res => {
            this.dialogVisible = false;
            this.clearInput();
            this.fetchData();
          });
        }
      });
    },

    // 保存节点分配人员信息
    submitSave() {
      // 转换
      let _pgNumCode = this.pgNumCode
        .map(ele => {
          return ele[ele.length - 1];
        })
        .join(",");

      allocationPowerDataNew(
        _pgNumCode,
        this.id,
        getRouterId(this.$route.path),
        1
      ).then(res => {
        this.dialogVisible = false;
      });
    },

    handlerEdit(id) {
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");

      // 回显 白名单安全组
      getWhiteGroupInfo(id).then(res => {
        this.whiteListForm.id = res.data.whiteGroupId;
        this.whiteListForm.whiteGroupName = res.data.whiteGroupName;
        this.whiteListForm.whiteGroupIps = res.data.whiteGroupIps;
      });
    },

    handlerDelete(id) {
      this.$confirm("此操作将永久删除该白名单安全组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delWhiteGroup(id).then(res => {
            this.clearInput();
            this.fetchData();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 40px;
}
</style>


