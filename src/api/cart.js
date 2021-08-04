import request from '@/utils/request'
import mockOrderListData from '../../mock/cart'
import { isDesignMode } from '@/utils/index'


export function cartData(params) {
  if (!isDesignMode()) {
    return request({
      url: '/fwebapi/order/shoppingCart/findList',
      method: 'get',
      params
    })
  } else {
    return mockOrderListData
  }

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

  export function updateSelected(data) {
    return request({
      url: '/fwebapi/order/shoppingCart/updateSelected',
      method: 'post',
      data,
    })
  }


  export function selectSettle(data) {
    return request({
      url:'/fwebapi/order/settle/selectSettle',
      method: 'post',
      data,
    })
  }


  export function cartAdd(data) {
    return request({
      url:'/fwebapi/order/shoppingCart/add?appid=143150160001',
      method: 'post',
      headers:{'appid':143150160001},

      data,
    })
  }
