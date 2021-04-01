<template>
  <div id="url-path"></div>
</template>

<script>

import { searchVisitUrl } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "urlPath",
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
      urlPath: "",
      urlPieX: [],
      urlPieY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.urlPath) {
        this.urlPath = this.$echarts.init(
          document.getElementById("url-path")
        );
      }

      let option = {
        title: {
          text: "url饼图",
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
          data: this.urlPieX,
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
            name: "访问url",
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
            data: this.urlPieY
          }
        ]
      };

      this.urlPath.setOption(option);
    },

    // 访问 url
    searchVisitUrl() {
      searchVisitUrl(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.urlPieX = res.list.map(item => {
          return item.key
        })
        this.urlPieY = res.list.map(item => {
          return {
            value: item.doc_count,
            name: item.key
          }
        })
      });
    },
  },
  watch: {
    urlPieX(newVal) {
      this.drawLine();
    }
  }
};
</script>

