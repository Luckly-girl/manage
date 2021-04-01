<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :style="{'color': theme.backgroundColor,'borderLeft': `3px solid ${theme.backgroundColor}`}" class="navOne unCopy" :to="{ path: $route.path }">{{ $route.meta.navTitle }}</el-breadcrumb-item>
      <el-breadcrumb-item class="navTwo unCopy">{{ $route.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    computed: {
      theme () {
        return this.$store.state.theme
      }
    }
  }
</script>

<style>
.el-breadcrumb {
  height: 22px;
  line-height: 22px;
  padding-bottom: 25px;
}
.el-breadcrumb .navOne {
  font-size: 16px;
  padding-left: 15px;
}
.el-breadcrumb .navTwo {
  font-size: 14px;
  line-height: 21px;
}
.el-breadcrumb .el-breadcrumb__inner {
  font-weight: 550;
}
</style>

