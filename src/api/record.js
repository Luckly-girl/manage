import {
  post,
  get
} from "@/utils/request";

// 获取日志封禁记录列表
export function getLogBanList(page, limit, banType, banStatus, nginxName) {
  return get(`/api/logBan/getLogBanList?page=${page}&limit=${limit}&banType=${banType}&banStatus=${banStatus}&nginxName=${nginxName}`)
}

// 获取转移记录列表
export function getTransferList(page, limit) {
  return get(`/api/transfer/getTransferList?page=${page}&limit=${limit}`)
}

// 获取转移记录列表
export function getParseList(page, limit) {
  return get(`/api/parse/getParseList?page=${page}&limit=${limit}`)
}

// 解封ip
export function unBlock(id) {
  return post('/api/logBan/unBlock', {
    id
  })
}

//检测记录
export function getNodeDetectRecord(page, limit, nodeHost) {
  return get(`/api/detect/getNodeDetectRecord?page=${page}&limit=${limit}&nodeHost=${nodeHost}`)
}