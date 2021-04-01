<template>
  <div class="user">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="searchBtn" @click="handlerAdd" label="开通角色"></bx-button>
      </el-form-item>

      <el-form-item label="角色名称" prop="roleName">
        <i class="icon-search pointer" @click="fetchData()"></i>
        <input maxlength="27"
          class="input"
          @keyup.enter="fetchData()"
          v-model="searchMap.roleName"
          placeholder="请输入角色名称"
        />
      </el-form-item>
      
      <el-form-item label="当前用户角色">
        <el-input v-model="userInfo.userRoles[0].roleName" disabled></el-input>
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      v-loading="tableLoading"
      :data="dataList"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
      style="width: 100%" >
      <el-table-column prop="code" label="角色编号" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="descpt" label="角色描述" align="center"></el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insertTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="btnAuthority($route.path, 1) || btnAuthority($route.path, 2)"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row)"
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

    <pagination ref="pagination" :total='total'></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      :close-on-click-modal="false"
      @closed="init" >
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <div class="add">
          <el-menu-item index="1">{{ !editId ? '新增角色' : '编辑角色' }}</el-menu-item>
        </div>
      </el-menu>

      <div class="editRole">
        <el-form
          :rules="rules"
          ref="fromAddRoleForm"
          :model="fromAddRole"
          label-width="70px"
          :inline="true"
          label-position="left"
        >
          <div class="form-flex list-product">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="fromAddRole.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色编号" prop="code">
              <el-input v-model="fromAddRole.code"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="descpt">
              <el-input type="textarea" v-model="fromAddRole.descpt"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="权限">
            <el-tree
              @check-change="checkPerms"
              :data="findPermsList"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              :props="defaultProps"
            >
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <ul v-if="!data.child.length">
                  <li @click="treeChildCheck(node, data, 'addData')" v-if="data.managerAddData">
                    <em
                      v-if="data.addData"
                      :style="{ 'backgroundColor': theme.backgroundColor, 'color': theme.color  }"
                    >新增</em>
                    <i v-else>新增</i>
                  </li>
                  <li
                    @click="treeChildCheck(node, data, 'updateData')"
                    v-if="data.managerUpdateData"
                  >
                    <em
                      v-if="data.updateData"
                      :style="{ 'backgroundColor': theme.backgroundColor, 'color': theme.color }"
                    >编辑</em>
                    <i v-else>编辑</i>
                  </li>
                  <li @click="treeChildCheck(node, data, 'delData')" v-if="data.managerDelData">
                    <em
                      v-if="data.delData"
                      :style="{ 'backgroundColor': theme.backgroundColor, 'color': theme.color }"
                    >删除</em>
                    <i v-else>删除</i>
                  </li>
                  <li @click="treeChildCheck(node, data, 'allocData')" v-if="data.managerAllocData">
                    <em
                      v-if="data.allocData"
                      :style="{ 'backgroundColor': theme.backgroundColor, 'color': theme.color }"
                    >分配</em>
                    <i v-else>分配</i>
                  </li>
                </ul>
              </div>
            </el-tree>
          </el-form-item>
          <!-- <el-form-item label="查看权限" class="view-permission-id">
            <el-radio-group v-model="fromAddRole.viewPermissionId">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">部分</el-radio>
              <el-radio :label="3">唯一</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="reset" @click="Reset">重置</el-button>
        <bx-button class="confirm" type="primary" @click="SET_setRole" label="确认"></bx-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  getRoleList,
  findPerms,
  getUserPerms,
  addRole,
  delRole,
  setRole,
  queryRole
} from "@/api/auth";

import {
  translateDataToTree,
  dataFlagToFalse,
  objFlagToFalse,
  treeSelect,
  selectFindParent,
  treeDataPushParent,
  resetDataSpace,
  addRoleFilter
} from "@/utils/filter";

