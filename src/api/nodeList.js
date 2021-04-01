// import request from "@/utils/request";

import {get, post} from "@/utils/request"

// 获取节点列表
export const getNodeList = (page, limit, nodeHost, status) => get(`/api/nginx/getNodeList?page=${page}&limit=${limit}&nodeHost=${nodeHost}&status=${status}`)

// 获取指定的服务器性能的消息
export const getIpNodeInfo = (id, begin_time, end_time) => get(`/api/webNodeInfo/getIpNodeInfo?ip=${id}&begin_time=${begin_time}&end_time=${end_time}`)

// 添加节点
export const addNginxNode = (addForm) => post(`/api/nginx/addNginxNode`, addForm)

// 点击编辑 获取节点详情
export const getNodeInfo = (id) => get(`/api/nginx/getNodeInfo?id=${id}`)

// 节点连接检测
export const checkNginxNode = (data) => post(`/api/nginx/checkNginxNode`, data)

// 删除节点
export const delNginxNode = (id) => post(`/api/nginx/delNginxNode`, {id})

// 防火墙开关
export const updateNodeIpTablesOpenStatus = (id, ipTableState) => post(`/api/nginx/updateNodeIpTablesOpenStatus`, {id, ipTableState})

// 获取节点状态列表
export const getNodeStatusById = (nodeId) => get(`/api/nginx/getNodeStatusById?nodeId=${nodeId}`)

// 获取节点状态列表
export const updateVersion = (nodeId) => post('/api/nginx/updateVersion', {nodeId})



