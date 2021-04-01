<template>
  <el-dialog
    :visible.sync="messageDialog"
    class="msg-dialog"
    :width="msgList.length <= 0 ? '620px' : '60vw'"
    :top="msgList.length <= 0 ? '20vh' : '20vh'"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-header">
      <div v-if="dialogType == 'list'">通知</div>
      <div v-else-if="dialogType == 'allList'" class="all-list-title">
        全部通知
        <bx-button
          class="all-read-btn"
          @click="addRead"
          label="全部标记为已读"
        ></bx-button>
      </div>
      <div v-else class="msg-detail-title">
        通知详情
        <i class="el-icon-arrow-left" @click="backList"></i>
      </div>
    </div>
    <div v-if="dialogType == 'list'" class="null-msg-bg">
      <div>
        <p class="null-msg-main" v-if="msgList.length <= 0">-没有新通知-</p>
        <div class="all-msg-bg" v-else>
          <ul class="all-msg-list">
            <li
              v-for="(item, index) in msgList"
              :key="index"
              @click="getNoticeInfo(item.id)"
            >
              <div class="msg-content-bg">
                <div
                  class="icon"
                  :class="[item.sureRead == 1 ? 'already-read' : '']"
                ></div>
                <div class="msg-content">
                  <span :class="[item.sureRead == 1 ? 'fc-999' : '']">{{
                    item.noticeTitle
                  }}</span>
                  <p class="ellipsis">{{ item.content }}</p>
                </div>
              </div>
              <div class="time">{{ item.insertTime | dateFilter }}</div>
            </li>
          </ul>
          <el-pagination
            v-if="total > 5"
            background
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="page"
            layout="total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <div class="null-msg-foot" @click="watchAllList">查看全部通知</div>
    </div>
    <div v-else-if="dialogType == 'allList'" class="all-msg-bg">
      <p class="null-msg-main" v-if="msgList.length <= 0">-没有新通知-</p>
      <ul class="all-msg-list">
        <li
          v-for="(item, index) in msgList"
          :key="index"
          @click="getNoticeInfo(item.id)"
        >
          <div class="msg-content-bg">
            <div
              class="icon"
              :class="[item.sureRead == 1 ? 'already-read' : '']"
            ></div>
            <div class="msg-content">
              <span :class="[item.sureRead == 1 ? 'fc-999' : '']">{{
                item.noticeTitle
              }}</span>
              <p class="ellipsis">{{ item.content }}</p>
            </div>
          </div>
          <div class="time">{{ item.insertTime | dateFilter }}</div>
        </li>
      </ul>
      <el-pagination
        v-if="total > 5"
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="page"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <div v-else class="msg-detail-main">
      <p class="msg-detail-noticeTitle">{{ msgDetail.noticeTitle }}</p>
      <span class="time">{{ msgDetail.insertTime | dateFilter }}</span>
      <div
        class="msg-detail-content"
        v-html="$options.filters.msgContentFilter(msgDetail.content)"
      ></div>
      <div class="msg-detail-foot">
        <el-button class="reset" @click="delNotice">删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Bus from "@/utils/bus";
import {
  updateAllNotice,
  getNoReadNoticeInfo,
  getAllInfo,
  delNotice,
  getNoticeInfo,
} from "@/api/notice";
export default {
  name: "msgList",
  data() {
    return {
      rooterList: "list",
      dialogType: "list",
      page: 1,
      pageSize: 5,
      total: 0,
      nullMsg: false,
      messageDialog: false,
      msgList: [],
      msgDetail: {
        noticeTitle: "",
        insertTime: 1575948868000,
        id: "",
        content: "",
      },
    };
  },
  created() {},
  mounted() {
    let _this = this;
    Bus.$on("openMsg", (data) => {
      if (data) {
        _this.messageDialog = data;
        _this.dialogType = "list";
        _this.page = 1;
        _this.rooterList = "list";
        _this.getNoReadNoticeInfo();
      }
    });
  },
  computed: {},
  methods: {
    baseGetList(item) {
      if (this[item] === "list") {
        this.getNoReadNoticeInfo();
      } else if (this[item] === "allList") {
        this.getAllInfo();
      }
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.baseGetList("dialogType");
    },
    backList() {
      this.baseGetList("rooterList");
      this.dialogType = this.rooterList;
    },
    getNoticeInfo(id) {
      this.dialogType = "detail";
      getNoticeInfo(id).then((res) => {
        this.msgDetail = res.data;
        Bus.$emit("getMsgNum", true);
      });
    },
    watchAllList() {
      this.dialogType = "allList";
      this.rooterList = "allList";
      this.page = 1;
      this.getAllInfo();
    },
    getNoReadNoticeInfo() {
      getNoReadNoticeInfo(this.page).then((res) => {
        this.msgList = res.data.rows;
        this.total = res.data.total;
      });
    },
    delNotice() {
      delNotice(this.msgDetail.id).then((res) => {
        this.backList("rooterList");
      });
    },
    getAllInfo() {
      getAllInfo(this.page).then((res) => {
        this.msgList = res.data.rows;
        this.total = res.data.total;
      });
    },
    addRead() {
      updateAllNotice().then((res) => {
        this.watchAllList();
        Bus.$emit("getMsgNum", true);
      });
    },
  },
};
</script>


<style lang="stylus">
.msg-dialog {
  .el-dialog__header {
    padding: 16px 40px;
    background-color: #f7f7f7;
    font-size: 16px;
  }

  .el-dialog__body {
    padding: 0;
  }

  .null-msg-main {
    text-align: center;
    padding: 100px 0;
    font-size: 18px;
  }

  .null-msg-foot {
    text-align: center;
    padding: 16px 0;
    background-color: #f7f7f7;
    color: #4d71ee;
    cursor: pointer;
  }

  .all-msg-bg {
    padding: 10px 40px;
  }

  .all-list-title {
    line-height: 32px;
  }

  .msg-detail-title, .all-list-title {
    position: relative;
    text-align: center;
  }

  .msg-detail-title {
    i {
      cursor: pointer;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .msg-detail-main {
    padding: 0 60px 40px;
  }

  .msg-detail-noticeTitle {
    font-size: 16px;
    color: #4d71ee;
    line-height: 16px;
    padding: 20px 0;
  }

  .all-read-btn {
    width: 132px;
    height: 32px;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
  }

  .msg-detail-content {
    margin-top: 20px;
    font-size: 14px;
    color: #333;
    line-height: 26px;
  }

  .reset {
    margin-right: 0;
  }

  .msg-detail-foot {
    margin-top: 140px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .time {
    color: #999;
    font-size: 14px;
  }

  .all-msg-list {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999999;
      font-size: 14px;
      padding: 24px 0;
      border-bottom: 1px solid #f7f7f7;
      cursor: pointer;

      &:hover {
        background: #f7f7f7;
      }
    }

    .msg-content-bg {
      display: flex;
      align-items: center;
    }

    .msg-content {
      width: 500px;

      span {
        color: #333;
        font-size: 16px;
      }

      p {
        margin-top: 8px;
      }
    }

    .icon {
      width: 16px;
      height: 16px;
      margin-right: 16px;
      border-radius: 50%;
      background-image: linear-gradient(0deg, #ff9e8b 0%, #ffae9e 60%, #ffbdb0 100%), linear-gradient(#ffa897, #ffa897);
      background-blend-mode: normal, normal;
    }

    .icon.already-read {
      background-image: linear-gradient(0deg, #74b9f8 0%, #95c9f9 100%), linear-gradient(#ffa897, #ffa897);
      background-blend-mode: normal, normal;
    }
  }
}
</style>
