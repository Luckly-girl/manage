<template>
  <div class="record">
    <div class="re_top">
      <img src="../../../assets/images/DNS/ico_tip.png" alt="" />
      <span
        >该域名还未正确设置 DNS
        服务器，解析记录将无法正常生效。请在域名注册商处将 DNS
        服务器修改为：tennis.dnspod.net、seven.dnspod.net， 即可正常解析。</span
      >
    </div>
    <div class="re_ban">
      <div class="re_left">
        <bx-button
          class="searchBtn re_a"
          label="添加记录"
          @click="addRecord"
        ></bx-button>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <!-- <i class="el-icon-location"></i> -->
              <span>更多操作</span>
            </template>
            <el-menu-item @click="addOne">批量添加记录 </el-menu-item>
            <el-menu-item @click="addTwo">批量修改记录 </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="re_right">
        <el-input
          class="re_input"
          v-model="searchMap.searchInfo"
          placeholder="请输入要搜索的域名"
        ></el-input>
        <bx-button
          class="searchBtn re_sou"
          label="搜索"
          @click="searchHandle"
        ></bx-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tData"
        style="width: 100%"
        stripe
        :default-sort="{ prop: 'hostRecord', order: 'ascending' }"
        @sort-change="sortChange"
        @cell-dblclick="cellClick"
      >
        <el-table-column width="60px" align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">
              <img src="../../../assets/images/DNS/out.jpg" alt="" />
            </span>
            <span v-if="scope.row.state === 1">
              <img src="../../../assets/images/DNS/succes.jpg" alt="" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hostRecord"
          label="主机记录"
          align="left"
          width="200px"
          sortable="custom"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-input v-model="scope.row.hostRecord" placeholder="">
                ></el-input
              >
            </div>
            <div v-if="scope.row.adshow">
              <el-input
                v-model="scope.row.hostRecord"
                placeholder=""
              ></el-input>
            </div>
            <span v-else>{{ scope.row.hostRecord }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordType"
          label="记录类型"
          align="left"
          sortable="custom"
          width="140px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-select
                v-model="scope.row.recordType"
                @change="handleEdit(scope.row)"
                placeholder=""
              >
                <el-option
                  v-for="item in record"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </div>
            <div v-if="scope.row.adshow">
              <el-select
                v-model="scope.row.recordType"
                @change="handleEditAdd(scope.row)"
                placeholder=""
              >
                <el-option
                  v-for="item in record"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </div>
            <span v-else>{{ scope.row.recordType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="line"
          label="线路类型"
          align="left"
          sortable="custom"
          width="140px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-select v-model="scope.row.line" placeholder="">
                <el-option
                  v-for="item in line"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div v-if="scope.row.adshow">
              <el-select v-model="scope.row.line" placeholder="">
                <el-option
                  v-for="item in line"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <span v-else>{{ scope.row.line }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordValue"
          label="记录值"
          sortable="custom"
          width="220px"
          align="left"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-input
                v-model="scope.row.recordValue"
                placeholder=""
              ></el-input>
            </div>
            <div v-if="scope.row.adshow">
              <el-input
                v-model="scope.row.recordValue"
                placeholder=""
              ></el-input>
            </div>
            <span v-else>{{ scope.row.recordValue }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重"
          align="left"
          sortable="custom"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-input
                v-model="scope.row.weight"
                :disabled="scope.row.flag"
                placeholder=""
              ></el-input>
            </div>
            <div v-if="scope.row.adshow">
              <el-input
                v-model="scope.row.weight"
                :disabled="scope.row.flag"
                placeholder=""
              ></el-input>
            </div>
            <span v-else>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mx" label="MX" align="center" sortable="custom">
          <template>
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="ttl" label="TTL" align="left" sortable="custom">
          <template slot-scope="scope">
            <div v-if="scope.row.show">
              <el-input v-model="scope.row.ttl" placeholder=""></el-input>
            </div>
            <div v-if="scope.row.adshow">
              <el-input v-model="scope.row.ttl" placeholder=""></el-input>
            </div>
            <span v-else>{{ scope.row.ttl }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastUpdateTime"
          label="最后操作时间"
          sortable="custom"
          width="200px"
          align="left"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <div
              class="re_edit"
              v-if="scope.row.show !== true && scope.row.adshow !== true"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.state === 0 ? '开启解析' : '暂停解析'"
                placement="top-end"
              >
                <img
                  v-if="scope.row.state === 0"
                  src="../../../assets/images/DNS/stop.png"
                  alt=""
                  @click.stop="stop(scope.row)"
                />
                <img
                  v-else
                  src="../../../assets/images/DNS/open.png"
                  alt=""
                  @click.stop="open(scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="点击添加备注"
                placement="top-end"
              >
                <img
                  src="../../../assets/images/DNS/edit.png"
                  @click.stop="editClick(scope.row)"
                  alt=""
                />
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除记录"
                placement="top-end"
              >
                <img
                  src="../../../assets/images/DNS/delete.png"
                  alt=""
                  @click.stop="deleteChange(scope.row)"
                />
              </el-tooltip>
            </div>
            <div class="scopeBtn" v-if="scope.row.adshow">
              <bx-button
                class="okBtn a"
                label="确定"
                @click="addBtn(scope.row, scope.$index)"
              ></bx-button>
              <el-button @click="btnCancle(scope.row, scope.$index)"
                >取消</el-button
              >
            </div>
            <div class="scopeBtn" v-if="scope.row.show">
              <bx-button
                class="okBtn a"
                label="确定"
                @click="editBtn(scope.row)"
              ></bx-button>
              <el-button @click="editCancle(scope.row)">取消</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 备注dialog -->
      <div class="remark">
        <el-dialog title="备注" :visible.sync="dialogVisible">
          <el-input
            type="textarea"
            placeholder="填写该域名的备注信息，方便备忘查看。"
            v-model="searchMap.remark"
            maxlength="200"
            show-word-limit
          >
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <bx-button
              class="ok"
              type="primary"
              label="确定"
              @click="remarkHandle"
            ></bx-button>
          </span>
        </el-dialog>
      </div>
      <!-- 删除域名dialog -->
      <div class="remark">
        <el-dialog title="删除记录" :visible.sync="dialogVisibleDelete">
          <div class="con">
            <img src="../../../assets/images/DNS/tip.png" alt="" />
            <span> 删除后该记录将失效，确定删除吗？ </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleDelete = false">取 消</el-button>
            <bx-button
              class="ok"
              type="primary"
              label="确定"
              @click="deleteHandle"
            ></bx-button>
          </span>
        </el-dialog>
      </div>
      <pagination ref="pagination" :total="total"></pagination>
    </div>
  </div>
</template>

<script>
import {
  getDomainInfoList,
  updateRemarkData,
  delDomainInfo,
  updateDomainInfoState,
  saveDomainInfo,
  updateDomainInfo,
  getDomainInfo,
} from "@/api/domain.js";
export default {
  name: "record",
  props: {
    id: Number,
  },
  data() {
    return {
      input: "",
      tableData: [],
      setData: [],
      searchMap: {
        id: null,
        sortField: "",
        sortType: "",
        remark: "",
        searchInfo: "",
      },
      dateTime: "",
      flag: false,
      lineType: "0",
      recordType: "0",
      record: [
        {
          value: "0",
          label: "A",
        },
        {
          value: "1",
          label: "CNAME",
        },
        {
          value: "2",
          label: "AAAA",
        },
      ],
      line: [
        {
          value: "0",
          label: "默认",
        },
        {
          value: "1",
          label: "境内",
        },
        {
          value: "2",
          label: "境外",
        },
      ],
      textarea: "",
      dialogVisible: false,
      dialogVisibleDelete: false,
      total: 10,
    };
  },
  created() {
    this.$nextTick(() => {
      this.fetchData();
    });
  },
  mounted() {},
  computed: {
    tData() {
      return [...this.setData, ...this.tableData];
    },
  },
  methods: {
    //获取域名记录详情列表
    fetchData() {
      getDomainInfoList(
        this.id,
        "",
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.sortField,
        this.searchMap.sortType
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data.rows);
      });
    },
    //搜索解析记录
    searchHandle() {
      getDomainInfoList(
        this.id,
        this.searchMap.searchInfo,
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        this.searchMap.sortField,
        this.searchMap.sortType
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data.rows);
      });
    },
    //点击表格排序
    sortChange(column, prop, order) {
      if (column.order === null) {
        column.order = "ascending";
      }
      getDomainInfoList(
        this.id,
        "",
        this.$refs.pagination.currentPage,
        this.$refs.pagination.pageSize,
        column.prop,
        column.order
      ).then((res) => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
        // console.log(res.data);
      });
      // console.log(column.prop); //prop标签 => nickname
      // console.log(column.order); //descending降序、ascending升序
    },
    //获取当前日期的时分秒
    getCurrentTime() {
      let date = new Date();
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours = date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      date =
        Y + "-" + M + "-" + D + " " + hours + ":" + minutes + ":" + seconds;
      // console.log(date);
      this.dateTime = date;
      return date;
    },
    //添加记录
    addRecord() {
      this.getCurrentTime();
      this.fetchData();
      // this.$set(this.tableData, "show", true);
      this.setData.push({
        hostRecord: "",
        recordType: "A",
        line: "默认",
        recordValue: "",
        weight: "",
        ttl: "600",
        lastUpdateTime: this.dateTime,
        adshow: true,
      });
    },
    //更多操作--批量添加记录
    addOne() {
      this.$router.push("/batch/addRecord");
    },
    //更多操作--批量修改记录
    addTwo() {
      this.$router.push("/batch/editRecord");
    },
    //表格操作--暂停
    stop(row) {
      let params = {
        id: row.id,
        state: 1,
      };
      updateDomainInfoState(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
      });
    },
    //表格操作--开始
    open(row) {
      let params = {
        id: row.id,
        state: 0,
      };
      updateDomainInfoState(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
      });
    },
    //操作----备注
    editClick(row) {
      this.searchMap.id = row.id;
      this.searchMap.remark = row.remark;
      this.dialogVisible = true;
    },
    //备注---提交
    remarkHandle() {
      let params = {
        id: this.searchMap.id,
        remark: this.searchMap.remark,
      };
      updateRemarkData(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
          this.dialogVisible = false;
        }
      });
    },
    //操作--删除
    deleteChange(row) {
      this.searchMap.id = row.id;
      this.dialogVisibleDelete = true;
    },
    //删除---提交
    deleteHandle() {
      let params = {
        id: this.searchMap.id,
      };
      delDomainInfo(params).then((res) => {
        if (res.code === 200) {
          this.fetchData();
        }
      });
      this.dialogVisibleDelete = false;
    },
    //双击可编辑
    cellClick(row) {
      this.$set(row, "show", true);
      row.hostRecord_cache = row.hostRecord;
      row.recordType_cache = row.recordType;
      row.line_cache = row.line;
      row.recordValue_cache = row.recordValue;
      row.weight_cache = row.weight;
      row.ttl_cache = row.ttl;
    },
    handleEdit(row) {
      if (row.recordType == "AAAA") {
        this.$set(row, "flag", true);
      }
    },
    handleEditAdd(row) {
      if (row.recordType == "A") {
        this.recordType = "0";
      } else if (row.recordType == "CNAME") {
        this.recordType = "1";
      } else if (row.recordType == "AAAA") {
        this.recordType = "2";
        this.$set(row, "flag", true);
      }
    },

    //添加---确认
    addBtn(row, index) {
      console.log(row);
      if (row.hostRecord == "") {
        row.hostRecord = "@";
      }
      if (row.line == "默认") {
        row.line = "0";
      } else if (row.line == "境内") {
        row.line = "1";
      } else if (row.line == "境外") {
        row.line = "2";
      }
      if (row.recordValue == "") {
        this.$message({
          message: "记录值内容不能为空",
          type: "warning",
          offset: 60,
        });
      } else if (row.recordValue !== "") {
        if (row.recordType == "A") {
          const reg = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请输入您服务器的IPV4地址",
              type: "warning",
              offset: 60,
            });
          } else if (row.weight !== "") {
            const teg = /^([0-9]{1,2}|100)$/;
            if (!teg.test(row.weight)) {
              this.$message({
                message: "权重不合法，请输入0~100的整数",
                type: "warning",
                offset: 60,
              });
            } else {
              let params = {
                domainId: this.id,
                hostRecord: row.hostRecord,
                recordType: this.recordType,
                lineType: row.line,
                recordValue: row.recordValue,
                ttl: row.ttl,
                weight: row.weight,
              };
              saveDomainInfo(params)
                .then((res) => {
                  if (res.code === 200) {
                    setTimeout(() => {
                      this.fetchData();
                      this.setData.splice(index, 1);
                    }, 2000);
                  }
                })
                .catch((err) => {});
            }
          } else {
            let params = {
              domainId: this.id,
              hostRecord: row.hostRecord,
              recordType: this.recordType,
              lineType: row.line,
              recordValue: row.recordValue,
              ttl: row.ttl,
              weight: row.weight,
            };
            saveDomainInfo(params)
              .then((res) => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.fetchData();
                    this.setData.splice(index, 1);
                  }, 2000);
                }
              })
              .catch((err) => {});
          }
        } else if (row.recordType == "CNAME") {
          const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请填写一个域名，如：cloud.tencent.com",
              type: "warning",
              offset: 60,
            });
          } else if (row.weight !== "") {
            const teg = /^([0-9]{1,2}|100)$/;
            if (!teg.test(row.weight)) {
              this.$message({
                message: "权重不合法，请输入0~100的整数",
                type: "warning",
                offset: 60,
              });
            } else {
              let params = {
                domainId: this.id,
                hostRecord: row.hostRecord,
                recordType: this.recordType,
                lineType: row.lineType,
                recordValue: row.recordValue,
                ttl: row.ttl,
                weight: row.weight,
              };
              saveDomainInfo(params)
                .then((res) => {
                  if (res.code === 200) {
                    setTimeout(() => {
                      this.fetchData();
                      this.setData.splice(index, 1);
                    }, 2000);
                  }
                })
                .catch((err) => {});
            }
          }
        } else if (row.recordType == "AAAA") {
          const reg = /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请输入您服务器的IPV6服务器地址",
              type: "warning",
              offset: 60,
            });
          } else {
            let params = {
              domainId: this.id,
              hostRecord: row.hostRecord,
              recordType: this.recordType,
              lineType: row.lineType,
              recordValue: row.recordValue,
              ttl: row.ttl,
              weight: row.weight,
            };
            saveDomainInfo(params)
              .then((res) => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.fetchData();
                    this.setData.splice(index, 1);
                  }, 2000);
                }
              })
              .catch((err) => {});
          }
        } else {
          return false;
        }
      }
    },
    //添加---点击取消
    btnCancle(row, index) {
      this.setData.splice(index, 1);
      row.adshow = false;
    },

    //编辑---确认
    editBtn(row) {
      if (row.line == "默认") {
        row.line = "0";
      } else if (row.line == "境内") {
        row.line = "1";
      } else if (row.line == "境外") {
        row.line = "2";
      }
      if (row.recordValue !== "") {
        if (row.recordType == "A") {
          const reg = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请输入您服务器的IPV4地址",
              type: "warning",
              offset: 60,
            });
          } else if (row.weight !== "" && row.weight !== null) {
            const teg = /^([0-9]{1,2}|100)$/;
            if (!teg.test(row.weight)) {
              this.$message({
                message: "权重不合法，请输入0~100的整数",
                type: "warning",
                offset: 60,
              });
            } else {
              let _info = {
                domainId: this.id,
                id: row.id + "",
                hostRecord: row.hostRecord,
                recordType: row.recordType,
                lineType: row.line,
                recordValue: row.recordValue,
                ttl: row.ttl,
                weight: row.weight,
              };
              updateDomainInfo(_info)
                .then((res) => {
                  if (res.code === 200) {
                    setTimeout(() => {
                      this.fetchData();
                    }, 1000);
                  }
                })
                .catch((err) => {});
            }
          } else {
            let _info = {
              domainId: this.id,
              id: row.id + "",
              hostRecord: row.hostRecord,
              recordType: row.recordType,
              lineType: row.line,
              recordValue: row.recordValue,
              ttl: row.ttl,
              weight: row.weight,
            };
            updateDomainInfo(_info)
              .then((res) => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.fetchData();
                  }, 1000);
                }
              })
              .catch((err) => {});
          }
        } else if (row.recordType == "CNAME") {
          const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请填写一个域名，如：cloud.tencent.com",
              type: "warning",
              offset: 60,
            });
          } else if (row.weight !== "" && row.weight !== null) {
            const teg = /^([0-9]{1,2}|100)$/;
            if (!teg.test(row.weight)) {
              this.$message({
                message: "权重不合法，请输入0~100的整数",
                type: "warning",
                offset: 60,
              });
            } else {
              let _info = {
                domainId: this.id,
                id: row.id + "",
                hostRecord: row.hostRecord,
                recordType: row.recordType,
                lineType: row.line,
                recordValue: row.recordValue,
                ttl: row.ttl,
                weight: row.weight,
              };
              updateDomainInfo(_info)
                .then((res) => {
                  if (res.code === 200) {
                    setTimeout(() => {
                      this.fetchData();
                    }, 1000);
                  }
                })
                .catch((err) => {});
            }
          } else {
            let _info = {
              domainId: this.id,
              id: row.id + "",
              hostRecord: row.hostRecord,
              recordType: row.recordType,
              lineType: row.line,
              recordValue: row.recordValue,
              ttl: row.ttl,
              weight: row.weight,
            };
            updateDomainInfo(_info)
              .then((res) => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.fetchData();
                  }, 1000);
                }
              })
              .catch((err) => {});
          }
        } else if (row.recordType == "AAAA") {
          const reg = /^((\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*)(\/(([1-9])|([1-9][0-9])|(1[0-1][0-9]|12[0-8]))){0,1})*$/;
          if (!reg.test(row.recordValue)) {
            this.$message({
              message: "请输入您服务器的IPV6服务器地址",
              type: "warning",
              offset: 60,
            });
          } else {
            let _info = {
              domainId: this.id,
              id: row.id + "",
              hostRecord: row.hostRecord,
              recordType: row.recordType,
              lineType: row.line,
              recordValue: row.recordValue,
              ttl: row.ttl,
              weight: row.weight,
            };
            updateDomainInfo(_info)
              .then((res) => {
                if (res.code === 200) {
                  setTimeout(() => {
                    this.fetchData();
                  }, 1000);
                }
              })
              .catch((err) => {});
          }
        } else {
          let _info = {
            domainId: this.id,
            id: row.id + "",
            hostRecord: row.hostRecord,
            recordType: row.recordType,
            lineType: row.line,
            recordValue: row.recordValue,
            ttl: row.ttl,
            weight: row.weight,
          };
          updateDomainInfo(_info)
            .then((res) => {
              if (res.code === 200) {
                setTimeout(() => {
                  this.fetchData();
                }, 1000);
              }
            })
            .catch((err) => {});
        }
      } else {
        this.$message({
          message: "记录值内容不能为空",
          type: "warning",
          offset: 60,
        });
      }
    },
    //编辑---点击取消
    editCancle(row) {
      // console.log(row);
      row.show = false;
      row.hostRecord = row.hostRecord_cache;
      row.recordType = row.recordType_cache;
      row.line = row.line_cache;
      row.recordValue = row.recordValue_cache;
      row.weight = row.weight_cache;
      row.ttl = row.ttl_cache;
      delete row.hostRecord_cache;
      delete row.recordType_cache;
      delete row.line_cache;
      delete row.recordValue_cache;
      delete row.weight_cache;
      delete row.ttl_cache;
    },
  },
};
</script>


