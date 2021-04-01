/**
 *  加密解密
 */
import CryptoJS from "crypto-js"
import store from "@/store"

export function setCookie(portId, psw, exdays) {
  // Encrypt，加密账号密码
  let cipherPortId = CryptoJS.AES.encrypt(portId + '', store.state.bxUid).toString()
  let cipherPsw = CryptoJS.AES.encrypt(psw + '', store.state.bxUid).toString()
  // console.log(cipherPortId+'/'+cipherPsw)//打印一下看看有没有加密成功

  let exdate = new Date() //获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) //保存的天数
  //字符串拼接cookie，为什么这里用了==，因为加密后的字符串也有个=号，影响下面getcookie的字符串切割，你也可以使用更炫酷的符号。
  window.document.cookie = "currentPortId" + "==" + cipherPortId + ";path=/;expires=" + exdate.toGMTString()
  window.document.cookie = "password" + "==" + cipherPsw + ";path=/;expires=" + exdate.toGMTString()
}
//读取cookie
export function getCookie() {
  let userInfo = {
    username: '',
    password: ''
  }
  if (document.cookie.length > 0) {
    let arr = document.cookie.split("; ") //这里显示的格式请根据自己的代码更改
    for (let i = 0; i < arr.length; i++) {
      let arr2 = arr[i].split("==") //根据==切割
      //判断查找相对应的值
      if (arr2[0] == "currentPortId") {
        // Decrypt，将解密后的内容赋值给账号
        let bytes = CryptoJS.AES.decrypt(arr2[1], store.state.bxUid)
        userInfo.username = bytes.toString(CryptoJS.enc.Utf8);
      } else if (arr2[0] == "password") {
        // Decrypt，将解密后的内容赋值给密码
        let bytes = CryptoJS.AES.decrypt(arr2[1], store.state.bxUid)
        userInfo.password = bytes.toString(CryptoJS.enc.Utf8)
      }
    }
  }
  return userInfo
}

//清除cookie
export function clearCookie() {
  setCookie("", "", -1)
}

const _key = CryptoJS.enc.Base64.parse('db2139561c9fe068');
const _iv = CryptoJS.enc.Base64.parse('db2139561c9fe068');


// 加密
// export function encrypt (data) {
//   let encrypted = ''
//   if (typeof(data) === 'string') {
//     encrypted = CryptoJS.AES.encrypt(data, _key, {
//       iv : _iv,
//       mode : CryptoJS.mode.CBC,
//       padding : CryptoJS.pad.Pkcs7
//     })
//   } else if (typeof(data) === 'object'){
//     data = JSON.stringify(data)
//     encrypted = CryptoJS.AES.encrypt(data, _key ,{
//       iv : _iv,
//       mode : CryptoJS.mode.CBC,
//       padding : CryptoJS.pad.Pkcs7
//     })
//   }
//   return encrypted.toString()
// }
export function encrypt(data) {
  return CryptoJS.AES.encrypt(data, store.state.bxUid).toString()
}
export function decrypt(message) {
  let k = CryptoJS.AES.decrypt(message, store.state.bxUid)
  return k.toString(CryptoJS.enc.Utf8)
}

// 解密
// export function decrypt (message) {
//   let decrypted = ''
//   decrypted = CryptoJS.AES.decrypt(message, _key, {
//     iv : _iv,
//     mode : CryptoJS.mode.CBC,
//     padding : CryptoJS.pad.Pkcs7
//   })
//   return decrypted.toString(CryptoJS.enc.Utf8)
// }

export function encryptByAES (message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(store.state.bxUid);
  var encrypted = CryptoJS.AES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64).replace(/[\r\n]/g, '');
}

export function decryptByAES (ciphertext, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(store.state.bxUid);
  var decrypted = CryptoJS.AES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext.replace(/[\r\n]/g, ''))
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encryptKey (key) {
  let array = key.split('')
  let letters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let encryptedKey = ''
  for (let i = 0; i < array.length; i++) {
    encryptedKey += array[i]
    for (let j = 0; j < i % 2 + 1; j++) {
      encryptedKey += letters.substr(parseInt(Math.random() * letters.length), 1)
    }
  }
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedKey.split('').reverse().join('')))
}

export function decryptKey (encryptedKey) {
  encryptedKey = CryptoJS.enc.Base64.parse(encryptedKey).toString(CryptoJS.enc.Utf8).split('').reverse().join('')
  let str = ''
  for (let i = 0, j = 0; i < encryptedKey.length; i++) {
    str += encryptedKey[i]
    i += (j++ % 2 + 1)
  }
  return str
}

