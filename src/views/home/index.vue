<template>
  <div class="home">
    <ul class="dis-flex home-header flex-jus-s-b">
      <li class="dis-flex flex-jus-center base-shadow">
        <img class="user-img" src="@/assets/images/login/user.jpg" alt="" />
        <span>用户名：{{ homeInfo.nickName }}</span>
      </li>
      <li class="base-shadow li-title">
        <h4>
          <img src="@/assets/images/home/icon_yue.png" alt="" />账户余额：
        </h4>
        <p>
          ￥ <span>{{ homeInfo.balance.toFixed(2) }}</span>
        </p>
      </li>
      <li class="base-shadow li-title" v-if="homeAuthority('logStorageRecord')">
        <h4>
          <img src="@/assets/images/home/icon_fengjin.png" alt="" />封禁IP：
        </h4>
        <p>
          <span
            class="point"
            @click="routerTo('logStorageRecord', '/logStorageRecord')"
            >{{ homeInfo.banIpCount }}</span
          >
          个
        </p>
      </li>
    </ul>
    <div class="dis-flex flex-jus-s-b home-content">
      <div
        style="width: 58.9%"
        class="home-content-fir"
        :class="[homeAuthority('security') ? '' : 'gray-home']"
      >
        <h3>安全组</h3>
        <ul>
          <li>
            <h4>白名单</h4>
            <p>
              <span class="point" @click="routerTo('security', '/security')">{{
                homeInfo.whiteGroupCount
              }}</span>
              个
            </p>
          </li>
          <li>
            <h4>黑名单</h4>
            <p>
              <span
                class="point"
                @click="routerTo('security', '/security', { tab: 1 })"
                >{{ homeInfo.blackGroupCount }}</span
              >
              个
            </p>
          </li>
          <li>
            <h4>国家</h4>
            <p>
              <span
                class="point"
                @click="routerTo('security', '/security', { tab: 2 })"
                >{{ homeInfo.countryGroupCount }}</span
              >
              个
            </p>
          </li>
        </ul>
      </div>
      <div style="width: 38.8%" class="home-content-fir">
        <h3>证书</h3>
        <ul>
          <li>
            <h4>总数</h4>
            <p>
              <span>{{ homeInfo.sslTotal }}</span> 个
            </p>
          </li>
          <li>
            <h4>即将过期</h4>
            <p class="red">
              <span>{{ homeInfo.sslExpiredSoonCount }}</span> 个
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="dis-flex flex-jus-s-b home-content">
      <div style="width: 100%" class="home-content-sec">
        <h3
          :class="[
            homeAuthority('site') || homeAuthority('nodeList')
              ? ''
              : 'gray-home',
          ]"
        >
          资源状态
        </h3>
        <ul>
          <li :class="[homeAuthority('site') ? '' : 'gray-home']">
            <div class="content-l">
              <p>
                <span>总站点数：</span
                ><span
                  ><i class="point" @click="routerTo('site', '/site')">{{
                    homeInfo.siteTotal
                  }}</i>
                  个</span
                >
              </p>
            </div>
            <div class="content-r">
              <p class="blue">
                <span>正常站点：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('site', '/site', { status: '2' })"
                    >{{ homeInfo.normalSiteCount }}</i
                  >
                  个</span
                >
              </p>
              <p class="yellow">
                <span>预部署：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('site', '/site', { status: '0' })"
                    >{{ homeInfo.preSiteCount }}</i
                  >
                  个</span
                >
              </p>
              <p class="red">
                <span>异常站点：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('site', '/site', { status: '3' })"
                    >{{ homeInfo.abNormalSiteCount }}</i
                  >
                  个</span
                >
              </p>
            </div>
          </li>
          <li :class="[homeAuthority('nodeList') ? '' : 'gray-home']">
            <div class="content-l">
              <p>
                <span>总节点数：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('nodeList', '/nodeList')"
                    >{{ homeInfo.nodeTotal }}</i
                  >
                  个</span
                >
              </p>
            </div>
            <div class="content-r">
              <p class="blue">
                <span>正常节点：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('nodeList', '/nodeList', { status: '1' })"
                    >{{ homeInfo.normalNodeCount }}</i
                  >
                  个</span
                >
              </p>
              <p class="red">
                <span>异常节点：</span
                ><span
                  ><i
                    class="point"
                    @click="routerTo('nodeList', '/nodeList', { status: '0' })"
                    >{{ homeInfo.abNormalNodeCount }}</i
                  >
                  个</span
                >
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getHomeInfo } from "@/api/login";
export default {
  data() {
    return {
      homeInfo: {
        abNormalNodeCount: 0,
        abNormalSiteCount: 0,
        balance: 0,
        banIpCount: 0,
        blackGroupCount: 0,
        countryGroupCount: 0,
        nickName: "",
        nodeTotal: 0,
        normalNodeCount: 0,
        preSiteCount: 0,
        normalSiteCount: 0,
        siteTotal: 0,
        sslTotal: 0,
        sslExpiredCount: 0,
        sslExpiredSoonCount: 0,
        whiteGroupCount: 0,
      },
    };
  },
  created() {
    this.getHomeInfo();
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    getHomeInfo() {
      getHomeInfo().then((res) => {
        this.homeInfo = res.data;
      });
    },
    routerTo(role, path, query) {
      if (!this.homeAuthority(role)) return false;
      if (query) {
        this.$router.push({ path: path, query: query });
      } else {
        this.$router.push({ path: path });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.point {
  cursor: pointer;
}

.home-header {
  height: 16.6vh;
  font-size: 16px;
  color: #fff;

  .user-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-right: 26px;
  }

  li {
    box-sizing: border-box;
    margin: 0 10px;
    flex: 1;
    width: 0;
    overflow: hidden;
    height: 100%;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    &:nth-child(1) {
      background: #bc8dee;
    }

    &:nth-child(2) {
      background: #ffa897;

      p {
        font-size: 24px;
      }
    }

    &:nth-child(3) {
      background: #89c3f8;
    }
  }
}

.li-title {
  box-sizing: border-box;
  padding: 3.1vh 0 0;

  h4 {
    padding-left: 2.1vw;

    img {
      margin-right: 12px;
    }

    font-size: 16px;
    display: flex;
    align-items: center;
  }

  p {
    margin-top: 1.3vh;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }

  span {
    font-size: 40px;
  }
}

.content-r {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.home-content {
  margin-top: 30px;

  h3 {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    height: 20px;
    padding-left: 12px;
    position: relative;
    color: #4d71ee;
    margin-bottom: 20px;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background-color: #4d71ee;
    }
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  li {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.1);
    height: 27.7vh;
    padding: 3.7vh;
    box-sizing: border-box;
    /* flex 1
    margin 0 .7vh
    &:first-child{
      margin-left 0
    }
    &:last-child{
      margin-right 0
    } */
  }

  h4 {
    font-size: 16px;
    color: #333;
  }

  p {
    text-align: center;
    color: #4d71ee;
    font-size: 14px;
    line-height: 40px;
    margin-top: 7.8vh;
  }

  span {
    font-size: 40px;
  }
}

.home-content {
  .home-content-fir {
    &:first-child {
      li {
        width: 32%;
      }
    }

    &:last-child {
      li {
        width: 48.6%;
      }
    }
  }
}

.blue {
  color: #4d71ee !important;
}

.red {
  color: #fa4c4c !important;
}

.yellow {
  color: #e8db08 !important;
}

.home-content-sec {
  li {
    padding: 3.7vh 0;
    width: 48.8%;
    display: flex;
    align-items: center;

    p {
      margin-top: 0;
      color: #333;
      padding: 0 18%;
      box-sizing: border-box;
      width: 100%;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 16px;
      }

      i {
        font-size: 40px;
        font-style: normal;
      }
    }

    div {
      width: 50%;
      height: 100%;
      border-right: 1px solid #eeeeee;

      &:first-child {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:last-child {
        border: none;
      }
    }
  }
}
</style>
