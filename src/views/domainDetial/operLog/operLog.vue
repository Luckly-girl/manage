<template>
  <div class="operLog">
    <div class="downLoad" @click="exportHandle">下载当前数据</div>
    <ul class="datas">
      <li v-for="(item, index) in list" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getOperationRecord, exportOperationRecord } from "@/api/domain.js";
export default {
  name: "operLog",
  props: { id: Number },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getOperationRecord();
  },
  methods: {
    getOperationRecord() {
      getOperationRecord(this.id).then((res) => {
        this.list = res.data;
        // console.log(res);
      });
    },
    //导出日志
    exportHandle() {
      exportOperationRecord(this.id).then((res) => {
        const elink = document.createElement("a");
        // elink.download = fileName;
        elink.style.display = "none";
        elink.href = res.message;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
  },
};
</script>

<style lang='stylus' scoped>
.operLog {
  .downLoad {
    width: 120px;
    height: 40px;
    color: #fff;
    font-size: 14px;
    border-radius: 4px 4px;
    line-height: 40px;
    text-align: center;
    background-color: #6780A4;
    margin: 20px 0 15px 20px;
  }

  .datas {
    border: 1px solid #E6E9EE;
    padding: 20px 30px;
    font-size: 14px;
    color: #333333;
    line-height: 2;
    text-align: justify;
    border-radius: 4px 4px;
  }
}
</style>