<template>
  <div class="select">
    <span class="label">分配组织架构</span>
    <el-cascader
      v-model="pgNumCode"
      :options="options"
      collapse-tags
      clearable
      filterable
      :props="{ multiple: true, expandTrigger: 'hover', label:'name', children:'child', value:'numCode', checkStrictly: true}"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>

import { getPowerGroup } from "@/api/user.js";
import { getRouterId, distributionDepartment } from "@/utils/filter.js";
import { getAllocationPowerData } from "@/api/auth.js";

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      options: [], // 级联选择框 分配组织机构
      pgNumCode: [],  // 分配组织架构 结果
      testNode: []
    }
  },
  mounted () {
    this.getPowerGroup()
    this.getAllocationPowerData()
  },
  methods: {
    // 获取组织架构分配人员
    getPowerGroup() {
      getPowerGroup("", 2).then(res => {
        this.options = res.data;
      });
    },

    // 点击编辑回显 分配组织架构
    getAllocationPowerData() {
      getAllocationPowerData(this.id, getRouterId(this.$route.path)).then(
        res => {
          this.pgNumCode = res.data;
        }
      );
    },
    handleChange(node) {
      this.pgNumCode = distributionDepartment(
        this.testNode,
        node,
        this.pgNumCode
      );
      this.testNode = this.pgNumCode;
    },
  }
  
}
</script>