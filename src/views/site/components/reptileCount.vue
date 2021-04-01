<template>
  <div>
    <ul class="total-count">
      <li>
        <i class="el-icon-s-data"></i><span>爬虫总数: {{total}}</span>
      </li>
    </ul>
    <div id="reptile-count" class="border-box"></div>
  </div>
</template>

<script>

import { searchReptileCount } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "reptileCount",
  props: {
    id: {
      type: String,
      required: true
    },
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
      total: 0,
      reptileCount: "",
      reptileCountX: [],
      reptileCountY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.reptileCount) {
        this.reptileCount = this.$echarts.init(
          document.getElementById("reptile-count")
        );
      }

      let option = {
        title: {
          text: "爬虫数量统计图",
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
          data: ["爬虫数量"],
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
          data: this.reptileCountX
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
            name: "爬虫数量",
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#409EFF"
            },
            data: this.reptileCountY
          },
        ]
      };

      this.reptileCount.setOption(option);
    },

    // 访问 次数
    searchReptileCount() {
      searchReptileCount(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.total = res.data.count
        this.reptileCountX = res.data.list.map(item => {
          return item.time
        })
        this.reptileCountY = res.data.list.map(item => {
          return item.value
        })
      });
    },
    
  },
  watch: {
    reptileCountX(newVal) {
      this.drawLine()
    }
  }
};
</script>
<style lang="stylus" scoped>
.total-count{
  li{
    background-color #409eff
    border-radius 4px 4px 0 0
  }
}
</style>

