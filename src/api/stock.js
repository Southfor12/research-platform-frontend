import request from '@/utils/request'

export function chemicalOrderList(params) {
  return request({
    url: '/chemical-order/list',
    method: 'get',
    params
  })
}

export function chemicalOrderInfo(params) {
  return request({
    url: '/chemical-order/get',
    method: 'get',
    params
  })
}

export function addChemicalOrder(params) {
  return request({
    url: '/chemical-order/create',
    method: 'post',
    data: params
  })
}

export function editChemicalOrder(params) {
  return request({
    url: '/chemical-order/update',
    method: 'post',
    data: params
  })
}

export function cancleChemicalOrder(params) {
    return request({
      url: '/chemical-order/cancel',
      method: 'post',
      data: params
    })
}
  
export function auditChemicalOrder(params) {
    return request({
        url: '/chemical-order/audit',
        method: 'post',
        data: params
    })
}

export function auditPlatformChemicalOrder(params) {
  return request({
      url: '/chemical-order/platform-audit',
      method: 'post',
      data: params
  })
}

export function completeChemicalOrder(params) {
    return request({
        url: '/chemical-order/complete',
        method: 'post',
        data: params
    })
}

export function chemicalFlow(params) {
  return request({
    url: '/chemical-order/chemical-flow',
    method: 'get',
    params
  })
}
