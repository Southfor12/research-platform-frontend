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
        params: {
            ...params,
            hideSuccess: params.hideSuccess
        }
    })
}

//根据笼子id查询笼盒id
export function getCageBoxId(params) {
    return request({
        url: '/animal/fac/cagebox/getcagebox',
        method: 'get',
        params: {
            ...params,
            hideSuccess: params.hideSuccess
        }
    })
}

//清理笼盒
export function cleanRack(params) {
    return request({
        url: '/animal/fac/cagebox/clear',
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
        url: '/animal/fac/cagebox/move',
        method: 'put',
        params
    })
}

//根据笼位id查询订单信息
export function getOrderInfo(params) {
    return request({
        url: '/animal/fac/cage/orderinformation',
        method: 'get',
        params
    })
}


//根据订单id查询订单详细信息
// export function getOrderDetail(params) {
//     return request({
//         url: '/animal/fac/cage/orderdetail',
//         method: 'get',
//         params
//     })
// }

//导入新的笼盒
export function importNewCage(data) {
    return request({
        url: '/animal/fac/cagebox/',
        method: 'post',
        data
    })
}

//修改动物的状态
export function updateAnimalStatus(params) {
    return request({
        url: '/animal/fac/cagebox/updataanimalstatus',
        method: 'put',
        params
    })
}


//查询所有动物状态
export function getAnimalStatus(params) {
    return request({
        url: '/animal/set/animalstatus/all',
        method: 'get',
        params
    })
}

//支持修改订单 （后端暂未实现）
export function updateOrderInfo(params) {
    return request({
        url: '/animal/fac/cage/updateorder',
        method: 'put',
        params
    })
}

//笼位锁定
export function lockCage(params) {
    return request({
        url: '/animal/fac/cage/lock',
        method: 'put',
        params
    })
}

//解锁
export function unlockCage(params) {
    return request({
        url: '/animal/fac/cage/unlock',
        method: 'put',
        params
    })
}

//根据笼盒id查询信息    
export function getCageBoxInfo(params) {
    return request({
        url: '/animal/fac/cagebox/getanimal',
        method: 'get',
        params
    })
}

//更新笼盒的信息
export function updateCageBoxInfo(params) {
    return request({
        url: '/animal/fac/cagebox/updatacagebox',
        method: 'put',
        params
    })
}

//饲养异常  
export function feedAbnormal(params) {
    return request({
        url: '/animal/fac/cage/insertfeedabnormality',
        method: 'post',
        params
    })
}

//笼位授权
export function cageAuthorization(params) {
    return request({
        url: '/animal/fac/cage/changeuser',
        method: 'put',
        params
    })
}

//取消授权
export function cancelAuthorization(params) {
    return request({
        url: '/animal/fac/cage/cancelreserved',
        method: 'put',
        params
    })
}

//获取自持笼位编号
export function getCageNumber(params) {
    return request({
        url: '/animal/fac/cage/reservednumbers',
        method: 'get',
        params
    })
}

//获取锁定笼位的编号
export function getLockedCageNumber(params) {
    return request({
        url: '/animal/fac/cage/lockednumbers',
        method: 'get',
        params
    })
}


























