import request from '@/utils/request'

export function trainDocInfo(params) {
    return request({
      url: '/train-doc/get',
      method: 'get',
      params
    })
}

export function trainDocList(params) {
  return request({
    url: '/train-doc/list',
    method: 'get',
    params
  })
}

export function frontTrainDocList(params) {
  return request({
    url: '/train-doc/front-list',
    method: 'get',
    params
  })
}

export function deleteTrainDoc(params) {
    return request({
      url: '/train-doc/delete',
      method: 'post',
      params
    })
}

export function addTrainDoc(params) {
    return request({
      url: '/train-doc/create',
      method: 'post',
      data: params
    })
}

export function editTrainDoc(params) {
    return request({
      url: '/train-doc/update',
      method: 'post',
      data: params
    })
}

export function examQuestionInfo(params) {
    return request({
      url: '/exam-question/get',
      method: 'get',
      params
    })
}

export function examQuestionList(params) {
  return request({
    url: '/exam-question/list',
    method: 'get',
    params
  })
}

export function frontExamQuestionList(params) {
  return request({
    url: '/exam-question/front-list',
    method: 'get',
    params
  })
}

export function deleteExamQuestion(params) {
    return request({
      url: '/exam-question/delete',
      method: 'post',
      params
    })
}

export function addExamQuestion(params) {
    return request({
      url: '/exam-question/create',
      method: 'post',
      data: params
    })
}

export function editExamQuestion(params) {
    return request({
      url: '/exam-question/update',
      method: 'post',
      data: params
    })
}

export function examInfo(params) {
    return request({
      url: '/exam/get',
      method: 'get',
      params
    })
}

export function examList(params) {
  return request({
    url: '/exam/list',
    method: 'get',
    params
  })
}

export function frontExamList(params) {
  return request({
    url: '/exam/front-list',
    method: 'get',
    params
  })
}

export function deleteExam(params) {
    return request({
      url: '/exam/delete',
      method: 'post',
      params
    })
}

export function addExam(params) {
    return request({
      url: '/exam/create',
      method: 'post',
      data: params
    })
}

export function editExam(params) {
    return request({
      url: '/exam/update',
      method: 'post',
      data: params
    })
}

export function examSubmit(params) {
  return request({
    url: '/exam/submit',
    method: 'post',
    data: params
  })
}

export function examRecordList(params) {
  return request({
    url: '/exam/record-front-list',
    method: 'get',
    params
  })
}

export function apparatusAdminList(params) {
  return request({
    url: '/exam/apparatus-admin-list',
    method: 'get',
    params
  })
}

export function importExam(params) {
  return request({
    url: '/question-import/create',
    method: 'post',
    data: params
  })
}
