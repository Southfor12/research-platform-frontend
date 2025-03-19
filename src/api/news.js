import request from '@/utils/request'

export function newsInfo(params) {
    return request({
      url: '/information/get',
      method: 'get',
      params
    })
}

export function newsList(params) {
  return request({
    url: '/information/list',
    method: 'get',
    params
  })
}

export function frontNewsList(params) {
  return request({
    url: '/information/front-list',
    method: 'get',
    params
  })
}

export function deleteNews(params) {
    return request({
      url: '/information/delete',
      method: 'post',
      params
    })
}

export function addNews(params) {
    return request({
      url: '/information/create',
      method: 'post',
      data: params
    })
}

export function editNews(params) {
    return request({
      url: '/information/update',
      method: 'post',
      data: params
    })
}
