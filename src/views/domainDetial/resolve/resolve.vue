<template>
  <div class="resolve">
    <div class="re_top">
      <img src="../../../assets/images/DNS/ico_tip.png" alt="" />
      <span
        >该域名还未正确设置 DNS
        服务器，解析记录将无法正常生效。请在域名注册商处将 DNS
        服务器修改为：tennis.dnspod.net、seven.dnspod.net， 即可正常解析。</span
      >
    </div>
    <div class="re_ban">
      <div class="re_left">
        <el-select
          v-model="hostRecord"
          placeholder="全部"
          @change="selectChange"
        >
          <el-option
            v-for="(item, index) in hostList"
            :key="index"
            :value="item.name"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-select v-model="value2" placeholder="">
          <el-option
            v-for="item in opt2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <ul class="btn">
          <li
            class="pointer"
            :class="{ active: mark == item.index }"
            @click="btnClick(item.index)"
            v-for="item in btnList"
            :key="item.index"
          >
            {{ item.name }}
          </li>
        </ul>
        <el-date-picker
          v-model="timeDate"
          :clearable="false"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getDateTime"
        >
        </el-date-picker>
      </div>
      <div class="re_right">
        <div @click="exportChange">下载当前数据</div>
      </div>
    </div>
    <div class="chartNum">
      <p>{{ chart }}</p>
      <p>请求次数：{{ totalNum }}次<small>（统计结果延迟一小时）</small></p>
    </div>
    <div id="myChart" class="myChart"></div>
    <div class="noChart" v-if="flag == true">
      <img src="../../../assets/images/DNS/kong.png" alt="" />
      <span>
        当前域名还未使用 DNSPod 域名解析服务，暂时无法获取
        解析量统计数据，可能是因为 DNS 服务器未正确设置
      </span>
    </div>
  </div>
</template>

