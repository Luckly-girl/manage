/**
 *  基础路径
 */
let baseUrl, baseHost, baseWs

if (process.env.NODE_ENV === "development") {
    // baseUrl = "http://192.168.0.169:8077";      // qw
    baseUrl = "http://csmanage.bxyun.cn";
    // baseUrl = "https://manage.bxyun.cn";
    // baseUrl = "http://192.168.0.196:9093/cdn" //  lb
    // baseHost = "192.168.0.215:8077"
    baseHost = "manage.bxyun.cn"
    baseWs = "wss://"
    // baseWs = "ws://"
} else if (process.env.NODE_ENV === "production") {
    baseWs = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    // baseUrl = "https://manage.bxyun.cn"
    // baseHost = window.location.host
    // baseWs = "ws://"
    baseUrl = "http://csmanage.bxyun.cn";
    baseHost = "manage.bxyun.cn"
}
export {
    baseUrl,
    baseHost,
    baseWs
}