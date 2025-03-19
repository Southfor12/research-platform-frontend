import request from '@/utils/request'

export function cardInfo(params) {
    return request({
      url: '/card/get',
      method: 'get',
      params
    })
}

export function unbindCard(params) {
    return request({
      url: '/card/unbind-user',
      method: 'post',
      params
    })
}

export function updateUnlockAdmin(params) {
  return request({
    url: '/card/update-unlock-admin',
    method: 'post',
    params
  })
}

export function cardList(params) {
  return request({
    url: '/card/list',
    method: 'get',
    params
  })
}

export function deleteCard(params) {
    return request({
      url: '/card/delete',
      method: 'post',
      params
    })
}

export function addCard(params) {
    return request({
      url: '/card/create',
      method: 'post',
      data: params
    })
}

export function editCard(params) {
    return request({
      url: '/card/update',
      method: 'post',
      data: params
    })
}

export function addPermission(params) {
  return request({
    url: '/card/add-permission',
    method: 'post',
    data: params
  })
}

export function deletePermission(params) {
  return request({
    url: '/card/delete-permission',
    method: 'post',
    params
  })
}
