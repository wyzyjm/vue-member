import request from '@/utils/request'
import {mockOrderListData,mockOrderStatus} from '../../mock/order'
import {orderDetailData} from '../../mock/detail'
import { isDesignMode } from '@/utils/index'

// 订单列表
export function orderList(params) {
  if (!isDesignMode()) {
    return request({
      url: '/fwebapi/order/memberOrder/findMyOrders',
      method: 'get',
      params
    })
  } else {
    return new Promise(function(resolve,reject){
      resolve(mockOrderListData)
    }) 
  }
}

// 订单详情
export function orderDetail(params) {
  if (!isDesignMode()) {
  return request({
    url: '/fwebapi/order/memberOrder/getOrderDetail',
    method: 'get',
    params
  })
  }else{
    return new Promise(function(resolve,reject){
      resolve(orderDetailData)
    })
  }
  
}

// 订单状态头部显示总数
export function orderStatus(params) {
  if (!isDesignMode()) {
  return request({
    url: '/fwebapi/order/memberOrder/getOrderCountByOrderStatus',
    method: 'get',
    params
  })
}else{
  return new Promise(function(resolve,reject){
    resolve(mockOrderStatus) 
  }) 
}
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

