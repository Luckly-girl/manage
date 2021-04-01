<template>
  <div
    :class="[
      $route.path == '/batch' ? 'app-container_a' : 'app-container',
      $route.path == '/batch/addRecord' ? 'app-container_a' : 'app-container',
      $route.path == '/batch/editRecord' ? 'app-container_a' : 'app-container',
      $route.path == '/batch/operateLog' ? 'app-container_a' : 'app-container',
      $route.path == '/batch/operateLog/operDomain'
        ? 'app-container_a'
        : 'app-container',
      $route.path == '/batch/operateLog/operRecord'
        ? 'app-container_a'
        : 'app-container',
    ]"
  >
    <el-scrollbar
      class="default-scrollbar"
      wrap-class="default-scrollbar__wrap"
      view-class="default-scrollbar__view"
    >
      <el-backtop target=".default-scrollbar .el-scrollbar__wrap" :bottom="60">
        <i class="el-icon-caret-top"></i>
      </el-backtop>
      <main-banner v-if="$route.path === '/personalDetails'"></main-banner>
      <div
        ref="main"
        :class="[
          $route.path == '/home' ? 'bg-tran' : '',
          $route.path == '/batch' ? 'mActive' : 'main',
          $route.path == '/batch/addRecord' ? 'mActive' : 'main',
          $route.path == '/batch/editRecord' ? 'mActive' : 'main',
          $route.path == '/batch/operateLog' ? 'mActive' : 'main',
          $route.path == '/batch/operateLog/operDomain' ? 'mActive' : 'main',
          $route.path == '/batch/operateLog/operRecord' ? 'mActive' : 'main',
        ]"
      >
        <app-link
          v-if="
            $route.path !== '/home' &&
            $route.path !== '/workOrderHistory' &&
            $route.path !== '/workOrderSub' &&
            $route.path !== '/domainDetial' &&
            $route.path !== '/batch' &&
            $route.path !== '/batch/addRecord' &&
            $route.path !== '/batch/editRecord' &&
            $route.path !== '/batch/operateLog' &&
            $route.path !== '/batch/operateLog/operDomain' &&
            $route.path !== '/batch/operateLog/operRecord'
          "
        ></app-link>
        <router-view></router-view>
      </div>
    </el-scrollbar>
    <msg-list></msg-list>
  </div>
</template>

<script>
import AppLink from "./Link";
import MainBanner from "./Banner";
import msgList from "@/components/msgList";
export default {
  components: {
    AppLink,
    MainBanner,
    msgList,
  },
};
</script>

<style scoped>
.app-container {
  height: 100%;
  padding-top: 40px;
  width: 100%;
  min-width: 1190px;
  box-sizing: border-box;
  background: #f7f7f7;
}
.main {
  margin: 30px 20px;
  padding: 30px;
  box-sizing: border-box;
  min-height: calc(100% - 40px);
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
}
.main.bg-tran {
  padding: 12px;
  background: transparent;
  box-shadow: none;
}
.app-container_a {
  height: 100%;
  padding-top: 190px;
  width: 100%;
  min-width: 1190px;
  box-sizing: border-box;
  background: #f7f7f7;
}

.mActive {
  margin: 25px 20px;
  padding: 30px;
  box-sizing: border-box;
  min-height: calc(100% - 190px);
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
}

/* 页面搜索框 */
.main .input {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  line-height: 38px;
  height: 38px;
  font-size: 14px;
  padding-right: 22px;
  border: none;
  background-color: #f7f7f7;
  border-radius: 4px;
  display: inline-block;
  outline: 0;
  padding: 0 12px;
}

.main .el-dialog .el-form-item {
  margin: 0;
  padding: 0;
}
.el-breadcrumb {
  height: 45px;
}
</style>


<style>
/* 分配人员 选择框 */
.main .allocation {
  height: 330px;
}
.main .allocation .select {
  padding: 40px 52px;
}

.main .el-menu-item {
  font-size: 16px;
  color: #333;
  text-align: center;
  box-sizing: border-box;
}

.main .edit .el-menu-item {
  border-bottom: 3px solid #4d71ee;
}

.main .add {
  width: 100%;
}
.main .add .el-menu-item {
  width: 100%;
  border: none !important;
}

/* 弹出框 label 字体 */
.main .el-dialog .el-form-item__label {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  padding: 0;
}

/* 弹出框 input */
.main .el-dialog .el-form-item__content {
  line-height: 32px;
}

/* 去除 弹出框 的内边距 */
.main .el-dialog__header,
.main .el-dialog__body {
  padding: 0;
}

/* 弹出框 包含的内容 */
/* .main .el-dialog .content {
  padding: 0 40px;
} */

/* 弹出框 头部 */
.main .el-menu.el-menu--horizontal,
.edit {
  display: flex;
  width: 100%;
}
.edit .el-menu-item {
  line-height: 56px !important;
  height: 56px !important;
  flex: 1;
}
</style>

