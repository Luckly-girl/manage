<template>
  <div id="visit-count"></div>
</template>

<script>

import { searchVisitCount } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "visitCount",
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
      visitCount: "",
      visitCountX: [],
      visitCountY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.visitCount) {
        this.visitCount = this.$echarts.init(
          document.getElementById("visit-count")
        );
      }

      let option = {
        title: {
          text: "访问次数统计图",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12,
          }
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/>{a} : {c}次"
        },
        legend: {
          data: ["访问次数"],
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
          data: this.visitCountX
        },
        yAxis: {
          type: "value",
          minInterval: 1,  //设置成1保证坐标轴分割刻度显示成整数。
          axisLabel: {
            formatter: '{value}'
          },
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
            name: "访问次数",
            type: "line",
            itemStyle: {
              color: "#409EFF"
            },
            data: this.visitCountY
          },
        ]
      };

      this.visitCount.setOption(option);
    },

    // 访问 次数
    searchVisitCount() {
      searchVisitCount(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.visitCountX = res.list.map(item => {
          return item.time
        })
        this.visitCountY = res.list.map(item => {
          return item.value
        })
      });
    },
    
  },
  watch: {
    visitCountX(newVal) {
      this.drawLine()
    }
  }
};
</script>

