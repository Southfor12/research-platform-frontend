import request from '@/utils/request'

export function sampleDeliverInfo(params) {
    return request({
      url: '/sample-deliver/get',
      method: 'get',
      params
    })
}

export function sampleDeliverList(params) {
  return request({
    url: '/sample-deliver/list',
    method: 'get',
    params
  })
}

export function deleteSampleDeliver(params) {
    return request({
      url: '/sample-deliver/delete',
      method: 'post',
      params
    })
}

export function addSampleDeliver(params) {
    return request({
      url: '/sample-deliver/create',
      method: 'post',
      data: params
    })
}

export function editSampleDeliver(params) {
    return request({
      url: '/sample-deliver/update',
      method: 'post',
      data: params
    })
}

export function deleteSampleDeliverItem(params) {
    return request({
      url: '/sample-deliver-item/delete',
      method: 'post',
      params
    })
}

export function addSampleDeliverItem(params) {
    return request({
      url: '/sample-deliver-item/create',
      method: 'post',
      data: params
    })
}

export function editSampleDeliverItem(params) {
    return request({
      url: '/sample-deliver-item/update',
      method: 'post',
      data: params
    })
}
