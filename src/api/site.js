// import request from "@/utils/request";

import {get, post } from "@/utils/request"

// 获取站点列表
export const queryNginxByCondition = (page, limit, realmName, productName, nginxState, sslStatus) => get(`/api/nginx/queryNginxByCondition?page=${page}&limit=${limit}&realmName=${realmName}&productName=${productName}&nginxState=${nginxState}&sslStatus=${sslStatus}`)

// 获取站点id查询详细站点
export const getNginxInfoById = (id) => get(`/api/nginx/getNginxInfoById?id=${id}`)

// 新增站点
export const addNginxInfo = (data) => post(`/api/nginx/addNginxInfo`, data)

// 复用cname
export const addNginxInfoNew = (data) => post(`/api/nginx/addNginxInfoNew`, data)

// 获取产品下拉框列表
export const getProductList = (type) => get(`/api/nginx/getProductList?type=${type}`)

// 获取产品下拉框列表new
export const getProductListNew = (nginxId) => get(`/api/product/getProductListNew?nginxId=${nginxId}`)

// 删除站点
export const deleteNginxInfo = (id, productId) => post(`/api/nginx/deleteNginxInfo`, { id, productId })

// 申请证书
export const applyCertificate = (id, productId) => post(`/api/nginx/applyCertificate`, { id, productId })

// 取消申请证书
export const cancleApply = (id) => post(`/api/nginx/cancleApply`, { id })

// 预部署状态，部署
export const deployNginxFile = (nginxId) => post(`/api/nginx/deployNginxFile`, {
    nginxId: nginxId
})

// 部署失败，单个重新部署
export const updateNginxDeployStatus = (nginxId, linkDeployId) => post(`/api/nginx/updateNginxDeployStatus`, {
    nginxId: nginxId,
    linkDeployId: linkDeployId
})

// 部署失败，一键重新部署
export const updateNginxAllDeployStatus = (nginxId) => post(`/api/nginx/updateNginxAllDeployStatus`, {
    nginxId: nginxId
})

// 通过站点id查询站点最近一次部署信息
// export const getDeployListByNginxId = (nginxId) => get(`/api/nginx/getDeployListByNginxId?nginxId=${nginxId}`)
export const getNginxState = (nginxId) => get(`/api/nginx/getNginxState?nginxId=${nginxId}`)

// 解析失败，单个重新解析
export const updateNginxParseStatus = (nginxId, linkParseId) => post(`/api/nginx/updateNginxParseStatus`, {
    nginxId: nginxId,
    linkParseId: linkParseId
})

// 解析失败，一键重新解析
export const updateNginxAllParseStatus = (nginxId) => post(`/api/nginx/updateNginxAllParseStatus`, {
    nginxId: nginxId
})

// 通过站点id查询站点最近一次解析信息
export const getParseListByNginxId = (nginxId) => get(`/api/nginx/getParseListByNginxId?nginxId=${nginxId}`)

// 获取站点基础详情
export const getNginxInfo = (id) => get(`/api/nginx/getNginxInfo?id=${id}`)

// 修改站点安全信息
export const updateNginxInfo = (data) => post(`/api/nginx/updateNginxInfo`, data)

// 获取站点安全详情
export const getSafeNginxInfo = (id) => get(`/api/nginx/getSafeNginxInfo?id=${id}`)

// 获取白名单安全组下拉框列表new
export const getWhiteGroupListNew = (nginxId) => get(`/api/safe/getWhiteGroupListNew?nginxId=${nginxId}`)

// 获取黑名单安全组下拉框列表new
export const getBlackGroupListNew = (nginxId) => get(`/api/safe/getBlackGroupListNew?nginxId=${nginxId}`)

// 查询国家安全组列表new
export const getCountryGroupListNew = (nginxId) => get(`/api/safe/getCountryGroupListNew?nginxId=${nginxId}`)

// 获取白名单安全组下拉框列表
export const getAllWhiteGroupList = (type) => get(`/api/safe/getAllWhiteGroupList?type=${type}`)

// 获取黑名单安全组下拉框列表
export const getAllBlackGroupList = (type) => get(`/api/safe/getAllBlackGroupList?type=${type}`)

// 修改站点安全信息
export const updateSafeInfo = (data) => post(`/api/nginx/updateSafeInfo`, data)

// 获取站点更多的模块详情
export const getMoreNginxInfo = (id) => get(`/api/nginx/getMoreNginxInfo?id=${id}`)

// 查询国家列表
export const getCountryList = () => get(`/api/nginx/getCountryList`)

// 查询国家安全组列表
export const getAllCountryGroupList = (type) => get(`/api/safe/getAllCountryGroupList?type=${type}`)

// 修改站点更多信息
export const updateMoreNginx = (data) => post(`/api/nginx/updateMoreNginx`, data)

// 缓存清理
export const clearCache = (id) => get(`/api/nginx/clearCache?id=${id}`)

// 获取站点证书详情
export const getSslNginxInfo = (id) => get(`/api/nginx/getSslNginxInfo?id=${id}`)

// 修改站点证书详情
export const updatePemContent = (data) => post(`/api/nginx/updatePemContent`, data)

// 访问code
export const searchHttpCode = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchHttpCode?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// url
export const searchVisitUrl = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchVisitUrl?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// 访问次数
export const searchVisitCount = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchVisitCount?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// 平均响应时间
export const searchResponseTime = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchResponseTime?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// 访问次数
export const searchVisitMap = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchVisitMap?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// 访问次数柱形图
export const searchCountryAndProvince = (nodeId, domain, startTime, endTime) => get(`/api/statis/searchCountryAndProvince?nodeId=${nodeId}&domain=${domain}&startTime=${startTime}&endTime=${endTime}`)

// 修改站点联系信息详情
export const updateContactInformation = (data) => post(`/api/nginx/updateContactInformation`, data)

// 获取站点联系信息详情
export const getContactInformationById = (id) => get(`/api/nginx/getContactInformationById?id=${id}`)

// 爬虫数量统计图
export const searchReptileCount = (nodeId, domain, startTime, endTime) => get(`/api/statis/searchReptileCount?nodeId=${nodeId}&domain=${domain}&startTime=${startTime}&endTime=${endTime}`)

// pv,uv统计图
export const searchPvAndUvCount = (nodeId, domain, startTime, endTime) => get(`/api/statis/searchPvAndUvCount?nodeId=${nodeId}&domain=${domain}&startTime=${startTime}&endTime=${endTime}`)

// 流量统计
export const searchNetflow = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchNetflow?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// ip top 20 统计图
export const searchIpTop = (nodeId, domain, starttime, endtime) => get(`/api/statis/searchIpTop?nodeId=${nodeId}&domain=${domain}&starttime=${starttime}&endtime=${endtime}`)

// dns劫持列表获取
export const getSiteDnsKidnapData = (siteId) => get(`/api/nginx/getSiteDnsKidnapData?siteId=${siteId}`)

// dns劫持列表获取
export const getNginxNodeTraffic = (nginxId, domain, startTime, endTime) => get(`/api/nodeTraffic/getNginxNodeTraffic?nginxId=${nginxId}&domain=${domain}&startTime=${startTime}&endTime=${endTime}`)