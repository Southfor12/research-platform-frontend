import request from '@/utils/request'

//新增动物
export function animalImport(data) {
    return request({
        url: '/animal/care/animalimport',
        method: 'post',
        data
    })
}

//根据笼架id和位置查询笼子id
export function getCageId(params) {
    return request({
        url: '/animal/fac/cage/getcageid',
        method: 'get',
        params
    })
}

//清理笼架
export function cleanRack(params) {
    return request({
        url: '/animal/fac/cage/clear',
        method: 'put',
        params
    })
}

//更改笼架联系人
export function updateCageContact(params) {
    return request({
        url: '/animal/fac/cage/changeuser',
        method: 'put',
        params
    })
}

//查询所有用户
export function allUsers() {
    return request({
        url: '/user/all',
        method: 'get'
    })
}

//根据用户id查询用户
export function getUserById(params) {
    return request({
        url: '/user/get',
        method: 'get',
        params
    })
}

//移动笼盒
export function moveCage(params) {
    return request({
        url: '/animal/fac/cage/move',
        method: 'put',
        params
    })
}
