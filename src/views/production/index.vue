<template>
  <div class="production">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
      <el-form-item v-if="btnAuthority($route.path, 0)">
        <bx-button class="searchBtn" type="text" @click="handlerAdd" label="添加产品"></bx-button>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.productName"
          placeholder="请输入产品名称"
        />
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
    >
      <el-table-column prop="productName" label="名称" align="center"></el-table-column>
      <el-table-column prop="area" label="区域" align="center"></el-table-column>
      <el-table-column prop="productGroup" label="产品分组" align="center"></el-table-column>
      <el-table-column prop="price" label="价格" align="center"></el-table-column>
      <el-table-column prop="domin.domin" label="DNS解析域名" align="center"></el-table-column>
      <el-table-column label="节点信息" align="center">
        <template slot-scope="scope">
          <span class="table-node-info pointer" @click="checkedClick(scope.row.id)">查看</span>
        </template>
      </el-table-column>
      <el-table-column label="站点信息" align="center">
        <template slot-scope="scope">
          <span class="table-node-info pointer" @click="checkedSiteClick(scope.row.id)">{{scope.row.nginxCount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isFilebeat" label="日志采集" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isFilebeat===2" style="color: #ffae00;">切换中</span>
          <el-switch
            v-else
            class="product-switch"
            v-model="scope.row.isFilebeat"
            :active-value="1"
            :inactive-value="0"
            :active-color="theme.backgroundColor"
            disabled
            @click.native="changeSwitch(scope.row.id, scope.row.isFilebeat, scope.$index)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
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
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
    <el-dialog :visible.sync="dialogVisibleNginx" width="626px" :close-on-click-modal="false" @closed="nginxList=[]">
      <div style="padding: 0px 40px 20px;">
        <el-table
          :data="nginxList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '50px' }"
          :row-style="{ height: '45px' }"
          stripe
        >
          <el-table-column label="站点信息" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="$router.push({path: '/site', query: {id: scope.row.id}})">{{scope.row.remark}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="826px" @closed="init()" :close-on-click-modal="false">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :active-text-color="theme.backgroundColor">
        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加产品</el-menu-item>
        </div>
        <div class="edit" :class="[showTabPart?'add':'']" v-else>
          <el-menu-item index="1" v-if="!showTabPart">编辑产品</el-menu-item>
          <el-menu-item index="2" v-if="!showTabPart && btnAuthority($route.path, 3)">产品分配</el-menu-item>
          <el-menu-item index="3">节点信息</el-menu-item>
        </div>
      </el-menu>

      <el-form
        v-if="activeIndex == 1"
        :model="addProductionForm"
        :rules="rules"
        ref="addProductionForm"
        :inline="true"
        label-width="65px"
        label-position="left"
      >
        <div class="list-product form-flex">
          <el-form-item label="名称" prop="productName">
            <el-input v-model="addProductionForm.productName"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="addProductionForm.price"></el-input>
          </el-form-item>
          <el-form-item label="区域" prop="area">
            <el-input v-model="addProductionForm.area"></el-input>
          </el-form-item>
          <el-form-item label="分组" prop="productGroup">
            <el-input v-model="addProductionForm.productGroup"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="DNS解析" prop="dominId">
          <el-select v-model="addProductionForm.dominId" filterable clearable placeholder="请选择DNS解析">
            <el-option
              v-for="(item) in domin"
              :key="item.dominId"
              :value="item.dominId"
              :label="item.dominName"
              :disabled="item.type==0"
            ></el-option>
          </el-select>
          <span class="font-tail">不选择会使用默认DNS解析</span>
        </el-form-item>

        <div v-for="(item, index) in addProductionForm.nodeIds" :key="index">
          <div class="normalinner">
            <el-row>
              <el-col :span="7">
                <el-form-item label="产品节点" :prop="'nodeIds.' + index +'.nodeId'" :rules="rules.nodeId">
                  <el-select
                    v-model="item.nodeId"
                    placeholder="请选择节点"
                    filterable
                    @change="productNodeIdChange(item.nodeId, index)"
                  >
                    <el-option v-for="nodeId in nodeList" :key="nodeId.id" :label="nodeId.value" :value="nodeId.id" :disabled="nodeId.type==0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="节点类型" :prop="'nodeIds.' + index +'.type'">
                  <el-select
                    v-model="item.type" @change="productTypeChange(item.type, item.nodeId)" filterable>
                    <el-option v-for="typeItem in productType" :key="typeItem.code" :label="typeItem.type" :value="typeItem.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="线路类型" :prop="'nodeIds.' + index +'.recordLine'" :rules="rules.recordLine">
                  <el-select
                    v-model="item.recordLine">
                    <el-option v-for="(recordLine,i) in recordLineList" :key="i" :label="recordLine" :value="i"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <div class="add-del-ico">
                  <i class="el-icon-circle-plus-outline" v-if="index==0" @click="addNode"></i>
                  <i class="el-icon-delete" v-if="addProductionForm.nodeIds.length>1" @click="delNode(index)"></i>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
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

      <div class="node-info" v-else>
        <el-table
          :data="nodeInfoList"
          :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
          :header-row-style="{ height: '45px' }"
          :row-style="{ height: '40px' }"
          stripe
        >
          <el-table-column prop="name" label="产品节点" align="center"></el-table-column>
          <el-table-column label="节点类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | productTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recordLine" label="线路" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.recordLine | recordLineFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="host" label="节点IP" align="center"></el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="resetForm()">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="addProductionForm.id === null ? submitAdd() : submitEdit()"
          label="提交"
        ></bx-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else-if="activeIndex == 2">
        <bx-button class="save" type="primary" @click="submitSave" label="保存"></bx-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addProductNew,
  openFilebeat,
  getProductList1,
  getProductInfo,
  getAllDomin,
  getAllNode,
  getNginxNodeByProductId,
  delProduct,
  getNodesNew,
  getDomainList,
  getNginxListByProductId
} from "@/api/product";
import { getPowerGroup } from "@/api/user.js";
import { allocationPowerData, getAllocationPowerData } from "@/api/auth.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import { toCascadeSelectorFormat } from "@/utils/pub.js";
import valid from "@/utils/validcode.js";
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    recordLineList () {
      return this.$store.state.recordLineList
    },
    productType () {
      return this.$store.state.productType
    }
  },
  data() {
    const nodeIdRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择节点"));
      } else {
        if (this.addProductionForm.nodeIds.length < 2) {
          callback();
        } else {
          let _thisIndex = Number(rule.field.split(".")[1]);
          let _arr = this.addProductionForm.nodeIds.filter(item => {
            return (
              item.nodeId === value &&
              item.recordLine ===
                this.addProductionForm.nodeIds[_thisIndex].recordLine
            );
          });
          if (_arr.length > 1) {
            callback(new Error("请勿选择重复节点"));
          } else {
            callback();
          }
        }
      }
    };
    const recordLineRule = (rule, value, callback) => {
      let _fields = this.$refs["addProductionForm"].fields;
      let _field = JSON.parse(JSON.stringify(rule.field.split(".")));
      let _thisIndex = Number(_field[1]);
      _field.splice(2, 1, "nodeId");
      let _arr = this.addProductionForm.nodeIds.filter(item => {
        return (
          item.nodeId === this.addProductionForm.nodeIds[_thisIndex].nodeId &&
          item.recordLine ===
            this.addProductionForm.nodeIds[_thisIndex].recordLine
        );
      });
      if (_arr.length > 1) {
        this.$refs["addProductionForm"].validateField(_field.join("."));
        callback();
      } else {
        _fields.map(i => {
          if (i.prop === _field.join(".")) {
            i.clearValidate();
            return false;
          }
        });
        callback();
      }
    };
    const userName = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9]/;
      if (value === '') {
        callback(new Error("必填项不能为空"))
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入英文及数字"));
        } else {
          callback();
        }
      }
    };
    return {
      list: [],
      total: 0, // 总记录数
      showTabPart: false, // 查看节点信息展示部分
      searchMap: {
        productName: ""
      },
      tableLoading: false,
      dialogVisible: false,
      dialogVisibleNginx: false,
      activeIndex: "1",
      addProductionForm: {
        id: null,
        productName: "",
        area: "",
        price: "",
        productGroup: "",
        dominId: "",
        nodeIds: [{
          nodeId: '',
          type: 1,
          recordLine: 0
        }]
      },
      rules: {
        productName: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.nameEmptyValue, trigger: "blur" }
        ],
        area: [{ required: true, validator: userName, trigger: "blur" }],
        price: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: valid.validcodeFloat, trigger: "blur" }
        ],
        productGroup: [
          { required: true, validator: userName, trigger: "blur" }
        ],
        nodeId: [{ required: true, validator: nodeIdRule, trigger: "change" }],
        recordLine: [{ validator: recordLineRule, trigger: "change" }]
      },
      domin: [], // 选择 DNS 解析
      nodeList: [], // 节点 集合
      addClick: false, // 添加: true  编辑: false
      options: [], // 分配人员名单
      users: [],
      id: "",
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
    productTypeChange (type, nodeId) {
      if (!nodeId || this.addProductionForm.nodeIds.length < 2) {
        return
      } else {
        let _arr = this.addProductionForm.nodeIds.filter(item => {
          return item.nodeId === nodeId
        })
        _arr.forEach(item => {
          item.type = type
        })
      }
    },
    productNodeIdChange (nodeId, i) {
      if (!nodeId || this.addProductionForm.nodeIds.length < 2) {
        return
      } else {
        let _arr = this.addProductionForm.nodeIds.filter((item,index) => {
          return item.nodeId === nodeId && index !==i
        })
        let _newArr = this.addProductionForm.nodeIds.filter(item => {
          return item.nodeId === nodeId
        })
        if (_arr.length > 0) {
          _newArr.forEach(item => {
            item.type = _arr[0].type
          })
        }
      }
    },
    handleChange (node) {
      this.pgNumCode = distributionDepartment(this.testNode, node, this.pgNumCode)
      this.testNode = this.pgNumCode
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
      this.addProductionForm = {
        id: null,
        productName: "",
        area: "",
        price: "",
        productGroup: "",
        dominId: "",
        nodeIds: [
          {
            nodeId: "",
            recordLine: 0
          }
        ]
      };
      this.showTabPart = false;
      if (this.activeIndex == 1) {
        this.$refs["addProductionForm"].resetFields();
      }
      this.testNode = [];
      this.nodeInfoList = [];
      this.id = "";
    },
    clearInput() {
      this.searchMap.productName = "";
    },
    fetchData() {
      this.tableLoading = true
      getProductList1(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.productName
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

      // 获取 DNS解析 选择框内容
      this.getAllDomin();

      // 获取 节点列表 选择款内容
      this.getAllNode();
    },
    submitAdd() {
      this.$refs["addProductionForm"].validate(valid => {
        if (valid) {
          addProductNew({
            productName: this.addProductionForm.productName,
            area: this.addProductionForm.area,
            productGroup: this.addProductionForm.productGroup,
            price: this.addProductionForm.price,
            nodeIds: this.addProductionForm.nodeIds,
            dominId: this.addProductionForm.dominId
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
      this.$refs["addProductionForm"].validate(valid => {
        if (valid) {
          addProductNew({
            id: this.addProductionForm.id,
            productName: this.addProductionForm.productName,
            area: this.addProductionForm.area,
            productGroup: this.addProductionForm.productGroup,
            price: this.addProductionForm.price,
            nodeIds: this.addProductionForm.nodeIds,
            dominId: this.addProductionForm.dominId
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
    resetForm() {
      this.$refs['addProductionForm'].resetFields()
      this.addProductionForm.nodeIds = [{
        nodeId: '',
        type: 1,
        recordLine: 0
      }]
    },
    addNode() {
      this.addProductionForm.nodeIds.push({
        nodeId: '',
        type: 1,
        recordLine: 0
      });
    },
    delNode(index) {
      this.addProductionForm.nodeIds.splice(index, 1);
    },
    checkedClick(id) {
      this.showTabPart = true;
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;
      this.handleSelect("3");
      this.getNginxNodeByProductId(id);
    },
    checkedSiteClick(id) {
      this.dialogVisibleNginx = true;
      this.getNginxListByProductId(id)
    },
    getAllDomin() {
      getAllDomin("1").then(res => {
        this.domin = res.data.rows;
      });
    },
    getDomainList(id) {
      getDomainList(id).then(res => {
        this.domin = res.data;
      });
    },
    getNodesNew(id) {
      getNodesNew(id).then(res => {
        this.nodeList = res.data;
      });
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
    getProductInfo(id) {
      getProductInfo(id).then(res => {
        this.addProductionForm.id = res.data.id;
        this.addProductionForm.nodeIds = res.data.nodeIds;
        this.addProductionForm.productName = res.data.productName;
        this.addProductionForm.area = res.data.area;
        this.addProductionForm.price = res.data.price;
        this.addProductionForm.productGroup = res.data.productGroup;
        this.addProductionForm.dominId = res.data.dominId;
      });
    },
    getNginxNodeByProductId(id) {
      getNginxNodeByProductId(id).then(res => {
        this.nodeInfoList = res.data.rows;
      });
    },
    getNginxListByProductId(id) {
      getNginxListByProductId(id).then(res => {
        this.nginxList = res.data.rows;
      });
    },
    handlerEdit(id) {
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;

      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.$refs["addProductionForm"].resetFields();
      });

      // 获取 DNS解析 选择框内容
      this.getDomainList(id);

      // 获取 节点列表 选择项内容
      this.getNodesNew(id);

      // 回显数据
      this.getProductInfo(id);

      // 回显节点信息
      this.getNginxNodeByProductId(id);
    },
    // 保存节点分配人员信息
    submitSave() {
      // 返回code字符串 （最后一个元素，用逗号分割）
      let _pgNumCode = this.pgNumCode.map(ele => ele[ele.length - 1]).join(",");
      allocationPowerData(
        _pgNumCode,
        this.id,
        getRouterId(this.$route.path)
      ).then(res => {
        this.dialogVisible = false;
      });
    },
    handlerDelete(id) {
      this.$confirm("此操作将永久删除该产品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delProduct(id).then(res => {
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
.el-menu-item {
  width: 208px;
}

.el-dialog .el-form {
  padding: 32px 40px 0;
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
}
.form-flex .el-form-item{
  margin-right: 50px;
}

</style>


<style>
/* 弹框里， 两列输入框 */
.production .el-dialog .list-product .el-input__inner {
  width: 240px;
}
.normalinner .el-form-item__content {
  width: 65% !important;
}
.normalinner .el-select {
  width: 100% !important;
}
</style>
