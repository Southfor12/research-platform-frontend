import request from '@/utils/request'

export function orderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}


export function getCageused(params) {
  return request({
    url: '/animal/fac/cage/used',
    method: 'get',
    params
  })
}

export function AddFeed(params) {
  return request({
    url: '/animal/ord/care',
    method: 'post',
    data: params
  })
}


export function AddItemOrder(params) {
  return request({
    url: '/animal/ord/item',
    method: 'post',
    data: params
  })
}



export function getItemOrder(params) {
  return request({
    url: '/animal/ord/item',
    method: 'get',
    params
  })
}


export function getAllAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal/all',
    method: 'get',
    params
  })
}

export function getAllItemOrder(params) {
  return request({
    url: '/animal/ord/item/all',
    method: 'get',
    params
  })
}

export function getAllFeedOrder(params) {
  return request({
    url: '/animal/ord/care/all',
    method: 'get',
    params
  })
}

export function getAllFeedOrder_(){
  return request({
    url: '/animal/ord/care/allorder',
    method: 'get',
  })
}
export function getAllTechOrder(params) {
  return request({
    url: '/animal/ord/tech/all',
    method: 'get',
    params
  })
}

export function delItemOrder(params) {
  return request({
    url: '/animal/ord/item',
    method: 'delete',
    params
  })
}


export function editItemOrder(params) {
  return request({
    url: '/animal/ord/item',
    method: 'put',
    data: params
  })
}


export function AddAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal',
    method: 'post',
    data: params
  })
}


export function getAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal',
    method: 'get',
    params
  })
}



export function get_a_AnimalOrder(params) {
  return request({
    url: '/animal/ord/animal/' + params.id,
    method: 'get',
    params
  })
}

export function get_a_FeedOrder(params) {
  return request({
    url: '/animal/ord/care/' + params.id,
    method: 'get',
    params
  })
}

export function editFeed(params) {
  return request({
    url: 'animal/ord/care',
    method: 'put',
    data: params
  })
}


export function editAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal',
    method: 'put',
    data: params
  })
}



export function buyAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal/buy',
    method: 'put',
    data: params
  })
}


export function delAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal',
    method: 'delete',
    params
  })
}


export function getFeedOrder(params) {
  return request({
    url: '/animal/ord/care',
    method: 'get',
    params
  })
}




export function delFeedOrder(params) {
  return request({
    url: '/animal/ord/tech/all',
    method: 'delete',
    params
  })
}

export function buyFeedOrder(params) {
  return request({
    url: '/animal/ord/care/buy',
    method: 'put',
    data: params
  })
}




export function getTechOrder(params) {
  return request({
    url: '/animal/ord/tech',
    method: 'get',
    params
  })
}


export function delTechOrder(params) {
  return request({
    url: '/animal/ord/tech',
    method: 'delete',
    params
  })
}

export function buyTechOrder(params) {
  return request({
    url: '/animal/ord/tech/buy',
    method: 'put',
    data: params
  })
}



export function buyTechOrderCold(params) {
  return request({
    url: '/animal/ord/tech/frozen',
    method: 'post',
    data: params
  })
}


export function buyTechOrderRevive(params) {
  return request({
    url: 'animal/ord/tech/awake',
    method: 'post',
    data: params
  })
}


export function buyTechOrderPurify(params) {
  return request({
    url: '/animal/ord/tech/clear',
    method: 'post',
    data: params
  })
}


export function checkAnimalOrder(params) {
  return request({
    url: '/animal/ord/animal/audit',
    method: 'put',
    data: params
  })
}

export function checkFeedOrder(params) {
  return request({
    url: '/animal/ord/care/audit',
    method: 'put',
    data: params
  })
}

//根据实验室的id，查询所拥有的饲养服务类型
export function getServiceType(room_id) { 
  return request({
    url: `/animal/pro/care/room_id/${room_id}`,
    method: 'get'
  });
}



export function checkItemOrder(params) {
  return request({
    url: '/animal/ord/item/audit',
    method: 'put',
    data: params
  })
}

export function checkTechOrder(params) {
  return request({
    url: '/animal/ord/tech/audit',
    method: 'put',
    data: params
  })
}