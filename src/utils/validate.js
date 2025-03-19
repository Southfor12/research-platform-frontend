import store from '@/store'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validMobile(str) {
  return /^1[0123456789]\d{9}$/.test(str)
}

export function checkPhone(rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号'))
    }
  }
}

export function validEmail(rule, value, callback) {
  if (!value) {
    callback()
  } else {
    const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确E-mail'))
    }
  }
}

export function checkNumber(rule, value, callback) {
    if(value === "" || value ==null){
      return callback(new Error("请输入有效数字"))
    }
    if (isNaN(value)) {
      return callback(new Error("请输入有效数字"))
    }
    callback()
}

export function checkGtZero(rule, value, callback) {
  if(value === "" || value ==null){
    return callback(new Error("请输入有效数字"))
  }
  if (isNaN(value)) {
    return callback(new Error("请输入有效数字"))
  }
  if (Number(value) <= 0) {
      return callback(new Error("请输入大于0的值"))
  }
  callback()
}

export function checkGtEtZero(rule, value, callback) {
  if(value === "" || value ==null){
    return callback(new Error("请输入有效数字"))
  }
  if (isNaN(value)) {
    return callback(new Error("请输入有效数字"))
  }
  if (Number(value) < 0) {
      return callback(new Error("请输入大于等于0的值"))
  }
  callback()
}

export function checkInt(rule, value, callback) {
  if(value === "" || value ==null){
    return callback(new Error("请输入有效数字"))
  }
  if (isNaN(value)) {
    return callback(new Error("请输入有效数字"))
  }
  if (!Number.isInteger(Number(value)) || Number(value) < 0) {
    return callback(new Error("请输入非负整数"))
  }
  callback()
}

export function checkNode(node) {
  return store.getters.nodes.some(item => {
    if (node == item) {
      return true
    }
  })
}
