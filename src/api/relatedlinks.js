import request from '@/utils/request'

export function relatedLinksInfo(params) {
    return request({
      url: '/link/get',
      method: 'get',
      params
    })
}

export function relatedLinksList(params) {
  return request({
    url: '/link/list',
    method: 'get',
    params
  })
}

export function deleteRelatedLinks(params) {
    return request({
      url: '/link/delete',
      method: 'post',
      params
    })
}

export function addRelatedLinks(params) {
    return request({
      url: '/link/create',
      method: 'post',
      data: params
    })
}

export function editRelatedLinks(params) {
    return request({
      url: '/link/update',
      method: 'post',
      data: params
    })
}