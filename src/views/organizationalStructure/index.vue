<template>
  <div class="_container">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      @submit.native.prevent
    >
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button
          class="searchBtn"
          type="text"
          @click="handlerAdd"
          label="添加机构"
        ></bx-button>
      </el-form-item>

      <el-form-item label="机构" prop="name">
        <i class="icon-search pointer" @click="fetchData()"></i>
        <input
          maxlength="27"
          class="input"
          @keyup.enter="fetchData()"
          v-model="searchMap.name"
          placeholder="请输入部门名称"
        />
      </el-form-item>

      <el-form-item label="所属部门">
        <el-input v-model="this.get_userInfo.pgNumCodeName" disabled></el-input>
      </el-form-item>

      <el-form-item label="机构编码">
        <el-input v-model="this.get_userInfo.pgNumCode" disabled></el-input>
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      v-loading="tableLoading"
      :data="findOrganList"
      row-key="id"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      :tree-props="{ children: 'child', value: 'numCode' }"
      stripe
    >
      <el-table-column
        prop="name"
        label="机构名称"
        align="left"
        v-if="
          btnAuthority($route.path, 0) ||
            btnAuthority($route.path, 1) ||
            btnAuthority($route.path, 2)
        "
      >
        <template slot-scope="scope">
          <!-- nodeType   1: 机构/部门名单； 2：人员名单    -->
          <span
            v-if="
              (scope.row.level === 2 || scope.row.level === 1) &&
                scope.row.nodeType === 1
            "
          >
            <i
              :style="{
                'padding-left':
                  !scope.row.child || scope.row.child.length == 0 ? '23px' : 0,
              }"
              class="iconfont icongongsixinxi act-img-btn icon-height"
            ></i>
          </span>
          <span v-else-if="scope.row.level === 3 && scope.row.nodeType === 1">
            <i
              :style="{
                'padding-left':
                  !scope.row.child || scope.row.child.length == 0 ? '4px' : 0,
              }"
              class="iconfont iconbumenguanli act-img-btn"
            ></i>
          </span>
          <span v-else-if="scope.row.nodeType === 2">
            <i class="iconfont iconrenyuan act-img-btn"></i>
          </span>
          <span v-else>
            <i
              :style="{
                'padding-left':
                  !scope.row.child || scope.row.child.length == 0 ? '3px' : 0,
              }"
              class="iconfont iconfenbumen act-img-btn"
            ></i>
          </span>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        v-if="
          btnAuthority($route.path, 0) ||
            btnAuthority($route.path, 1) ||
            btnAuthority($route.path, 2)
        "
      >
        <template slot-scope="scope" v-if="scope.row.nodeType === 1">
          <i
            class="iconfont iconbutton_increase act-img-btn"
            @click="handleAdd2(scope.row)"
            v-if="btnAuthority($route.path, 0)"
          ></i>
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handleEdit(scope.row)"
            v-if="btnAuthority($route.path, 1)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row)"
            v-if="btnAuthority($route.path, 2)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @close="init()"
      :close-on-click-modal="false"
    >
      <el-menu :default-active="activeIndex" mode="horizontal">
        <div class="add">
          <el-menu-item index="1">{{ dialogTitle }}</el-menu-item>
        </div>
      </el-menu>

      <el-form
        class="_form"
        :model="organizationalForm"
        :rules="rules"
        ref="organizationalForm"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="机构名称" prop="name">
          <el-input
            v-model="organizationalForm.name"
            placeholder="请输入机构/部门名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="上级部门" prop="superiorDepartmentVal">
          <el-select
            v-model="organizationalForm.superiorDepartmentVal"
            disabled
            :placeholder="this.get_userInfo.pgNumCodeName"
          >
            <!-- <el-option></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item
          label="机构编码"
          prop="code"
          v-if="this.dialogTitle === '修改部门'"
        >
          <el-input
            v-model="organizationalForm.code"
            disabled
            :placeholder="organizationalForm.code"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="descr">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="organizationalForm.descr"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button class="reset" @click="resetForm">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="submit()"
          label="提交"
        ></bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPowerGroup,
  insertPowerMember,
  updatePowerMember,
  delPowerMember,
} from "@/api/organizationalStructure";
import { getRouterId } from "@/utils/filter.js";

