
import {get, post} from "@/utils/request"

// 获取直播列表
export const queryLiveBroadcast = (page, limit, realmName, productName, deployStatus) => get(`/api/livebroad/queryLiveBroadcast?page=${page}&limit=${limit}&realmName=${realmName}&productName=${productName}&deployStatus=${deployStatus}&appName=&streamName=`)
// 获取直播详情
export const querySiteInfoByStreamName = (liveBroadId) => get(`/api/livebroad/querySiteInfoByStreamName?liveBroadId=${liveBroadId}`)
// 删除
export const delLiveBroadcast = (liveBroadId) => post("/api/livebroad/delLiveBroadcast", {liveBroadId})
// 生成直播URL
export const createLiveBroadURL = (data) => post("/api/livebroad/createLiveBroadURL", data)
// 生成直播URL
export const saveLiveBroadInfo = (data) => post("/api/livebroad/saveLiveBroadInfo", data)
// 直播分配权限
export const lbAllocationPowerData = (liveBroadId, pgId) => post('/api/livebroad/lbAllocationPowerData',{liveBroadId, pgId})