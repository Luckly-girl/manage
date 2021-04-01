import { get } from "@/utils/request";

export default {

  // ping检测
  pingDomin(domin) {
    return get(`/api/websiteDetection/pingDomin?domin=${domin}`)
  },

  // 获取全部可用代理ip
  getProxyIps() {
    return get(`/api/websiteDetection/getProxyIps`)
  },

  // 域名检测: 检测域名、代理ip主键id
  checkDomin(domin, id) {
    return get(`/api/websiteDetection/checkDomin?domin=${domin}&id=${id}`)
  },

  // 被墙检测
  checkFireWall(domin) {
    return get(`/api/detectWall/checkFireWall?domin=${domin}`)
  },

}