import request from '@/utils/request'

export function hcsInfo(params) {
    return request({
      url: '/hcs/get',
      method: 'get',
      params
    })
}

export function hcsList(params) {
  return request({
    url: '/hcs/list',
    method: 'get',
    params
  })
}

export function deleteHcs(params) {
    return request({
      url: '/hcs/delete',
      method: 'post',
      params
    })
}

export function addHcs(params) {
    return request({
      url: '/hcs/create',
      method: 'post',
      data: params
    })
}

export function editHcs(params) {
    return request({
      url: '/hcs/update',
      method: 'post',
      data: params
    })
}

export function hcsAuth(params) {
  return request({
    url: '/hcs/auth-user',
    method: 'post',
    data: params
  })
}
