<template>
  <div class="perm">
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
          @click="handlerAddNode"
          label="开通权限"
        ></bx-button>
      </el-form-item>

      <el-form-item label="权限名称" prop="name">
        <i class="icon-search pointer" @click="fetchData()"></i>
        <input
          class="input"
          @keyup.enter="fetchData()"
          v-model="searchMap.name"
          placeholder="请输入权限名称"
        />
      </el-form-item>
    </el-form>

    <el-table
      class="mt-18"
      :data="list"
      v-loading="tableLoading"
      row-key="name"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      :tree-props="{ children: 'child' }"
      stripe
    >
      <el-table-column
        prop="name"
        label="权限名称"
        align="center"
      ></el-table-column>
      <el-table-column prop="istype" label="权限分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.istype === '0'">菜单</span>
          <span v-if="scope.row.istype === '1'">功能</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="page"
        label="权限路径"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="code"
        label="权限Code"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="zindex"
        label="优先级"
        align="center"
      ></el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="180"
        v-if="
          btnAuthority($route.path, 0) ||
          btnAuthority($route.path, 1) ||
          btnAuthority($route.path, 2)
        "
      >
        <template slot-scope="scope">
          <i
            v-if="
              (scope.row.pid == '0' || !scope.row.pid) &&
              btnAuthority($route.path, 0)
            "
            class="iconfont iconbutton_increase act-img-btn"
            @click="handleEdit(scope.row, 'child')"
          ></i>
          <i
            class="iconfont iconbutton_edit act-img-btn"
            :style="{
              'padding-left':
                scope.row.pid == '0' || !scope.row.pid ? 0 : '48px',
            }"
            @click="handleEdit(scope.row)"
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

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @closed="resetForm"
      :close-on-click-modal="false"
    >
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
      >
        <div class="add">
          <el-menu-item index="1">{{ pupotName }}</el-menu-item>
        </div>
      </el-menu>
      <div class="add-permission">
        <el-form
          :inline="true"
          :rules="rules"
          label-position="left"
          label-width="85px"
          ref="userFrom"
          :model="userFrom"
        >
          <div class="form-flex list-product">
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="userFrom.name"></el-input>
            </el-form-item>
            <el-form-item label="权限路径" prop="page">
              <el-input v-model="userFrom.page"></el-input>
            </el-form-item>
            <el-row style="width: 100%">
              <el-col :span="12">
                <el-form-item label="权限分类" prop="istype">
                  <el-radio-group v-model="userFrom.istype">
                    <el-radio label="0">菜单</el-radio>
                    <el-radio label="1">功能</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="pl-18">
                <el-form-item label="图标" prop="icon">
                  <el-popover
                    placement="bottom"
                    width="400"
                    v-model="iconselect"
                    trigger="click"
                  >
                    <el-row>
                      <el-col
                        :span="6"
                        v-for="(item, index) in iconfontList"
                        :key="index"
                        class="icon-col"
                      >
                        <el-button
                          type="img"
                          size="auto"
                          @click.native="
                            userFrom.icon = item;
                            iconselect = false;
                          "
                        >
                          <i :class="['iconfont ' + item]"></i>
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-button size="mini" slot="reference">
                      <span v-if="!userFrom.icon">添加</span>
                      <i :class="['iconfont ' + userFrom.icon]" v-else></i>
                    </el-button>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="权限code" prop="code">
              <el-input v-model="userFrom.code"></el-input>
            </el-form-item>
            <el-form-item label="权限优先级" prop="zindex">
              <el-input v-model="userFrom.zindex"></el-input>
              <div class="priority-font">请填写大于 0 的整数数字</div>
            </el-form-item>
          </div>

          <el-form-item label="文本域" label-width="70px" prop="descpt">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder
              v-model="userFrom.descpt"
            ></el-input>
          </el-form-item>
          <div class="blank32"></div>
        </el-form>
        <div class="dialog-footer">
          <el-button class="reset" @click="resetForm">重置</el-button>
          <bx-button
            class="confirm"
            type="primary"
            @click="setPerm()"
            label="确认"
          ></bx-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import memberApi from "@/api/cdn";
