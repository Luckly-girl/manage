import {get, post} from "@/utils/request"


export default {
  // 获取该白名单组已分配的系统用户信息
  getWhiteUsers(id) {
    return get(`/api/safe/getWhiteUsers?id=${id}`)
  },
  // 修改安全组分配的系统用户
  updateSafeUsers(data) {
    return post(`/api/safe/updateSafeUsers`, data)
  },
  // 获取该黑名单组已分配的系统用户信息
  getBlackUsers(id) {
    return get(`/api/safe/getBlackUsers?id=${id}`)
  },
  // 获取该国家组已分配的系统用户信息
  getCountryUsers(id) {
    return get(`/api/safe/getCountryUsers?id=${id}`)
  }
}



