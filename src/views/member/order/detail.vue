<template>
  <div class="app-container">
      订单详情
    <!-- 进度条 -->
    <ce-steps :active="data.orderStatusFlow+1" :datalist="datalist" class="border-bottom"></ce-steps>

    <!-- 订单编号、按钮 -->
    <div class="order-type">
      <div>订单号：{{data.order.orderNumber}}</div>
      <div
      v-if="data.orderStatusFlow == 1"
      class="col-danger"
      ><svg-icon name="icon-shijian"></svg-icon>剩余0时29分</div>
      <div>订单状态：<span class="font-20 col-danger">{{data.orderStatusFlow}}</span></div>
      <div>
        <el-button v-if="data.orderStatusFlow == 0 || data.paymentTypeName == '货到付款'" type="text">取消订单</el-button>
        <el-button type="primary" plain>查看发票信息</el-button>
        <el-button v-if="data.orderStatusFlow == 0" type="primary" plain @click="showDialog('edit')">修改地址</el-button>
        <el-button v-if="data.orderStatusFlow == 0" type="primary">付款</el-button>  
        <el-button v-if="data.orderStatusFlow == 2" type="primary">确认收货</el-button>  
      </div>
    </div>

    <!-- 收货信息 -->
    <ul class="border detail">
      <li class="detail-item">
        <p class="title">商品清单/结算信息</p>
        <div class="item-list">
          <p class="consignee"><span>收货人：</span><span>{{data.order.consigneeName}}</span></p>
          <p class="consignee"><span>所在地区：</span><span>{{data.order.consigneeProvince}}{{data.order.consigneeCity}}{{data.order.consigneeCounty}}</span></p>
          <p class="consignee"><span>详细地址：</span><span>{{data.order.consigneeAddr}}</span></p>
          <p class="consignee"><span>手机号码：</span><span> +{{data.order.consigneePhoneHead}} {{data.order.consigneePhone}}</span></p>
          <p class="consignee"><span>固定电话：</span><span>{{data.order.consigneeTelHead}}-{{data.order.consigneeTel}}</span></p>
          <p class="consignee"><span>邮政编码：</span><span>{{data.order.consigneeZipCode}}</span></p>
        </div>
      </li>
      <li class="detail-item">
        <p class="title">订单信息</p>
        <div class="item-list">
            <span>支付方式：{{data.paymentTypeName}}</span>
            <el-button type="text">支付信息<svg-icon name="icon-xia"></svg-icon></el-button>
            <div class="slot-content">
              <p v-for="(item, index) in paymentData" :key="index">交易号：2344657687990809090</p>
            </div>
          <p>配送方式：{{data.order.logName}}</p>
        </div>
      </li>
      <li class="detail-item">
        <p class="title">物流信息</p>
        <div class="item-list">
          <el-timeline :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in data.order.LogsList"
              :key="index"
              :timestamp="activity.createTime">
              {{activity.remark}}
            </el-timeline-item>
          </el-timeline>
        </div>
      </li>
    </ul>

    <!-- 商品清单 -->
    <div class="border">
      <p class="title">商品清单/结算信息</p>
      <div class="product-list">
        <product-list :productList="data.order.orderProductSkuList" :currencySymbol="data.order.currencySymbol"></product-list>
        <div class="message-board">
          <div>
            <p>给卖家留言</p>
            <textarea name="" id="" placeholder="我的留言是不可修改的" v-model="data.order.sellerMsg">  </textarea>
          </div>
          <div class="message-pay">
            <p>共 <span class="col-danger font-20">{{data.order.quantity}}</span> 件商品</p>
            <p>商品总额：  {{data.order.currencySymbol}} {{data.totalAmount}}</p>
            <p>运费总计：  {{data.order.currencySymbol}} {{data.order.freight ? data.order.freight : 0}}</p>
            <p class="col-danger font-20">实付金额： <span class="font-bold">{{data.order.currencySymbol}} {{data.order.sumPayable}}</span></p>
          </div>
        </div>
      </div>
    </div>

    <AddressForm
      ref="addressDialog"
      :setAddrForm="current"
      @confirm="confirmDialog"
    ></AddressForm>

  </div>
</template>
<script>
import { getDetail } from '@/api/table'
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import AddressForm from "@/views/components/addressForm"; // 收货人地址弹窗
import productList from '@/views/components/productList'

export default {
  components: {
    ceSteps,
    svgIcon,
    AddressForm,
    productList
  },
  data() {
    return {
      active: 0,
      data: null,
      current: {}, // 弹窗传值
      currencySymbol: null,
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
      reverse: true,
      // activities: [],
      paymentData: [
        {
          key: '交易号',
          value: '2344657687990809090'
        }
      ]
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getDetail(this.listQuery).then(response => {
        console.log(response.data) 
        this.data = response.data
      })
    },
    
    // 弹窗 显示
    showDialog(status) {
      const _this = this.$refs["addressDialog"]; // 获取当前弹窗组件实例
      _this.dialogFormVisible = true; // 修改弹窗 显示状态
      _this.dialogStatus = status; // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 弹窗确认事件
    confirmDialog(data, addFormData, status) {
      /**
       * 1. 获取子组件传过来的 表单信息, 和 状态
       * 2. 根据状态, 对将表单信息进行处理
       */
      console.log(data);
      // this.current = {};
      // if (status === "create") {
      //   console.log("这是创建收货地址");
      // } else {
      //   console.log("这是编辑收货地址");
      // }
      // this.getList();
    },
    // 编辑
    eidtAddress(item) {
      // this.current = JSON.parse(JSON.stringify(item)); // 赋值
      // this.showDialog("edit");
    },
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
.detail{
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.detail-item{
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
  height: 260px;
  padding: 10px;
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
.consignee{
  display: flex;
}
.consignee span{
  width: 100px;
  text-align: right;
  line-height: 1.3;
}
.consignee span:nth-child(2){
  width: calc(100% - 110px);
  text-align: left;
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

