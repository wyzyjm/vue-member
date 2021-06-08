const Mock = require('mockjs')

const data = Mock.mock({
    data: {    
        "orderStatus": 1,
        "paymentTypeName": "货到付款",
        "totalAmount": 1210.0,
        // 订单日志
        "logList": [{
            time: 123456849879564,
            content: "订单创建成功！"
        }],
        "order": {
            "id": 87,
            "currencySymbol": "￥",
            "orderNumber": 202105111500398400,
            "consigneeName": "收货人",
            "consigneeProvince": "北京市",
            "consigneeCity": "北京市",
            "consigneeCounty": "大兴区",
            "consigneeAddr": "北京市北京市大兴区北京市大兴区地盛西路数码庄园",
            "consigneeZipCode": 453600,
            "consigneeTel": 6769038,
            "consigneeTelHead": 0373,
            "consigneePhoneHead": "0086",
             "consigneePhone" : 18635496258,
            "logName": "菜鸟物流",
            "waybill": 23782468326843435,
            "quantity": 11,
            "sumPayable": 2420.0,
            "orderProductSkuList|3": [{
                "productId": 144,
                "skuId": 271,
                "skuName": "货品名称",
                "skuImg": "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
                "skuPrice": 110.0,
                "quantity": 11,
                "aggregateAmount": 1210.0,
                "skuSpec": [{
                    "specName": "内存",
                    "specValue": "8+256g"
                }],
                "productUrl": "/product/144. html"
            }],
            "LogsList": [{
                "remark": "订单创建",
                "createTime": 1623122346000
            }],
            "invoice" : {    
              "id" : 1234,
              "invoiceTitle":1,
              "taxpayerNum":"纳税人识别号",
              "invoiceContent" :"发票内容",
              "takerPhone":"+8613500402886",
              "takerEmail":"zhongqi@300.cn",
              "invoiceDownLink":"电子发票下载链接"
        
            },
            "sellerMsg" : "给卖家的留言"
        }
    }
})

module.exports = [
  {
    url: '/vue-admin-template/detail/data',
    type: 'get',
    response: config => {
      const list = data.data
      return {
        code: 20000,
        data: list
      }
    }
  }
]
