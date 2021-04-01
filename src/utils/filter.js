import store from "@/store"
import Bus from "@/utils/bus"

/**
 * 将数据变为树形结构，用于树形表格
 * @param {*} data 
 */
export function translateDataToTree(data) {
  let parents = data.filter(value => value.pid == '0')
  let children = data.filter(value => value.pid != '0')

  let translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.pid === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.child !== 'undefined' ? parent.child.push(current) : parent.child = [current]
        }
      })
    })
  }
  translator(parents, children)
  return parents
}

export function dataFlagToFalse(data) {
  let translator = (data) => {
    data.forEach((item) => {
      item.child.forEach(items => {
        items.addData = false
        items.updateData = false
        items.delData = false
        items.allocData = false
      })
    })
  }
  translator(data)
  return data
}

export function objFlagToFalse (data, bol) {
  if (data.pid !== 0) {
    data.managerAddData ? data.addData = bol : data.addData = false
    data.managerUpdateData ? data.updateData = bol : data.updateData = false
    data.managerDelData ? data.delData = bol : data.delData = false
    data.managerAllocData ? data.allocData = bol : data.allocData = false
  }
}

export function treeSelect (data) {
  let children = data.filter(value => value.pid != '0')
  let selected = []
  children.forEach(item => {
    if (item.checked) {
      selected.push(item.id)
    }
  })
  return selected
}

export function treeDataPushParent (data) {
  let arr = []
  let hash = {}
  data.forEach(item => {
    if (item.pid !== 0) {
      arr.push({
        id: item.pid,
        addData: true,
        updateData: true,
        allocData: true,
        delData: true})
    }
  })
  let newArr = data.concat(arr).reduceRight((item, next) => {
    hash[next.id] ? '' : hash[next.id] = true && item.push(next)
    return item
  }, [])
  return newArr
}

export function baseBus(name, fn) {
  Bus.$on("refushPage", data => {
    if (data === name) {
      fn()
    }
  })
}

/**
 * 
 * @param {*} arr 
 */
export function addRoleFilter (arr) {
  let _arr = arr.map(({id, addData, updateData, delData, allocData}) => {
    return {id, addData, updateData, delData, allocData}
  })
  return _arr
}

export function selectFindParent (data, seleted) {
  let arr = []
  data.forEach(item => {
    seleted.forEach(a => {
      if (item.id == a && item.pid != '0') {
        arr.push(item.pid)
      }
    })
  })
  return Array.from(new Set([...seleted, ...arr]))
}
export function resetDataSpace (val) {
  // let _val = val + ''
  // return _val.replace(/^\s+|\s+$/g, '')
  return String(val).replace(/^\s+|\s+$/g, '')
}

export function deepCopy (obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

export function getRouterId (path) {
  let _id = ''
  store.state.addRouters[0].children.forEach(item => {
    if ('/' + item.path === path) {
      _id = item.meta.navId
    }
  })
  return _id
}

export function splitArr (str) {
  let temp = str.split(/[\n\s+,，]/g)
  return temp.filter(item => item != '')
}

export function removeRepeat (arr){
  let temp;
  let count;
  for (let i = 0; i < arr.length; i++) { // 第一次遍历数组，确保数组里的子数组都能被检测
    temp = arr[i]; // 存储被检测的当前子数组
    for (let k = 0; k < arr.length; k++) {
      if (k != i && arr[k].length == temp.length) { // 第二次遍历数组，检测除了被检测数组本身以及两者长度不一样的子数组
        count = 0; // 初始化
        for (let j = 0; j < arr[k].length; j++) { // 遍历检测的子数组
          if (arr[k][j] == temp[j]) {
            count++;  // 记录检测子数组与被检测子数组中的元素重复次数
          }
        }
        if (count == temp.length) { // 如果次数与被检测子数组的长度相等，代表两者重复
          arr.splice(k,1) // 删除该重复元素
          k-- // 数组长度变化，K需要减一回到当前位置
        }
      }
    }
  }
  return arr
}
// ['A01A01A01']转化为['A01', 'A01A01', 'A01A01A01']
export function selectShowParents (arr)  {
  let result = []
  if (arr.length < 2) {
    result = [arr]
  } else {
    for(let i = 0;i < arr.length; i++){
      result.push(arr.slice(0, arr.length - i))
    }
    result.reverse()
  }
  return result
}

// 分配部门操作
export function distributionDepartment (oldArr, newArr, outputArr)  {
  if (oldArr.length > newArr.length) {
    let _newNode = newArr.map(item => {
      return String(item)
    })
    let _difference = Array.from(new Set([...oldArr].filter(x => !new Set(_newNode).has(String(x)))))
    return oldArr.filter(item => String(item).indexOf(String(_difference[0])) === -1)
  } else {
    let _newArr = []
    newArr.forEach(item => {
      _newArr.push(...selectShowParents(item))
    })
    return removeRepeat([...outputArr, ..._newArr])
  }
}

