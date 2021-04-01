import {get, post } from "@/utils/request"

/**
 * 获取nginx日志列表
 * 
 * @param {*} showPage 分页
 * @param {*} showSize 
 * @param {*} domain 域名
 * @param {*} requestMethod 请求类型
 * @param {*} httpStatus http状态码
 * @param {*} startTime 开始时间
 * @param {*} endTime 结束时间
 */
const searchBackgroundLog = (showPage, showSize, domain, requestMethod, httpStatus, startTime, endTime) => get(`api/statis/searchBackgroundLog?showPage=${showPage}&showSize=${showSize}&domain=${domain}&requestMethod=${requestMethod}&httpStatus=${httpStatus}&startTime=${startTime}&endTime=${endTime}`);


export {
    searchBackgroundLog
}