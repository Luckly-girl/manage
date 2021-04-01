<template>
  <div class="user">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      @keyup.enter.native="fetchData()"
    >
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button
          class="searchBtn"
          @click="handlerAdd"
          label="开通用户"
        ></bx-button>
      </el-form-item>

      <el-form-item label="用户名" prop="name">
        <el-input v-model="searchMap.uname"></el-input>
      </el-form-item>

      <el-form-item label="手机号" prop="umobile">
        <el-input v-model="searchMap.umobile"></el-input>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dateSearch"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button class="searchBtn btn-reset" @click="reset1()"
          >重置</el-button
        >
      </el-form-item>
      <el-form-item>
        <bx-button
          class="searchBtn"
          @click="fetchData()"
          label="查询"
        ></bx-button>
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
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        width="70"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="roleNames"
        label="角色名称"
        align="center"
      ></el-table-column>
      <el-table-column label="添加时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.insertTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="job" label="是否在职" align="center" width="120">
        <template slot-scope="scope">
          <img
            v-if="scope.row.job == false"
            @click="setJobUser(scope.row, 1)"
            src="@/assets/images/sys/button_zaizhi.png"
            alt
          />
          <img
            v-else
            @click="setJobUser(scope.row, 0)"
            src="@/assets/images/sys/button_lizhi.png"
          />
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="del" label="解锁" align="center" width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.del == false" class="iconfont iconbutton_jiesuo act-img-btn"></i>
          <i v-else class="iconfont iconbutton_suo act-img-btn" @click="recoverUser(scope.row)"></i>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="130"
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

    <pagination ref="pagination" :total="total"></pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      width="626px"
      @close="init"
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

      <add-user
        ref="myChild"
        @showbox="toshow"
        :parentmsg="pupotName"
        :userID="id"
      ></add-user>

      <div slot="footer" class="dialog-footer">
        <el-button class="reset" @click="resetForm()">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="updateDate()"
          label="确认"
        ></bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AddUser from "./AddUser";
import {
  getUsersList,
  setJobUser,
  delUser,
  recoverUser,
  getUserAndRoles,
} from "@/api/user";
import { dateFilter } from "@/filters";

export default {
  components: {
    AddUser,
  },
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      searchMap: {
        uname: "",
        umobile: "",
        insertTimeStart: "",
        insertTimeEnd: "",
      },
      dialogVisible: false,
      activeIndex: "1",
      radio: "0",
      pupotName: "开通账户",
      id: "",
      dateSearch: [],
      tableLoading: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    init() {
      this.$refs.myChild.set_init();   
    },
    fetchData() {
      this.tableLoading = true;
      getUsersList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.uname,
        this.searchMap.umobile,
        this.searchMap.insertTimeStart,
        this.searchMap.insertTimeEnd
      )
        .then((res) => {
          this.tableLoading = false;
          this.list = res.data.rows;
          this.total = res.data.total;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    clearInput() {
      this.reset1();
    },
    reset1() {
      this.searchMap = {
        uname: "",
        umobile: "",
        insertTimeStart: "",
        insertTimeEnd: "",
      };
      this.dateSearch = [];
    },
    // 修改用户在职信息
    // setJobUser(data, jobVal) {
    //   // let _jobVal = jobVal === 1 ? 0 : 1
    //   // 获取 list 下标，然后修改该 下标 元素的 job 值
    //   // let ind = this.list.findIndex(item => item.id === data.id)
    //   setJobUser({
    //     id: data.id, //	Integer	用户id
    //     isJob: jobVal, //	Integer	在职状态 0.离职 1.在职
    //     version: data.version //	Integer	版本
    //   }).then(res => {
    //     // console.log(this.list[ind])
    //     // this.list[ind].job = data.job === true ? false : true

    //     this.fetchData()
    //   })
    // },
    //恢复用户
    recoverUser(data) {
      recoverUser({
        id: Number(data.id),
        version: data.version,
      }).then((res) => {
        this.$message.success("恭喜你，用户恢复成功");
        this.fetchData();
      });
    },
    handlerAdd() {
      this.pupotName = "开通账户";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.myChild.add_getUserAndRoles();
      });
    },
    handlerEdit(data) {
      this.pupotName = "编辑账户";
      this.id = data.id;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.myChild.set_getUserAndRoles();
      });
    },
    resetForm() {
      this.init();
    },
    updateDate() {
      this.$refs.myChild.set_setUser();
    },
    handlerDelete(data) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser({
            id: Number(data.id),
            version: data.version,
          }).then((res) => {
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    toshow(msg) {
      this.dialogVisible = msg;
    },
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      if (newVal == false) {
        this.fetchData();
      }
    },
    dateSearch(val) {
      if (val) {
        this.searchMap.insertTimeStart = dateFilter(val[0].getTime());
        this.searchMap.insertTimeEnd = dateFilter(val[1].getTime());
      } else {
        this.searchMap.insertTimeStart = "";
        this.searchMap.insertTimeEnd = "";
      }
    },
  },
};
</script>

<style scoped>
.btn-reset {
  color: #333;
  background-color: #dddddd;
  margin-right: 0px;
}
</style>