export default {
  data() {
    return {
      tableLoading: false,
      editId: "",
      dataList: [],
      total: 0, // 总记录数
      defaultProps: {
        children: "child",
        label: "name"
      },
      searchMap: {
        roleName: ""
      },
      normalData: [],
      chooseTree: [],
      dialogVisible: false,
      activeIndex: "1",
      radio: "0",
      activeName: "first",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      deepCopyPermsList: [],
      findPermsList: [],
      fromAddRole: {
        permIds: "", //String	菜单id(用,号隔开)
        roleName: "", //	String	角色名称
        code: "", //	String	角色编号
        descpt: "", //	String	角色描述
        viewPermissionId: 1 //	Integer	查看权限 1.查看所有 2.查看部分 3.只查看自身
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "角色编号不能为空", trigger: "blur" }
        ],
        descpt: [
          { required: true, message: "角色描述不能为空", trigger: "blur" }
        ]
      },
      permIdlist: [],
      radioVal: ""
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {

    treeChildCheck(node, data, k) {
      this.$refs.tree.setChecked(node, true, false);
      data[k] = !data[k];
    },
    
    checkPerms(data, ie) {
      if (
        !ie ||
        (!data.addData && !data.updateData && !data.delData && !data.allocData)
      ) {
        objFlagToFalse(data, ie);
      }
    },

    init() {
      this.fromAddRole = {
        permIds: "",
        roleName: "",
        code: "",
        descpt: "",
        viewPermissionId: 1
      };
      this.normalData = [];
      this.findPermsList = [];
      this.deepCopyPermsList = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs["fromAddRoleForm"].resetFields();
    },

    clearInput() {
      this.searchMap.roleName = "";
    },

    fetchData() {
      this.tableLoading = true
      getRoleList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.roleName
      ).then(res => {
        this.tableLoading = false;
        this.dataList = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },

    // 获取 权限 数据
    SET_findPerms(data) {
      queryRole(Number(data.id)).then(res => {
        this.fromAddRole = res.data.roleDetail;
        this.normalData = res.data.perms;
        this.chooseTree = treeSelect(res.data.perms);
        this.findPermsList = translateDataToTree(res.data.perms);
        this.deepCopyPermsList = this.findPermsList;
        this.$refs.tree.setCheckedKeys(this.chooseTree);
      });
    },

    Reset() {
      this.fromAddRole = {
        permIds: "",
        roleName: "",
        code: "",
        descpt: "",
        viewPermissionId: 1
      };
      this.normalData = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs["fromAddRoleForm"].resetFields();
    },

    handlerDelete(data) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRole({
            id: Number(data.id)
          }).then(res => {
            this.clearInput();
            this.fetchData();
            this.activeName = "first";
          });
        })
        .catch(() => {});
    },

    getUserPerms() {
      getUserPerms().then(res => {
        this.normalData = res.data.rows;
        this.findPermsList = dataFlagToFalse(res.data.rows);
      });
    },

    handlerAdd() {
      this.editId = "";
      this.permIdlist = [];
      this.dialogVisible = true;
      this.getUserPerms();
    },

    handlerEdit(data) {
      this.editId = data.id;
      this.permIdlist = [];
      this.dialogVisible = true;
      this.SET_findPerms(data);
    },

    //编辑角色资料
    SET_setRole() {
      this.fromAddRole.roleName = resetDataSpace(this.fromAddRole.roleName);
      this.fromAddRole.code = resetDataSpace(this.fromAddRole.code);
      this.fromAddRole.descpt = resetDataSpace(this.fromAddRole.descpt);
      this.$refs["fromAddRoleForm"].validate(valid => {
        if (valid) {
          if (!this.editId) {
            this.addeSub();
          } else {
            this.editSub();
          }
        } else {
          return false;
        }
      });
    },

    addeSub() {
      addRole({
        permIds: addRoleFilter(
          treeDataPushParent(this.$refs.tree.getCheckedNodes())
        ),
        roleName: this.fromAddRole.roleName, //	String	角色名称
        code: this.fromAddRole.code, //	String	角色编号
        descpt: this.fromAddRole.descpt,
        viewPermissionId: this.fromAddRole.viewPermissionId
      }).then(res => {
        this.clearInput();
        this.fetchData();
        this.Reset();
        this.dialogVisible = false;
      });
    },

    editSub() {
      setRole({
        id: this.fromAddRole.id, //Integer	角色id(新增的时候不填,编辑必填)
        permIds: addRoleFilter(
          treeDataPushParent(this.$refs.tree.getCheckedNodes())
        ), //	String	菜单id(用,隔开)
        roleName: this.fromAddRole.roleName, //	String	角色名称
        code: this.fromAddRole.code, //	String	角色编号
        descpt: this.fromAddRole.descpt,
        viewPermissionId: this.fromAddRole.viewPermissionId
      }).then(res => {
        this.clearInput();
        this.fetchData();
        this.Reset();
        this.$store.dispatch("GetUserPerms").then(res => {
          // 拉取菜单
          this.$store.dispatch("GenerateRoutes").then(resss => {
            // 根据roles权限生成可访问的路由表
            this.$router.addRoutes(this.$store.getters.addRouters); // 动态添加可访问路由表
            this.$forceUpdate();
          });
        });
        this.dialogVisible = false;
      });
    }
  },

  watch: {
    activeName(newVal, oldVal) {
      newVal == "second" ? this.Reset() : "";
    }
  }
};
</script>

<style scoped>
.custom-tree-node {
  display: flex;
}
.custom-tree-node ul {
  display: flex;
  margin-left: 40px;
}
.custom-tree-node em,
.custom-tree-node i {
  font-style: normal;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 20px;
  color: #fff;
  border-radius: 4px;
}
.custom-tree-node i {
  background: #ccc;
  color: #fff;
}
.custom-tree-node li {
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.view-permission-id {
  width: 100%;
  margin-top: 20px !important;
}
.addRole {
  width: 600px;
  margin-left: 150px;
}
.editRole {
  padding: 32px 40px;
}

.user .form-flex .el-form-item {
  margin: 0 0 32px;
}

</style>

<style>
.user .list-product .el-input__inner {
  width: 180px;
}
</style>


