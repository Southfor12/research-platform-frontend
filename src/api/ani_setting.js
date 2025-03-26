import request from '@/utils/request'

//获取所有的动物类型
export function getAnimalType(params) {
  return request({
    url: '/animal/set/animaltype/all',
    method: 'get',
    params
  })
}

//新建动物类型
export function addAnimalType(params) {
  return request({
    url: '/animal/set/animaltype',
    method: 'post',
    data: params
  })
}

//删除动物类型
export function delAnimalType(params) {
  return request({
    url: '/animal/set/animaltype',
    method: 'delete',
    params
  })
}

//编辑动物类型
export function editAnimalType(params) {
  return request({
    url: '/animal/set/animaltype',
    method: 'put',
    data: params
  })
}

//查询动物疾病类型
export function getAnimalDiseaseType(params) {
  return request({
    url: '/animal/set/animaldisease/all',
    method: 'get',
    params
  })
}

//新增动物疾病
export function addAnimalDiseaseType(params) {
  return request({
    url: '/animal/set/animaldisease',
    method: 'post',
    data: params
  })
}

////删除动物疾病
export function delAnimalDiseaseType(params) {
  return request({
    url: '/animal/set/animaldisease',
    method: 'delete',
    params
  })
}

//编辑动物疾病
export function editAnimalDiseaseType(params) {
  return request({
    url: '/animal/set/animaldisease',
    method: 'put',
    data: params
  })
}

//查询所有动物处死原因
export function getAnimalDeathReason(params) {
  return request({
    url: '/animal/set/executionreason/all',
    method: 'get',
    params
  })
}

//新增动物处死原因
export function addAnimalDeathReason(params) {
  return request({
    url: '/animal/set/executionreason',
    method: 'post',
    data: params
  })
}

//删除动物处死原因
export function delAnimalDeathReason(params) {
  return request({
    url: '/animal/set/executionreasonn',
    method: 'delete',
    params
  })
}

//编辑动物处死原因
export function editAnimalDeathReason(params) {
  return request({
    url: '/animal/set/executionreason',
    method: 'put',
    data: params
  })
}


//查询所有治疗方案
export function getTreatmentPlan(params) {
  return request({
    url: '/animal/set/treatmentplan/all',
    method: 'get',
    params
  })
}

//新增治疗方案
export function addTreatmentPlan(params) {
  return request({
    url: '/animal/set/treatmentplan',
    method: 'post',
    data: params
  })
}

//删除治疗方案
export function delTreatmentPlan(params) {
  return request({
    url: '/animal/set/treatmentplan',
    method: 'delete',
    params
  })
}

//编辑治疗方案
export function editTreatmentPlan(params) {
  return request({
    url: '/animal/set/treatmentplan',
    method: 'put',
    data: params
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

//新增动物状态
export function addAnimalStatus(params) {
  return request({
    url: '/animal/set/animalstatus',
    method: 'post',
    data: params
  })
}

//删除动物状态
export function delAnimalStatus(params) {
  return request({
    url: '/animal/set/animalstatus',
    method: 'delete',
    params
  })
}

//编辑动物状态
export function editAnimalStatus(params) {
  return request({
    url: '/animal/set/animalstatus',
    method: 'put',
    data: params
  })
}

//根据名称模糊查询动物类型
export function getAnimalTypeByName(params) {
  return request({
    url: '/animal/set/animaltype/name',
    method: 'get',
    params
  })
}

//根据名称模糊查询动物疾病
export function getAnimalDiseaseByName(params) {
  return request({
    url: '/animal/set/animaldisease/name',
    method: 'get',
    params
  })
}

//根据名称模糊查询动物处死原因
export function getAnimalDeathReasonByName(params) {
  return request({
    url: '/animal/set/executionreason/name',
    method: 'get',
    params
  })
}

//根据名称模糊查询治疗方案
export function getTreatmentPlanByName(params) {
  return request({
    url: '/animal/set/treatmentplan/medicine',
    method: 'get',
    params
  })
}

//根据名称模糊查询动物状态
export function getAnimalStatusByName(params) {
  return request({
    url: '/animal/set/animalstatus/status',
    method: 'get',
    params
  })
}

//分页查询所有动物品系
export function getAnimalStrain(params) {
  return request({
    url: '/animal/care/animalstrain/page',
    method: 'get',
    params
  })
}

//新增动物品系
export function addAnimalStrain(params) {
  return request({
    url: '/animal/care/animalstrain',
    method: 'post',
    data: params
  })
}

//编辑动物品系
export function editAnimalStrain(params) {
  return request({
    url: '/animal/care/animalstrain',
    method: 'put',
    data: params
  })
}

//删除动物品系
export function delAnimalStrain(params) {
  return request({
    url: '/animal/care/animalstrain',
    method: 'delete',
    params
  })
}







