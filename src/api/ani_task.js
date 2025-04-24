import request from '@/utils/request'

// 获取所有任务
export function getTasks() {
  return request({
    url: '/animal/work/scheduledTask/all',
    method: 'get'
  })
}

//新增任务
export function addTask(data) {
  return request({
    url: '/animal/work/scheduledTask',
    method: 'post',
    data
  })
}

//删除任务
export function deleteTask(id) {
  return request({
    url: '/animal/work/scheduledTask',
    method: 'delete',
    params: { id }
  })
}

//分页查询
export function getTasksByPage(params) {
  return request({
    url: '/animal/work/scheduledTask/name',
    method: 'get',
    params
  })
}

//分页查询人员信息
export function getStaffByPage(params) {
  return request({
    url: '/animal/work/workStaff/name',
    method: 'get',
    params
  })
}

//根据工作组的名字进行查询
export function getStaffByWorkGroupName(params) {
  return request({
    url: '/animal/work/workgroup/name',
    method: 'get',
    params
  })
}

//查询所有工单
export function getAllWorkOrder() {
  return request({
    url: '/animal/work/workOrderType/all',
    method: 'get'
  })
}

//新增工单类型
export function addWorkOrderType(data) {
  return request({
    url: '/animal/work/workOrderType',
    method: 'post',
    data
  })
}

//根据类型名查询工单
export function getWorkOrderByName(params) {
  return request({
    url: '/animal/work/workOrderType/name',
    method: 'get',
    params
  })
}

//删除工单类型
export function deleteWorkOrderType(id) {
  return request({
    url: '/animal/work/workOrderType',
    method: 'delete',
    params: { id }
  })
} 

//查询所有任务类型
export function getAllTaskType() {
  return request({
    url: '/animal/work/taskType/all',
    method: 'get'
  })
}

//新增任务类型
export function addTaskType(data) {
  return request({
    url: '/animal/work/taskType',
    method: 'post',
    data
  })
}

//删除任务类型  
export function deleteTaskType(id) {
  return request({
    url: '/animal/work/taskType',
    method: 'delete',
    params: { id }
  })
}

//根据任务类型名查询任务类型
export function getTaskTypeByName(params) {
  return request({
    url: '/animal/work/taskType/name',
    method: 'get',
    params
  })
}


