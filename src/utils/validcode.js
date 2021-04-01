
/**
 * ip 正则校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let validcodeip = (rule, value, callback) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error('输入格式不合法'))
  }
}

/**
 * 多个ip ，号隔开
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let ipRoles = (rule, value, callback) => {
  const reg = /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/;
  if (!value) {
    callback(new Error("必填项不能为空"));
  } else {
    let _ips = value.split(",");
    if (_ips.every(item => reg.test(item))) {
      callback();
    } else {
      callback(new Error("输入格式不合法"));
    }
  }
};

/**
 * 域名 正则表达式   www.baidu.com
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let validcodehost = (rule, value, callback) => {
  const reg = /^(([0-9a-z]+-[0-9a-z]+)+\.|([0-9a-z]+)\.)+[a-z]{2,8}$/;
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error('输入格式不合法'))
  }
}

/**
 * 端口 正则校验   8080
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let validcodeport = (rule, value, callback) => {
  const reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error('输入格式不合法'))
  }
}

/**
 * 价格 正则校验  ----最多输入两位小数
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let validcodeFloat = (rule, value, callback) => {
  // const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  const reg = /^(?!0+$)(?!0*\.0*$)\d{1,8}(\.\d{1,2})?$/;
  if (reg.test(value) == false) {
    callback(new Error("填写大于0的数字，最多两位小数"));
  } else {
    callback();
  }
}

/**
 * 大于零的正整数  正则校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let validNumber = (rule, value, callback) => {
  let reg = /^\+?[1-9]\d*$/ // /^[1-9]\d*$/  ///^\+?[1-9]\d*$/
  if (!reg.test(value)) {
    callback(new Error('请输入大于零的正整数'))
  } else {
    callback()
  }
}

/**
 * 手机号码  正则验证 11位
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let phoneNumber = (rule, value, callback) => {
  if (value && (!(/^[1][3456789]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
    callback(new Error('手机号码不符合规范'))
  } else {
    callback()
  }
}

/**
 * 6位以上密码 正则校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
let password = (rule, value, callback) => {
  if (!value) {
    callback()
    return
  }
  let reg = /^.{6,}$/;
  if (!reg.test(value)) {
    callback(new Error('密码不符合规范'))
  } else {
    callback()
  }
}

 /**
  * 电子邮箱 正则校验
  * @param {*} rule 
  * @param {*} value 
  * @param {*} callback 
  */
 let emailValue = (rule, value, callback) => {
  let temp = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/
  if (value && (!(temp).test(value))) {
    callback(new Error('邮箱格式不符合规范'))
  } else {
    callback()
  }
}

 /**
  * 名称不能为空 正则校验
  * @param {*} rule 
  * @param {*} value 
  * @param {*} callback 
  */
 let nameEmptyValue = (rule, value, callback) => {
  let temp = /(^\s+)|(\s+$)|\s+/g
  if (value && ((temp).test(value))) {
    callback(new Error('名称中不可以含有空格'))
  } else {
    callback()
  }
}

export default {
  validcodeip,
  validcodehost,
  validcodeport,
  validcodeFloat,
  validNumber,
  phoneNumber,
  emailValue,
  password,
  nameEmptyValue
}