<script>
import {
  dnsAnalysisStatistics,
  exportDnsAnalysisStatistics,
  getHostRecordList,
} from "@/api/domain.js";
import { getDateFilter } from "@/filters";
export default {
  name: "resolve",
  props: {
    tname: String,
    id: Number,
  },
  data() {
    return {
      hostRecord: "",
      hostList: [],
      opt2: [{ value: "1", label: "" }],
      value2: "",
      btnList: [
        { name: "今天", index: 0 },
        {
          name: "昨天",
          index: 1,
        },
        { name: "近7天", index: 2 },
        {
          name: "近30天",
          index: 3,
        },
      ],
      format: "hours",
      timeDate: [],
      currentTime: null,
      beforeTime: null,
      weekTime: null,
      monthTime: null,
      searchMap: {
        startTime: "",
        endTime: "",
      },
      mark: 0,
      chart: "",
      totalNum: 0,
      flag: false,
      listX: [],
      listY: [],
    };
  },
  created() {
    this.value2 = this.tname;
    this.opt2[0].label = this.tname;
    this.getNowFormatDate();
    this.getBeforeDay();
    this.getBeforeWeek();
    this.getBeforeMonth();
    this.dnsAnalysisStatistics();
    this.timeDate.push(this.currentTime, this.currentTime);
    this.getHostRecordList();
  },
  mounted() {},
  methods: {
    datedifference(sDate1, sDate2) {
      //sDate1和sDate2是2006-12-18格式
    },
    //获取当前日期
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      this.currentTime = currentdate;
      this.searchMap.startTime = currentdate;
      this.searchMap.endTime = currentdate;
      // console.log(this.currentTime, 333333);
      return currentdate;
    },

    //获取指定日期前一天
    getBeforeDay() {
      var nowdate = new Date();
      nowdate.setDate(nowdate.getDate() - 1);
      var y = nowdate.getFullYear();
      var m =
        nowdate.getMonth() + 1 < 10
          ? "0" + (nowdate.getMonth() + 1)
          : nowdate.getMonth() + 1;
      var d =
        nowdate.getDate() < 10 ? "0" + nowdate.getDate() : nowdate.getDate();
      var formatwdate = y + "-" + m + "-" + d;
      this.beforeTime = formatwdate;
      // console.log(formatwdate, 2222);
      return formatwdate;
    },

    //获取指定日期前七天
    getBeforeWeek() {
      var _date = new Date(); //获取今天日期
      _date.setDate(_date.getDate() - 6); //日期回到七天前
      var year = _date.getFullYear();
      var month = _date.getMonth() + 1;
      var day = _date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }

      var dateTemp = year + "-" + month + "-" + day;
      // _date.setDate(_date.getDate() + 7); //日期重置
      this.weekTime = dateTemp;
      // console.log(dateTemp,77777)
      return dateTemp;
    },

    //获取指定日期前一个月
    getBeforeMonth() {
      var nowdate = new Date();
      var beforedate = new Date(nowdate);
      beforedate.setDate(nowdate.getDate() - 29);
      // 30天前
      let systemDateBegin = `${beforedate.getFullYear()}-${
        beforedate.getMonth() + 1 < 10
          ? `0${beforedate.getMonth() + 1}`
          : beforedate.getMonth() + 1
      }-${beforedate.getDate()}`;
      this.monthTime = systemDateBegin;
      return systemDateBegin;
    },
    //获取域名主机列表
    getHostRecordList() {
      getHostRecordList(this.id).then((res) => {
        this.hostList = res.data;
        // console.log(this.hostList[0].name);
      });
    },
    //获取详情图
    dnsAnalysisStatistics() {
      this.$nextTick(() => {
        dnsAnalysisStatistics(
          this.format,
          this.searchMap.startTime,
          this.searchMap.endTime,
          this.hostRecord,
          this.tname
        )
          .then((res) => {
            // console.log(res);
            if (res.code === 200) {
              this.chart = res.data.info.domainName;
              this.totalNum = res.data.info.total;
              this.listX = res.data.times.map((item) => {
                return item.time;
              });
              this.listY = res.data.times.map((item) => {
                return item.num;
              });

              // console.log(res.data);
            } else {
              this.flag = true;
            }
            this.drawLine();
          })
          .catch((err) => {});
      });
    },
    selectChange(val) {
      this.hostRecord = val;
      this.dnsAnalysisStatistics();
    },
    //时间筛选
    getDateTime(date) {
      var dateSpan, iDays;
      let sDate1 = Date.parse(getDateFilter(date[0].getTime()));
      let sDate2 = Date.parse(getDateFilter(date[1].getTime()));
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      // console.log(iDays, 8888);
      // return iDays;
      if (
        getDateFilter(date[0].getTime()) === this.currentTime &&
        getDateFilter(date[1].getTime()) === this.currentTime
      ) {
        this.format = "hours";
        this.mark = 0;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else if (
        getDateFilter(date[0].getTime()) === this.beforeTime &&
        getDateFilter(date[1].getTime()) === this.beforeTime
      ) {
        this.format = "hours";
        this.mark = 1;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else if (
        getDateFilter(date[0].getTime()) === this.weekTime &&
        getDateFilter(date[1].getTime()) === this.currentTime
      ) {
        this.format = "hours";
        this.mark = 2;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else if (
        getDateFilter(date[0].getTime()) === this.monthTime &&
        getDateFilter(date[1].getTime()) === this.currentTime
      ) {
        this.format = "hours";
        this.mark = 3;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else if (date !== null && iDays >= 7) {
        this.format = "day";
        this.mark = null;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else if (date !== null && iDays <= 6) {
        this.format = "hours";
        this.mark = null;
        this.timeDate = [];
        this.searchMap.startTime = getDateFilter(date[0].getTime());
        this.searchMap.endTime = getDateFilter(date[1].getTime());
        this.timeDate.push(this.searchMap.startTime, this.searchMap.endTime);
        this.dnsAnalysisStatistics();
      } else {
        this.timeDate = [];
        this.searchMap.startTime = "";
        this.searchMap.endTime = "";
      }
    },
    //选择天数
    btnClick(ind) {
      if (ind === 0) {
        this.timeDate = [];
        // console.log(this.timeDate, 123123);
        this.timeDate.push(this.currentTime, this.currentTime);
        this.format = "hours";
        this.searchMap.startTime = this.currentTime;
        this.searchMap.endTime = this.currentTime;
        this.dnsAnalysisStatistics();
      } else if (ind === 1) {
        this.timeDate = [];
        this.timeDate.push(this.beforeTime, this.beforeTime);
        this.format = "hours";
        this.searchMap.startTime = this.beforeTime;
        this.searchMap.endTime = this.beforeTime;
        this.dnsAnalysisStatistics();
      } else if (ind === 2) {
        this.timeDate = [];
        this.timeDate.push(this.weekTime, this.currentTime);
        this.format = "hours";
        this.searchMap.startTime = this.weekTime;
        this.searchMap.endTime = this.currentTime;
        this.dnsAnalysisStatistics();
      } else if (ind === 3) {
        this.timeDate = [];
        this.timeDate.push(this.monthTime, this.currentTime);
        this.format = "day";
        this.searchMap.startTime = this.monthTime;
        this.searchMap.endTime = this.currentTime;
        this.dnsAnalysisStatistics();
      }
      this.mark = ind;
    },
    //下载解析数据
    exportChange() {
      exportDnsAnalysisStatistics(
        this.format,
        this.searchMap.startTime,
        this.searchMap.endTime,
        this.tname
      )
        .then((res) => {
          // const fileName = "解析记录表.xls";
          // if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          // elink.download = fileName;
          elink.style.display = "none";
          elink.href = res.message;
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          // }
          // else {
          //   // IE10+下载
          //   navigator.msSaveBlob("http://manage.bxyun.cn/download/export/20210121/1611218347_1611218347_39_20210121163907_revenue.xls", fileName);
        })
        .catch((err) => {});
    },
    //Echarts图表
    drawLine() {
      // let tData = [this.currentTime, "14:00", "16:00", "20:00"];
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "20px",
          left: "100px",
          right: "100px",
          bottom: "50px",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.listX,
          axisLabel: {
            showMaxLabel: true,
            color: "#ccc",
            splitNumber: 10,
            // interval: this.format === "day" ? '50' : '5',
          },
        },
        yAxis: {
          type: "value",
          // max: function(value) {
          //   return _max;
          // },
          splitLine: {
            lineStyle: {
              type: "dotted",
            },
          },
          axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          // boundaryGap: [0, "100%"],
          axisLabel: {
            color: "#666",
            fontSize: 12,
            // formatter: function (params) {
            //   console.log(params,3333)
            //   return params == 0 ? 0 : params + " Kb";
            // },
          },
        },
        series: [
          {
            name: "请求次数",
            type: "line",
            smooth: true,
            symbol: "circle",
            sampling: "average",
            itemStyle: {
              normal: {
                color: "#7CB5EC",
                lineStyle: {
                  color: "#7CB5EC",
                },
              },
            },
            areaStyle: {
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: "#A3CBF1", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#A3CBF1", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.listY,
          },
        ],
      });
    },
  },
  watch: {},
};
</script>

<style lang="stylus">
.resolve {
  .re_ban {
    .re_left {
      margin-top: 20px;

      .el-select {
        width: 130px;
        padding-right: 15px;

        .el-input__inner {
          width: 120px;
        }
      }

      .el-input--suffix .el-input__inner {
        padding-right: 0;
      }

      .el-range-editor {
        width: 235px;

        .el-input__inner {
          width: 235px;
        }

        .el-range-separator {
          width: 11%;
        }
      }
    }
  }
}
</style>

<style lang="stylus" scoped>
.resolve {
  padding-top: 35px;

  .re_top {
    display: flex;
    height: 45px;
    justify-content: left;
    align-items: center;
    background-color: #EDF1FD;
    border-radius: 5px 5px;

    img {
      width: 20px;
      height: 20px;
      padding: 0 15px;
    }

    span {
      font-size: 13px;
      color: #4D71EE;
    }
  }

  .re_ban {
    display: flex;
    justify-content: space-between;

    .re_left {
      display: flex;

      ul.btn {
        display: flex;
        padding-right: 15px;

        .pointer {
          width: 70px;
          height: 38px;
          font-size: 14px;
          color: #020202;
          text-align: center;
          line-height: 38px;
          border: 1px solid #ddd;
          margin-left: -1px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          &:first-child {
            border-radius: 5px 0 0 5px;
          }

          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }

    .re_right {
      div {
        width: 130px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background-color: #6780A4;
        border-radius: 4px 4px;
        color: #fff;
        margin-top: 20px;
        font-size: 14px;
      }
    }
  }

  .active {
    color: #fff !important;
    background-color: #4D71EE;
  }

  .chartNum {
    padding: 30px 0 0 70px;

    p:nth-child(1) {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      padding-bottom: 20px;
    }

    p:nth-child(2) {
      color: #606266;
      font-size: 14px;

      small {
        color: #B4C0D0;
      }
    }
  }

  .myChart {
    width: 100%;
    height: 500px;
  }

  .noChart {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      width: 360px;
      font-size: 13px;
      color: #6E7F96;
      padding-left: 15px;
      line-height: 2;
    }

    img {
      width: 110px;
      height: 110px;
    }
  }
}
</style>
