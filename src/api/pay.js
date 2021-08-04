import request from '@/utils/request'
import {mockOrderPayInit,mockPayResult} from '../../mock/pay'
import { isDesignMode } from '@/utils/index'

//订单支付初始化信息
export function orderPayInit(params) {
  if (!isDesignMode()) {
    return request({
      url: '/fwebapi/order/payMode/orderPayInit',
      method: 'get',
      params
    })
  } else {
    return new Promise(function(resolve,reject){
      resolve(mockOrderPayInit)
    }) 
  }
}
//保存线下支付记录
export function saveOffLineTransfer(data) {
  return request({
    url: '/fwebapi/order/payMode/saveOffLineTransfer',
    method: 'post',
    data
  })
}
//根据支付方式查询支付配置？？？
export function getPayModeByCode(params) {
  return request({
    url: '/fwebapi/order/payMode/getPayModeByCode',
    method: 'get',
    params
  })

}
//生成支付单
export function createPayment(data) {
  return request({
    url: '/fwebapi/order/pay/createPayment',
    method: 'post',
    data
  })
}
//支付结果
export function payResult(params) {
  

  if (!isDesignMode()) {
    return request({
      url: '/fwebapi/order/pay/result',
      method: 'get',
      params
    })
  } else {
    return new Promise(function(resolve,reject){
      resolve(mockPayResult)
    }) 
  }
}