// import { deepCopy } from "@/utils/filter";
import { findViews, findPerms, setPerm, del, getPerm } from "../../api/auth.js";
import { translateDataToTree } from "@/utils/filter";
export default {
  data() {
    return {
      list: [],
      searchMap: {
        name: "",
      },
      // editInfo: {
      //   id: '',
      //   pId: ''
      // },
      dialogVisible: false,
      activeIndex: "1",
      // radio: "0",
      pupotName: "添加权限",
      iconselect: false,
      tableLoading: false,
      iconfontList: this.$store.state.iconfontList,
      userFrom: {
        id: "", //	Integer	菜单id(新增不填写且type为1,编辑必填且type为0)
        name: "", //	String	菜单名称
        type: "1", //	Integer	判断操作 0.编辑 1.新增
        pid: 0, //Integer	父菜单id
        istype: "0", //Integer	权限分类(0.菜单 1.功能)
        page: "", //	String	菜单url
        code: "", //	String	菜单编号
        zindex: "", //	Integer	菜单排序
        descpt: "", //	String	描述
        icon: "",
      },
      rules: {
        name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        page: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        code: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        zindex: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        descpt: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
      },
      // isshow: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.tableLoading = true;
      findPerms(this.searchMap.name)
        .then((res) => {
          this.tableLoading = false;
          this.list = translateDataToTree(res.data.rows);
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // circleArray(arr) {
    //   let pIds = new Set();
    //   let ids = new Set();
    //   for (let item of arr) {
    //     item.istype == "0" ? (item.type = "菜单") : (item.type = "功能");
    //     item.children = [];
    //     pIds.add(item.pId);
    //     ids.add(item.id);
    //   }
    //   pIds = Array.from(pIds);
    //   ids = Array.from(ids);

    //   let arr2 = deepCopy(arr);
    //   for (let ele of arr) {
    //     // console.log(arr2)
    //     this.circleSleep(ele, arr, arr2, pIds);
    //   }
    // },
    // circleSleep(ele, arr, arr2, pIds) {
    //   for (let item of arr2) {
    //     item.istype == "0" ? (item.type = "菜单") : (item.type = "功能");
    //     if (item.pid === ele.id) {
    //       ele.children.push(item);
    //       let index3 = arr.findIndex(cur => {
    //         return cur.pid === item.pid;
    //       });
    //       if (pIds.includes(item.id)) {
    //         this.circleSleep(item, arr, arr2, pIds);
    //       }
    //       arr.splice(index3, 1);
    //     }
    //   }
    // },
    clearInput() {
      this.searchMap.name = "";
    },
    handlerAddNode() {
      this.pupotName = "开通权限";
      this.userFrom.id = "";
      this.userFrom.pid = 0;
      this.dialogVisible = true;
    },
    handleEdit(data, child) {
      if (child) {
        this.userFrom.id = data.id;
        this.userFrom.pid = data.pid;
        this.pupotName = "添加子节点";
      } else {
        this.userFrom.id = data.id;
        this.userFrom.pid = data.pid;
        this.pupotName = "编辑权限";
      }
      this.getPerm(data.id);
      this.dialogVisible = true;
    },
    handlerDelete(id) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del({
            id: id,
          }).then((res) => {
            this.dialogVisible = false;
            this.clearInput();
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    setPerm() {
      this.$refs["userFrom"].validate((valid) => {
        if (valid) {
          setPerm({
            id: this.userFrom.id,
            name: this.userFrom.name,
            type: this.userFrom.type,
            pid: this.userFrom.pid,
            istype: Number(this.userFrom.istype),
            page: this.userFrom.page,
            code: this.userFrom.code,
            icon: this.userFrom.icon,
            zindex: Number((this.userFrom.zindex + "").trim()),
            descpt: this.userFrom.descpt,
          }).then((res) => {
            this.$store.dispatch("GetUserPerms").then((res) => {
              // 拉取菜单
              this.$store.dispatch("GenerateRoutes").then((resss) => {
                // 根据roles权限生成可访问的路由表
                this.$router.addRoutes(this.$store.getters.addRouters); // 动态添加可访问路由表
                this.$forceUpdate();
              });
            });
            this.resetForm();
            this.dialogVisible = false;
            this.clearInput();
            this.fetchData();
          });
        }
      });
    },
    resetForm() {
      this.$refs["userFrom"].resetFields();
    },
    getPerm(id) {
      getPerm(id).then((res) => {
        if (this.pupotName == "编辑权限") {
          this.userFrom = res.data;
          this.userFrom.istype = res.data.istype + "";
          this.userFrom.type = "0";
        } else if (this.pupotName == "添加子节点") {
          this.userFrom.type = "1";
          this.userFrom.pid = res.data.id;
          this.userFrom.id = "";
        }
      });
    },
    // updateDate(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       // 提交更新
    //       memberApi.update(this.pojo).then(res => {
    //         this.dialogVisible = false
    //         this.clearInput()
    //         this.fetchData();
    //       })
    //     } else {
    //       return false
    //     }
    //   });
    // },
    // toshow(msg) {
    //   this.dialogVisible = msg;
    //   this.fetchData();
    // }
  },
};
</script>

<style scoped>
.pl-18 {
  padding-left: 18px;
}
.add-permission {
  padding: 32px 40px;
}

.el-radio-group {
  padding: 0 9px;
}

.priority-font {
  font-size: 12px;
  color: #999;
  padding-top: 3px;
}

.add-permission .form-flex .el-form-item {
  margin: 0 0 32px;
}
.add-permission .input {
  width: 180px;
}
</style>

<style>
.perm .el-table [class*="el-table__row--level"] .el-table__expand-icon {
  width: 40px;
}
</style>


