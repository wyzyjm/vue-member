const Mock = require('mockjs')

const data = Mock.mock({
  "list|9":[
    {
        id : "@id",
        orderNumber:202105101719088093,
        createTime:1620717797,
        currencySymbol:"¥",
        consigneeName:"收货人姓名",
        sumPayable:"实付款",
        freight: "@integer(1, 50)",
        paymentTypeName:"微信支付",
        orderStatus:"@integer(0, 4)",
        "orderProductSkuList|2":[
            {
                productId:"@id",
                skuId:12,
                skuImg:"/public/assets/images/img.png",
                skuName:"手机",
                "skuSpec|3":[
                    {
                        specName:"内存",
                        specValue:"8+256g",
                    }
                ],
                skuPrice:"@integer(300, 5000)",
                quantity:"@integer(1, 100)",
                goodsUrl:"/goods/detail.html"
            }
        ]
    }
]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const list = data.list
      return {
        code: 20000,
        data: {
          pagination :{
            pageSize : 5,
            currentPage : 1,
            totalCount : 4,
          },
          list: list
        }
      }
    }
  }
]
