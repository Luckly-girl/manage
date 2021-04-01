import axios from "axios";
import {
    baseUrl
} from "./env.js"
import store from '@/store'
import router from '@/router'
import {
    Loading,
    Message
} from 'element-ui'
import {
    message
} from '@/utils/resetMessage'
// import qs from 'qs';     // json --> form

const request = axios.create({
    // withCredentials: true,
    baseURL: baseUrl, // 基础路径
    timeout: 60000, // 请求超时， 60000毫秒
    headers: { // 添加 header 头信息
        // "Access-Control-Allow-Origin": "*",
        // 'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        // 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', //请求头为json对象
        'Content-Type': 'application/json;charset=utf-8' //请求头为json字符串
        // 'Content-Type': 'text/plain' //请求头为json字符串
    }
});
const normalreq = axios.create({
    // withCredentials: true,
    baseURL: baseUrl, // 基础路径
    timeout: 60000, // 请求超时， 60000毫秒
    headers: { // 添加 header 头信息
        // "Access-Control-Allow-Origin": "*",
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json;charset=utf-8' //请求头为json字符串
    }
})

function respfn(res) {
    loading.close()
    const response = res.data
    if (response.code !== 200 && response.status !== 200) {
        if (response.code === 20000 || response.code === 20001) {
            message.error({
                message: response.message,
                duration: 5 * 1000
            })
            store.commit('SET_TOKEN', '')
            store.commit('SET_TOKEN', '')
            store.commit('SET_ROUTERS', [])
            store.commit('SET_ROLES', [])
            localStorage.removeItem('token')
            router.replace('login')
            // return Promise.reject('error')
        } else if (response.code === 90001) {
            message.error({
                message: '网络异常',
                duration: 5 * 1000
            })
        } else if (response.code === 90002) {
            message.error({
                message: response.message,
                duration: 5 * 1000
            })
        } else if (response.code === 103001) {
            store.dispatch("GetUserPerms").then(res => {
                message.error({
                    message: response.message,
                    duration: 5 * 1000
                })
            })
        } else {
            message.error({
                message: response.message,
                duration: 5 * 1000
            })
        }
    }
    return response
}

function errfn(err) {
    // 出现异常
    loading.close()
    message.error({
        message: '网络异常',
        duration: 5 * 1000
    })
    return Promise.reject(err)
}


// 加载数据时，打开和关闭动画特效
const loading = {
    loadingInstance: null, // Loading 实例
    open: function () {
        // console.log('加载中', this.loadingInstance)
        if (this.loadingInstance === null) { // 创建单例，防止切换路由重复加载
            // console.log('创建实例加载')
            this.loadingInstance = Loading.service({
                text: '拼命加载中...',
                // customClass: 'loadingClass',
                // target: '.main',   // 效果显示区域
                background: '#fff'
            })

        }
    },

    close: function () { // 关闭加载
        if (this.loadingInstance !== null) {
            this.loadingInstance.close()
            // console.log('结束加载')
        }
        this.loadingInstance = null
    }
}

// 请求拦截器
request.interceptors.request.use(
    config => {
        let _token = localStorage.getItem('token')
        if (_token) {
            config.headers['Authorization'] = _token
        }
        Message.closeAll()
        // 打开加载效果
        loading.open()
        return config;
    },
    err => { // 出现异常
        loading.close()
        return Promise.reject(err)
    }
);
normalreq.interceptors.request.use(
    config => {
        let _token = localStorage.getItem('token')
        if (_token) {
            config.headers['Authorization'] = _token
        }
        Message.closeAll()
        // 打开加载效果+
        return config;
    },
    err => { // 出现异常
        return Promise.reject(err);
    }
)

// 响应拦截器
request.interceptors.response.use(
    respfn,
    errfn
);
normalreq.interceptors.response.use(
    respfn,
    errfn
);

export function post(url, data) {
    return new Promise((resolve, reject) => {
        request({
            method: 'post',
            url: url,
            data: data
        }).then(res => {
            if (res.code === 200) {
                setTimeout(() => {
                    message.success({
                        message: res.message,
                        duration: 2 * 1000
                    })
                }, 0)
                resolve(res)
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export function get(url) {
    return new Promise((resolve, reject) => {
        normalreq.get(url).then(res => {
            if (res.code === 200) {
                resolve(res)
            }
        }).catch(err => {
            reject(err)
        })
    })
}