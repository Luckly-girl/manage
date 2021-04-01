import {get, post} from "@/utils/request"

// 获取加入我们列表
export const getContactUsList = (page, limit) => get(`/manage/website/getContactUsList?page=${page}&limit=${limit}`)
