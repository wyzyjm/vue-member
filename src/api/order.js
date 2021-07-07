import request from '@/utils/request'

// 订单列表
export function orderList(params) {
  return request({
    url: '/fwebapi/order/memberOrder/findMyOrders',
    method: 'get',
    params
  })
}

// 订单详情
export function orderDetail(params) {
  return request({
    url: '/fwebapi/order/memberOrder/getOrderDetail',
    method: 'get',
    params
  })
}

// 订单状态头部显示总数
export function orderStatus(params) {
  return request({
    url: '/fwebapi/order/memberOrder/getOrderCountByOrderStatus',
    method: 'get',
    params
  })
}

// 确认收货
export function confirmOrder(params) {
  return request({
    url: '/fwebapi/order/memberOrder/confirmOrder',
    method: 'get',
    params
  })
}

// 取消订单
export function cancelOrder(params) {
  return request({
    url: '/fwebapi/order/memberOrder/cancelOrder',
    method: 'get',
    params
  })
}

