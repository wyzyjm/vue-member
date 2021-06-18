import request from '@/utils/request'

// 获取 收货地址列表
export function getAddressList(params) {
    return request({
        url: '/api/order/address/list',
        method: 'POST',
        params
    })
}

// 新增
/**
 {
  "consigneeAddr": "",
  "consigneeCity": "",
  "consigneeCountry": "",
  "consigneeCounty": "",
  "consigneeName": "",
  "consigneePhone": "",
  "consigneePhoneHead": "",
  "consigneeProvince": "",
  "consigneeTel": "",
  "consigneeTelHead": "",
  "consigneeZipCode": "",
  "receiverTitle": ""
}
 */
export function addAddressList(data, params) {
    return request({
        url: '/fwebapi/order/address/add',
        method: 'POST',
        data,
        params
    })
}
// 设为默认
export function setAddressList(params) {
    return request({
        url: '/fwebapi/order/address/list',
        method: 'POST',
        params
    })
}
// 删除
export function deleteAddressList(params) {
    return request({
        url: '/fwebapi/order/address/delete',
        method: 'POST',
        params
    })
}
// 修改
/**
 {
  "consigneeAddr": "string",
  "consigneeCity": "string",
  "consigneeCountry": "string",
  "consigneeCounty": "string",
  "consigneeName": "string",
  "consigneePhone": "string",
  "consigneePhoneHead": "string",
  "consigneeProvince": "string",
  "consigneeTel": "string",
  "consigneeTelHead": "string",
  "consigneeZipCode": "string",
  "receiverTitle": "string"
}
 */
export function eidtAddressList(data, params) {
    return request({
        url: '/fwebapi/order/address/update',
        method: 'POST',
        data,
        params
    })
}