
import {get, post} from "@/utils/request"

//82、获取全部角色信息new
export const getRolesNew = (id) => get(`/api/auth/getRolesNew?id=${id}`)
//82、获取全部角色信息
export const getRoles = () => get('/api/auth/getRoles')
//2、根据用户id查询权限树
export const getUserPerms = () => get('/api/auth/getUserPerms')
//89、获取全部菜单  /api/auth/findPerms
export const findPerms = (name) => get(`/api/auth/findPerms?name=${name}`) 
//93、新增角色 /api/auth/addRole
export const addRole = (data) => post('/api/auth/addRole',data)
//94、删除角色 /api/auth/delRole
export const delRole = (data) => post("/api/auth/delRole",data)
//91、查询角色集合 /api/auth/getRoleList
export const getRoleList = (page, limit, roleName) => get(`/api/auth/getRoleList?page=${page}&limit=${limit}&roleName=${roleName}`)
//92、编辑角色  请求路径：/api/auth/setRole
export const setRole = (data) => post('/api/auth/setRole',data)
// 90、用户查看权限查询 /api/auth/findViews
export const findViews = () => get('/api/auth/findViews')
//95、新增/编辑菜单 /api/auth/setPerm
export const setPerm = (data) => post('/api/auth/setPerm',data)
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