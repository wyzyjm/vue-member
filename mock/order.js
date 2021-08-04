const Mock = require('mockjs')


export const mockOrderListData = Mock.mock({
  data: {
    data: {
      "list|5": [{
        consigneeName: "@cname",
        createTime: "1627952865000",
        currencySymbol: "¥",
        freight: "@increment()",
        id: "@increment()",
        orderNumber: "20210803090744822587",
        orderProcessNodes: "ORDER_SUBMIT,PAYMENT_PROCESS,DELIVERY_PROCESS,TRADE_SUCCESS",
        orderProductSkuList: [{
          productId: "@increment()",
          "quantity|1-10": 1,
          skuId: "@increment()",
          skuImg: "",
          skuName: "@ctitle",
          "skuPrice|1-999": 1.01,
          skuSpec: [{
            specId: "@increment()",
            specName: "型号",
            specValue: "Ss"
          }]
        }

        ],
        orderStatus: 30,
        payMode: 0,
        paymentTypeName: "微信",
        "sumPayable|1-999": 0.01,
        systemTime: "1627958854064",
      }
      ],
      pagination: {
        currentPage: 1,
        orderBys: {},
        pageSize: 10,
        params: {},
        totalCount: 205,
        totalPages: 21,
      }
    },
  },

  status: 200,
  msg: "success"
}
)
export const mockOrderStatus = Mock.mock({
  data: {
    "code": "0", 
    data:
      { "notConfirmCount": 0, 
      "notPayCount": 0, "notDeliverCount": 0, "hasDeliverCount": 0 }
  },
  status: 200,
  msg: "success"
}
)

