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
