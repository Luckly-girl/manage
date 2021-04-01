import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
  getUserPerms,
  getUserInfo,
  logout,
  getVersionNum
} from '@/api/login'
import {
  constantRouterMap,
  asyncRouterMap,
  parentRouterMap,
  errorRouter
} from './router'
Vue.use(Vuex);

// function recursionRouter(userRouter = [], allRouter = []) {
//   let realRoutes = []
//   // let parents = userRouter.filter(value => value.pId == '0')
//   let children = userRouter.filter(value => value.pId != '0' && value.open == true)
//   allRouter.forEach((v, i) => {
//     children.forEach((item, index) => {
//       if (item.name === v.meta.title) {
//         // if (item.children && item.children.length > 0) {
//         //   v.children = recursionRouter(item.children, v.children)
//         // }
//         realRoutes.push(v)
//       }
//     })
//   })
//   return realRoutes
// }

export default new Vuex.Store({
  state: {
    // 初始化状态
    // 版本号信息
    bxUid: 'bxyunUid',
    bxIv: 'baixunyun0000000',
    versionInfo: {
      updateFlag: '', // 0->不可升级，1->可升级
      updateStatus: '', // 1、4->升级中，2->升级成功，3->升级失败
      versionNum: ''
    },
    // 部署状态
    deployStatusList: [{
        text: '预部署',
        value: 0
      },
      {
        text: '部署中',
        value: 1
      },
      {
        text: '部署成功',
        value: 2
      },
      {
        text: '部署失败',
        value: 3
      }
    ],
    // 直播部署状态
    liveDeployStatusList: [{
        text: '未部署',
        value: 0
      },
      {
        text: '部署中',
        value: 1
      },
      {
        text: '部署成功',
        value: 2
      },
      {
        text: '部署失败',
        value: 3
      }
    ],
    // 证书申请状态
    sslStatusList: [{
        text: '未申请',
        value: 0
      },
      {
        text: '正在申请',
        value: 1
      },
      {
        text: '申请成功',
        value: 2
      },
      {
        text: '申请中',
        value: 3
      },
      {
        text: '申请失败',
        value: 4
      },
      {
        text: '取消申请',
        value: 5
      }
    ],
    // dns解析状态
    parseStatusList: [{
        text: '未解析',
        value: 0
      },
      {
        text: '解析中',
        value: 1
      },
      {
        text: '解析成功',
        value: 2
      },
      {
        text: '解析失败',
        value: 3
      }
    ],
    // 节点状态
    searchStatusList: [{
        text: '异常',
        value: 0
      },
      {
        text: '正常',
        value: 1
      }
    ],
    // 封禁类型
    banTypeList: [{
        text: '限时封禁',
        value: 0
      },
      {
        text: '永久封禁',
        value: 1
      }
    ],
    // 封禁状态
    banStatusList: [{
        text: '封禁中',
        value: 0
      },
      {
        text: '已解封',
        value: 1
      }
    ],
    // 节点类型
    productType: [{
        type: '普通节点',
        code: 1
      },
      {
        type: '备用节点',
        code: 2
      }
    ],
    // 主题颜色列表
    themeList: [{
        backgroundColor: '#4d71ee',
        color: '#fff'
      },
      {
        backgroundColor: '#304156',
        color: '#fff'
      }
    ],
    // 工单问题类型列表
    workTypeList: [
      "节点异常",
      "产品异常",
      "站点异常",
      "其他问题"
    ],
    // 工单问题状态
    workStatusList: [
      "未处理",
      "已关闭"
    ],
    theme: {
      backgroundColor: '#4d71ee',
      color: '#fff'
    },
    count: 0,
    token: '',
    navRouters: [],
    btnType: ['add', 'update', 'del', 'alloc'],
    userInfo: {},
    roles: [],
    routers: constantRouterMap,
    addRouters: [],
    tilingRouters: [],
    btnList: [],
    // 线路类型
    recordLineList: [
      '默认',
      '境内',
      '境外'
      // ,
      // '电信',
      // '联通',
      // '移动'
    ],
    siteTypeList: ['后端IP', '源站域名'],
    // IP类型
    ipTypeList: ['web', 'phone', ],
    // 协议类型
    agreementList: [{
      agreement: 'HTTP',
      code: 1
    }, {
      agreement: 'HTTPS',
      code: 2
    }],
    parseTypeList: [
      '新增',
      '删除'
    ],
    gzipTypeList: [{
      label: 'html',
      name: 'HTML'
    }, {
      label: 'css',
      name: 'CSS'
    }, {
      label: 'js',
      name: 'JS'
    }, {
      label: 'json',
      name: 'JSON'
    }],
    cacheTypeList: [{
      label: 'html',
      name: 'HTML'
    }, {
      label: 'css',
      name: 'CSS'
    }, {
      label: 'js',
      name: 'JS'
    }, {
      label: 'png',
      name: 'PNG'
    }, {
      label: 'img',
      name: 'IMG'
    }, {
      label: 'gif',
      name: 'GIF'
    }, {
      label: 'flv',
      name: 'FLV'
    }, {
      label: 'ico',
      name: 'ICO'
    }, {
      label: 'swf',
      name: 'SWF'
    }],
    cacheTimeList: [{
      type: 1,
      label: '天'
    }, {
      type: 2,
      label: '小时'
    }, {
      type: 3,
      label: '分钟'
    }],
    swichType: [0, 1],
    iconfontList: [
      'iconDNSguanli2',
      'iconyonghuguanli2',
      'iconanquanguanli2',
      'iconfengjinjilu2',
      'iconzhandianguanli2',
      'iconzhandianjiance2',
      'iconxitongguanli1',
      'iconquanxianguanli2',
      'iconzhanghaoguanli1',
      'iconzhuanyijilu1',
      'iconjiaoseguanli1',
      'iconjiedianguanli1',
      'iconchanpinguanli1',
      'icongerenxiangqing1',
      'iconcdnguanli',
      'iconcaozuorizhi1',
      'iconjiexijilu',
      'iconDNSguanli',
      'iconcaozuorizhi',
      'iconjiedianguanli',
      'iconchanpinguanli',
      'iconjiaoseguanli',
      'iconzhandianguanli',
      'iconquanxianguanli',
      'iconfengjinjilu',
      'iconjiexijilu1',
      'iconzhandianjiance',
      'iconanquanguanli',
      'icongerenxiangqing',
      'iconzhuanyijilu',
      'iconyonghuguanli',
      'iconicon_accounts',
      'iconicon_system',
      'iconicon_cdn'
    ]
  },
  mutations: {
    // 处理状态
    increment(state, payload) {
      state.count += payload.step
    },
    SET_USERINFO: (state, data) => {
      state.userInfo = data
    },
    SET_ROLES(state, data) {
      state.roles = data
    },
    SET_THEME(state, theme) {
      state.theme = theme
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      // console.log(routers,55)
      state.tilingRouters = routers.length ? routers[0].children : []
      state.routers = constantRouterMap
      // console.log(state.routers, state.tilingRouters)
    },
    SET_BTNLIST: (state, btnList) => {
      state.btnList = btnList
    },
    SET_NAV: (state, data) => {
      state.navRouters = data
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_VERSIONINFO(state, version) {
      state.versionInfo = version
      localStorage.setItem('versionInfo', JSON.stringify(version))
    }
  },
  getters: {
    roles: state => state.roles,
    addRouters: state => state.addRouters,
    btnList: state => state.btnList,
    btnType: state => state.btnType,
    userInfo: state => state.userInfo,
    getToken: (state) => {
      // if (!state.token) {
      //   state.token = localStorage.getItem('token')
      // }
      state.token = localStorage.getItem('token')
      return state.token
    },
    getVersion: (state) => {
      if (state.versionInfo.versionNum === '') {
        state.versionInfo = JSON.parse(localStorage.getItem('versionInfo'))
      }
      return state.versionInfo
    }
  },
  actions: {
    // 提交改变后的状态
    increment(context) {
      context.commit('increment')
    },
    SET_USERINFO(context) {
      context.commit('SET_USERINFO')
    },
    GetUserPerms({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserPerms().then(response => {
          commit('SET_ROLES', response.data.rows)
          commit('SET_BTNLIST', response.data.OnOff || [])
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetVersion({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getVersionNum().then(response => {
          commit('SET_VERSIONINFO', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          commit('SET_USERINFO', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    CleenAllState({
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_NAV', [])
        commit('SET_ROUTERS', [])
        commit('SET_BTNLIST', [])
        commit('SET_ROLES', [])
        resolve()
      })
    },
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROUTERS', [])
          commit('SET_BTNLIST', [])
          commit('SET_ROLES', [])
          localStorage.removeItem('token')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GenerateRoutes({
      commit,
      state
    }) {
      return new Promise(resolve => {
        let _routers = state.roles
        let _asyRouter = []
        let Tiling = function (arr) {
          arr.forEach((item) => {
            // console.log(item,5555)
            if (item.child.length <= 0) {
              _asyRouter.push({
                path: item.page,
                name: item.page,
                component: () => import(`./views/${item.page}`),
                meta: {
                  title: item.name,
                  navTitle: item.parentName,
                  navId: item.id
                }
              })
              // console.log(_asyRouter,333)
              return item
            } else if (item.child.length > 0) {
              // item.child.forEach((children) => {
              //   children.navTitle = item.name
              // })
              Tiling(item.child)
            }
          })
        }
        Tiling(_routers)

        parentRouterMap.splice(1, parentRouterMap.length - 1)
        let MainContainer = parentRouterMap[0]

        let children = MainContainer.children
        children.splice(10, children.length - 10)
        parentRouterMap.push(errorRouter)

        children.push(..._asyRouter)
        // console.log(..._asyRouter)
        commit('SET_ROUTERS', parentRouterMap)
        // if (_routers && _routers.length) {
        //   asyncRouterMap.forEach((v, i) => {
        //     _routers.forEach((item, index) => {
        //       if (item.name === v.meta.title) {
        //         _asyRouter.push(v)
        //       }
        //     })
        //   })
        // } else {
        //   _asyRouter = []
        // }
        // let accessedRouters = _asyRouter
        // parentRouterMap.splice(1,parentRouterMap.length-1)
        // let MainContainer = parentRouterMap[0]
        // let children = MainContainer.children
        // children.splice(1,children.length-1)
        // parentRouterMap.push(errorRouter)
        // children.push(...accessedRouters)
        // commit('SET_ROUTERS', parentRouterMap)
        // let parents = state.roles.filter(value => value.pId == '0')
        // let child = parentRouterMap[0].children.filter(value => value.name != 'home')
        // parents.forEach((parent) => {
        //   child.forEach((current, index) => {
        //     if (current.meta.navTitle === parent.name) {
        //       let temp = JSON.parse(JSON.stringify(child))
        //       temp.splice(index, 1)
        //       typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        //     }
        //   })
        // })
        resolve(_asyRouter)
      })
    }
  }
  // ,
  // plugins: [createPersistedState({
  //     storage: window.sessionStorage
  //   })]
})