export default {
  data() {
    return {
      tableLoading: false,
      findOrganList: [], // 树形结构表格 数据
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示10条数据
      searchMap: {
        name: "",
      },
      dialogVisible: false,
      activeIndex: "1",
      organizationalForm: {
        id: null,
        name: "",
        superiorDepartmentVal: "",
        code: "",
        descr: "",
      },
      rules: {
        name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
      },
      thisCode: "",
      dialogTitle: "", // 弹框标题
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    get_userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    fetchData() {
      this.tableLoading = true;
      getPowerGroup(this.searchMap.name, 1)
        .then((res) => {
          this.tableLoading = false;
          this.findOrganList = res.data;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },

    clearInput() {
      this.searchMap.name = "";
    },

    init() {
      this.organizationalForm = {
        id: null,
        name: "",
        superiorDepartmentVal: "",
        code: this.thisCode,
        descr: "",
      };
      this.$nextTick(() => {
        this.$refs["organizationalForm"].resetFields();
      });
    },

    submit(row) {
      this.$refs["organizationalForm"].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "开通组织") {
            this.submitAdd1();
          }
          if (this.dialogTitle === "添加子部门") {
            this.submitAdd2();
          }
          if (this.dialogTitle === "修改部门") {
            this.submitEdit();
          }
        } else {
          return false;
        }
      });
    },

    submitAdd1() {
      insertPowerMember(
        2,
        this.organizationalForm.name,
        this.organizationalForm.descr,
        this.get_userInfo.pgNumCode,
        getRouterId(this.$route.path)
      ).then((res) => {
        this.clearInput();
        this.fetchData();
        this.dialogVisible = false;
      });
    },
    submitAdd2() {
      insertPowerMember(
        2,
        this.organizationalForm.name,
        this.organizationalForm.descr,
        this.organizationalForm.code,
        getRouterId(this.$route.path)
      ).then((res) => {
        this.clearInput();
        this.fetchData();
        this.dialogVisible = false;
      });
    },
    submitEdit() {
      updatePowerMember(
        this.organizationalForm.name,
        this.organizationalForm.descr,
        this.organizationalForm.code,
        getRouterId(this.$route.path)
      ).then((res) => {
        this.clearInput();
        this.fetchData();
        this.dialogVisible = false;
      });
    },
    handlerDelete(row) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delPowerMember(row.numCode, getRouterId(this.$route.path)).then(
            (res) => {
              this.clearInput();
              this.fetchData();
            }
          );
        })
        .catch(() => {});
    },

    handlerAdd() {
      this.dialogVisible = true;
      this.dialogTitle = "开通组织";
    },
    handleAdd2(row) {
      this.dialogTitle = "添加子部门";
      this.dialogVisible = true;
      this.organizationalForm.superiorDepartmentVal = row.name;
      this.organizationalForm.code = row.numCode;
    },
    // 修改部门
    handleEdit(row) {
      this.dialogTitle = "修改部门";
      this.dialogVisible = true;
      this.organizationalForm.name = row.name;
      this.organizationalForm.superiorDepartmentVal = row.preName;
      this.organizationalForm.code = row.numCode;
      this.organizationalForm.descr = row.descr;

      this.thisCode = row.numCode;
    },

    resetForm() {
      this.init();
    },
  },
};
</script>
<style scoped>
._container {
  min-height: 600px;
}

._form {
  padding: 40px 40px 0;
}
.el-dialog .el-form-item {
  margin-bottom: 48px;
}
.el-select {
  width: 100%;
}

.el-radio-group {
  padding-left: 12px;
}
.icon-height {
  height: 16px;
}
</style>

<style>
/* 文本输入 */
._container .el-input__inner,
._container .el-textarea__inner {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 30px 0 20px;
  border: none;
  background-color: #f7f7f7;
  border-radius: 4px;
  outline: 0;
}
._container .el-form-item__label {
  position: relative;
}

._container .el-table td:first-child {
  padding-left: 15% !important;
}
._container .el-table th:first-child {
  padding-left: 20% !important;
}
</style>
