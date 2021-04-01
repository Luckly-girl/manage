<template>
  <div id="ip-geographic"></div>
</template>

<script>
import { searchCountryAndProvince } from "@/api/site";
import { dateFilter } from "@/filters";

export default {
  name: "ipGeographic",
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
      subtext: "国家（详情点击柱形图查看对应国家的省／州统计）",
      ipPatternX: [],
      temporaryList: [],
      dataList: [],
      ipPatternY: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.drawBar();
    });
  },
  methods: {
    drawBar() {
      if (!this.visitCode) {
        this.visitCode = this.$echarts.init(
          document.getElementById("ip-geographic")
        )
      }

      let option = {
        title: {
          text: "IP区域访问频次",
          subtext: this.subtext,
          left: "2%",
          top: "2%",
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "category",
          data: this.ipPatternY,
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "访问code",
            type: "bar",
            // z: 3,
            label: {
              normal: {
                position: "right",
                show: true
              }
            },
            data: this.ipPatternX
          }
        ]
      };
      this.visitCode.setOption(option);
      this.visitCode.resize()
      this.visitCode.on("click", params => {
        this.visitCode.dispose();
        this.visitCode = this.$echarts.init(
          document.getElementById("ip-geographic")
        )
        if (this.temporaryList[params.dataIndex]) {
          if (!this.temporaryList[params.dataIndex].hasOwnProperty("provinces")) {
            this.temporaryList = this.dataList;
            if (!this.temporaryList.length) {
              this.subtext = ""
            } else {
              this.subtext = "国家（详情点击柱形图查看对应国家的省/州统计）"
            }
          } else {
            this.subtext = "省／州（点击任意柱形图查看国家统计）";
            this.temporaryList = this.dataList[params.dataIndex].provinces;
          }
          this.ipPatternX = this.temporaryList.map(item => {
            return item.count;
          });
          this.ipPatternY = this.temporaryList.map(item => {
            return item.name;
          });
        }
      });
    },

    searchIpPattern() {
      searchCountryAndProvince(
        "",
        this.realmName.length > 0
          ? this.realmName.join(" ")
          : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        this.visitCode.dispose();
        this.visitCode = this.$echarts.init(
          document.getElementById("ip-geographic")
        );
        this.dataList = res.list;
        this.temporaryList = res.list;
        if (!this.temporaryList.length) {
              this.subtext = ""
            } else {
              this.subtext = "国家（详情点击柱形图查看对应国家的省/州统计）"
            }
        this.ipPatternX = res.list.map(item => {
          return item.count;
        });
        this.ipPatternY = res.list.map(item => {
          return item.name;
        });
      });
    }
  },
  watch: {
    ipPatternY(newVal) {
      this.drawBar();
    }
  }
};
</script>

