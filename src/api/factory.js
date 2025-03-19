import request from '@/utils/request'

export function allFactory() {
  return request({
    url: '/factory/all',
    method: 'get'
  })
}
