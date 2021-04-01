
import {get, post} from "@/utils/request"

// 81、获取用户管理列表
export const getUsersList = (page, limit, uname, umobile, insertTimeStart, insertTimeEnd) => get(`/api/user/getUsersList?page=${page}&limit=${limit}&uname=${uname}&umobile=${umobile}&insertTimeStart=${insertTimeStart}&insertTimeEnd=${insertTimeEnd}`)
// 84、新增/编辑用户
export const setUser = (data) => post('/api/user/setUser',data)
//83、修改用户在职状态
export const setJobUser = (data) => post('/api/user/setJobUser',data)
//85、查询用户及其对应的角色信息
export const getUserAndRoles = (data) => get(`/api/user/getUserAndRoles?id=${data}`) 
//86、删除用户
export const delUser = (data) => post('/api/user/delUser',data)
//87、回复删除
export const recoverUser = (data) => post('/api/user/recoverUser',data)
// // 修改用户登录密码 /api/user/setPwd
// export const setPwd = (data) => post('/api/user/setPwd',data)
// // 修改昵称
// export const setNickname = (data) =>post ('/api/user/setNickname',data)
// 修改用户密码及昵称
export const setPwdAndNickName = (data) => post('/api/user/setPwdAndNickName',data)

// 129、获取当前成员对应的组
export const getPowerGroup = (name, dataSrc) => get(`/api/power/getPowerGroup?name=${name}&dataSrc=${dataSrc}`)


