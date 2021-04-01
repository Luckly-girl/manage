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
    dataYRecvTotal: {
      type: Array,
      required: true
    },
    dataYSendTotal: {
      type: Array,
      required: true
    }
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
          text: "网络流入流出速率(bps)",
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
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [
            { name: "networkin_rate", icon: "circle" },
            { name: "networkout_rate", icon: "circle" },
          ],
          bottom: '3%'
        },
        backgroundColor: "#fff",
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
          // y轴 显示
          axisLabel: {
            color: "#666",
            fontSize: 12,
            formatter: function (params) {
              return  params < 1000 ? params + 'k' : (params / 1000).toFixed(2) + 'M'
            }
          }
        },
        series: [
          {
            name: "networkout_rate",
            type: "line",
            data: this.dataYSendTotal,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,
            itemStyle: {
              color: "#409EFF"
            },
            
          },
          {
            name: "networkin_rate",
            type: "line",
            data: this.dataYRecvTotal ,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,    // 5个转折点才显示一个
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