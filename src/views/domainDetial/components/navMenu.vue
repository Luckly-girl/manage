<template>
  <el-menu
    active-text-color="#4D71EE"
    class="_top_nav"
    :default-active="'record'"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item
      :index="navItem.name"
      v-for="navItem in list"
      :key="navItem.name"
      >{{ navItem.title }}</el-menu-item
    >
  </el-menu>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  data() {
    return {
      activeIndex: this.$route.name,
      redirect: 0,
    };
  },
  created() {
    // this.redirect = sessionStorage.getItem("redirect");
  },
  methods: {
    // :disabled="redirect == 1"
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
      // if (key == "security" && key == "more") {

      //   console.log(3333)
      // }
      this.$emit("change", key);
    },
  },
};
</script>
<style lang="stylus" scoped>
._top_nav {
  .el-menu-item {
    font-size: 16px;
    font-weight: 400;
    color: #020202 !important;
    height: 50px;
    line-height: 50px;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
}
</style>
