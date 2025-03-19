import request from '@/utils/request'

export function apparatusInfo(params) {
    return request({
      url: '/apparatus/get',
      method: 'get',
      params
    })
}

export function apparatusAll(params) {
    return request({
      url: '/apparatus/all',
      method: 'get',
      params
    })
}

export function checkTrain(params) {
  return request({
    url: '/apparatus/check-train',
    method: 'get',
    params
  })
}

export function apparatusList(params) {
  return request({
    url: '/apparatus/list',
    method: 'get',
    params
  })
}

export function apparatusIndexFrontList(params) {
  return request({
    url: '/apparatus/index-front-list',
    method: 'get',
    params
  })
}

export function apparatusIndexFrontInfo(params) {
  return request({
    url: '/apparatus/front-info',
    method: 'get',
    params
  })
}

//仪器预约使用记录
export function apparatusUseList(params) {
  return request({
    url: '/apparatus/use-list',
    method: 'get',
    params
  })
}

export function frontApparatusList(params) {
  return request({
    url: '/apparatus/front-list',
    method: 'get',
    params
  })
}

export function deleteApparatus(params) {
    return request({
      url: '/apparatus/delete',
      method: 'post',
      params
    })
}

export function addApparatus(params) {
    return request({
      url: '/apparatus/create',
      method: 'post',
      data: params
    })
}

export function editApparatus(params) {
    return request({
      url: '/apparatus/update',
      method: 'post',
      data: params
    })
}

export function apparatusTypeInfo(params) {
    return request({
      url: '/apparatus-type/get',
      method: 'get',
      params
    })
}

export function apparatusTypeList(params) {
  return request({
    url: '/apparatus-type/list',
    method: 'get',
    params
  })
}

export function deleteApparatusType(params) {
    return request({
      url: '/apparatus-type/delete',
      method: 'post',
      params
    })
}

export function addApparatusType(params) {
    return request({
      url: '/apparatus-type/create',
      method: 'post',
      data: params
    })
}

export function editApparatusType(params) {
    return request({
      url: '/apparatus-type/update',
      method: 'post',
      data: params
    })
}

export function apparatusChargeRuleInfo(params) {
  return request({
    url: '/apparatus-charge-rule/get',
    method: 'get',
    params
  })
}

export function apparatusChargeRuleList(params) {
  return request({
    url: '/apparatus-charge-rule/list',
    method: 'get',
    params
  })
}

export function frontApparatusChargeRuleList(params) {
  return request({
    url: '/apparatus-charge-rule/front-list',
    method: 'get',
    params
  })
}

export function deleteApparatusChargeRule(params) {
  return request({
    url: '/apparatus-charge-rule/delete',
    method: 'post',
    params
  })
}

export function addApparatusChargeRule(params) {
  return request({
    url: '/apparatus-charge-rule/create',
    method: 'post',
    data: params
  })
}

export function editApparatusChargeRule(params) {
  return request({
    url: '/apparatus-charge-rule/update',
    method: 'post',
    data: params
  })
}

export function auditApparatusChargeRule(params) {
  return request({
    url: '/apparatus-charge-rule/audit',
    method: 'post',
    data: params
  })
}

export function apparatusReagentInfo(params) {
  return request({
    url: '/apparatus-reagent/get',
    method: 'get',
    params
  })
}

export function apparatusReagentList(params) {
  return request({
    url: '/apparatus-reagent/list',
    method: 'get',
    params
  })
}

export function deleteApparatusReagent(params) {
  return request({
    url: '/apparatus-reagent/delete',
    method: 'post',
    params
  })
}

export function addApparatusReagent(params) {
  return request({
    url: '/apparatus-reagent/create',
    method: 'post',
    data: params
  })
}

export function editApparatusReagent(params) {
  return request({
    url: '/apparatus-reagent/batch-update',
    method: 'post',
    data: params
  })
}

export function bookingList(params) {
  return request({
    url: '/booking/list',
    method: 'get',
    params
  })
}

export function frontBookingList(params) {
  return request({
    url: '/booking/front-list',
    method: 'get',
    params
  })
}

export function editBooking(params) {
  return request({
    url: '/booking/update',
    method: 'post',
    params
  })
}

export function deleteBooking(params) {
  return request({
    url: '/booking/delete',
    method: 'post',
    params
  })
}

export function booking(params) {
  return request({
    url: '/booking/create',
    method: 'post',
    params
  })
}

export function bookableTime(params) {
  return request({
    url: '/apparatus/get-bookable-time',
    method: 'get',
    params
  })
}

export function bookableUpdate(params) {
  return request({
    url: '/booking/audit',
    method: 'post',
    params
  })
}

export function apparatusHcsInfo(params) {
  return request({
    url: '/apparatus-hcs/get',
    method: 'get',
    params
  })
}

export function apparatusHcsList(params) {
  return request({
    url: '/apparatus-hcs/list',
    method: 'get',
    params
  })
}

export function deleteApparatusHcs(params) {
  return request({
    url: '/apparatus-hcs/delete',
    method: 'post',
    params
  })
}

export function addApparatusHcs(params) {
  return request({
    url: '/apparatus-hcs/create',
    method: 'post',
    data: params
  })
}

export function editApparatusHcs(params) {
  return request({
    url: '/apparatus-hcs/batch-update',
    method: 'post',
    data: params
  })
}

export function apparatusAuthUserInfo(params) {
  return request({
    url: '/apparatus-auth-user/get',
    method: 'get',
    params
  })
}

export function apparatusAuthUserList(params) {
  return request({
    url: '/apparatus-auth-user/list',
    method: 'get',
    params
  })
}

export function frontApparatusAuthUserList(params) {
  return request({
    url: '/apparatus-auth-user/front-list',
    method: 'get',
    params
  })
}

export function deleteApparatusAuthUser(params) {
  return request({
    url: '/apparatus-auth-user/delete',
    method: 'post',
    params
  })
}

export function addApparatusAuthUser(params) {
  return request({
    url: '/apparatus-auth-user/create',
    method: 'post',
    data: params
  })
}

export function editApparatusAuthUser(params) {
  return request({
    url: '/apparatus-auth-user/update',
    method: 'post',
    data: params
  })
}

export function apparatusRankList(params) {
  return request({
    url: '/apparatus/rank',
    method: 'get',
    params
  })
}

export function myApparatusList(params) {
  return request({
    url: '/apparatus-auth-user/list',
    method: 'get',
    params
  })
}

export function apparatusTypeAll(params) {
  return request({
    url: '/apparatus-type/all',
    method: 'get',
    params
  })
}

export function updateExamConfig(params) {
  return request({
    url: '/apparatus/update-exam-config',
    method: 'post',
    data: params
  })
}

export function submitExam(params) {
  return request({
    url: '/apparatus/submit-exam',
    method: 'post',
    data: params
  })
}

export function examQuestions(params) {
  return request({
    url: '/apparatus/exam-questions',
    method: 'get',
    params
  })
}

export function roomOverview(params) {
  return request({
    url: '/apparatus/room-overview',
    method: 'get',
    params
  })
}

export function indexList() {
  return request({
    url: '/apparatus/index-list',
    method: 'get'
  })
}

export function bookingIndexList(params) {
  return request({
    url: '/booking/index-list',
    method: 'get',
    params
  })
}

export function bookingIndexFrontList(params) {
  return request({
    url: '/booking/index-front-list',
    method: 'get',
    params
  })
}
