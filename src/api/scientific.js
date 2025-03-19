import request from '@/utils/request'

export function sciPaperList(params) {
    return request({
      url: '/sci-paper/list',
      method: 'get',
      params
    })
}

export function frontSciPaperList(params) {
    return request({
      url: '/sci-paper/front-list',
      method: 'get',
      params
    })
}

export function sciPaperInfo(params) {
    return request({
      url: '/sci-paper/get',
      method: 'get',
      params
    })
}

export function deleteSciPaper(params) {
      return request({
        url: '/sci-paper/delete',
        method: 'post',
        params
      })
}

export function deletePersonalSciPaper(params) {
      return request({
        url: '/sci-paper/personal-delete',
        method: 'post',
        params
      })
}

export function auditSciPaper(params) {
  return request({
    url: '/sci-paper/audit',
    method: 'post',
    params
  })
}

export function addSciPaper(params) {
    return request({
      url: '/sci-paper/create',
      method: 'post',
      data: params
    })
}

export function editSciPaper(params) {
    return request({
      url: '/sci-paper/update',
      method: 'post',
      data: params
    })
}

export function sciAwardList(params) {
    return request({
      url: '/sci-award/list',
      method: 'get',
      params
    })
}

export function frontSciAwardList(params) {
    return request({
      url: '/sci-award/front-list',
      method: 'get',
      params
    })
}

export function sciAwardInfo(params) {
    return request({
      url: '/sci-award/get',
      method: 'get',
      params
    })
}

export function deleteSciAward(params) {
      return request({
        url: '/sci-award/delete',
        method: 'post',
        params
      })
}

export function deletePersonalSciAward(params) {
      return request({
        url: '/sci-award/personal-delete',
        method: 'post',
        params
      })
}

export function auditSciAward(params) {
  return request({
    url: '/sci-award/audit',
    method: 'post',
    params
  })
}

export function addSciAward(params) {
    return request({
      url: '/sci-award/create',
      method: 'post',
      data: params
    })
}

export function editSciAward(params) {
    return request({
      url: '/sci-award/update',
      method: 'post',
      data: params
    })
}

export function sciProjectList(params) {
    return request({
      url: '/sci-project/list',
      method: 'get',
      params
    })
}

export function frontSciProjectList(params) {
    return request({
      url: '/sci-project/front-list',
      method: 'get',
      params
    })
}

export function sciProjectInfo(params) {
    return request({
      url: '/sci-project/get',
      method: 'get',
      params
    })
}

export function deleteSciProject(params) {
      return request({
        url: '/sci-project/delete',
        method: 'post',
        params
      })
}

export function deletePersonalSciProject(params) {
      return request({
        url: '/sci-project/personal-delete',
        method: 'post',
        params
      })
}

export function auditSciProject(params) {
  return request({
    url: '/sci-project/audit',
    method: 'post',
    params
  })
}

export function addSciProject(params) {
    return request({
      url: '/sci-project/create',
      method: 'post',
      data: params
    })
}

export function editSciProject(params) {
    return request({
      url: '/sci-project/update',
      method: 'post',
      data: params
    })
}

export function sciHonourList(params) {
    return request({
      url: '/sci-honour/list',
      method: 'get',
      params
    })
}

export function frontSciHonourList(params) {
    return request({
      url: '/sci-honour/front-list',
      method: 'get',
      params
    })
}

export function sciHonourInfo(params) {
    return request({
      url: '/sci-honour/get',
      method: 'get',
      params
    })
}

export function deleteSciHonour(params) {
      return request({
        url: '/sci-honour/delete',
        method: 'post',
        params
      })
}

export function deletePersonalSciHonour(params) {
      return request({
        url: '/sci-honour/personal-delete',
        method: 'post',
        params
      })
}

export function auditSciHonour(params) {
  return request({
    url: '/sci-honour/audit',
    method: 'post',
    params
  })
}

export function addSciHonour(params) {
    return request({
      url: '/sci-honour/create',
      method: 'post',
      data: params
    })
}

export function editSciHonour(params) {
    return request({
      url: '/sci-honour/update',
      method: 'post',
      data: params
    })
}
