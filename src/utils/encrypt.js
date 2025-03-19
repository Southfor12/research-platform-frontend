import CryptoJs from "crypto-js"
import JsEncrypt from "jsencrypt"
import NodeRsa from "node-rsa"
import md5 from 'js-md5';

let clientPass = {
  'key': 'LBCO0cQLk30WY66R',
  'pubKey': '/C/c1KDjm3j7DnCD2ocK4NFfXghsc8P9bdjDzvDPmBKU/63MnPnhZxuPeF/MBt1N6RmUEYH/mNsgTAh30DcsSxyYPfH9D7XkkVjdBhGkwz4oVBpABsbQg/GFGPu/tKcOEi+b1a5Q12JY0hZ6cOCa/aDL3DY2SCFMpnYAZ7ymAVhryPEuw7QHyPfhuFs5LXf6WFc9h0l9rqoXICtVARbSu57jPAvln+15IWR/jbWYMplRutiyJaqCHZq4LBXLxga3CBu66cFyp7atabckGVJmWq6HfNBiWJyQdYInLtrl/KtChGF0iECzHMINddpoId/LBaETTiNiOAqtaHRmznd2mKM/HZ30U9az9/ITJFCp3XlpM/uB3d2YNqqh1LvpU+XNPnL5goJK0DTm3GslXRE3QPPaCHen0Yk6yg7WFHSN0banRxR0L2WVf/TKE+bw5MH1cWpmBINjOQxvG56L9PTSpEcPD2NcQr5QFIx3NRgkUDOZjoh9XBouXCseqbwTJ5rOCnSFrFtUFhNMvfcDQjAHMg4jKIyVbA8n8+y7LJlApZrm1GSWJcLDgN46K0Qb2cC63nEyGi6kf0jeNaZ1VTESZA=='
}

export function enc(data) {
  const key = '9722756041bf30025cbff04b515e76bd';
  const len = key.length;
  let encryptedData = '';
  for (let i = 0; i < data.length; i++) {
    const k = i % len;
    encryptedData += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(k));
  }
  return encryptedData;
}

/**
 * AES加密
 * word 待加密字符串
 * key  十六位十六进制数AES秘钥
 */
export function aesEncrypt(word, key) {
  return word;
  key = CryptoJs.enc.Utf8.parse(key)
  let encrypted = CryptoJs.AES.encrypt(word, key, {
    iv: key,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7,
  })
  return encrypted.toString()
}

export function aesDecrypt(encrypted, key) {
  return encrypted;
  key = CryptoJs.enc.Utf8.parse(key)
  const decipher = CryptoJs.AES.decrypt(encrypted, key, {
    iv: key,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.Pkcs7
  })
  return CryptoJs.enc.Utf8.stringify(decipher)
}

/**
 * RSA服务端公钥加密
 * word 待加密字符串
 * rsaPubKey RSA服务端公钥
 */
export function rsaEncrypt(word, rsaPubKey) {
  return word;
  let jse = new JsEncrypt()
  // jse.setPublicKey(rsaPubKey)
  jse.setPrivateKey(rsaPubKey)
  return jse.encrypt(word)
}

/**
 * AES随机秘钥
 */
export function aesRandomKey() {
  let charStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let randomKey = "";
  for (var i = 0; i < 16; i++) {
    randomKey += charStr[parseInt(Math.random() * charStr.length)];
  }
  return randomKey;
}
