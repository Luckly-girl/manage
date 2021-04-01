<template>
  <div class="header_all">
    <div class="header">
      <div class="act-img-btn">
        <el-dropdown class="workorder-dropdown" @command="handleCommand">
          <span class="el-dropdown-link"> 意见反馈 </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sub">提交反馈</el-dropdown-item>
            <el-dropdown-item command="his" divided>历史反馈</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="user">
        <img class="icons" src="@/assets/images/login/user.jpg" alt="" />
        <span class="username">{{ userInfo.username }}</span>
      </div>
      <div class="act-img-btn act-img-btn-other" @click="openMsg">
        <el-badge :value="num" :max="99" :hidden="!num">
          <i class="iconfont logout iconbutton_message"></i>
        </el-badge>
      </div>
      <i
        class="iconfont logout iconbutton_exit act-img-btn"
        @click="handleLogout"
      ></i>
    </div>
    <div
      class="menu"
      v-if="
        $route.path == '/batch' ||
        $route.path == '/batch/addRecord' ||
        $route.path == '/batch/editRecord' ||
        $route.path == '/batch/operateLog' ||
        $route.path == '/batch/operateLog/operDomain' ||
        $route.path == '/batch/operateLog/operRecord'
      "
    >
      <p>
        <em>.</em>DNS解析<i
          class="el-breadcrumb__separator el-icon-arrow-right"
        ></i
        ><small>批量管理</small>
      </p>
      <el-menu
        active-text-color="#4D71EE"
        class="_top_nav"
        :default-active="activeIndex"
        router
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="/batch">添加域名</el-menu-item>
        <el-menu-item index="/batch/addRecord">添加记录</el-menu-item>
        <el-menu-item index="/batch/editRecord">修改记录</el-menu-item>
        <el-menu-item index="/batch/operateLog">操作日志</el-menu-item>
        <!-- <el-menu-item index="/batch/operateLog/operDomain"></el-menu-item>
        <el-menu-item index="/batch/operateLog/operRecord"></el-menu-item> -->
      </el-menu>
    </div>
  </div>
</template>

