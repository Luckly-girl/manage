<template>
  <div id="container"></div>
</template>

<script>
import { searchVisitMap } from "@/api/site";
import { dateFilter } from "@/filters";
export default {
  name: "IPGeographicDistribution",
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
      heatmapData: [],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    
    initMap() {
      let map = new AMap.Map("container", {
        features: ["bg", "road"],
        mapStyle: "amap://styles/whitesmoke",
        center: [116.397475, 39.908668],
        pitch: 0,
        zoom: 0,
        viewMode: "2D"
      });
      let layer = new Loca.HeatmapLayer({
        map: map
      });
      if (!this.isSupportCanvas()) {
        this.$Message.info(
          "热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~"
        );
      }
      // 从接口获取数据
      // 官网示例数据结构 http://a.amap.com/jsapi_demos/static/resource/heatmapData.js
      searchVisitMap(
        "",
        this.realmName.length>0 ? this.realmName.join(" ") : this.realmNameArr.join(" "),
        dateFilter(this.dateSearch[0].getTime()),
        dateFilter(this.dateSearch[1].getTime())
      ).then(res => {
        if (res.list.length) {
          this.heatmapData = res.list;
          this.heatmapData.forEach(item => {
            item.coordinate = [item.lng, item.lat];
          });

          layer.setData(this.heatmapData, {
            // max: 10,
            lnglat: "coordinate",
            value: "count"
          });

          layer.setOptions({
            style: {
              radius: 16,
              opacity: [0.2, 1],
              color: {
                0.5: "#2c7bb6",
                0.65: "#abd9e9",
                0.7: "#ffffbf",
                0.9: "#fde468",
                1.0: "#d7191c"
              }
            }
          });
          layer.render();
          
        } else {
          this.heatmapData = [];
        }
      });
    },
    isSupportCanvas() {
      //判断浏览区是否支持canvas
      let elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));   
    }
  }
};
</script>

