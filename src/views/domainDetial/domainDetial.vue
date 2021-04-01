<template>
  <div class="siteBase">
    <div class="_top_back" @click="$router.go(-1)">
      <img src="../../assets/images/DNS/go.png" />
      <span>{{ tname }}</span>
    </div>
    <nav-Menu @change="component = $event" :list="navList"></nav-Menu>
    <!-- <router-view></router-view> -->
    <!-- <keep-alive> -->
    <component :is="component" :id="Number(id)" :tname="tname"></component>
    <!-- </keep-alive> -->
  </div>
</template>
<script>
import navMenu from "./components/navMenu";
import navList from "./components/navList";
import record from "./record/record";
import resolve from "./resolve/resolve";
import operLog from "./operLog/operLog";
// import { getNavList } from "@/api/site";
export default {
  components: {
    navMenu,
    record,
    resolve,
    operLog,
  },
  data() {
    return {
      navList: navList,
      component: "record",
      tname: "",
      id: 0,
    };
  },
  created() {
    this.tname = this.$route.query.data;
    this.id = this.$route.query.id;
    // console.log(typeof this.id, 1111);
  },
};
</script>
<style lang="stylus" scoped>
.siteBase {
  min-width: 900px;

  ._top_back {
    width: 90px;
    display: flex;
    justify-content: left;
    align-self: center;
    margin-bottom: 35px;
    color: #020202;
    cursor: pointer;

    img {
      width: 10px;
      height: 15px;
    }

    span {
      font-size: 16px;
      font-weight: 700;
      padding-left: 15px;
    }
  }
}
</style>
