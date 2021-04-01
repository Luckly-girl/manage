
import {get, post} from "@/utils/request"

// 新增流量配置接口
export const insertCfgNetwork = (data) => post('/api/cfgnetwork/insertCfgNetwork', data)
// 获取流量配置列表
export const getCfgData = (page, limit) => get(`/api/cfgnetwork/getCfgData?page=${page}&limit=${limit}`)
// 修改配置流量信息
export const updateCfgNetwork = (data) => post('/api/cfgnetwork/updateCfgNetwork', data)
// 删除配置流量信息
export const delCfgNetwork = (id) => post('/api/cfgnetwork/delCfgNetwork', {id}) 
