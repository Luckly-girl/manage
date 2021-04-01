<template>
  <div class="navbar" :style="{ backgroundColor: theme.backgroundColor }">
    <div class="navbar-bg">
      <el-scrollbar
        class="default-scrollbar"
        wrap-class="default-scrollbar__wrap"
        view-class="default-scrollbar__view"
      >
        <div class="logo" @click="$router.push('home')">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <!-- :router="true" 表示开启路由模式，开启之后，index值代表路由地址 -->
        <el-menu
          :router="true"
          class="nav-menu"
          :default-active="$route.path"
          :background-color="theme.backgroundColor"
          :text-color="theme.color"
          :active-text-color="theme.color"
          :unique-opened="true"
        >
          <el-submenu
            :index="index + ''"
            v-for="(parent, index) in parentsList"
            :key="index"
          >
            <template slot="title">
              <item
                :addclass="'font-nav'"
                v-if="parent"
                :icon="parent.icon"
                disIcon="true"
                :title="parent.name"
              />
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="`/${child.page}`"
                v-for="(child, i) in parent.child"
                :key="i"
              >
                <item
                  v-if="child"
                  :icon="child.icon"
                  disIcon="true"
                  :title="child.name"
                />
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
      <div class="pro-version">
        <span>{{ versionInfo.versionNum }}</span>
        <el-popover
          v-if="versionInfo.versionCount.nodeUpdatingCount != 0"
          placement="top"
          title
          width="150"
          trigger="hover"
        >
          <div class="nav-update-list">
            <p>
              <span>总节点：</span
              ><span>{{ versionInfo.versionCount.nodeCount }}个</span>
            </p>
            <p>
              <span>失败节点：</span
              ><span>{{ versionInfo.versionCount.nodeErrorCount }}个</span>
            </p>
            <p>
              <span>成功节点：</span
              ><span>{{ versionInfo.versionCount.nodeSuccessCount }}个</span>
            </p>
            <p>
              <span>更新中节点：</span
              ><span>{{ versionInfo.versionCount.nodeUpdatingCount }}个</span>
            </p>
          </div>
          <div slot="reference">
            <div class="update-btn updateing">更新中</div>
          </div>
        </el-popover>
        <div
          class="update-btn"
          v-if="
            versionInfo.updateFlag == 1 &&
              versionInfo.versionCount.nodeUpdatingCount == 0
          "
          @click="versionUpdate"
        >
          更新
        </div>
        <!-- <div class="update-btn" @click="versionUpdate">更新</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Item from "./Item";
import { versionUpdate } from "@/api/login";
import { baseBus } from "@/utils/filter";
export default {
  components: { Item },
  data() {
    return {
      active: "tab0", // 默认路由
      bgColor: "#4d71ee", // 背景色
      textColor: "#fff", // 文字颜色
      activeTextColor: "#fff", // 点击后文字颜色
      // list: {
      //   1: [
      //     "/layout/nodeList",
      //     "/layout/production",
      //     "/layout/site",
      //     "/layout/siteDetection",
      //     "/layout/DNS",
      //     "/layout/security",
      //     "/layout/transferRecord",
      //     "/layout/logStorageRecord",
      //   ],
      //   2: [
      //     "/layout/user",
      //     "/layout/role",
      //     "/layout/permission",
      //     "/layout/operLog",
      //   ],
      //   3: ["/layout/personalDetails"],
      // },
      ac_index: "1",
    };
  },
  created() {
    // this.active = this.$route.path;
  },
  mounted() {
    baseBus("versionNum", () => {
      this.getVersionNum();
    });
    if (localStorage.getItem("theme")) {
      let _index = Number(localStorage.getItem("theme"));
      // console.log(_index,4444)
      this.$store.commit("SET_THEME", this.themeList[_index]);
    }
    this.getVersionNum();
  },
  methods: {
    getVersionNum() {
      this.$store.dispatch("GetVersion");
    },
    versionUpdate() {
      versionUpdate().then((res) => {
        this.getVersionNum();
      });
    },
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath, 55555);
    // },
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    // index() {
    //   for (let [index, item] of Object.entries(this.list)) {
    //     if (item.includes(this.$route.path)) {
    //       return index;
    //     }
    //   }
    // },
    theme() {
      return this.$store.state.theme;
    },
    themeList() {
      return this.$store.state.themeList;
    },
    versionInfo() {
      return this.$store.getters.getVersion;
    },
    parentsList() {
      return this.$store.state.roles;
    },
  },
  watch: {},
};
</script>

<style scoped>
.nav-update-list p {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.navbar {
  line-height: 50px;
  height: 100%;
  width: 210px;
  background-color: #4d71ee;
}
.navbar-bg {
  position: relative;
  height: 100%;
  width: 100%;
  padding-bottom: 64px;
  box-sizing: border-box;
}
.navbar .logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.pro-version {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
  font-size: 14px;
}
.pro-version span,
.pro-version .update-btn {
  line-height: 24px;
}
.pro-version div {
  display: flex;
}
.pro-version .update-btn {
  width: 48px;
  justify-content: center;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  font-size: 12px;
}
.pro-version .update-btn.updateing {
  background: #e8db08;
  color: #888;
}
.navbar .el-menu {
  border-right: 0;
}
.navbar .el-menu-item-group__title {
  padding: 0;
}
.navbar .el-submenu .el-menu-item {
  padding: 0px;
  height: 60px;
  line-height: 60px;
  font-family: Microsoft YaHei;
  font-size: 14px;
}
.navbar .icon-nav {
  padding-right: 12px;
}
.navbar .font-nav {
  font-family: Microsoft YaHei;
  font-size: 16px;
}
.navbar .navColor {
  color: #05ffd3;
}
.navbar .activeClass {
  width: 4px;
  height: 100%;
  background: #05ffd3;
  position: absolute;
  left: 0;
}
.navbar .nav-title {
  padding-left: 7px;
}
</style>
