import request from '@/utils/request'

export function platformInfo(params) {
  return request({
    url: '/platform/get',
    method: 'get',
    params
  })
}

export function platformList(params) {
  return request({
    url: '/platform/list',
    method: 'get',
    params
  })
}

export function frontPlatformList(params) {
  return request({
    url: '/platform/front-list',
    method: 'get',
    params
  })
}

export function deletePlatform(params) {
  return request({
    url: '/platform/delete',
    method: 'post',
    params
  })
}

export function addPlatform(params) {
  return request({
    url: '/platform/create',
    method: 'post',
    data: params
  })
}

export function editPlatform(params) {
  return request({
    url: '/platform/update',
    method: 'post',
    data: params
  })
}

export function allPlatforms(params) {
  return request({
    url: '/platform/all',
    method: 'get',
    params
  })
}

export function allPlatformsByFactoryId(params) {
  return request({
    url: '/platform/all-by-factory-id',
    method: 'get',
    params
  })
}

export function getRooms(params) {
  return request({
    url: '/platform/get-room',
    method: 'get',
    params
  })
}

export function applyPlatformInfo(params) {
  return request({
    url: '/platform-apply/get',
    method: 'get',
    params
  })
}

export function applyPlatformList(params) {
  return request({
    url: '/platform-apply/list',
    method: 'get',
    params
  })
}

export function frontApplyPlatformList(params) {
  return request({
    url: '/platform-apply/front-list',
    method: 'get',
    params
  })
}

export function deleteApplyPlatform(params) {
  return request({
    url: '/platform-apply/delete',
    method: 'post',
    params
  })
}

export function addApplyPlatform(params) {
  return request({
    url: '/platform-apply/create',
    method: 'post',
    data: params
  })
}

export function editApplyPlatform(params) {
  return request({
    url: '/platform-apply/update',
    method: 'post',
    data: params
  })
}

export function auditApplyPlatform(params) {
  return request({
    url: '/platform-apply/audit',
    method: 'post',
    data: params
  })
}

export function latestApply(params) {
  return request({
    url: '/platform-apply/latest-apply',
    method: 'get',
    params
  })
}

export function updateLearningTime(params) {
  return request({
    url: '/platform-apply/update-time',
    method: 'post',
    params
  })
}

export function platformScoreItemInfo(params) {
  return request({
    url: '/platform-score-item/get',
    method: 'get',
    data: params
  })
}

export function platformScoreItemList(params) {
  return request({
    url: '/platform-score-item/list',
    method: 'get',
    params
  })
}

export function deletePlatformScoreItem(params) {
  return request({
    url: '/platform-score-item/delete',
    method: 'post',
    params
  })
}

export function addPlatformScoreItem(params) {
  return request({
    url: '/platform-score-item/create',
    method: 'post',
    data: params
  })
}

export function editPlatformScoreItem(params) {
  return request({
    url: '/platform-score-item/update',
    method: 'post',
    data: params
  })
}

export function platformUserInfo(params) {
  return request({
    url: '/platform-user/get',
    method: 'get',
    params
  })
}

export function platformUserList(params) {
  return request({
    url: '/platform-user/list',
    method: 'get',
    params
  })
}

export function frontPlatformUserList(params) {
  return request({
    url: '/platform-user/front-list',
    method: 'get',
    params
  })
}

export function deletePlatformUser(params) {
  return request({
    url: '/platform-user/delete',
    method: 'post',
    params
  })
}

export function addPlatformUser(params) {
  return request({
    url: '/platform-user/create',
    method: 'post',
    data: params
  })
}

export function editPlatformUser(params) {
  return request({
    url: '/platform-user/update',
    method: 'post',
    data: params
  })
}

export function platformScoreRecordInfo(params) {
  return request({
    url: '/platform-score-record/get',
    method: 'get',
    params
  })
}

export function platformScoreRecordList(params) {
  return request({
    url: '/platform-score-record/list',
    method: 'get',
    params
  })
}

export function frontPlatformScoreRecordList(params) {
  return request({
    url: '/platform-score-record/front-list',
    method: 'get',
    params
  })
}

