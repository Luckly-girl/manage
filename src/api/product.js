import {get, post} from "@/utils/request"
// 产品新增/编辑 new
export const addProductNew = (data) => post(`/api/product/addProductNew`, data)
// 修改日志采集状态
export const openFilebeat = (id, isFilebeat) => post(`/api/product/openFilebeat`, {id, isFilebeat})
// 获取产品列表
export const getProductList1 = (page, limit, param) => get(`/api/product/getProductList?page=${page}&limit=${limit}&productName=${param}`)
// 获取产品详情
export const getProductInfo = (id) => get(`/api/product/getProductInfo?id=${id}`)
// 获取DNS解析下拉框列表
export const getAllDomin = (param) => get(`/api/domin/getAllDomin?type=${param}`)
// 获取DNS解析下拉框列表new
export const getDomainList = (productId) => get(`/api/domin/getDomainList?productId=${productId}`)
// 获取 节点列表 下拉框列表
export const getAllNode = (param) => get(`/api/nginx/getAllNode?type=${param}`)
// 获取 节点列表 下拉框列表new
export const getNodesNew = (productId) => get(`/api/nginx/getNodesNew?productId=${productId}`)
// 通过产品id获取对应的节点信息
export const getNginxNodeByProductId = (id) => get(`/api/product/getNginxNodeByProductId?id=${id}`)
// 删除产品
export const delProduct = (id) => post(`/api/product/delProduct`, {id})
// 根据产品查询站点列表
export const getNginxListByProductId = (id) => get(`/api/product/getNginxListByProductId?id=${id}`)



