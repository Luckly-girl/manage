
import {get, post} from "@/utils/request"

// 查询历史工单列表
export const getWorkOrderList = (page, limit, title) => get(`/api/workorder/getWorkOrderList?page=${page}&limit=${limit}&title=${title}`)
// 提交工单
export const workorderCreate = (data) => post('/api/workorder/create', data)
// 删除工单
export const delWorkOrder = (id) => post('/api/workorder/delWorkOrder', {id})
// admin查询所有工单
export const getAllWorkOrderList = (page, limit, title) => get(`/api/admin/workorder/getWorkOrderList?page=${page}&limit=${limit}&title=${title}`)
// admin处理操作
export const updateStatus = (data) => post('/api/admin/workorder/updateStatus', data)