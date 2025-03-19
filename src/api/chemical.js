import request from '@/utils/request'

export function chemicalBookingInfo(params) {
    return request({
      url: '/booking-chemical/get',
      method: 'get',
      params
    })
}

export function chemicalBookingList(params) {
  return request({
    url: '/booking-chemical/list',
    method: 'get',
    params
  })
}

export function frontChemicalBookingList(params) {
    return request({
      url: '/booking-chemical/front-list',
      method: 'get',
      params
    })
}

export function addChemicalBooking(params) {
    return request({
      url: '/booking-chemical/create',
      method: 'post',
      data: params
    })
}

export function cancelChemicalBooking(params) {
    return request({
      url: '/booking-chemical/cancel',
      method: 'post',
      params
    })
}

export function auditChemicalBooking(params) {
    return request({
      url: '/booking-chemical/audit',
      method: 'post',
      params
    })
}

export function mentorAuditChemicalBooking(params) {
  return request({
    url: '/booking-chemical/mentor-audit',
    method: 'post',
    params
  })
}

export function chemicalBookingMoney(params) {
    return request({
      url: '/booking-chemical/count-money',
      method: 'post',
      data: params
    })
}
