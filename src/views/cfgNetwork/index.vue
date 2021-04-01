<template>
  <div class="user">
    <el-form ref="searchForm" :inline="true">
      <el-form-item>
        <bx-button class="searchBtn" @click="handlerAdd" label="新增流量配置"></bx-button>
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
      <el-table-column prop="nodeName" label="节点名称" align="center"></el-table-column>
      <el-table-column prop="ip" label="节点IP" align="center"></el-table-column>
      <el-table-column prop="in" label="流入" align="center"></el-table-column>
      <el-table-column prop="out" label="流出" align="center"></el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime| dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row)"
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
          <el-menu-item index="1">{{ !editId ? '新增流量配置' : '编辑流量配置' }}</el-menu-item>
        </div>
      </el-menu>

      <div class="editRole">
        <el-form
          :rules="rules"
          ref="fromAddCfgForm"
          :model="fromAddCfg"
          label-width="70px"
          :inline="true"
          label-position="left"
        >
          <div>
            <el-row>
              <el-col>
                <el-form-item label="节点名称" prop="nodeId">
                  <el-select
                    v-model="fromAddCfg.nodeId"
                    filterable
                    placeholder="请选择节点名称"
                    :disabled="fromAddCfg.id!==''"
                  >
                    <el-option
                      v-for="(item, index) of nodeList"
                      :key="index"
                      :value="item.id"
                      :label="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="流入" prop="in">
                  <el-input v-model="fromAddCfg.in"></el-input>
                </el-form-item>
                <span class="unit">Kb</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="流出" prop="out">
                  <el-input v-model="fromAddCfg.out"></el-input>
                </el-form-item>
                <span class="unit">Kb</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="时间段" prop="dateSearch">
                  <el-date-picker
                    class="transparent-input"
                    v-model="fromAddCfg.dateSearch"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['12:00:00']"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-form-item label="角色描述" prop="descpt">
              <el-input type="textarea" v-model="fromAddRole.descpt"></el-input>
            </el-form-item> -->
          </div>
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
  insertCfgNetwork,
  getCfgData,
  updateCfgNetwork,
  delCfgNetwork
} from "@/api/cfgNetwork";

import {
  getAllNode
} from "@/api/product";
import { dateFilter } from "@/filters";

export default {
  data() {
    const numberRule = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/
      if (value === '') {
        callback(new Error("请输入自然数"));
      } else {
        if (value == 0) {
          callback();
        } else {
          if (!reg.test(value)) {
            callback(new Error("请输入自然数"));
          } else {
            callback();
          }
        }
      }
    }
    return {
      editId: "",
      tableLoading: false,
      dataList: [],
      total: 0, // 总记录数
      dialogVisible: false,
      activeIndex: "1",
      activeName: "first",
      nodeList: [],
      fromAddCfg: {
        id: '',
        nodeId: "",
        dateSearch: [],
        in: 0,
        out: 0,
        beginTime: '',
        endTime: ''
      },
      rules: {
        nodeId: [
          { required: true, message: "请选择节点", trigger: "change" }
        ],
        in: [
          { required: true, validator: numberRule, trigger: "blur" }
        ],
        out: [
          { required: true, validator: numberRule, trigger: "blur" }
        ],
        dateSearch: [
          { required: true, message: "请选择时间段", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  computed: {
    datePick() {
　　　return this.fromAddCfg.dateSearch
　　}
  },
  methods: {
    init() {
      this.fromAddCfg = {
        id: '',
        nodeId: "",
        in: 0,
        out: 0,
        dateSearch: [],
        beginTime: '',
        endTime: ''
      }
      this.nodeList = [];
      this.$refs["fromAddCfgForm"].resetFields();
    },

    fetchData() {
      this.tableLoading = true
      getCfgData(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        ''
      ).then(res => {
        this.tableLoading = false;
        this.dataList = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },
    getAllNode() {
      getAllNode("1").then(res => {
        this.nodeList = res.data.rows;
      });
    },

    Reset() {
      this.fromAddCfg = {
        id: '',
        nodeId: "",
        in: 0,
        out: 0,
        dateSearch: [],
        beginTime: '',
        endTime: ''
      }
      this.nodeList = [];
      this.$refs["fromAddCfgForm"].resetFields();
    },

    handlerDelete(data) {
      this.$confirm("此操作将永久删除该流量修改记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCfgNetwork(Number(data.id)).then(res => {
            this.fetchData();
            this.activeName = "first";
          });
        })
        .catch(() => {});
    },

    handlerAdd() {
      this.editId = "";
      this.nodeList = [];
      this.dialogVisible = true;
      this.getAllNode()
    },

    handlerEdit(data) {
      this.editId = data.id;
      this.nodeList = [];
      this.dialogVisible = true;
      this.getAllNode()
      this.fromAddCfg = {
        id: data.id,
        nodeId: data.nodeId,
        in: data.in,
        out: data.out,
        dateSearch: [new Date(data.beginTime), new Date(data.endTime)],
        beginTime: data.beginTime,
        endTime: data.endTime
      }
    },

    //编辑角色资料
    SET_setRole() {
      this.$refs["fromAddCfgForm"].validate(valid => {
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
      let _params = {
        nodeId: this.fromAddCfg.nodeId,
        in: Number(this.fromAddCfg.in),
        out: Number(this.fromAddCfg.out),
        beginTime: this.fromAddCfg.beginTime,
        endTime: this.fromAddCfg.endTime
      }
      insertCfgNetwork(_params).then(res => {
        this.fetchData();
        this.Reset();
        this.dialogVisible = false;
      });
    },

    editSub() {
      let _params = {
        id: this.fromAddCfg.id,
        nodeId: this.fromAddCfg.nodeId,
        in: Number(this.fromAddCfg.in),
        out: Number(this.fromAddCfg.out),
        beginTime: this.fromAddCfg.beginTime,
        endTime: this.fromAddCfg.endTime
      }
      updateCfgNetwork(_params).then(res => {
        this.fetchData();
        this.Reset();
        this.dialogVisible = false;
      });
    }
  },

  watch: {
    activeName(newVal, oldVal) {
      newVal == "second" ? this.Reset() : "";
    },
    datePick(val) {
      if (val&&val.length>0) {
        this.fromAddCfg.beginTime = val[0].getTime();
        this.fromAddCfg.endTime = val[1].getTime();
      } else {
        this.fromAddCfg.beginTime = "";
        this.fromAddCfg.endTime = "";
      }
    }
  }
};
</script>

<style scoped>
.unit{
  line-height: 36px;
  font-size: 18px;
}
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


