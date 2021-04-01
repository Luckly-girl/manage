import store from "../store"

/**
 * 截取字符串str，并将 字符串 push 到数组arr
 * @param {*} str 要截取的字符串
 * @param {*} arr 将 截取的字符串 存到 arr
 */
const interceptStrings = (str, arr) => {
    if (str.length >= store.state.userInfo.pgNumCode.length) {
      arr.push(str);
      // 截取字符串
      let ele = str.slice(0, str.lastIndexOf("A"));
      interceptStrings(ele, arr);   // 递归
    }
    // arr.reverse();
  }
  
/**
 * 用于级联选择器数据回显
 * 将后台返回来的一维数组（只有最后一级）----> 级联选择器 回显需要的二维数组格式（包含父级）
 * @param {*} arr 后台返回的数组（里面存储的是 最后一级编码）
 */
  export const toCascadeSelectorFormat = (arr) => {
    let arr1 = [];   // 存储 二维数组 元素
    for (let [index, item] of arr.entries()) {
      let arr2 = [];  // 存储 截取 字符串后的元素
      // 截取 字符串，并将字串保存在 arr2
      interceptStrings(item, arr2);
      // 将一维数组作为元素 保存起来
      arr1.push(arr2);
    }
    // console.log(arr1)
    // 返回结果
    return arr1;
  }





