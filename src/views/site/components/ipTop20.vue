<template>
  <div id="ip-top20"></div>
</template>

<script>

import { searchIpTop } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "ipTop20",
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
      ipTop20: "",
      ipTop20X: [],
      ipTop20Y: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.ipTop20) {
        this.ipTop20 = this.$echarts.init(
          document.getElementById("ip-top20")
        );
      }

      let option = {
        title: {
          text: "ipTop20",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12,
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}次 ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: "vertical",
          icon: 'circle',
          left: "73%",
          top: 15,
          bottom: 18,
          data: this.ipTop20X,
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
            name: "ipTop20饼图",
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
            data: this.ipTop20Y,
            // data: [
            //   {name: "demo1.sheyy.co", value: "1.2"},
            //   {name: "demo2.sheyy.co", value: "0.5"},
            // ]

          }
        ]
      };

      this.ipTop20.setOption(option);
    },

    // 访问 ipTop20
    searchIpTop() {
      searchIpTop(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        // console.log(res.data.rows)
        this.ipTop20X = res.data.rows.map(item => {
          return item.key
        })
        
        this.ipTop20Y = res.data.rows.map(item => {
          return {
            name: item.key,
            value: item.doc_count,
          }
        })

        // console.log(this.ipTop20X)
      });
    },
  },
  watch: {
    ipTop20X(newVal) {
      this.drawLine();
    }
  }
};
</script>

