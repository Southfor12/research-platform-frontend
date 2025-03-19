import request from '@/utils/request'

export function reagentInfo(params) {
    return request({
      url: '/reagent/get',
      method: 'get',
      params
    })
}

export function reagentList(params) {
  return request({
    url: '/reagent/list',
    method: 'get',
    params
  })
}

export function deleteReagent(params) {
    return request({
      url: '/reagent/delete',
      method: 'post',
      params
    })
}

export function addReagent(params) {
    return request({
      url: '/reagent/create',
      method: 'post',
      data: params
    })
}

export function editReagent(params) {
    return request({
      url: '/reagent/update',
      method: 'post',
      data: params
    })
}

export function reagentLevelInfo(params) {
    return request({
      url: '/reagent-level/get',
      method: 'get',
      params
    })
}

export function reagentLevelList(params) {
  return request({
    url: '/reagent-level/list',
    method: 'get',
    params
  })
}

export function deleteReagentLevel(params) {
    return request({
      url: '/reagent-level/delete',
      method: 'post',
      params
    })
}

export function addReagentLevel(params) {
    return request({
      url: '/reagent-level/create',
      method: 'post',
      data: params
    })
}

export function editReagentLevel(params) {
    return request({
      url: '/reagent-level/update',
      method: 'post',
      data: params
    })
}
