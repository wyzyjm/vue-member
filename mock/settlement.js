const Mock = require('mockjs')

const data = Mock.mock({
  // 物流信息集合
	"distributionList": [{
		"id": 1,
		"name": "快递发货"
	}],
	// 支付方式集合
	"payList": [{
		"id": 402,
         "type" : 0,
		"typeName": "在线支付",
         "prompt" : "即时到账，支持支付宝、微信、Paypal等支付方式"
	}]
})