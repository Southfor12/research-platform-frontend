import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function deleteUser(params)
{
  return request({
    url: '/user/delete',
    method: 'post',
    data: params
  })
}

export function register(params) {
  return request({
    url: '/user/register',
    method: 'post',
    data: params
  })
}

export function transIntoMentor(params) {
  return request({
    url: '/user/trans-into-mentor',
    method: 'post',
    data: params
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function allUsers() {
  return request({
    url: '/user/all',
    method: 'get'
  })
}

export function allApparatusAdmins() {
  return request({
    url: '/user/all-apparatus-admins',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function checkPassword(params) {
  return request({
    url: '/member/check-password',
    method: 'get',
    params
  })
}

export function updatePassword(params) {
  return request({
    url: '/member/update-password',
    method: 'post',
    data: params
  })
}

export function sendCode(params) {
  return request({
    url: '/send-code',
    method: 'post',
    data: params
  })
}

export function userInfo(params) {
  return request({
    url: '/user/get',
    method: 'get',
    params
  })
}

export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function userIndexFrontList(params) {
  return request({
    url: '/user/index-front-list',
    method: 'get',
    params
  })
}

export function userExport(params) {
  return request({
    url: '/user/export',
    method: 'get',
    params
  })
}

export function frontUserList(params) {
  return request({
    url: '/user/front-list',
    method: 'get',
    params
  })
}

export function userScoreLists(params) {
  return request({
    url: '/user/score-list',
    method: 'get',
    params
  })
}

export function audit(params) {
  return request({
    url: '/user/audit',
    method: 'post',
    data: params
  })
}

export function editBookingStatus(params)
{
  return request({
    url: '/user/edit-booking-status',
    method: 'post',
    data: params
  })
}

export function editUser(params) {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}

export function editMobile(params) {
  return request({
    url: '/user/edit-mobile',
    method: 'post',
    data: params
  })
}

export function userScoreReset(params) {
  return request({
    url: '/user-score/reset',
    method: 'post',
    params
  })
}

export function userScoreList(params) {
  return request({
    url: '/user-score/list',
    method: 'get',
    params
  })
}

export function frontUserScoreList(params) {
  return request({
    url: '/user-score/front-list',
    method: 'get',
    params
  })
}
