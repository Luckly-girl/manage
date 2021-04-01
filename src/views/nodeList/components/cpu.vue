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
    dataX: {
      type: Array,
      required: true
    },
    dataYCPU: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      CPU: ""
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
      if (!this.CPU) {
        this.CPU = this.$echarts.init(document.getElementById(this.chartId));
      }

      this.CPU.setOption({
        title: {
          text: "CPU使用率",
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
            { name: "cpu_total", icon: "circle", },
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
            fontSize: 12,
            
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
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: "cpu_total",
            type: "line",
            data: this.dataYCPU,
            smooth: true,
            symbol: "emptyCircle",
            itemStyle: {
              color: "#409EFF"
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