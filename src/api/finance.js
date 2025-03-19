import request from '@/utils/request'

export function financeStatistics(params) {
    return request({
      url: '/finance/statistics',
      method: 'get',
      params
    })
}

export function total(params) {
    return request({
      url: '/finance/total',
      method: 'get',
      params
    })
}

export function platformList(params) {
    return request({
      url: '/finance/platform-list',
      method: 'get',
      params
    })
}
