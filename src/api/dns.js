// import request from "@/utils/request";

import {get, post} from "@/utils/request"

// 获取DNS解析列表
export const getDominList = (page, limit, domin) => get(`/api/domin/getDominList?page=${page}&limit=${limit}&domin=${domin}`)

// 新增DNS解析
export const addDomin = (data) => post(`/api/domin/addDomin`, data)

// 获取DNS解析详情
export const getDominInfo = (id) => get(`/api/domin/getDominInfo?id=${id}`)

// DNS解析编辑
export const updateDomin = (data) => post(`/api/domin/updateDomin`, data)

// 删除DNS解析
export const delDomin = (dominId) => post(`/api/domin/delDomin`, {dominId})

// 修改DNS解析状态 表格 switch 开关
export const updateDnsStatus = (dominId) => post(`/api/domin/updateDnsStatus`, {dominId})



