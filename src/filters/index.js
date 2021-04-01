import store from "@/store";

/**
 * 将时间戳 转换成 固定格式时间 2019-12-19 10:01:20
 * @param {*} time 时间戳 
 */
const dateFilter = (time) => {

    let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    // console.log(date)

    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;

}

const getDateFilter = (time) => {

    let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    // console.log(date)

    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return year + "-" + month + "-" + day;

}

const msgContentFilter = (Content) => {
    let arr = Content.split('，')
    return arr.join('<br>')
}

const recordLineFilter = (status) => { // 线路类型
    if (status == undefined) return '--'
    else return store.state.recordLineList[status]
}

const parseTypeFilter = (status) => { // 解析操作类型
    if (status == undefined) return '--'
    else return store.state.parseTypeList[status]
}

const workTypeFilter = (type) => { // 工单类型
    if (type == undefined) return '--'
    else return store.state.workTypeList[type]
}

const workStatusFilter = (status) => { // 工单类型
    if (status == undefined) return '--'
    else return store.state.workStatusList[status]
}

const productTypeFilter = (status) => { // 节点类型
    if (status == undefined) return '--'
    else {
        let _type = store.state.productType.filter(item => {
            return item.code === status
        })
        return _type[0].type
    }
}


export {
    dateFilter,
    getDateFilter,
    msgContentFilter,
    parseTypeFilter,
    recordLineFilter,
    workTypeFilter,
    workStatusFilter,
    productTypeFilter
}