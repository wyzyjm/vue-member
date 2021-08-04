const Mock = require('mockjs')


  let mockCartData = Mock.mock({
    data: {
      "totalPrice": 1000.00,
      "totalNum": 10,
      "currencySymbol": "¥",
      "shoppingCartList|5" : [
        {
          "productId": 143,
          "skuId|+1": 260,
          "quantity": 11,
          "skuName": '@ctitle(10)',
          "skuImg": "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
          "skuSpec": [
            {
              "specId": 12345,
              "specName": "规格名称",
              "specValue": "规格值"
            }
          ],
          "skuPrice|1-999": 1,
          "subtotal|1-999": 1,
          "moq": 10,
          "stock": 10000,
          "productUrl": "/product/144. html",
          "statusTip": 1
        }
      ]
    },
    status:200
  }
  )

export default mockCartData 
