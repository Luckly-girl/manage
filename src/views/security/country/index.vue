<template>
  <div class="country">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 30px"
      @submit.native.prevent >
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="addBtnSecurity" type="text" @click="handlerAdd" label="添加国家隔离安全组"></bx-button>
      </el-form-item>
      <el-form-item label="安全组" prop="conditions">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.conditions"
          placeholder="请输入安全组名称"
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
      <el-table-column prop="countryGroupName" label="安全组名称" align="center" min-width="200"></el-table-column>
      <el-table-column label="放行国家" align="center" min-width="750">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            title
            width="700"
            trigger="hover"
            :content="scope.row.countryName"
          >
            <div style="width: 100%" slot="reference">
              <span class="ellipsis-span">{{scope.row.countryName}}</span>
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
            @click="handlerEdit(scope.row.countryGroupId)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.countryGroupId)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total='total'></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @closed="init()"
      class="dialog-input-250"
      :close-on-click-modal="false" >

      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        :active-text-color="theme.backgroundColor" >

        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加国家隔离安全组</el-menu-item>
        </div>

        <div class="edit" v-else>
          <el-menu-item index="1">修改国家安全组</el-menu-item>
          <el-menu-item index="2" v-if="btnAuthority($route.path, 3)">国家分配</el-menu-item>
        </div>
      </el-menu>

      <div class="add-list" v-if="activeIndex == 1">
        <el-form
          :rules="rules"
          label-position="left"
          label-width="85px"
          ref="addCountry"
          :model="countryForm"
        >
          <el-form-item label="安全组组名" prop="countryGroupName">
            <el-input v-model="countryForm.countryGroupName" placeholder="请输入安全组组名" maxlength="20"></el-input>
          </el-form-item>

          <el-form-item label="放行国家" prop="countryIds">
            <el-select
              v-model="countryForm.countryIds"
              filterable
              multiple
              collapse-tags
              placeholder="请选择放行国家"
            >
              <el-option
                v-for="(item, index) of countryList"
                :key="index"
                :label="item.countryName"
                :value="item.id"
              ></el-option>
            </el-select>
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
            filterable
            :props="{ multiple: true, expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
            @change="handleChange"
          ></el-cascader>
        </div>
      </div>

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="resetForm('addCountry')">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="countryForm.id === null ? submitAdd('addCountry') : submitEdit('addCountry')"
          label="确认"
        ></bx-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <bx-button class="save" type="primary" @click="submitSave" label="保存">保存</bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCountryList,
  getCountryGroupList,
  saveCountryGroup,
  getCountryGroupInfo,
  updateCountryGroup,
  delCountryGroup
} from "@/api/security";
import { getPowerGroup } from "@/api/user.js";
import { allocationPowerDataNew, getAllocationPowerDataNew } from "@/api/auth.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import valid from "@/utils/validcode.js";

export default {
  data() {
    return {
      id: "",
      total: 0, // 总记录数
      list: [],
      tableLoading: true,
      searchMap: {
        conditions: ""
      },
      countryForm: {
        id: null,
        countryGroupName: "",
        countryIds: ""
      },
      rules: {
        countryGroupName: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.nameEmptyValue, trigger: "blur" }
        ]
      },
      countryList: [], // 存储后台传过来的 放行国家
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
      this.countryForm = {
        id: null,
        countryGroupName: "",
        countryIds: ""
      }
      if (this.activeIndex == 1) {
        this.$refs["addCountry"].resetFields();
      }
      this.testNode = []
    },
    clearInput() {
      this.searchMap.conditions = "";
    },
    fetchData() {
      this.tableLoading = true
      getCountryGroupList(
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
      getAllocationPowerDataNew(this.id, getRouterId(this.$route.path), 3).then(
        res => {
          //   let _pgNumCode = res.data.map(ele => {
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
      this.$nextTick(() => {
        this.$refs["addCountry"].resetFields();
      });

      // 获取 放行国家列表
      this.getCountryList()

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveCountryGroup({
            countryGroupName: this.countryForm.countryGroupName,
            countryIds: this.countryForm.countryIds
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
    submitSave() {
      let _pgNumCode = this.pgNumCode
        .map(ele => {
          return ele[ele.length - 1];
        })
        .join(",");

      allocationPowerDataNew(
        _pgNumCode,
        this.id,
        getRouterId(this.$route.path),
        3
      ).then(res => {
        this.dialogVisible = false;
      });
    },
    submitEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateCountryGroup({
            countryGroupId: this.countryForm.id,
            countryGroupName: this.countryForm.countryGroupName,
            countryIds: this.countryForm.countryIds
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

    getCountryList() {
      getCountryList().then(res => {
        this.countryList = res.data.rows;
      });
    },

    handlerEdit(id) {
      this.id = id;
      this.countryForm.id = id;
      this.dialogVisible = true;
      this.addClick = false;
      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.$refs["addCountry"].resetFields();
      });

      this.getCountryList()

      // 回显 国家安全组 详情
      getCountryGroupInfo(id).then(res => {
        this.countryForm.id = res.data.countryGroupId;
        this.countryForm.countryGroupName = res.data.countryGroupName;
        this.countryForm.countryIds = res.data.countryIds;
      });
    },
    handlerDelete(id) {
      this.$confirm("此操作将永久删除该国家安全组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delCountryGroup(id).then(res => {
          this.clearInput();
          this.fetchData();
        });
      }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 40px;
}

.el-checkbox-group {
  padding-left: 85px;
}

.nodeList_save {
  display: flex;
  flex-wrap: wrap;
  padding-left: 85px;
}
.nodeList_save > li {
  justify-content: center;
  width: 95px;
  padding: 0 10px 20px 10px;
}
</style>

