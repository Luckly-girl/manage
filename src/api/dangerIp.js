
import {get, post} from "@/utils/request"

// 高危IP列表
export const getLogBlockIps = (page, limit, count, ip) => get(`/api/logBlockIp/getLogBlockIps?page=${page}&limit=${limit}&count=${count}&ip=${ip}`)
// 查记录详情列表
export const getLogBlockIpInfos = (page, limit, ip) => get(`/api/logBlockIp/getLogBlockIpInfos?page=${page}&limit=${limit}&ip=${ip}`)