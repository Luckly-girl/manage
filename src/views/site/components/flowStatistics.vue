<template>
  <div id="flow-statistics"></div>
</template>

<script>

import { searchNetflow } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "flowStatistics",
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
      flow: "",
      flowX: [],
      flowY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.flow) {
        this.flow = this.$echarts.init(
          document.getElementById("flow-statistics")
        );
      }

      let option = {
        title: {
          text: "流量统计图",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12,
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}KByte ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: "vertical",
          icon: 'circle',
          left: "73%",
          top: 15,
          bottom: 18,
          data: this.flowX,
          // data: ["demo1.sheyy.co", "demo2.sheyy.co"],
          tooltip: {
            show: true
          },
          formatter: function(name) {
            if (!name) return ''
            if (name.length > 25) {
              name = name.slice(0, 25) + '...'
            }
            return name
          }
        },
        series: [
          {
            name: "流量统计图",
            type: "pie",
            radius: ["50%", "70%"],
            center: ['35%', '55%'],   // 饼图位置
            label: {
              normal: {
                show: false,
                position: "outside"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold",
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.flowY,
            // data: [
            //   {name: "demo1.sheyy.co", value: "1.2"},
            //   {name: "demo2.sheyy.co", value: "0.5"},
            // ]
          }
        ]
      };

      this.flow.setOption(option);
    },

    // 访问 流量统计
    searchNetflow() {
      searchNetflow(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.flowX = res.data.rows.map(item => {
          return item.domain
        })
        this.flowY = res.data.rows.map(item => {
          return {
            name: item.domain,
            value: item.value,
          }
        })
      });
    },
  },
  watch: {
    flowX(newVal) {
      this.drawLine();
    }
  }
};
</script>

