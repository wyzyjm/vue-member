const Mock = require('mockjs')
import router from '../src/router'
console.log(router)
export const mockSkuItemData = Mock.mock({"data":{"totalPrice":50.02,"currencySymbol":"¥","orderSplitResponseVOList":[{"shoppingCartList":[{"shoppingCartCode":"872111938923716608","productId":"869227232945037312","skuId":"869227232945037312","skuName":"yx实物1001","skuImg":"shop/20210622144830/cms/image/501658b8-23f1-41de-9ef2-c810053987d9.jpg","standardsDesc":"[]","skuSpec":[],"goodsName":"yx实物1001","skuPrice":0.01,"currency":"¥","quantity":2,"moq":1,"stock":890,"statusTip":1,"goodsInvalidFlag":1,"subtotal":0.02,"appId":"143150160001","orderProcessId":"869157161248022528"}],"totalNum":1,"totalPrice":50.02,"payableGoodsAmount":0.02,"freightPrice":50.00}]},"status":200,"msg":"success"})
export const mockPayModeInfo = Mock.mock({"data":{"distributionList":[{"id":"1","name":"快递发货"}],"payList":[{"type":0,"typeName":"在线支付","prompt":"即时到账，支持支付宝、微信、Paypal等支付方式","isAvailable":true},{"type":1,"typeName":"线下支付","prompt":"支持Bank Transfer、Western Union、Money Gram等支付方式","isAvailable":true},{"type":2,"typeName":"货到付款","prompt":"仅支持部分在地区货到付款","isAvailable":true}]},"status":200,"msg":"success"});