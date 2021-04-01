<template>
  <el-drawer
    title="流量统计"
    :visible.sync="trafficDrawer"
    :with-header="false"
    @closed="closeDrawer"
    size="85%"
  >
    <div class="traffic-out">
      <el-form
        label-position="left"
        ref="trafficForm"
        :model="trafficForm"
        class="traffic-form"
      >
        <el-form-item prop="domain" label="域名">
          <el-select
            v-model="trafficForm.domain"
            filterable
            clearable
            placeholder="请选择域名"
          >
            <el-option
              v-for="(item, index) of domainList"
              :key="index"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="dateSearch"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <bx-button
            class="searchBtn"
            @click="searchData"
            label="搜索"
          ></bx-button>
        </el-form-item>
      </el-form>
      <div class="total_traffic">总流量： {{ nginxTraffic }}</div>
      <div id="traffic_echart"></div>
      <el-table
        class="mt-18"
        :data="nginxTrafficVos"
        :header-cell-style="{ background: '#f7f7f7', color: '#47537e' }"
        :header-row-style="{ height: '60px' }"
        :row-style="{ height: '56px' }"
        stripe
      >
        <el-table-column
          prop="domain"
          label="域名"
          align="center"
        ></el-table-column>
        <el-table-column prop="traffic" label="流量" align="center">
          <template slot-scope="scope">
            <span>{{ (scope.row.traffic / 1024).toFixed(2) }} Kb</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import echarts from "echarts";
let trafficEchart;
let optionOne;
import { getNginxNodeTraffic } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "trafficDrawer",
  props: {
    // nginxId: String
    // dateSearch: {
    //   type: Array,
    //   required: true
    // },
    // realmNameArr: {
    //   type: Array,
    //   default: () => {
    //     return [];
    //   }
    // }
  },
  data() {
    return {
      nginxTraffic: 0,
      trafficDrawer: false,
      trafficForm: {
        nginxId: "",
        domain: "",
        startTime: "",
        endTime: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dateSearch: ["", ""],
      domainList: [],
      nginxTrafficVos: [],
      listX: [],
      listY: [],
      maxY: "",
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.drawLine();
    // });
  },
  watch: {
    dateSearch(val) {
      if (val) {
        this.trafficForm.startTime = dateFilter(val[0].getTime());
        this.trafficForm.endTime = dateFilter(val[1].getTime());
      } else {
        this.trafficForm.startTime = "";
        this.trafficForm.endTime = "";
      }
    },
  },
  methods: {
    initDrawer(id) {
      this.trafficForm.nginxId = id;
      this.trafficDrawer = true;
      this.getNginxNodeTraffic();
    },
    closeDrawer() {
      this.trafficForm = {
        nginxId: "",
        domain: "",
        startTime: "",
        endTime: "",
      };
    },
    drawLine() {
      trafficEchart = new echarts.init(
        document.getElementById("traffic_echart")
      );
      let _max = (Number((this.maxY / 10).toFixed(0)) + 1) * 10;

      optionOne = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
          formatter: function (params) {
            let name = params[0].name;
            let value = params[0].value;
            return name + "<br />" + "流量：" + value + " Kb";
          },
        },
        grid: {
          top: "20px",
          left: "100px",
          right: "100px",
          bottom: "50px",
        },
        title: {
          left: "center",
          text: "",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.listX,
          axisLabel: {
            showMaxLabel: true,
            color: "#ccc",
            interval: 20,
          },
        },
        yAxis: {
          type: "value",
          max: function (value) {
            return _max;
          },
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
          boundaryGap: [0, "100%"],
          axisLabel: {
            color: "#666",
            fontSize: 12,
            formatter: function (params) {
              return params == 0 ? 0 : params + " Kb";
            },
          },
        },
        series: [
          {
            name: "流量",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(114, 43, 216)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(214, 194, 244)",
                },
                {
                  offset: 0.8,
                  color: "rgb(255,255,255)",
                },
              ]),
            },
            data: this.listY,
          },
        ],
      };
      trafficEchart.setOption(optionOne);
    },
    getNginxNodeTraffic() {
      this.$nextTick(() => {
        getNginxNodeTraffic(
          this.trafficForm.nginxId,
          this.trafficForm.domain,
          this.trafficForm.startTime,
          this.trafficForm.endTime
        ).then((res) => {
          this.domainList = res.data.domainList;
          let _nginxTraffic = res.data.nginxTraffic;
          if (_nginxTraffic.length > 9) {
            this.nginxTraffic =
              (Number(_nginxTraffic) / (1024 * 1024 * 1024)).toFixed(2) + " Gb";
          } else if (_nginxTraffic.length > 6 && _nginxTraffic.length <= 9) {
            this.nginxTraffic =
              (Number(_nginxTraffic) / (1024 * 1024)).toFixed(2) + " Mb";
          } else {
            this.nginxTraffic =
              (Number(_nginxTraffic) / 1024).toFixed(2) + " Kb";
          }
          this.nginxTrafficVos = res.data.nginxTrafficVos;
          this.maxY =
            res.data.nginxTimeTrafficMax / 1024 > 1
              ? Number((res.data.nginxTimeTrafficMax / 1024).toFixed(0))
              : 10;
          this.listX = res.data.timeVos.map((item) => {
            return item.time;
          });
          this.listY = res.data.timeVos.map((item) => {
            if (item.traffic == 0) {
              return 0;
            } else if (item.traffic / 1024 > 1) {
              return (item.traffic / 1024).toFixed(2);
            } else {
              console.log(item.traffic);
              return (item.traffic / 1024).toFixed(2);
              // return 1;
            }
          });
          this.drawLine();
        });
      });
    },
    searchData() {
      this.getNginxNodeTraffic();
    },
  },
};
</script>
<style lang="stylus" scoped>
.traffic-out {
  padding: 20px;
}

#traffic_echart {
  height: 427px;
  width: 100%;
}

.traffic-form {
  display: flex;

  .el-form-item {
    display: flex;
    margin-right: 20px;
  }
}

.total_traffic {
  font-size: 16px;
  color: #4d71ee;
}
</style>

