import request from '@/utils/request'
// 校区
export function addCourtyard(params) {
  return request({
    url: '/animal/fac/campus',
    method: 'post',
    data: params
  })
}
export function getCourtyard(params) {
  return request({
    url: '/animal/fac/campus/page',
    method: 'get',
    params
  })
}
export function get_a_Courtyard(params) {
  return request({
    url: '/animal/fac/campus/' + params.id,
    method: 'get',

  })
}
export function delCourtyard(params) {
  return request({
    url: '/animal/fac/campus',
    method: 'delete',
    params
  })
}
export function editCourtyard(params) {
  return request({
    url: '/animal/fac/campus',
    method: 'put',
    data: params
  })
}

//楼宇
export function addTenement(params) {
  return request({
    url: '/animal/fac/building',
    method: 'post',
    data: params
  })
}
export function getTenement(params) {
  return request({
    url: '/animal/fac/building/page',
    method: 'get',
    params
  })
}
export function get_a_Tenement(params) {
  return request({
    url: '/animal/fac/building/' + params.id,
    method: 'get',

  })
}
export function delTenement(params) {
  return request({
    url: '/animal/fac/building',
    method: 'delete',
    params
  })
}
export function editTenement(params) {
  return request({
    url: '/animal/fac/building',
    method: 'put',
    data: params
  })
}

//实验室
export function addLaboratory(params) {
  return request({
    url: '/animal/fac/room',
    method: 'post',
    data: params
  })
}
export function getLaboratory(params) {
  return request({
    url: '/animal/fac/room/page',
    method: 'get',
    params
  })
}
export function get_a_Laboratory(params) {
  return request({
    url: '/animal/fac/room/' + params.id,
    method: 'get',

  })
}
export function delLaboratory(params) {
  return request({
    url: '/animal/fac/room' + '?id=' + params.id,
    method: 'delete',
    params
  })
}
export function editLaboratory(params) {
  return request({
    url: '/animal/fac/room',
    method: 'put',
    data: params
  })
}

//笼架
export function getRack(params) {
  return request({
    url: '/animal/fac/rack/page',
    method: 'get',
    params
  })
}
export function addRack(params) {
  return request({
    url: '/animal/fac/rack',
    method: 'post',
    data: params
  })
}
export function get_a_Rack(params) {
  return request({
    url: '/animal/fac/rack/' + params.id,
    method: 'get',
  })
}
export function editRack(params) {
  return request({
    url: '/animal/fac/rack',
    method: 'put',
    data: params
  })
}
export function getCage(params) {
  return request({
    url: '/animal/fac/used',
    method: 'get',
    params
  })
}

//查询所有笼子信息
export function getCageAll(params) {
  return request({
    url: '/animal/fac/cage/rack',
    method: 'get',
    params
  })
}

//笼子预约之分配笼子
export function assignCagetouser(data) {
  return request({
    url: '/animal/ord/cagebooking/give',
    method: 'put',
    data
  })
}

//取消笼子分配
export function delCage(params) {
  return request({
    url: '/animal/ord/cagebooking/cancel',
    method: 'put',
    params
  })
}

// 移动笼盒
export function moveCage(data) {
  return request({
    url: '/animal/ord/cage/move',
    method: 'put',
    data
  })
}