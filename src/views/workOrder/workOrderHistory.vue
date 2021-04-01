<template>
  <div class="production">
    <el-page-header @back="$router.go(-1)" content="历史反馈"></el-page-header>
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent class="searchMap-from">
      <el-form-item label="标题" prop="host">
        <i class="icon-search pointer" @click="fetchData"></i>
        <input
          maxlength="27"
          class="input"
          @keyup.enter="fetchData"
          v-model="searchMap.title"
          placeholder="请输入标题"
        />
      </el-form-item>
    </el-form>
    <el-table
      v-loading="tableLoading"
      class="mt-18"
      :data="list"
      :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
      :header-row-style="{ height: '60px' }"
      :row-style="{ height: '56px' }"
      stripe
    >
      <el-table-column prop="workId" label="反馈编号" align="center" min-width="150"></el-table-column>
      <el-table-column prop="title" label="问题标题" align="center" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="问题类型" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.workType | workTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="提交帐号" align="center"></el-table-column>
      <el-table-column label="提交时间" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | workStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="100"
        fixed="right"
      >
        <template slot-scope="scope"> 
          <i
            class="iconfont iconbutton_check act-img-btn"
            @click="handlerEdit(scope.row)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
    </el-table> 

    <pagination ref="pagination" :total="total"></pagination>

    <el-dialog :visible.sync="dialogVisible" width="826px" @closed="init()" :close-on-click-modal="false">
      <el-menu :default-active="activeIndex" mode="horizontal" :active-text-color="theme.backgroundColor">
        <div class="add">
          <el-menu-item index="1">反馈详情</el-menu-item>
        </div>
      </el-menu>

      <el-form
        class="work-order-form"
        :model="workOrder"
        ref="workOrderSubForm"
        :inline="true"
        label-width="70px"
        label-position="left"
      >
        <el-row>
          <el-col>
            <el-form-item label="问题标题" prop="title">
              <el-input v-model="workOrder.title" placeholder="请选择问题标题" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="问题类型" prop="workType">
              <el-select
                v-model="workOrder.workType"
                placeholder="请选择问题类型"
                disabled
              >
                <el-option v-for="(item,index) in workTypeList" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="问题详情" prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入问题详情"
                v-model="workOrder.content"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWorkOrderList,
  delWorkOrder
} from "@/api/workOrder";
export default {
  computed: {
    workTypeList () {
      return this.$store.state.workTypeList
    },
    theme () {
      return this.$store.state.theme
    }
  },
  data() {
    return {
      list: [],
      searchMap: {
        title: ''
      },
      workOrder: {
        title: '',
        content: "",
        workType: ""
      },
      total: 0, // 总记录数
      dialogVisible: false,
      tableLoading: false,
      activeIndex: "1"
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  methods: {
    init() {
      this.workOrder = {
        title: '',
        content: "",
        workType: ""
      }
    },
    fetchData() {
      this.tableLoading = true
      getWorkOrderList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.title
      ).then(res => {
        this.tableLoading = false;
        this.list = res.data.rows;
        this.total = res.data.total;
      }).catch(err => {
        this.tableLoading = false;
      });
    },
    handlerEdit(item) {
      this.dialogVisible = true;
      this.workOrder = item
    },
    handlerDelete(id) {
      this.$confirm("此操作将永久删除该历史反馈, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delWorkOrder(id).then(res => {
          this.fetchData();
        });
      })
      .catch(() => {});
    }
  }
};
</script>

<style scoped>
.searchMap-from{
  margin-top:30px;
}
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

.table-node-info {
  color: #4d71ee;
  border-bottom: 1px solid #4d71ee;
  padding-bottom: 3px;
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
