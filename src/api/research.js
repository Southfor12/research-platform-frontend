import request from '@/utils/request'

export function researchGroupList(params) {
  return request({
    url: '/research-group/list',
    method: 'get',
    params
  })
}

export function frontResearchGroupList(params) {
  return request({
    url: '/research-group/front-list',
    method: 'get',
    params
  })
}

export function researchGroupInfo(params) {
  return request({
    url: '/research-group/get',
    method: 'get',
    params
  })
}

export function deleteResearchGroup(params) {
  return request({
    url: '/research-group/delete',
    method: 'post',
    params
  })
}

export function addResearchGroup(params) {
  return request({
    url: '/research-group/create',
    method: 'post',
    data: params
  })
}

export function editResearchGroup(params) {
  return request({
    url: '/research-group/update',
    method: 'post',
    data: params
  })
}

export function researchGroupAccountList(params) {
  return request({
    url: '/research-group-account/list',
    method: 'get',
    params
  })
}

export function researchGroupAccountAll() {
  return request({
    url: '/research-group-account/all',
    method: 'get'
  })
}

export function frontResearchGroupAccountList(params) {
  return request({
    url: '/research-group-account/front-list',
    method: 'get',
    params
  })
}

export function researchGroupAccountInfo(params) {
  return request({
    url: '/research-group-account/get',
    method: 'get',
    params
  })
}

export function deleteResearchGroupAccount(params) {
  return request({
    url: '/research-group-account/delete',
    method: 'post',
    params
  })
}

export function addResearchGroupAccount(params) {
  return request({
    url: '/research-group-account/create',
    method: 'post',
    data: params
  })
}

export function editResearchGroupAccount(params) {
  return request({
    url: '/research-group-account/update',
    method: 'post',
    data: params
  })
}

export function researchGroupAccountRecharge(params) {
  return request({
    url: '/research-group-account/recharge',
    method: 'post',
    data: params
  })
}

export function researchGroupAccountAuthList(params) {
  return request({
    url: '/research-group-account-user/list',
    method: 'get',
    params
  })
}

export function researchGroupAccountAuthIndexFrontList(params) {
  return request({
    url: '/research-group-account-user/index-front-list',
    method: 'get',
    params
  })
}

export function frontResearchGroupAccountAuthList(params) {
  return request({
    url: '/research-group-account-user/front-list',
    method: 'get',
    params
  })
}

export function researchGroupAccountAuthInfo(params) {
  return request({
    url: '/research-group-account-user/get',
    method: 'get',
    params
  })
}

export function deleteResearchGroupAccountAuth(params) {
  return request({
    url: '/research-group-account-user/delete',
    method: 'post',
    params
  })
}

export function addResearchGroupAccountAuth(params) {
  return request({
    url: '/research-group-account-user/create',
    method: 'post',
    data: params
  })
}

export function researchGroupUserList(params) {
  return request({
    url: '/research-group-user/list',
    method: 'get',
    params
  })
}

export function frontResearchGroupUserList(params) {
  return request({
    url: '/research-group-user/front-list',
    method: 'get',
    params
  })
}

export function researchGroupUserAudit(params) {
  return request({
    url: '/research-group-user/audit',
    method: 'post',
    data: params
  })
}

export function researchGroupAuditByAdmin(params) {
  return request({
    url: '/research-group-user/audit-by-admin',
    method: 'post',
    data: params
  })
}

export function researchGroupUserSetAdmin(params) {
  return request({
    url: '/research-group-user/set-admin',
    method: 'post',
    data: params
  })
}

export function applyJoinResearchGroup(params) {
  return request({
    url: '/research-group/apply-join',
    method: 'post',
    data: params
  })
}

export function researchGroupAccountCashFlow(params) {
  return request({
    url: '/research-group-account/cash-flow',
    method: 'get',
    params
  })
}

export function frontResearchGroupAccountCashFlow(params) {
  return request({
    url: '/research-group-account/front-cash-flow',
    method: 'get',
    params
  })
}

export function debtDetail(params) {
  return request({
    url: '/research-group-account/debt-detail',
    method: 'get',
    params
  })
}



