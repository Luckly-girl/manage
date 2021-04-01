import {
    post,
    get
} from "@/utils/request";

// 获取域名列表
export const getDomainList = (domainName, page, limit, sortField, sortType) => get(`/dns/api/domain/getDomainList?domainName=${domainName}&page=${page}&limit=${limit}&sortField=${sortField}&sortType=${sortType}`)

//添加域名
export const saveDomain = (data) => post(`/dns/api/domain/saveDomain`, data)

//操作---备注信息
export const updateRemark = (data) => post(`/dns/api/domain/updateRemark`, data)

//操作---域名暂停
export const updateDomainState = (data) => post(`/dns/api/domain/updateDomainState`, data)

// 操作---域名锁定
export const lockDomain = (data) => post(`/dns/api/domain/lockDomain`, data)

//操作---删除
export const delDomain = (data) => post(`/dns/api/domain/delDomain`, data)

//获取域名记录详情列表
export const getDomainInfoList = (domainId, recordValue, page, limit, sortField, sortType) => get(`/dns/api/domainInfo/getDomainInfoList?domainId=${domainId}&recordValue=${recordValue}&page=${page}&limit=${limit}&sortField=${sortField}&sortType=${sortType}`)

//修改编辑备注信息
export const updateRemarkData = (data) => post(`/dns/api/domainInfo/updateRemark`, data)

//删除解析记录
export const delDomainInfo = (data) => post(`/dns/api/domainInfo/delDomainInfo`, data)

//修改域名解析状态
export const updateDomainInfoState = (data) => post(`/dns/api/domainInfo/updateDomainInfoState`, data)

//新增域名解析
export const saveDomainInfo = (data) => post(`/dns/api/domainInfo/saveDomainInfo`, data)

//修改域名详情
export const updateDomainInfo = (data) => post(`/dns/api/domainInfo/updateDomainInfo`, data)

//dns解析统计
export const dnsAnalysisStatistics = (format, startTime, endTime, hostRecod, domainName) => get(`/dns/api/domainInfo/dnsAnalysisStatistics?format=${format}&startTime=${startTime}&endTime=${endTime}&hostRecod=${hostRecod}&domainName=${domainName}`)

//dns解析统计记录下载
export const exportDnsAnalysisStatistics = (format, startTime, endTime, domainName) => get(`/dns/api/domainInfo/exportDnsAnalysisStatistics?format=${format}&startTime=${startTime}&endTime=${endTime}&domainName=${domainName}`)

//获取解析日志
export const getOperationRecord = (domainId) => get(`/dns/api/domainInfo/getOperationRecord?domainId=${domainId }`)

//解析日志导出
export const exportOperationRecord = (domainId) => get(`/dns/api/domainInfo/exportOperationRecord?domainId=${domainId }`)


//批量新增域名
export const batchSaveDomain = (data) => post(`/dns/api/domain/batchSaveDomain`, data)

//添加记录---搜索域名
export const getDomainByDomainName = (domainName) => get(`/dns/api/domain/getDomainByDomainName?domainName=${domainName }`)

//批量添加记录
export const saveBatchDomainInfo = (data) => post(`/dns/api/domainInfo/saveBatchDomainInfo`, data)

//修改记录查询
export const getDomainInfo = (data) => post(`/dns/api/domainInfo/getDomainInfo`, data)

//批量修改解析记录
export const updateBatchDomainInfo = (data) => post(`/dns/api/domainInfo/updateBatchDomainInfo`, data)

//获取操作日志
export const getOperationLogData = (page, limit) => get(`/dns/api/operationLog/getOperationLog?page=${page}&limit=${limit}`)

//获取操作日志详情
export const getOperationLogInfo = (operationLogId) => get(`/dns/api/operationLog/getOperationLogInfo?operationLogId=${operationLogId}`)

//获取域名主机列表
export const getHostRecordList = (domainId) => get(`/dns/api/domainInfo/getHostRecordList?domainId=${domainId}`)