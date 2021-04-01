// import  request from "@/utils/request";
import {post,get} from "@/utils/request"


// 将全部未读消息标记为已读
export function updateAllNotice() {
  return post("/api/notice/updateAllNotice")
}

// 获取未读消息列表
export function getNoReadNoticeInfo(page) {
  return get(`/api/notice/getNoReadNoticeInfo?page=${page}&limit=5`)
}

// 获取全部消息列表
export function getAllInfo(page) {
  return get(`/api/notice/getAllInfo?page=${page}&limit=5`)
}

// 根据消息id删除消息
export function delNotice(id) {
  return post("/api/notice/delNotice", {id: id})
}

// 获取消息详情
export function getNoticeInfo(id) {
  return get(`/api/notice/getNoticeInfo?id=${id}`)
}

