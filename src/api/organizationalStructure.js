
import {get, post} from "@/utils/request"

/**
 * 129、获取当前成员对应的组
 * @param {*} name | String | 部门名 |
 * @param {*} dataSrc | int | 获取来源(1.组织架构 2.人员分配)
 */
export const getPowerGroup = (name, dataSrc) => get(`/api/power/getPowerGroup?name=${name}&dataSrc=${dataSrc}`)

/**
 * 130、新增部门
 * @param {*} optType int 1:第一级部门，2：子部门
 * @param {*} name string 部门名称
 * @param {*} descr string 描述
 * @param {*} preNumCode string 上一级部门编码
 * @param {*} permId int 当前页面的 路由id
 */
export const insertPowerMember = (optType, name, descr, preNumCode, permId) => post('/api/power/insertPowerMember', {optType, name, descr, preNumCode, permId})

/**
 * 131、修改部门信息
 * @param {*} name string 部门名称
 * @param {*} descr string 描述
 * @param {*} curNumCode string 部门编码
 * @param {*} permId int 当前页面的 路由id
 */
export const updatePowerMember = (name, descr, curNumCode, permId) => post('/api/power/updatePowerMember', {name, descr, curNumCode, permId})

/**
 * 132、删除组信息
 * @param {*} numCode string 当前部门编码
 * @param {*} permId 当前页面的 路由id
 */
export const delPowerMember = (numCode, permId) => post('/api/power/delPowerMember', {numCode, permId})


