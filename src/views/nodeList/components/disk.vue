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
    dataYDisk: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      disk: ""
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
      if (!this.disk) {
        this.disk = this.$echarts.init(document.getElementById(this.chartId));
      }

      this.disk.setOption({
        title: {
          text: "disk使用率（%）",
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
        backgroundColor: "#fff", 
        legend: {
          data: [
            { name: "diskusage_utilization", icon: "circle" },
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
            name: "diskusage_utilization",
            type: "line",
            data: this.dataYDisk,
            smooth: true,
            symbol: "emptyCircle",
            // symbolSize: 5,
            itemStyle: {
              color: "#999",
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