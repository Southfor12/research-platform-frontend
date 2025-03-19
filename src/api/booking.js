import request from '@/utils/request'

export function commonApparatusTimeInfo(params) {
    return request({
      url: '/apparatus-time/get',
      method: 'get',
      params
    })
}

export function commonApparatusTimeList(params) {
  return request({
    url: '/apparatus-time/list',
    method: 'get',
    params
  })
}

export function frontCommonApparatusTimeList(params) {
  return request({
    url: '/apparatus-time/front-list',
    method: 'get',
    params
  })
}

export function getMyBookingFiles(params) {
  return request({
    url: '/booking/get-my-booking-files',
    method: 'get',
    params
  })
}

export function getBookingFiles(params) {
  return request({
    url: '/booking/get-booking-files',
    method: 'get',
    params
  })
}

export function deleteCommonApparatusTime(params) {
    return request({
      url: '/apparatus-time/delete',
      method: 'post',
      params
    })
}

export function addCommonApparatusTime(params) {
    return request({
      url: '/apparatus-time/create',
      method: 'post',
      data: params
    })
}

export function editCommonApparatusTime(params) {
    return request({
      url: '/apparatus-time/update',
      method: 'post',
      data: params
    })
}

export function specialApparatusTimeInfo(params) {
    return request({
      url: '/apparatus-time-single/get',
      method: 'get',
      params
    })
}

export function specialApparatusTimeList(params) {
  return request({
    url: '/apparatus-time-single/list',
    method: 'get',
    params
  })
}

export function frontSpecialApparatusTimeList(params) {
  return request({
    url: '/apparatus-time-single/front-list',
    method: 'get',
    params
  })
}

export function deleteSpecialApparatusTime(params) {
    return request({
      url: '/apparatus-time-single/delete',
      method: 'post',
      params
    })
}

export function addSpecialApparatusTime(params) {
    return request({
      url: '/apparatus-time-single/create',
      method: 'post',
      data: params
    })
}

export function editSpecialApparatusTime(params) {
    return request({
      url: '/apparatus-time-single/update',
      method: 'post',
      data: params
    })
}

export function bookingCharge(params) {
  return request({
    url: '/booking/charge',
    method: 'post',
    data: params
  })
}

export function exportBooking(params) {
  return request({
    url: '/booking/export',
    method: 'get',
    params
  })
}

export function bookingCancle(params) {
  return request({
    url: '/booking/cancel',
    method: 'post',
    data: params
  })
}

export function bookingCancleByAdmin(params) {
  return request({
    url: '/booking/cancel-by-admin',
    method: 'post',
    data: params
  })
}

export function countMoney(params) {
  return request({
    url: '/booking/count-money',
    method: 'post',
    data: params
  })
}

export function getByRoomId(params) {
  return request({
    url: '/booking/get-by-room-id',
    method: 'get',
    params
  })
}
