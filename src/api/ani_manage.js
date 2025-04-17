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
export function feedAbnormal(data) {
    return request({
        url: '/animal/fac/cage/insertfeedabnormality',
        method: 'post',
        data
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

//动物管理的查询
export function getAnimalManage(params) {
    return request({
        url: '/animal/care/animalimport/page',
        method: 'get',
        params
    })
}

//动物处死
export function animalDeath(data) {
    return request({
        url: '/animal/care/animalimport/kill',
        method: 'put',
        data
    })
}


//动物管理的编辑
export function animalManageEdit(data) {
    return request({
        url: '/animal/care/animalimport/update',
        method: 'put',
        data
    })
}

//动物管理的修改动物状态
export function updateAnimalStatus2(data) {
    return request({
        url: '/animal/care/animalimport/updatestatus',
        method: 'put',
        data
    })
}

//动物管理的提交测量数据功能
export function submitMeasureData(data) {
    return request({
        url: '/animal/care/animalimport/insertsurvey',
        method: 'post',
        data
    })
}

//动物管理的疾病治疗
export function diseaseTreatment(data) {
    return request({
        url: '/animal/care/animalimport/inserttreatment',
        method: 'post',
        data
    })
}

//查询所有饲养异常类型
export function getFeedAbnormalType(params) {
    return request({
        url: '/animal/set/abnormalitytype/all',
        method: 'get',
        params
    })
}

//获取饲养异常
export function getFeedAbnormal(params) {
    return request({
        url: '/animal/fac/feedabnormality/all',
        method: 'get',
        params
    })
}

//查询所有尸体处理的记录
export function getCadaverManage(params) {
    return request({
        url: '/animal/care/bodydisposal/page',
        method: 'get',
        params
    })
}

//新增尸体处理
export function addCadaverManage(data) {
    return request({
        url: '/animal/care/bodydisposal',
        method: 'post',
        data
    })
}   

//删除尸体处理  
export function deleteCadaverManage(params) {
    return request({
        url: '/animal/care/bodydisposal',
        method: 'delete',
        params
    })
}

//查询测量数据的体重
export function getMeasureDataWeight(params) {
    return request({
        url: '/animal/care/surveydata/weight',
        method: 'get',
        params
    })
}

//查询测量数据的体温
export function getMeasureDataTemperature(params) {
    return request({
        url: '/animal/care/surveydata/temperature',
        method: 'get',
        params
    })
}   

//分页查询所有精子
export function getSpermManage(params) {
    return request({
        url: '/animal/care/spermmanagement/page',
        method: 'get',
        params
    })
}

//新增精子  
export function addSperm(data) {
    return request({
        url: '/animal/care/spermmanagement',
        method: 'post',
        data
    })
}

//获取饲养统计数据
export function getFeedStatistics(params) {
    return request({
        url: '/animal/care/feedingstatistics/getfeedingstatisticscount',
        method: 'get',
        params
    })
}

//按照房间获取饲养统计数据
export function getFeedStatisticsByRoom(params) {
    return request({
        url: '/animal/care/feedingstatistics/getRoomAndCageInformation',
        method: 'get',
        params
    })
}

//按照联系人获取饲养统计数据
export function getFeedStatisticsByContact(params) {
    return request({
        url: '/animal/care/feedingstatistics/getByUser',
        method: 'get',
        params
    })
}

//查询课题组名
export function getResearchGroupName(params) {
    return request({
        url: '/animal/ord/care/getresearchGroupName',
        method: 'get',
        params
    })
}

//饲养统计中的按照课题组统计
export function getFeedStatisticsByResearchGroup(params) {
    return request({
        url: '/animal/care/feedingstatistics/getByGroup',
        method: 'get',
        params
    })
}

//笼架授权查询已经自持的笼位
export function getReservedCage(params) {
    return request({
        url: '/animal/fac/cage/reserved',
        method: 'get',
        params
    })
}

//取消笼架授权
export function cancelRackAuthorization(params) {
    return request({
        url: '/animal/fac/cage/cancelreserved',
        method: 'put',
        params
    })  
}

//查询所有饲养服务
export function getFeedService(params) {
    return request({
        url: '/animal/pro/care/page',
        method: 'get',
        params
    })
}

//查询所有的自持笼位
export function getReservedCage2(params) {
    return request({
        url: '/animal/fac/cage/getReservedNumbersByUserId',
        method: 'get',
        params
    })
}
