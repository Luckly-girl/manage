<template>
  <div id="response-time"></div>
</template>

<script>

import { searchResponseTime } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "averageResponseTime",
  props: {
    realmName: {
      type: Array,
      required: true
    },
    dateSearch: {
      type: Array,
      required: true
    },
    realmNameArr: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      averageResponseTime: "",
      responseTimeX: [],
      responseTimeY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.averageResponseTime) {
        this.averageResponseTime = this.$echarts.init(
          document.getElementById("response-time")
        );
      }

      let option = {
        title: {
          text: "平均响应时间（s/秒）",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12,
          }
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/>{a} : {c}秒"
        },
        legend: {
          data: ["平均响应时间"],
          top: '5%'
        },
        grid: {
          left: "7%",
          right: "8.5%",
          bottom: "6%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.responseTimeX
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: "#ddd",
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: "平均响应时间",
            type: "line",
            stack: "总量",
            data: this.responseTimeY,
            // areaStyle: {}
            itemStyle: {
              color: "#f56c6c"
            },
          },
        ]
      };

      this.averageResponseTime.setOption(option);
    },

    // 平均响应时间
    searchResponseTime() {
      searchResponseTime(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.responseTimeX = res.list.map(item => {
          return item.time
        })
        this.responseTimeY = res.list.map(item => {
          return Number(item.value).toFixed(2)
        })
      });
    },


  },
  watch: {
    responseTimeX(newVal) {
      this.drawLine()
    }
  }
};
</script>