<style lang='stylus'>
.record {
  .re_ban {
    .re_left {
      width: 240px;
      display: flex;
      justify-content: space-between;

      .el-menu-vertical-demo {
        width: 120px;
        border: 0;
        height: 40px;
        background-color: #E6ECF6;
        border-radius: 4px 4px;
        z-index: 5;

        .el-submenu__title {
          line-height: 40px;
          font-size: 16px;
        }

        .el-submenu__title:hover {
          background: 0;
        }

        .el-submenu__icon-arrow {
          position: absolute;
          top: 45%;
        }
      }

      .main .el-menu-item {
        text-align: initial;
      }

      .el-submenu .el-menu-item {
        font-size: 16px;
        padding-left: 0 !important;
        padding-right: 83px;
        background-color: #fff;
        border-radius: 3px;
        transition: none;
      }

      .el-submenu {
        width: 120px;
        height: 36px;

        .el-menu {
          width: 200px;
          box-shadow: 1px 2px 5px 5px #F2F2F2;
          border-radius: 4px 4px;
        }
      }
    }
  }

  .table {
    padding: 20px 0 30px;

    .el-table th > .cell, .el-table td > .cell {
      height: 40px;
      font-size: 14px;
      color: #717171;
      line-height: 40px;
    }

    .el-table th {
      background-color: #F7F7F7;
    }

    .el-table--enable-row-transition .el-table__body td {
      height: 55px;
    }

    .el-table__body tr.current-row > td {
      background-color: #eee !important;
    }
  }

  .remark {
    .el-dialog {
      width: 500px;
      height: 240px;

      .el-dialog__header {
        height: 55px;
        padding-top: 10px;
      }

      .el-dialog__title {
        line-height: 55px;
        padding-left: 30px;
      }

      .el-dialog__footer {
        padding-top: 20px;

        .el-button--primary {
          background: #66B1FF;
        }
      }

      .el-textarea {
        width: 440px;
        margin-left: 30px;
        border: 1px solid #eee;
        border-radius: 3px;
      }

      .el-textarea__inner {
        width: 435px;
        height: 100px;
        background-color: #fff;
      }

      .el-select {
        width: 160px;
        padding: 0;
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
<style lang='stylus' scoped>
.record {
  padding: 35px 0;

  .re_top {
    display: flex;
    height: 45px;
    justify-content: left;
    align-items: center;
    background-color: #EDF1FD;
    border-radius: 5px 5px;

    img {
      width: 20px;
      height: 20px;
      padding: 0 15px;
    }

    span {
      font-size: 13px;
      color: #4D71EE;
    }
  }

  .re_ban {
    display: flex;
    justify-content: space-between;

    .re_left {
      padding-top: 30px;

      .re_a {
        border-radius: 5px 5px;
      }
    }

    .re_right {
      width: 400px;
      display: flex;
      justify-content: space-between;
      padding-top: 30px;

      .re_input {
        display: inline-block;
        width: 300px;
      }

      .re_sou {
        border-radius: 5px 5px;
      }
    }
  }

  .table {
    .re_edit {
      display: flex;
      justify-content: space-around;
      cursor: pointer;

      img {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-top: 10px;
      }
    }

    .scopeBtn {
      display: flex;
      justify-content: center;
      align-items: center;

      .a {
        height: 40px;
        font-size: 15px;
      }

      .el-button {
        width: 60px;
        height: 40px;
        background-color: #6780A4;
        color: #fff;
        margin-right: 10px;
      }
    }
  }

  .remark {
    .con {
      padding: 20px 10px 20px 50px;
      display: flex;
      justify-content: left;
      align-items: center;

      span {
        line-height: 2;
      }

      img {
        display: inline-block;
        width: 60px;
        height: 40px;
        padding: 5px 15px;
      }
    }
  }
}
</style>