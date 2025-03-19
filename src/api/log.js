import request from '@/utils/request'

export function systemLogList(params) {
    return request({
      url: '/log/list',
      method: 'get',
      params
    })
}

export function doorLogList(params) {
    return request({
      url: '/door-record/list',
      method: 'get',
      params
    })
}
