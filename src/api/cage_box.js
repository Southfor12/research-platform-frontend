import request from '@/utils/request'

// 获取笼盒列表
export function getCageBoxList(params) {
    return request({
        url: '/animal/set/cageboxtype/all',
        method: 'get',
        params
    })
}
