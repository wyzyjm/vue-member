import request from '@/utils/request'

export function orderList(params) {
  return request({
    url: '/fwebapi/order/memberOrder/findMyOrders',
    method: 'get',
    params
  })
}

export function orderDetail(params) {
  return request({
    url: '/fwebapi/order/memberOrder/getOrderDetail',
    method: 'get',
    params
  })
}
