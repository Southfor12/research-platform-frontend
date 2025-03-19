import request from '@/utils/request'

export function listApparatusData(params) {
    return request({
      url: '/apparatus-data/list',
      method: 'get',
      params
    })
}

export function allApparatus(params) {
    return request({
      url: '/apparatus-data/all-apparatus',
      method: 'get',
      params
    })
}

export function createApparatusData(params) {
    return request({
      url: '/apparatus-data/create',
      method: 'post',
      data: params
    })
}

export function deleteApparatusData(params) {
    return request({
      url: '/apparatus-data/delete',
      method: 'post',
      data: params
    })
}
