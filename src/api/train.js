import request from '@/utils/request'

export function trainInfo(params) {
    return request({
      url: '/train/get',
      method: 'get',
      params
    })
}

export function trainList(params) {
  return request({
    url: '/train/list',
    method: 'get',
    params
  })
}

export function frontTrainList(params) {
  return request({
    url: '/train/front-list',
    method: 'get',
    params
  })
}

export function deleteTrain(params) {
    return request({
      url: '/train/delete',
      method: 'post',
      params
    })
}

export function addTrain(params) {
    return request({
      url: '/train/create',
      method: 'post',
      data: params
    })
}

export function editTrain(params) {
    return request({
      url: '/train/update',
      method: 'post',
      data: params
    })
}

export function trainEnrollList(params) {
  return request({
    url: '/train-user/list',
    method: 'get',
    params
  })
}

export function frontTrainEnrollList(params) {
  return request({
    url: '/train-user/front-list',
    method: 'get',
    params
  })
}

export function trainEnroll(params) {
  return request({
    url: '/train-user/create',
    method: 'post',
    data: params
  })
}

export function trainApply(params) {
  return request({
    url: '/train-user/apply',
    method: 'post',
    data: params
  })
}

export function deleteTrainEnroll(params) {
  return request({
    url: '/train-user/delete',
    method: 'post',
    data: params
  })
}

export function verifyEnroll(params) {
  return request({
    url: '/train-user/verify-enroll',
    method: 'post',
    data: params
  })
}

export function cancelTrainEnroll(params) {
  return request({
    url: '/train-user/cancel-apply',
    method: 'post',
    data: params
  })
}

export function trainSignIn(params) {
  return request({
    url: '/train-user/arrive',
    method: 'post',
    data: params
  })
}

export function passTrainEnroll(params) {
  return request({
    url: '/train-user/pass-train',
    method: 'post',
    params
  })
}
