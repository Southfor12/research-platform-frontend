import request from '@/utils/request'

export const uploadUrl = process.env.VUE_APP_BASE_API + '/upload';

export function captcha(params) {
    return request({
      url: '/captcha',
      method: 'get',
      params
    })
}

export function mobileCaptcha(params) {
  return request({
    url: '/mobile-captcha',
    method: 'get',
    params
  })
}

export function resetPassword(params) {
  return request({
    url: '/reset-password',
    method: 'post',
    params
  })
}

export function statistics(params) {
  return request({
    url: '/stat/today',
    method: 'get',
    params
  })
}

export function randomKey() {
  return request({
    url: '/random-key',
    method: 'get'
  })
}
