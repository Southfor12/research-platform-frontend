import request from '@/utils/request'

export function platformScoreTypeList(params) {
    return request({
      url: '/platform-score-type/list',
      method: 'get',
      params
    })
}

export function addPlatformScoreType(params) {
    return request({
      url: '/platform-score-type/create',
      method: 'post',
      data: params
    })
}

export function editPlatformScoreType(params) {
    return request({
      url: '/platform-score-type/update',
      method: 'post',
      data: params
    })
}

export function deletePlatformScoreType(params) {
    return request({
      url: '/platform-score-type/delete',
      method: 'post',
      data: params
    })
}

export function addPlatformScoreItem(params) {
    return request({
      url: '/platform-score-item/create',
      method: 'post',
      data: params
    })
}

export function editPlatformScoreItem(params) {
    return request({
      url: '/platform-score-item/update',
      method: 'post',
      data: params
    })
}

export function deletePlatformScoreItem(params) {
    return request({
      url: '/platform-score-item/delete',
      method: 'post',
      data: params
    })
}

export function platformScoreRecordList(params) {
  return request({
    url: '/platform-score-record/list',
    method: 'get',
    params
  })
}

export function addPlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/create',
    method: 'post',
    data: params
  })
}

export function editPlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/update',
    method: 'post',
    data: params
  })
}

export function deletePlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/delete',
    method: 'post',
    data: params
  })
}
