<template>
  <div>
    <ul class="total-count">
      <li>
        <i class="el-icon-s-data"></i><span>pv总数: {{pvTotal}}</span>
      </li>
      <li>
        <i class="el-icon-s-data"></i><span>uv总数: {{uvTotal}}</span>
      </li>
    </ul>
    <div id="pv-and-uv-count" class="border-box"></div>
  </div>
</template>

<script>
import { searchPvAndUvCount } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "pvAndUvCount",
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
      pvTotal: 0,
      uvTotal: 0,
      pvuvCount: "",
      pvuvCountX: [],
      pvCountY: [],
      uvCountY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.pvuvCount) {
        this.pvuvCount = this.$echarts.init(
          document.getElementById("pv-and-uv-count")
        );
      }

      let option = {
        title: {
          text: "pv,uv图",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
        tooltip: {
          trigger: "axis"
          // formatter: "{b} <br/>{a} : {c}次"
        },
        legend: {
          data: ["pv", "uv"],
          top: "5%"
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
          data: this.pvuvCountX
        },
        yAxis: {
          type: "value",
          minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数。
          axisLabel: {
            formatter: "{value}"
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
            name: "pv",
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#89c3f8"
            },
            data: this.pvCountY
          },
          {
            name: "uv",
            type: "line",
            smooth: true,
            itemStyle: {
              color: "#ffa897"
            },
            data: this.uvCountY
          }
        ]
      };

      this.pvuvCount.setOption(option);
    },

    // 访问 次数
    searchPvAndUvCount() {
      searchPvAndUvCount(
        "",
        this.realmName.length > 0
          ? this.realmName.join(" ")
          : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.pvTotal = res.data.pv.count;
        this.uvTotal = res.data.uv.count;
        this.pvuvCountX = res.data.pv.timeMap.map(item => {
          return item.time;
        });
        this.pvCountY = res.data.pv.timeMap.map(item => {
          return item.value;
        });
        this.uvCountY = res.data.uv.timeMap.map(item => {
          return item.value;
        });
      });
    }
  },
  watch: {
    pvuvCountX(newVal) {
      this.drawLine();
    }
  }
};
</script>

<style lang="stylus" scoped>
.total-count {
  li {
    &:nth-child(1) {
      background-color: #89c3f8;
      border-top-left-radius: 4px;
    }

    &:nth-child(2) {
      border-top-right-radius: 4px;
      background-color: #ffa897;
    }
  }
}
</style>
