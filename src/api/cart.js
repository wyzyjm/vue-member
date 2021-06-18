import request from '@/utils/request'

export function cartData(params) {
    return request({
      url: 'http://172.22.146.56:8888/fwebapi/order/shoppingCart/findList',
      method: 'get',
      params
    })
  }


