 <template>
  <div>
    <!-- 分页组件 -->
    <el-pagination
      v-if="total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    total: { 
      type: Number,
      required: true
    },
    fn: String
  },
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10 // 每页显示10条数据
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.fn ? this.$emit('fatherMethod') : this.$parent.fetchData()
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.fn ? this.$emit('fatherMethod') : this.$parent.fetchData()
    }
  }
};
</script>

<style scoped>

 /* 靠右 */
.el-pagination {
  padding: 20px 12px 0;
  text-align: right;
}

</style>

 <style>

/* 分页 跳转、总数 */
.el-pagination__jump,
span.el-pagination__total {
  margin-left: 11px;
}

</style>