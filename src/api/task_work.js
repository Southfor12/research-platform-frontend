import request from '@/utils/request'

// 获取我的任务工单列表
// export function getTaskWorkList(params) {
//     return request({
//         url: '/task/work/list',
//         method: 'get',
//         params
//     })
// }

//查询所有服务工单
export function getServiceOrderList(params) {
    return request({
        url: '/animal/work/workOrder/page',
        method: 'get',
        params
    })
}

// 审核服务工单
export function auditServiceOrder(params) {
    return request({
        url: `/animal/work/workOrder/updateStatus?id=${params.id}&status=${params.status}`,
        method: 'put'
    })
}

// 获取所有员工列表
export function getStaffList() {
    return request({
        url: '/animal/work/workStaff/all',
        method: 'get'
    })
}

// 获取所有工作组列表
export function getWorkGroupList() {
    return request({
        url: '/animal/work/workgroup/all',
        method: 'get'
    })
}

//分配任务
export function assignTask(params) {
    return request({
        url: `/animal/work/workOrder/assignTasks?id=${params.id}&work_staff_id=${params.work_staff_id}`,
        method: 'put'
    })
}

// 获取所有任务列表
export function getTaskList(params) {
    return request({
        url: '/animal/work/workOrder/getAllTasks',
        method: 'get',
        params
    })
}


// 查询我的任务列表
export function getMyTaskList(params) {
    return request({
        url: '/animal/work/workOrder/getMyTasks',
        method: 'get',
        params
    })
}

//新增人员
export function addStaff(data) {
    return request({
        url: '/animal/work/workStaff',
        method: 'post',
        data
    })
}


//删除员工
export function deleteStaff(params) {
    return request({
        url: `/animal/work/workStaff`,
        method: 'delete',
        params
    })
}

//新增工作组
export function addWorkGroup(data) {
    return request({
        url: '/animal/work/workgroup',
        method: 'post',
        data
    })
}

//删除工作组
export function deleteWorkGroup(params) {
    return request({
        url: `/animal/work/workgroup`,
        method: 'delete',
        params
    })
}

//根据工作组名称查询工作组
export function getWorkGroupByName(params) {
    return request({
        url: `/animal/work/workgroup/name`,
        method: 'get',
        params
    })
}