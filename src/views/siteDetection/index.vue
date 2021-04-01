<template>
  <div class="detection">
    <ul>
      <li
        class="siteDetectionBtn unCopy"
        :style="{'backgroundColor': (index=== mark ? theme.backgroundColor : '#fff'),'color': (index=== mark ? theme.color : '#606266')}"
        @click="handlerBtn(index, item.component)"
        v-for="(item, index) of btnList"
        :key="index"
      >{{item.name}}</li>
    </ul>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
export default {
  computed: {
    theme () {
      return this.$store.state.theme
    }
  },
  data() {
    return {
      btnList: [
        { name: "ping检测", component: "PingDetection" },
        { name: "域名检测", component: "DomainNameDetection" },
        { name: "域名被墙检测", component: "DomainNameDetectionByWall" }
      ],
      mark: 0, // 默认下标
      currentComponent: "PingDetection" // 当前渲染的路由
    };
  },
  methods: {
    handlerBtn(index, component) {
      this.mark = index;
      this.currentComponent = component;
    }
  },
  components: {
    PingDetection: () => import("./pingDetection"),
    DomainNameDetection: () => import("./domainNameDetection"),
    DomainNameDetectionByWall: () => import("./domainNameDetectionByWall")
  }
};
</script>

<style>

.detection ul {
  display: flex;
  display: -webkit-flex; /* Safari */
  list-style: none;
}

.detection ul > li.siteDetectionBtn {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  background: #fff;
  cursor: pointer;
  text-align: center;
  white-space: nowrap; 
  border: 1px solid #dcdfe6;
  margin-right: 24px;
  border-radius: 4px;
  line-height: 14px;
  padding: 10px 23px;
}

/* 弹出框 li 不需要border */
.detection .el-dialog ul > li {
  border: none;
  /* border-radius: 0; */
}

.detection ul > li.siteDetectionBtn.bgColor {
  background: #4d71ee;
  color: #fff;
}

.detection .tip {
  font-Size: 12px; 
  color: #fa4c4c; 
  padding: 8px 8px 32px
}

.detection .show-font {
  font-Size: 14px; 
  color: #333333; 
  padding-bottom: 12px
}

.detection .show-font>span {
  padding-right: 20px;
}
</style>