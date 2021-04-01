import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

export const constantRouterMap = [{
        path: "/",
        redirect: {
            name: "login"
        }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("./views/login")
    },
    {
        path: "/regist",
        name: "regist",
        component: () => import("./views/regist")
    }
]
export const parentRouterMap = [{
    path: "",
    name: "layout",
    component: () => import("./components/Layout"),
    children: [{
            // 嵌套路由不用加 
            path: "home",
            name: "home",
            component: () => import("./views/home")
        },
        {
            path: "workOrderHistory",
            name: "workOrderHistory",
            component: () => import("./views/workOrder/workOrderHistory")
        },
        {
            path: "workOrderSub",
            name: "workOrderSub",
            component: () => import("./views/workOrder/workOrderSub")
        },
        {
            path: 'domainDetial',
            name: 'domainDetial',
            component: () => import("./views/domainDetial/domainDetial")
        },
        {
            path: 'batch',
            name: 'batch',
            component: () => import("./views/batch/index.vue")
        },
        {
            path: 'batch/addRecord',
            name: 'addRecord',
            component: () => import("./views/batch/addRecord/addRecord.vue")
        },
        {
            path: 'batch/editRecord',
            name: 'editRecord',
            component: () => import("./views/batch/editRecord/editRecord.vue")
        },
        {
            path: 'batch/operateLog',
            name: 'operateLog',
            component: () => import("./views/batch/operateLog/operateLog.vue")
        },
        {
            path: 'batch/operateLog/operDomain',
            name: 'operDomain',
            component: () => import('./views/batch/operateLog/operDomain/index.vue')
        },
        {
            path: 'batch/operateLog/operRecord',
            name: 'operRecord',
            component: () => import('./views/batch/operateLog/operRecord/index.vue')
        }

    ]
}]

// export const batchRouterMap = [{
//     path: "",
//     name: "batch",
//     component: () => import("./views/batch"),
//     children: [{
//             path: 'addDomainName',
//             name: 'addDomainName',
//             component: () => import("./views/batch/addDomainName/addDomainName.vue")
//         },
//         {
//             path: 'addRecord',
//             name: 'addRecord',
//             component: () => import("./views/batch/addRecord/addRecord.vue")
//         },
//         {
//             path: 'editRecord',
//             name: 'editRecord',
//             component: () => import("./views/batch/editRecord/editRecord.vue")
//         },
//         {
//             path: 'operateLog',
//             name: 'operateLog',
//             component: () => import("./views/batch/operateLog/operateLog.vue")
//         }
//     ]
// }]

export default new Router({
    mode: 'history',
    routes: constantRouterMap
})

export const errorRouter = {
    path: '*',
    component: () => import('./views/error/404')
}

// export const asyncRouterMap = [
//   {
//     path: 'nodeList',
//     name: 'nodeList',
//     component: () => import('./views/nodeList'),
//     meta: { navTitle: 'CDN管理', title: '节点列表' }
//   },
//   {
//     path: 'production',
//     name: 'production',
//     component: () => import('./views/production'),
//     meta: { navTitle: 'CDN管理', title: '产品管理' }
//   },
//   {
//     path: 'site',
//     name: 'site',
//     component: () => import('./views/site'),
//     meta: { navTitle: 'CDN管理', title: '站点管理' }
//   },
//   {
//     path: 'DNS',
//     name: 'DNS',
//     component: () => import('./views/DNS'),
//     meta: { navTitle: 'CDN管理', title: 'DNS管理' }
//   },
//   {
//     path: 'siteDetection',
//     name: 'siteDetection',
//     component: () => import('./views/siteDetection'),
//     meta: { navTitle: 'CDN管理', title: '站点检测' }
//   },
//   {
//     path: 'security',
//     name: 'security',
//     component: () => import('./views/security'),
//     meta: { navTitle: 'CDN管理', title: '安全管理' }
//   },
//   {
//     path: 'transferRecord',
//     name: 'transferRecord',
//     component: () => import('./views/transferRecord'),
//     meta: { navTitle: 'CDN管理', title: '转移记录' }
//   },
//   {
//     path: 'logStorageRecord',
//     name: 'logStorageRecord',
//     component: () => import('./views/logStorageRecord'),
//     meta: { navTitle: 'CDN管理', title: '日志封禁记录' }
//   },
//   {
//     path: 'user',
//     name: 'user',
//     component: () => import('./views/user'),
//     meta: { navTitle: '系统管理', title: '用户管理' }
//   },
//   {
//     path: 'role',
//     name: 'role',
//     component: () => import('./views/role'),
//     meta: { navTitle: '系统管理', title: '角色管理' }
//   },
//   {
//     path: 'organizationalStructure',
//     name: 'organizationalStructure',
//     component: () => import('./views/organizationalStructure'),
//     meta: { navTitle: '组织架构', title: '组织架构' }
//   },
//   {
//     path: 'permission',
//     name: 'permission',
//     component: () => import('./views/permission'),
//     meta: { navTitle: '系统管理', title: '权限管理' }
//   },
//   {
//     path: 'operLog',
//     name: 'operLog',
//     component: () => import('./views/operationLog'),
//     meta: { navTitle: '系统管理', title: '操作日志' }
//   },
//   {
//     path: 'personalDetails',
//     name: 'personalDetails',
//     component: () => import('./views/personalDetails'),
//     meta: { navTitle: '账号管理', title: '个人详情' }
//   }
// ]