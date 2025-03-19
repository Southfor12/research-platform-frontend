import request from '@/utils/request'

export function roleList(params) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params
  })
}

export function loginRoles() {
  return request({
    url: '/system/login-roles/list',
    method: 'get'
  })
}

export function baseRoleList() {
  return request({
    url: '/system/role/base_list',
    method: 'get'
  })
}

export function nodeList() {
  return request({
    url: '/system/node/list',
    method: 'get'
  })
}

export function addRole(params) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data: params
  })
}

export function getRole(params) {
  return request({
    url: '/system/role/info',
    method: 'get',
    params
  })
}

export function editRole(params) {
  return request({
    url: '/system/role/edit',
    method: 'post',
    data: params
  })
}

export function deleteRole(params) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    params
  })
}

export function adminList(params) {
  return request({
    url: '/system/admin/list',
    method: 'get',
    params
  })
}

export function addAdmin(params) {
  return request({
    url: '/system/admin/add',
    method: 'post',
    data: params
  })
}

export function editAdmin(params) {
  return request({
    url: '/system/admin/edit',
    method: 'post',
    data: params
  })
}

export function adminInfo(params) {
  return request({
    url: '/system/admin/info',
    method: 'get',
    params
  })
}

export function deleteAdmin(params) {
  return request({
    url: '/system/admin/delete',
    method: 'post',
    params
  })
}

export function settingInfo(params) {
  return request({
    url: '/setting/get',
    method: 'get',
    params
  })
}

export function settingUpdate(params) {
  return request({
    url: '/setting/update',
    method: 'post',
    data: params
  })
}
