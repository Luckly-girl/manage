<template>
  <div id="visit-code"></div>
</template>

<script>
import { searchHttpCode } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "visitCode",
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
      visitCode: "",
      codePieX: [],
      codePieY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      if (!this.visitCode) {
        this.visitCode = this.$echarts.init(
          document.getElementById("visit-code")
        );
      }

      let option = {
        title: {
          text: "访问Code",
          left: "2%",
          top: "5%",
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}次 ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          icon: "circle",
          left: "73%",
          top: 15,
          bottom: 18,
          data: this.codePieX
        },
        series: [
          {
            name: "访问code",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["35%", "55%"], // 饼图位置
            label: {
              normal: {
                show: false,
                position: "outside"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.codePieY
          }
        ]
      };

      this.visitCode.setOption(option);
    },

    searchHttpCode() {
      searchHttpCode(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.codePieX = res.list.map(item => {
          return item.key;
        });
        this.codePieY = res.list.map(item => {
          return {
            value: item.doc_count,
            name: item.key
          };
        });
      });
    }
  },
  watch: {
    codePieX(newVal) {
      this.drawLine();
    }
  }
};
</script>

