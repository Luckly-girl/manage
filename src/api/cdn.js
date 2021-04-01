// import request from "@/utils/request";

import {get, post} from "@/utils/request";

export default {

  // 查询 下拉框 当前用户所管理的系统用户信息
  getUsers() {
    return get(`/api/user/getUsers`)
  },

  // 获取产品下拉框列表
  getProductList(type){
    return get(`/api/nginx/getProductList?type=${type}`)
  },


  // 获取转移记录列表
  getTransferList(page, limit) {
    return get(`/api/transfer/getTransferList?page=${page}&limit=${limit}`)
  },

  // 获取日志封禁记录列表
  getLogBanList(page, limit, banType, banStatus, nginxName) {
    return get(`/api/logBan/getLogBanList?page=${page}&limit=${limit}&banType=${banType}&banStatus=${banStatus}&nginxName=${nginxName}`)
  }

}