<script>
// import { logout } from '@/api/login'
import { baseHost, baseWs } from "@/utils/env.js";
import Bus from "@/utils/bus";
export default {
  data() {
    return {
      menuFlag: false,
      user: "",
      num: 0,
      disConnect: false,
      websock: null,
      tt: null,
      lockReconnect: false,
      activeIndex: "/",
      heartCheck: {
        _that: this,
        timeout: 60 * 1000 * 9.5, //每隔三秒发送心跳
        // timeout: 15000, //每隔三秒发送心跳
        severTimeout: 5000, //服务端超时时间
        num: 3, //3次心跳均未响应重连
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          //接收成功一次推送，就将心跳检测的倒计时重置为30秒
          clearTimeout(this.timeoutObj); //重置倒计时
          this.start();
        },
        start: function () {
          var _this = this;
          this.timeoutObj && clearTimeout(this.timeoutObj);
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
          this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            _this._that.websocketsend(); // 心跳包
            _this.serverTimeoutObj = setTimeout(function () {
              _this._that.websocketclose();
            }, _this.severTimeout);
          }, this.timeout);
        },
      },
    };
  },
  created() {
    this.webSocketTest();
    Bus.$off("getMsgNum");
    this.setCurrentRoute();

    // getUserPerms().then((res) => {
    //   res.data.rows.forEach((el) => {
    //     if (el.name === "DNS解析") {
    //       el.child.forEach((val) => {
    //         if (val.name === "批量管理") {
    //           this.menuFlag = true;
    //         }
    //       });
    //     }
    //   });
    //   // console.log(res, 66666);
    // });
  },
  mounted() {
    let _this = this;
    Bus.$on("getMsgNum", (data) => {
      if (data) {
        _this.websocketsend("发送数据" + new Date());
      }
    });
    Bus.$on("loginOut", (data) => {
      if (data) {
        _this.disConnect = true;
        _this.websock.onclose = _this.websocketclose;
        _this.websock.close();
      }
    });
    Bus.$on("loginIn", (data) => {
      if (data) {
        _this.websock.close();
        _this.reconnect(_this.wsuri);
      }
    });
    window.addEventListener("online", this.updateOnlineStatus, false);
    window.addEventListener("offline", this.updateOnlineStatus, false);
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    wsuri() {
      return baseWs + baseHost + "/api/websocket/" + this.userInfo.id;
    },
  },
  // 检测路由变化
  watch: {
    $route() {
      this.setCurrentRoute();
    },
  },
  // destroyed() {
  //   this.disConnect = true
  //   // this.websocketclose()
  //   this.websock.onclose = this.websocketclose
  // },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus, false);
    window.removeEventListener("offline", this.updateOnlineStatus, false);
  },
  // watch: {
  //   websock: {
  //     handler (n, o) {
  //     },
  //     deep: true
  //   },
  // },
  methods: {
    setCurrentRoute() {
      this.activeIndex = this.$route.path; // 通过他就可以监听到当前路由状态并激活当前菜单
    },
    webSocketTest() {
      // const h = this.$createElement
      let _this = this;
      this.disConnect = false;
      if ("WebSocket" in window) {
        // console.log("您的浏览器支持 WebSocket!");
        // 打开一个 web socket
        this.websock = new WebSocket(_this.wsuri);
        this.websock.onmessage = _this.websocketonmessage;
        this.websock.onopen = _this.websocketonopen;
        this.websock.onerror = _this.websocketonerror;
        this.websock.onclose = _this.websocketclose;
      }
    },
    websocketonopen() {
      // this.websocketsend("发送数据"+new Date());
      this.heartCheck.start();
    },
    websocketonmessage(evt) {
      let _that = this;
      let received_msg = JSON.parse(evt.data);
      console.log("数据已接收..." + new Date().toLocaleString());
      _that.num = received_msg.count;
      if (received_msg.msgPop) {
        _that.$notify({
          title: "您有新消息，请注意查收",
          duration: 2000,
          dangerouslyUseHTMLString: true,
          position: "bottom-right",
        });
        Bus.$emit("refushPage", received_msg.refushPage);
      }
      this.heartCheck.reset();
    },
    websocketsend(Data) {
      //数据发送
      console.log("数据发送..." + new Date().toLocaleString());
      this.websock.send(Data);
    },
    websocketclose(e) {
      // 关闭 websocket
      console.log("心跳已关闭..." + new Date().toLocaleString());
      // console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
      this.websock.close();
      if (!this.disConnect) {
        this.reconnect(this.wsuri);
      }
    },
    websocketonerror() {
      // 关闭 websocket
      console.log("心跳错误..." + new Date().toLocaleString());
      let flag = true;
      this.reconnect(this.wsuri, flag);
    },
    reconnect(url, flag) {
      // 心跳重连
      console.log("心跳重连" + new Date().toLocaleString());
      let _that = this;
      if (this.lockReconnect || flag) {
        return;
      }
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      this.tt && clearTimeout(this.tt);
      this.tt = setTimeout(function () {
        if (!this.disConnect) {
          _that.createWebSocket(url);
          _that.lockReconnect = false;
        }
      }, 4000);
    },
    createWebSocket() {
      console.log("心跳重连" + new Date().toLocaleString());
      try {
        this.websock = new WebSocket(this.wsuri);
        this.webSocketTest();
      } catch (e) {
        if (!this.disConnect) this.reconnect(this.wsuri);
      }
    },
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
      if (this.onLine) {
        this.lockReconnect = false;
        this.disConnect = false;
        this.reconnect(this.wsuri);
      } else {
        this.disConnect = true;
      }
    },
    openMsg() {
      Bus.$emit("openMsg", true);
    },
    handleCommand(command) {
      if (command === "his") {
        this.$router.push("/workOrderHistory");
      } else if (command === "sub") {
        this.$router.push("/workOrderSub");
      }
    },
    handleSelect(key, keyPath) {
      this.$router.push({
        path: key,
        params: { data: "query" },
      });
    },
    handleLogout() {
      // 退出系统
      // this.$message(`点击退出系统`);
      // logout(localStorage.getItem("cdn-manager-token")).then(res => {
      //   const resp = res.data;
      //   if (resp.flag) {
      // 推出成功
      // 清除本地数据
      // localStorage.removeItem("cdn-manager-token");
      // localStorage.removeItem("cdn-manager-user");
      // 跳转到登录页面
      // this.disConnect = true
      // this.websocketclose()
      this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: 'warning',
      //       duration: 2000
      //     });
      //   }
      // });
      // this.$message(`点击了${command}`);
    },
  },
};
</script>


<style scoped lang="stylus">
.workorder-dropdown {
  .el-dropdown-link {
    display: flex;
    justify-content: center;
    width: 96px;
  }
}

.act-img-btn-other {
  margin: 0 25px !important;
}

.header_all {
  .header {
    position: absolute;
    z-index: 300;
    padding: 0 30px;
    box-sizing: border-box;
    height: 50px;
    top: 0;
    left: 0;
    min-width: 1190px;
    background: #fff;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .user {
      display: flex;
      align-items: center;

      .icons {
        height: 35px;
        width: 35px;
        border-radius: 50px;
      }

      .username {
        font-family: Arial;
        font-size: 16px;
        color: #333;
        padding: 8px;
      }
    }
  }

  .menu {
    position: absolute;
    z-index: 300;
    padding: 0 30px;
    top: 70px;
    left: 20px;
    right: 20px;
    margin-bottom: 20px;
    min-width: 1190px;
    height: 125px;
    background: #fff;
    display: flex;
    align-items: left;
    flex-direction: column;
    border: 0;

    p {
      font-size: 16px;
      font-weight: 700;
      height: 60px;
      line-height: 80px;
      padding: 0;

      em {
        display: inline-block;
        width: 3px;
        height: 22px;
        line-height: 22px;
        color: #4876FF;
        margin-right: 20px;
        background-color: #4876FF;
      }

      small {
        color: #666666;
        font-weight: 500;
      }
    }

    .el-menu.el-menu--horizontal {
      border-bottom: 0;

      .el-menu-item {
        color: #696969;
        font-size: 16px;
      }
    }
  }
}
</style>
