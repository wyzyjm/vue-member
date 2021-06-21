import request from '@/utils/request'

// 获取 收货地址列表 
const getAddressList = () => {
    return request({
        url: '/fwebapi/order/address/list',
        method: 'POST'
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
        data
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
    consigneeAddr: "详细地址修改了一下"
    consigneeCity: "郑州市"
    consigneeCountry: "中国"
    consigneeCounty: "县"
    consigneeName: "我是编辑后的名字"
    consigneePhone: "183****8347"
    consigneePhoneHead: "0086"
    consigneeProvince: "河南省修改"
    consigneeTel: "6769038"
    consigneeTelHead: "8633"
    consigneeZipCode: "453600"
    receiverCode: "855547036190957568"
 */
const eidtAddressList = (data) => {
    return request({
        url: "/fwebapi/order/address/update",
        method: 'POST',
        data
    })
}


export {
    getAddressList, // 列表
    addAddressList, // 新增
    setAddressList, // 设为默认
    deleteAddressList, // 删除
    eidtAddressList // 修改
}