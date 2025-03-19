import request from '@/utils/request'

export function invoiceInfo(params) {
    return request({
      url: '/invoice/get',
      method: 'get',
      params
    })
}

export function invoiceList(params) {
  return request({
    url: '/invoice/list',
    method: 'get',
    params
  })
}

export function frontInvoiceList(params) {
    return request({
      url: '/invoice/front-list',
      method: 'get',
      params
    })
}

export function deleteInvoice(params) {
    return request({
      url: '/invoice/delete',
      method: 'post',
      params
    })
}

export function addInvoice(params) {
    return request({
      url: '/invoice/create',
      method: 'post',
      data: params
    })
}

export function editInvoice(params) {
    return request({
      url: '/invoice/update',
      method: 'post',
      data: params
    })
}
