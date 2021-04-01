import {get, post} from "@/utils/request"

// 获取白名单组列表
export const getWhiteGroupList = (page, limit, conditions) => get(`/api/safe/getWhiteGroupList?page=${page}&limit=${limit}&conditions=${conditions}`)

// 新增白名单组
export const saveWhiteGroup = (data) => post(`/api/safe/saveWhiteGroup`, data)

// 获取白名单组详情
export const getWhiteGroupInfo = (id) => get(`/api/safe/getWhiteGroupInfo?id=${id}`)

// 编辑白名单组
export const updateWhiteGroup = (data) => post(`/api/safe/updateWhiteGroup`, data)

// 删除白名单组
export const delWhiteGroup = (whiteGroupId) => post(`/api/safe/delWhiteGroup`, {whiteGroupId})

// 获取黑名单组列表
export const getBlackGroupList = (page, limit, conditions) => get(`/api/safe/getBlackGroupList?page=${page}&limit=${limit}&conditions=${conditions}`)

// 新增黑名单组
export const saveBlackGroup = (data) => post(`/api/safe/saveBlackGroup`, data)

// 获取黑名单组详情
export const getBlackGroupInfo = (id) => get(`/api/safe/getBlackGroupInfo?id=${id}`)

// 编辑黑名单组
export const updateBlackGroup = (data) => post(`/api/safe/updateBlackGroup`, data)

// 删除黑名单组
export const delBlackGroup = (blackGroupId) => post(`/api/safe/delBlackGroup`, {blackGroupId})

// 获取国家组列表
export const getCountryGroupList = (page, limit, conditions) => get(`/api/safe/getCountryGroupList?page=${page}&limit=${limit}&conditions=${conditions}`)

// 新增国家组
export const saveCountryGroup = (data) => post(`/api/safe/saveCountryGroup`, data)

// 获取国家组详情
export const getCountryGroupInfo = (id) => get(`/api/safe/getCountryGroupInfo?id=${id}`)

// 编辑国家组
export const updateCountryGroup = (data) => post(`/api/safe/updateCountryGroup`, data)

// 删除国家组
export const delCountryGroup = (countryGroupId) => post(`/api/safe/delCountryGroup`, {countryGroupId})

// 查询国家列表  获取放行国家
export const getCountryList = () => get(`/api/nginx/getCountryList`)

