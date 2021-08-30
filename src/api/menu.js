import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/page-service/sys/list',
    method: 'post',
    data
  })
}

export function addCarts(data) {
  return request({
    url: '/fwebapi/order/shoppingCart/add',
    method: 'post',
    data
  })
}

export function getHeaderFoot(params) {
  return request({
    url: window.location.origin + '/get_partial',
    method: 'get',
    params
  })
}
export function getAppByName(params) {
  return request({
    url: window.location.origin + '/producer/getAppByName',
    method: 'get',
    params
  })
}
