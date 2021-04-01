<template>
  <div class="production">
    <el-page-header @back="$router.go(-1)" content="提交反馈"></el-page-header>
    <el-form
      class="work-order-form"
      :model="workOrder"
      :rules="rules"
      ref="workOrderSubForm"
      :inline="true"
      label-width="120px"
      label-position="left">
      <el-row>
        <el-col>
          <el-form-item label="问题标题" prop="title">
            <el-input v-model="workOrder.title" placeholder="请选择问题标题" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="问题类型" prop="workType">
            <el-select
              v-model="workOrder.workType"
              placeholder="请选择问题类型"
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
              ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="dialog-footer">
        <el-button class="reset" @click="resetForm()">重置</el-button>
        <bx-button
          class="confirm"
          type="primary"
          @click="submitWorkOrder"
          label="提交"
        ></bx-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  workorderCreate
} from "@/api/workOrder";
export default {
  computed: {
    workTypeList () {
      return this.$store.state.workTypeList
    }
  },
  data() {
    return {
      workOrder: {
        title: '',
        content: "",
        workType: ""
      },
      rules: {
        title: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        content: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        workType: [{ required: true, message: "请选择问题类型", trigger: "change" }]
      }
    };
  },
  methods: {
    submitWorkOrder() {
      this.$refs["workOrderSubForm"].validate(valid => {
        if (valid) {
          workorderCreate(this.workOrder).then(res => {
            this.$router.replace('workOrderHistory')
          });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['workOrderSubForm'].resetFields()
      this.workOrder =  {
        title: '',
        content: "",
        workType: ""
      }
    }
  }
};
</script>

<style scoped>
.work-order-form{
  padding: 50px;
}
.work-order-form .el-row{
  margin-bottom: 20px;
}
.dialog-footer{
  margin-top: 100px;
}

</style>
