<template>
  <div class="security">
    <ul class="security-tab">
      <li class="securityBtn unCopy"
        :style="{'backgroundColor': (index===mark ? theme.backgroundColor : '#fff'), 'color': (index===mark ? theme.color : '#606266')}"
        @click="handlerBtn(index, item.component)"
        v-for="(item, index) of btnList"
        :key="index" >{{item.name}}</li>
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
        { name: "白名单安全组", component: "whiteList" },
        { name: "黑名单安全组", component: "blackList" },
        { name: "国家隔离安全组", component: "country" }
      ],
      mark: 0, // 默认下标
      currentComponent: "WhiteList"   // 当前渲染的路由
    };
  },
  methods: {
    handlerBtn(index, component) {
      this.mark = index;
      this.currentComponent = component;
    }
  },
  mounted () {
    if (this.$route.query.tab) {
      this.mark = Number(this.$route.query.tab)
      this.currentComponent = this.btnList[this.mark].component
    } else {
      this.mark = 0
      this.currentComponent = "WhiteList"
    }
  },
  components:{
    WhiteList: () => import('./whiteList'),
    BlackList: () => import('./blackList'),
    Country: () => import('./country')
  }
};
</script>


<style>

.security .security-tab {
  display: flex;
  display: -webkit-flex; /* Safari */
  list-style: none;
}
.security .security-tab > li.securityBtn,
.security .addBtnSecurity {
  font-size: 14px;
  font-weight: 500px;
  color: #606266;
  background: #fff;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;  
  border: 1px solid #dcdfe6;
  margin-right: 20px;
  border-radius: 4px;
  line-height: 14px;
  padding: 10px 18px;
}

/* 弹出框 li 不需要border */
.security .el-dialog ul > li {
  border: none; 
  border-radius: 0;
}

.security ul > li.securityBtn.bgColor,
.security .addBtnSecurity {
  background: #4d71ee;
  color: #fff;
}

.security .add .el-menu-item {
  border-bottom: none;
}

.security .el-pagination {
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: flex-end;
}

.security .tip{
  text-indent: 95px; 
  font-size: 12px; 
  color: #999999; 
  padding-top: -28px
}

.security .add-list {
  padding: 40px 40px 35px;
  height: 245px;
}

.security div.allocation {
  height: 320px;
}

.security .add-list .el-row .el-form-item {
  margin-bottom: 12px;
}

</style>