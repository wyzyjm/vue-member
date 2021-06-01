<template>
  <div class="app-container">
      订单详情
    <!-- 进度条 -->
    <ce-steps :active="active" :datalist="datalist" class="border-bottom"></ce-steps>

    <!-- 订单编号、按钮 -->
    <div class="order-type">
      <div>订单号：153008702655</div>
      <div class="col-danger"><svg-icon name="icon-shijian"></svg-icon>剩余0时29分</div>
      <div>订单状态：<span class="font-20 col-danger">待付款</span></div>
      <div>
        <el-button type="text">取消订单</el-button>
        <el-button type="primary" plain>查看发票信息</el-button>
        <el-button type="primary" plain>修改地址</el-button>
        <el-button type="primary">付款</el-button>  
        <el-button type="primary">确认收货</el-button>  
      </div>
    </div>

    <!-- 收货信息 -->
    <ul class="border detial">
      <li class="detial-item">
        <p class="title">商品清单/结算信息</p>
        <div class="border-right item-list">
          <p>收货人：这个名字很长</p>
          <p>所在地区：北京市大兴区</p>
          <p>详细地址：亦庄经济技术开发区地盛西路1号地盛西路1号亦庄经济技术开发区</p>
          <p>手机号码：+86 18512341234</p>
          <p>固定电话：010-46732122</p>
          <p>邮政编码：100000</p>
        </div>
      </li>
      <li class="detial-item">
        <p class="title">订单信息</p>
        <div class="border-right item-list">
            <span>支付方式：微信支付</span>
            <el-button type="text">支付信息<svg-icon name="icon-xia"></svg-icon></el-button>
            <div class="slot-content">
              <p v-for="(item, index) in paymentData" :key="index">交易号：2344657687990809090</p>
            </div>
          <p>配送方式：快递发货</p>
        </div>
      </li>
      <li class="detial-item">
        <p class="title">物流信息</p>
        <div class="item-list">
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </li>
    </ul>

    <!-- 商品清单 -->
    <div class="border">
      <p class="title">商品清单/结算信息</p>
      <div class="product-list">
        <product-list :productList="productList"></product-list>
        <div class="message-board">
          <div>
            <p>给卖家留言</p>
            <textarea name="" id="" placeholder="我的留言是不可修改的"></textarea>
          </div>
          <div class="message-pay">
            <p>共 <span class="col-danger font-20">3</span> 件商品</p>
            <p>商品总额：  ¥ 300.00</p>
            <p>运费总计：  ¥ 5.00</p>
            <p class="col-danger font-20">实付金额： <span class="font-bold">¥ 305.00</span></p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<script>
import ceSteps from "@/components/CeSteps"
import svgIcon from '@/components/SvgIcon'
import productList from '@/views/components/productList'

export default {
  components: {
    ceSteps,
    svgIcon,
    productList
  },
  data() {
    return {
      active: 0,
      datalist: [
        {
          title: "提交订单",
          description: "2016-03-25 10:26:10",
        },
        {
          title: "待付款",
          description: "",
        },
        {
          title: "待发货",
          description: "",
        },
        {
          title: "待收货",
          description: "",
        },
      ],
      productList: [{
          "productId": 144,
          "skuId": 271,
          "skuName": "货品名称",
          "skuImg": "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
          "skuPrice": 1121210.0,
          "quantity": 11,
          "aggregateAmount": 1210.0,
          "skuSpec": [{
              "specName": "内存",
              "specValue": "8+256g"
          }],
          "productUrl": "/product/144. html"
      },{
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
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      },{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      paymentData: [
        {
          key: '交易号',
          value: '2344657687990809090'
        }
      ]
    }
  },
  methods: {
    
  }
}
</script>
<style scoped>
ul,li{
  list-style: none;
  padding: 0;
  margin: 0;
}
.font-20{
  font-size: 20px;
}
.font-bold{
  font-weight: bold;
}
.col-danger{
  color: #F56C6C;
}
.border{
  border: 1px solid #C0C4CC;
}
.border-bottom{
  border-bottom: 1px solid #C0C4CC;
}
.border-top{
  border-top: 1px solid #C0C4CC;
}
.border-right{
  border-right: 1px solid #C0C4CC;
}
.order-type{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}
.detial{
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.detial-item{
  flex: 1;
}
.title{
  background-color: rgb(242, 242, 242);
  margin: 0;
  padding: 15px 20px;
}
.product-list{
  margin: 0 40px;
}
.item-list{
  height: 230px;
  padding: 10px 20px;
  margin: 20px 10px;
  overflow-y: auto;
}
.item-list::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background: none;
}

.item-list::-webkit-scrollbar-track {
    background: none;
}

.item-list::-webkit-scrollbar-thumb {
    background-color: #E0E0E0;
    border-radius: 6px;
}

.item-list::-webkit-scrollbar-button {
    height: 0;
    background: none;
}
.message-board{
  display: flex;
  justify-content: space-between;
}
.message-board textarea{
  width: 500px;
  height: 100px;
  resize: vertical;
  border: none;
}
.message-pay{
  text-align: right;
}
</style>

