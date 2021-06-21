import request from '@/utils/request'

export function cartData(params) {
    return request({
      url: '/fwebapi/order/shoppingCart/findList',
      method: 'get',
      params
    })
  }


export function cartDel(params) {
    return request({
      url: '/fwebapi/order/shoppingCart/deleteBatch',
      method: 'get',
     
      params,
       
    })
  }

  export function cartUpdate(data) {
    return request({
      url: '/fwebapi/order/shoppingCart/update',
      method: 'post',
      data,
    })
  }


