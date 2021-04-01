<template>
  <div class="production">
    <el-form ref="searchForm" :inline="true" :model="searchMap" @submit.native.prevent>
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
      class="mt-18"
      :data="list"
      v-loading="tableLoading"
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
        min-width="80"
        fixed="right"
      >
        <template slot-scope="scope"> 
          <i
            class="iconfont iconbutton_check act-img-btn"
            @click="handlerEdit(scope.row)"
          ></i>
        </template>
      </el-table-column>
    </el-table> 

    <pagination ref="pagination" :total="total"></pagination>

    <el-dialog :visible.sync="dialogVisible" width="826px" @closed="init" :close-on-click-modal="false">
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
        <el-row>
          <el-col>
            <el-form-item label="反馈备注" prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入反馈备注"
                v-model="workOrder.remark"
                :readonly="workOrder.status==1"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-footer">
          <!-- <el-button class="reset" @click="resetForm()">重置</el-button> -->
          <bx-button
            class="confirm"
            type="primary"
            @click="updateStatus"
            :label="workOrder.status==1?'已解决':'提交'"
            :disabled="workOrder.status==1"
          ></bx-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllWorkOrderList,
  updateStatus
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
        content: '',
        workType: '',
        remark: ''
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
      this.workOrder.remark = ''
      this.workOrder = {
        title: '',
        content: '',
        workType: '',
        remark: ''
      }
    },
    fetchData() {
      this.tableLoading = true
      getAllWorkOrderList(
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
    updateStatus() {
      updateStatus({
        id: this.workOrder.id,
        remark: this.workOrder.remark,
        status: 1
      }).then(res => {
        this.dialogVisible = false
        this.fetchData()
      })
    }
  }
};
</script>

<style scoped>
.searchMap-from{
  margin-top:30px;
}

.el-dialog .el-form {
  padding: 32px 40px 0;
}

.el-dialog .el-form-item {
  margin: 0 0 32px;
}

.dialog-footer{
  padding: 50px 0;
}
.el-button.confirm{
  margin-left: 0;
}
.el-button.confirm.is-disabled{
  background: #ccc!important;
  border-color: #ccc!important;
}
</style>
