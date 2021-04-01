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
    dataYMemory: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      memory: ""
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
      if (!this.memory) {
        this.memory = this.$echarts.init(document.getElementById(this.chartId));
      }
      this.memory.setOption({
        title: {
          text: "内存使用量",
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
            { name: "memory_usedutilization", icon: "circle" },
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
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: "memory_usedutilization",
            type: "line",
            data: this.dataYMemory,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,
            itemStyle: {
              color: "#fa4c4c",
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