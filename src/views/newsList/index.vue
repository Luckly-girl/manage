<template>
  <div class="site">
    <el-form ref="searchForm" :inline="true">
      <!-- <el-form-item v-if="btnAuthority($route.path, 0)"> -->
      <el-form-item>
        <bx-button class="searchBtn" type="text" @click="handlerAdd" label="添加产品"></bx-button>
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
      <el-table-column prop="title" label="新闻标题" align="center" min-width="200"></el-table-column>
      <el-table-column prop="describeInfo" label="新闻简介" align="center" min-width="500"></el-table-column>
      <el-table-column label="创建时间" align="center" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="130"
        fixed="right"
      >
        <template slot-scope="scope">
          <i
            class="iconfont iconbutton_edit act-img-btn"
            @click="handlerEdit(scope.row.id)"
          ></i>
          <i
            class="iconfont iconbutton_delete act-img-btn"
            @click="handlerDelete(scope.row.id)"
          ></i>
      <!-- <el-table-column
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
          ></i> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination ref="pagination" :total="total"></pagination>
    <el-dialog :visible.sync="dialogVisible" width="1000px" @closed="init()" :close-on-click-modal="false" class="news-dialog">
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :active-text-color="theme.backgroundColor">
        <div class="add" v-if="addClick">
          <el-menu-item index="1">增加新闻</el-menu-item>
        </div>
        <div class="edit" :class="[showTabPart?'add':'']" v-else>
          <el-menu-item index="1" v-if="!showTabPart">编辑新闻</el-menu-item>
          <el-menu-item index="2" v-if="!showTabPart && btnAuthority($route.path, 3)">产品分配</el-menu-item>
        </div>
      </el-menu>

      <el-form
        v-if="activeIndex == 1"
        :model="newsInfo"
        :rules="rules"
        ref="newsInfo"
        label-width="65px"
        label-position="left"
      >
        <el-form-item label="新闻标题" label-width="105px" prop="title">
          <el-input
            v-model="newsInfo.title"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item label="新闻简介" label-width="105px" prop="describe">
          <el-input
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="newsInfo.describeInfo"
          ></el-input>
        </el-form-item>
        <Tinymce ref="editor" v-model="newsInfo.newsText"></Tinymce>
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

      <div slot="footer" class="dialog-footer" v-if="activeIndex == 1">
        <el-button class="reset" @click="resetForm()">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="!id ? submitAdd() : submitEdit()"
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
  newsCenterList,
  delNewsCenter,
  addNewsCenter,
  updateNewsCenter,
  getDetailNewsCenter
} from "@/api/news";
import { dateFilter } from "@/filters";
import Tinymce from "@/components/Tinymce";
export default {
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  },
  components: {
    Tinymce
  },
  data() {
    return {
      addClick: true,
      list: [],
      total: 0, // 总记录数
      showTabPart: false, // 查看节点信息展示部分
      newsInfo: {
        describeInfo: '',
        newsText: '',
        title: ''
      },
      tableLoading: false,
      dialogVisible: false,
      activeIndex: "1",
      rules: {
      },
      id: "",
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
    handleChange (node) {
      this.pgNumCode = distributionDepartment(this.testNode, node, this.pgNumCode)
      this.testNode = this.pgNumCode
    },
    init() {
      this.newsInfo = {
        describe: '',
        newsText: '',
        title: ''
      }
      this.showTabPart = false;
      if (this.activeIndex == 1) {
        this.$refs["newsInfo"].resetFields();
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
      newsCenterList(
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize
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
      if (this.$refs.editor) {
        this.$refs.editor.setContent('')
      }
    },
    submitAdd() {
      this.$refs["newsInfo"].validate(valid => {
        if (valid) {
          addNewsCenter(this.newsInfo).then(res => {
            this.fetchData();
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    submitEdit() {
      this.$refs["newsInfo"].validate(valid => {
        if (valid) {
          updateNewsCenter({
            id: this.id,
            ...this.newsInfo
          }).then(res => {
            this.fetchData();
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['newsInfo'].resetFields()
    },
    // 获取 分配人员 选择项内容
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
        // this.options = res.data[0].child;
      });
    },
    getDetailNewsCenter(id) {
      getDetailNewsCenter(id).then(res => {
        this.newsInfo = res.data;
        this.$refs.editor.setContent(res.data.newsText)
      });
    },
    handlerEdit(id) {
      this.id = id;
      this.dialogVisible = true;
      this.addClick = false;

      // 返回第一个 tab导航 并置空
      this.handleSelect("1");
      this.$nextTick(() => {
        this.getDetailNewsCenter(id)
      });
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
      this.$confirm("此操作将永久删除该新闻, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delNewsCenter(id).then(res => {
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