export function platformScoreRecordRanking(params) {
  return request({
    url: '/platform-score-record/ranking',
    method: 'get',
    params
  })
}

export function deletePlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/delete',
    method: 'post',
    params
  })
}

export function addPlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/create',
    method: 'post',
    data: params
  })
}

export function editPlatformScoreRecord(params) {
  return request({
    url: '/platform-score-record/update',
    method: 'post',
    data: params
  })
}

export function platformRoomInfo(params) {
  return request({
    url: '/platform-room/get',
    method: 'get',
    params
  })
}

export function platformRoomList(params) {
  return request({
    url: '/platform-room/list',
    method: 'get',
    params
  })
}

export function frontPlatformRoomList(params) {
  return request({
    url: '/platform-room/front-list',
    method: 'get',
    params
  })
}

export function deletePlatformRoom(params) {
  return request({
    url: '/platform-room/delete',
    method: 'post',
    params
  })
}

export function addPlatformRoom(params) {
  return request({
    url: '/platform-room/create',
    method: 'post',
    data: params
  })
}

export function editPlatformRoom(params) {
  return request({
    url: '/platform-room/update',
    method: 'post',
    data: params
  })
}

export function openDoor(params) {
  return request({
    url: '/platform-room/open-door',
    method: 'post',
    data: params
  })
}

export function examQuestions(params) {
  return request({
    url: '/platform/exam-questions',
    method: 'get',
    params
  })
}

export function submitExam(params) {
  return request({
    url: '/platform/submit-exam',
    method: 'post',
    data: params
  })
}

export function updateExamConfig(params) {
  return request({
    url: '/platform/update-exam-config',
    method: 'post',
    data: params
  })
}

export function applyMoney(params) {
  return request({
    url: '/platform-apply/count-money',
    method: 'post',
    data: params
  })
}

export function auditProject(params) {
  return request({
    url: '/platform-apply/audit-project',
    method: 'post',
    data: params
  })
}

export function mentorAuditList(params) {
  return request({
    url: '/platform-apply/member-list',
    method: 'get',
    params
  })
}

export function myProjectAuditList(params) {
  return request({
    url: '/platform-apply-projects/my-audit-list',
    method: 'get',
    params
  })
}

export function auditApplyProject(params) {
  return request({
    url: '/platform-apply-projects/audit',
    method: 'post',
    params
  })
}

export function mentorAudit(params) {
  return request({
    url: '/platform-apply/mentor-audit',
    method: 'post',
    params
  })
}

export function platformAudit(params) {
  return request({
    url: '/platform-apply/platform-audit',
    method: 'post',
    params
  })
}

export function applyLeavePlatformList(params) {
  return request({
    url: '/platform-leave-apply/list',
    method: 'get',
    params
  })
}

export function leavePlatformApply(params) {
  return request({
    url: '/platform-leave-apply/create',
    method: 'post',
    data: params
  })
}

export function latestLeaveApply(params) {
  return request({
    url: '/platform-leave-apply/latest-apply',
    method: 'get',
    params
  })
}

export function frontApplyLeavePlatformList(params) {
  return request({
    url: '/platform-leave-apply/front-list',
    method: 'get',
    params
  })
}

export function mentorAuditLeaveList(params) {
  return request({
    url: '/platform-leave-apply/member-list',
    method: 'get',
    params
  })
}

export function mentorAuditLeave(params) {
  return request({
    url: '/platform-leave-apply/mentor-audit',
    method: 'post',
    params
  })
}

export function platformAuditLeave(params) {
  return request({
    url: '/platform-leave-apply/platform-audit',
    method: 'post',
    params
  })
}

export function auditApplyPlatformLeave(params) {
  return request({
    url: '/platform-leave-apply/audit',
    method: 'post',
    data: params
  })
}

export function indexList(params) {
  return request({
    url: '/platform/index-list',
    method: 'get',
    params
  })
}

export function platformIndexFrontList(params) {
  return request({
    url: '/platform/index-front-list',
    method: 'get',
    data: params
  })
}
