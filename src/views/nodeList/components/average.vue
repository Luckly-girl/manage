<template>
  <div :id="chartId"></div>
</template>

<script>
export default {
  props: {
    chartId: {
      type: String,
      required: true
    },
    dataX:{
     type: Array,
      required: true
    },
    dataYOneMin: {
      type: Array,
      required: true
    },
    dataYFiveMin: {
      type: Array,
      required: true
    },
    dataYFifteen: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      network: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      if (!this.network) {
        this.network = this.$echarts.init(
          document.getElementById(this.chartId)
        );
      }
      // 绘制 网络 图表
      this.network.setOption({
        title: {
          text: "系统平均负载",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#666",
            fontSize: 14,
            bottom: 20
          }
        },
        grid: {
          left: '12%',
          right: '4%',
          top: '23%',
          bottom: '23%'
        },
        backgroundColor: "#fff", // 背景颜色
        legend: {
          data: [
            { name: "load_1m", icon: "circle" },
            { name: "load_5m", icon: "circle" },
            { name: "load_15m", icon: "circle" },
          ],
          bottom: '3%'
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          position: "bottom",
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#666",
            fontSize: 12
          },
          data: this.dataX
        },
        yAxis: {
          splitNumber: 5, 
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#666",
              opacity: 0.2
            }
          },
          axisLabel: {
            color: "#666",
            fontSize: 12,
          }
        },
        series: [
          {
            name: "load_1m",
            type: "line",
            data: this.dataYOneMin,
            smooth: true,
            symbol: "emptyCircle",
            itemStyle: {
              color: "#409EFF",
            },
            
          },
          {
            name: "load_5m",
            type: "line",
            data: this.dataYFiveMin,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,
            itemStyle: {
              color: "#999999"
            },
            
          },
          {
            name: "load_15m",
            type: "line",
            data: this.dataYFifteen,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,
            itemStyle: {
              color: "#ffae00"
            },
            
          }
        ]
      });
    }
  },
  watch: {
    dataX(newVal) {
      this.drawLine();
    }
  }
};
</script>