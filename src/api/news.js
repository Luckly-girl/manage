
import {get, post} from "@/utils/request"

// 获取新闻列表
export const newsCenterList = (page, limit, roleName) => get(`/manage/website/newsCenterList?page=${page}&limit=${limit}`)
// 删除新闻
export const delNewsCenter = (id) => post('/manage/website/delNewsCenter',{id})
// 新增新闻
export const addNewsCenter = (data) => post('/manage/website/addNewsCenter', data)
// 编辑新闻
export const updateNewsCenter = (data) => post('/manage/website/updateNewsCenter', data)
// 查询新闻详情
export const getDetailNewsCenter = (id) => get(`/manage/website/getDetailNewsCenter?id=${id}`)
//97、删除菜单 /api/auth/del
export const del=(data) => post('/api/auth/del',data)
//96、获取单项菜单详情 /api/auth/getPerm
export const getPerm = (data) => get(`/api/auth/getPerm?id=${data}`)
//113、获取操作日志列表 /api/sys/queryOperateLog
export const queryOperateLog = (page, limit, username) => get(`/api/sys/queryOperateLog?page=${page}&limit=${limit}&username=${username}`)
//124、根据id查询角色 /api/auth/queryRole
export const queryRole = (id) => get(`/api/auth/queryRole?id=${id}`)


/**
 * 133、保存数据分配
 * @param {*} pgId | String | 组织编号
 * @param {*} showId | String | 单行数据id
 * @param {*} permPage | int | 权限路由id
 */
export const allocationPowerData = (pgId, showId, permPage) => post('/api/power/allocationPowerData',{
  pgId: pgId,
  showId: showId,
  permPage: permPage,
  safeType: 0})

  export const allocationPowerDataNew = (pgId, showId, permPage, safeType) => post('/api/power/allocationPowerData',{pgId, showId, permPage, safeType})

/**
 * 133、分配组织架构回显
 * @param {*} pgId | String | 组织编号
 * @param {*} showId | String | 单行数据id
 * @param {*} permPage | int | 权限路由id
 */
export const getAllocationPowerData = (showId, permPage) => get(`/api/power/getAllocationPowerData?showId=${showId}&permPage=${permPage}&safeType=0`)

/**
 * 133、分配组织架构回显
 * @param {*} pgId | String | 组织编号
 * @param {*} showId | String | 单行数据id
 * @param {*} permPage | int | 权限路由id
 */
export const getAllocationPowerDataNew = (showId, permPage, safeType) => get(`/api/power/getAllocationPowerData?showId=${showId}&permPage=${permPage}&safeType=${safeType}`)