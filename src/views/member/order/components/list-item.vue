<template>
  <div class="item-card">
    <div class="item-card-title">
      <span>商品信息</span>
      <span>单价</span>
      <span>数量</span>
      <span>收货人</span>
      <span>实付款</span>
      <span>订单状态</span>
      <span class="operate">操作</span>
    </div>
    <ul class="item-card-content">
      <li
      v-for="(data, index) in list"
      :key="index"
      class="order">
          <div class="order-id">
            <span>下单时间：{{data.createTime}}</span><span>订单号：{{data.orderNumber}}</span>
          </div>
          <ul class="order-list">
            <li class="order-item">
              <div class="goods">
                <div 
                v-for="(item, i) in data.orderProductSkuList"
                :key="i"
                class="goods-information">
                  <div class="goods-cont">
                    <a :href="item.goodsUrl" class="goods-img"><img :src="item.skuImg" :alt="item.skuName"></a>
                    <div class="goods-title">
                      <p>{{item.skuName}}</p>
                      <p class="col-9">
                        <span 
                        v-for="(skuSpec, s) in item.skuSpec"
                        :key="s"
                        >
                        {{skuSpec.specName}}：{{skuSpec.specValue}}；</span>
                      </p>
                    </div>
                  </div>
                  <div class="col-danger goods-price">
                    <span>{{data.currencySymbol}}{{item.skuPrice}}</span>
                  </div>
                  <div class="goods-num"><span>{{item.quantity}}</span></div>
                </div>
              </div>
              <div><span>{{data.consigneeName}}</span></div>
              <div class="actual-payment">
                <p>¥{{data.sumPayable}}</p>
                <p class="col-9 border-bottom p-y m-y">含运费¥{{data.freight}}</p>
                <p class="col-9">{{data.paymentTypeName}}</p>
              </div>
              <div class="col-danger">
                <span>{{data.orderStatus}}</span>
              </div>
              <div class="operate">
                <div v-if="data.orderStatus == 1">
                  <p class="p-y"><i>svg</i> 剩余1时58分</p>
                  <el-button type="primary">付款</el-button>
                </div>
                <el-button v-if="data.orderStatus == 2" type="primary">确认收货</el-button>
                <el-button type="text">查看订单</el-button>
                <el-button v-if="data.orderStatus == 2" type="text">取消订单</el-button>
                <el-button v-else type="text">查看物流</el-button>
              </div>
            </li>
          </ul>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    list: {
      type: Array,
      default: () => [
        {
          "id" : 123,
          "orderNumber":202105101719088093,
          "createTime":1620717797,
          "currencySymbol":"¥",
          "consigneeName":"收货人姓名",
          "sumPayable":"实付款",
            "freight" : 5,
          "paymentTypeName":"微信支付",
          "orderStatus":1,
          "orderProductSkuList":[
              {
                  "productId":1345,
                  "skuId":12,
                  "skuImg":"/public/assets/images/img.png",
                  "skuName":"手机",
                  "skuSpec":[
                      {
                          "specName":"内存",
                          "specValue":"8+256g",
                      },
                      {
                          "specName":"内存2",
                          "specValue":"8+256g",
                      }
                  ],
                  "skuPrice":500,
                  "quantity":2,
                  "goodsUrl":"/goods/detail.html"
              },
              {
                  "productId":1345,
                  "skuId":12,
                  "skuImg":"/public/assets/images/img.png",
                  "skuName":"手机",
                  "skuSpec":[
                      {
                          "specName":"内存",
                          "specValue":"8+256g",
                      },
                      {
                          "specName":"内存2",
                          "specValue":"8+256g",
                      }
                  ],
                  "skuPrice":5000,
                  "quantity":2,
                  "goodsUrl":"/goods/detail.html"
              }
          ]
        },
        {
          "id" : 123,
          "orderNumber":202105101719088093,
          "createTime":1620717797,
          "currencySymbol":"¥",
          "consigneeName":"收货人姓名",
          "sumPayable":"实付款",
            "freight" : 5,
          "paymentTypeName":"微信支付",
          "orderStatus":1,
          "orderProductSkuList":[
              {
                  "productId":1345,
                  "skuId":12,
                  "skuImg":"/public/assets/images/img.png",
                  "skuName":"手机第三方士大夫电商电商多所多所多所多手机第三方士大夫电商电商多所多所多所多所多所多",
                  "skuSpec":[
                      {
                          "specName":"内存",
                          "specValue":"8+256g",
                      },
                      {
                          "specName":"内存2",
                          "specValue":"8+256g",
                      }
                  ],
                  "skuPrice":5000,
                  "quantity":2,
                  "goodsUrl":"/goods/detail.html"
              }
          ]
        }
      ]
    }
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
ul,li{
  list-style: none;
}

.col-9{
  color: #999999;
}
.col-danger{
  color: #F56C6C;
}
.p-y{
  padding: 5px 0;
}
.m-y{
  margin: 5px;
}
.border-bottom{
  border-bottom: 1px solid rgba(222, 222, 224, 1);
}
.item-card-title{
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(245, 245, 245, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(222, 222, 224, 1);
  >span{
    width: 100px;
    text-align: center;
  }
  >span:nth-child(1){
    width: 320px;
  }
  .operate{
    width: 140px;
    display: flex;
    flex-direction: column;
  }
}
.order-id{
  width: 100%;
  padding: 15px 10px;
  background-color: rgba(245, 245, 245, 1);
}
.order-item{
  display: table-row;
  justify-content: space-around;
  align-items: center;
  border-left:1px solid rgba(222, 222, 224, 1);
  border-bottom:1px solid rgba(222, 222, 224, 1);
  >div{
    width: 100px;
    height: 100%;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    border-right:1px solid rgba(222, 222, 224, 1);
    border-bottom:1px solid rgba(222, 222, 224, 1);
  }
  >div:nth-child(1){
    width: 520px;
    border-bottom:none;
  }
  .goods-information{
    width: 100%;
    display: table-row;
    position: relative;
    >div{
      width: 100px;
      height: 140px;
      display: table-cell;
      vertical-align: middle;
      border-bottom:1px solid rgba(222, 222, 224, 1);
    }
    >div:nth-child(1){
      width: 320px;
      text-align: left;
      border-left:1px solid rgba(222, 222, 224, 1);
    }
    .goods-cont{
      display: flex;
      align-items: center;
    }
    .goods-title{
      width: 200px;
      height: 100%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      p{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.5;
      }
    }
    .goods-img{
      width: 120px;
      height: 120px;
      background: #ddd;
      margin:0 10px;
      overflow: hidden;
    }
  }
  .operate{
    width: 140px;
  }
  button{
    padding: 5px 8px;
    margin-bottom: 3px;
  }
}
</style>