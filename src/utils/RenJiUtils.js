import { Base64 } from 'js-base64';
import md5 from 'js-md5';

let md5Key = md5('sucwjkey');

//字符串进行亦或加密处理
function xor(data) {
  if (typeof data !== 'string') {
    return data;
  }

  let result = '';
  for (var i = 0; i < data.length; i++) {
    var k = i % 32;
    result += String.fromCharCode(data.charCodeAt(i) ^ md5Key.charCodeAt(k));
  }

  return result;
}

//加密函数
export function encrypt(data) {
  if (typeof data !== 'string') {
    return data;
  }
  data = Base64.encode(data);
  data = xor(data);
  return Base64.encode(data);
}

//解密函数
export function decrypt(data) {
  if (typeof data !== 'string') {
    return data;
  }
  data = Base64.decode(data);
  data = xor(data);
  return Base64.decode(data);
}
