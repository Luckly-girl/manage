import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as filters from './filters/index'
import '@/assets/css/base.css'
import '@/premission'
import '@/assets/iconfont/iconfont.css'
import promise from 'es6-promise'
import elButton from '@/components/themeButton'
import elPagination from '@/components/pagination'
import 'vx-easyui/dist/themes/default/easyui.css';
import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import EasyUI from 'vx-easyui';
import _ from 'lodash'

promise.polyfill()

Vue.use(EasyUI);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.component(elButton.name, elButton)
Vue.component(elPagination.name, elPagination)

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.prototype.btnAuthority = (path, key) => {
    if (store.getters.btnList.length > 0) {
        let btns = store.getters.btnList
        let type = false
        let _key = path.split('/')[1] + '-' + store.getters.btnType[key]
        btns.map((item) => {
            if (item === _key) {
                type = true
            }
        })
        return type
    } else {
        return false
    }
}
Vue.prototype.homeAuthority = (path) => {
    return store.state.tilingRouters.some(item => {
        return item.path === path
    })
}
Vue.config.productionTip = false; // 是否生产环境（否，现在是开发环境）
// console.log(process.env.VUE_APP_SERVICE_URL);
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App),
    // mounted () {
    //     document.dispatchEvent(new Event('render-event'))
    // }
}).$mount("#app");