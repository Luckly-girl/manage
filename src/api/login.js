// import  request from "@/utils/request";
import {
  post,
  get
} from "@/utils/request"


// 登录接口
export function login(username, password, rememberMe) {
  return post("/gateway/user/login", {
    username,
    password,
    rememberMe
  })
}
// 获取权限接口
export function getUserPerms() {
  return get("/api/auth/getUserPerms")
}
// 获取用户信息接口
export function getUserInfo() {
  return get("/api/user/getUserInfo")
}
// 获取版本号接口
export function getVersionNum() {
  return get("/api/version/getVersionNum")
}
// 版本升级接口
export function versionUpdate() {
  return post("/api/version/versionUpdate")
}
// 退出登录
export function logout() {
  return get("/api/user/logout")
}

// 首页接口
export function getHomeInfo() {
  return get("/api/home/getHomeInfo")
}

// 注册接口
export function register(data) {
  return post("/api/user/register", data)
}

// 发送验证码接口
export function sendMsg(phoneNumber) {
  return post("/api/user/sendMsg", {
    phoneNumber
  })
}

// 校验验证码接口
export function checkMcode(phoneNumber, mcode) {
  return get(`/api/user/checkMcode?phoneNumber=${phoneNumber}&mcode=${mcode}`)
}