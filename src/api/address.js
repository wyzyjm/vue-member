import request from '@/utils/request'

const params = {
    tenantId: 1600018169,
}
// 获取 收货地址列表 
const getAddressList = () => {
    return request({
        url: '/fwebapi/order/address/list',
        method: 'POST',
        params
    })
}

// 新增 国家地区传参
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
const addAddressList = (data) => {
    return request({
        url: '/fwebapi/order/address/add',
        method: 'POST',
        data,
        params
    })
}
// 设为默认 传参
const setAddressList = (params) => {
    return request({
        url: '/fwebapi/order/address/default',
        method: 'GET',
        params
    })
}
// 删除
const deleteAddressList = (params) => {
    return request({
        url: '/fwebapi/order/address/delete',
        method: 'GET',
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
const eidtAddressList = (data, params) => {
    return request({
        url: '​/fwebapi​/order​/address​/update',
        method: 'POST',
        data,
        params
    })
}


export {
    getAddressList, // 列表
    addAddressList, // 新增
    setAddressList, // 设为默认
    deleteAddressList, // 删除
    eidtAddressList // 修改
}