import request from '@/utils/request'

export function payModeInitInfo(data) {
  return request({
    url: '/fwebapi/order/payMode/initInfo',
    method: 'post',
    data
  })
}

export function addUpdateInvoice(data) {
  return request({
    url: '/fwebapi/order/settle/addUpdateInvoice',
    method: 'post',
    data
  })
}
//运费计算
export function calculateFare(data) {
  return request({
    url: '/fwebapi/order/settle/calculateFare',
    method: 'post',
    data
  })
}
//提交订单
export function addOrder(data) {
  return request({
    url: '/fwebapi/order/settle/addOrder',
    method: 'post',
    data
  })
}

//查询发票
export function getSettle(params) {
  return request({
    url: '/fwebapi/order/settle/list',
    method: 'get',
    params
  })
}

//通过发票id查询发票
export function getSettleById(params) {
  return request({
    url: '/fwebapi/order/settle/getById',
    method: 'get',
    params
  })
}
//通过发票id查询发票
export function skuItem(params) {
  return request({
    url: '/fwebapi/order/shoppingCart/skuItem',
    method: 'get',
    params
  })
}







