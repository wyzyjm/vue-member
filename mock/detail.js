const Mock = require('mockjs')

export const orderDetailData = Mock.mock(
  {"data":{"code":"0","data":{"order":{"orderId":"872157705348767744","memberId":"864808182405980160","orderNumber":"20210803164320969331","orderStatus":60,"currencySymbol":"¥","totalAmount":358.00,"freight":0.00,"sumPayable":358.00,"orderProcessNodes":"ORDER_SUBMIT,PAYMENT_PROCESS,TRADE_SUCCESS","sellerMsg":"","createTime":1627980201000,"systemTime":1627980982815,"consigneeInfo":{"consigneeName":"liangboping002dds22211","consigneePhoneHead":"CN+86","consigneePhone":"17780634551","consigneeTelHead":"CN+86","consigneeTel":"17780634551","consigneeZipCode":"1000000","consigneeCountry":"1","consigneeProvince":"51","consigneeCity":"1","consigneeCounty":"4","consigneeAddr":"fdsgdasd21ewde32ew","defaultFlag":0,"reverseFlag":0},"orderStatusDetailList":[{"time":1627980201000,"content":"提交订单"},{"time":1627980201000,"content":"待付款"},{"time":1627980764000,"content":"交易关闭"}],"goodsList":[{"productId":"871787891821961216","skuId":"871787892010704896","skuName":"liangpd02","skuImg":"shop/20210622144830/cms/image/63a473d2-402d-40b2-b5a6-d248ab75afe0.jpg","skuPrice":26.00,"quantity":3,"subtotal":78.00,"skuSpec":[{"specId":"869271630558846976","specName":"文字规格","specValue":"头像"},{"specId":"869271630558846977","specName":"图片规则","specValue":"小猪"}]},{"productId":"871787891821961216","skuId":"871787891951984640","skuName":"liangpd02","skuImg":"shop/20210622144830/cms/image/239e0f9e-917d-4a16-a17d-21e6e3fd7fac.jpg","skuPrice":250.00,"quantity":1,"subtotal":250.00,"skuSpec":[{"specId":"869271630558846976","specName":"文字规格","specValue":"头像"},{"specId":"869271630558846977","specName":"图片规则","specValue":"小鸡"}]},{"productId":"871786543248367616","skuId":"871786543248367616","skuName":"liangpd01","skuImg":"shop/20210622144830/cms/image/b1dce1d8-5d36-4934-b3b9-9f1eae86f06b.jpg","skuPrice":10.00,"quantity":3,"subtotal":30.00,"skuSpec":[]}]}}},"status":200,"msg":"success"}
)

// module.exports = [
//   {
//     url: '/vue-admin-template/detail/data',
//     type: 'get',
//     response: config => {
//       const list = data.data
//       return {
//         code: 20000,
//         data: list
//       }
//     }
//   }
// ]
