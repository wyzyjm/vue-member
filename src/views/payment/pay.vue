<template>
  <div class="app-container">
    <p class="title text-normal">
      <span @click="$router.push('/information/')"
        >{{ orderInfo.userName }}账户名称</span
      >
      | <span @click="$router.push('/order/list')">我的订单</span>
    </p>

    <el-card class="box-card text-normal" style="clear: both">
      
      <corderinfo :orderInfo="orderInfo" :orderDetail="orderDetail"></corderinfo>
      <el-card style="margin-top: 20px">
        <div v-if="orderInfo.payType === 0">
          <p><strong>在线支付</strong></p>

          <div class="online">
            <!-- <div
              v-for="item in payList"
              :key="item.id"
              class="item"
              @click="openPay(item.id)"
            > -->
            <div
              class="item"
              @click="openPay"
            >
              <img style="width: 100px" src="../../assets/images/vchat.png" />
              <!-- <img style="width: 100px" :src="item.payImg" /> -->
              
            </div>
            <div class="item">
              <img style="width: 100px" src="../../assets/images/alipay.png" />
            </div>
            <div class="item">
              <img style="width: 100px" src="../../assets/images/paypal.png" />
            </div>
          </div>
        </div>
        <template v-if="orderInfo.payType===1">
        <p><strong>线下支付</strong></p>
        <div class="offline">
          <div class="item">
            <img style="width: 100px" src="../../assets/images/bank.png" />
          </div>
          <div class="item">
            <img style="width: 100px" src="../../assets/images/money.png" />
          </div>
          <div class="item">
            <img
              style="width: 100px"
              src="../../assets/images/WesternUnion.png"
            />
          </div>
        </div>
        </template>
      </el-card>
    </el-card>
    <el-dialog title="" :visible.sync="dialogVisible" width="530px">
      <div class="text-normal" style="text-align: center">
        <div class="pop-title">支付宝支付</div>
        <p class="pop-info">
          1、如果未完成付款，请点击继续付款
          <br />2、如果您已完成，请点击“已完成付款”
        </p>
        <p>
          <el-button
            type="primary"
            style="margin-right: 30px"
            @click="dialogVisible = false"
            >重新支付</el-button
          >
          <el-button type="primary" plain @click="dialogVisible = false"
            >已完成付款</el-button
          >
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import corderinfo from './components/orderinfo.vue'
export default {
  data() {
    return {
      showDetail: false,
      dialogVisible: false,
      orderTimer: null,
      orderTimeCount: 0,
      orderInfo: {},
      orderDetail: {},
      payList: {},
    };
  },
  components:{
    corderinfo
  },
  mounted() {
    //data
    let data2 = {
      orderId: 88,
      userId: 99,
      userName: "小明",
      orderNo: "202105111523178740",
      amount: 2420.0,
      currencySymbol: "￥",
      createTime: 23454567879,
      failureTime: 3600,
      payType: 0,
      payList: [
        {
          id: 1,
          payName: "微信支付",
          payImg: "../../../src/assets/images/vchat.png",
        },
        {
          id: 2,
          payName: "支付宝",
          payImg: "../../assets/images/alipay.png",
        },
        {
          id: 3,
          payName: "paypal",
          payImg: "../../assets/images/paypal.png",
        },
      ],
      orderDetail: {
        id: 123,
        consigneeName: "收货人名称",
        consigneeProvince: "省",
        consigneeCity: "市",
        consigneeCounty: "区",
        consigneeAddr: "详细地址值",
        consigneePhoneHead: "0086",
        consigneePhone: 18636908524,
        productName: ["商品名称", "手机", "电脑", "电动车"],
      },
    };
    // for(let i in data){
    //  this.$set(this.orderInfo,i,data[i])
    // }
    this.orderInfo = data2
    this.orderDetail = data2.orderDetail;
    this.payList = data2.payList;
    console.log(this.orderInfo);
  },
  methods: {
    openPay() {
      this.dialogVisible = true;
      this.$router.push({path:'/payment/poppay',query:{}})
    },
   
  },
};
</script>
<style scoped>
.online,
.offline {
  margin-bottom: 150px;
}
.online .item,
.offline .item {
  display: inline-block;
  vertical-align: middle;
  width: 180px;
}
.online::after {
  display: block;
  content: "";
  clear: both;
}
.pop-info {
  width: 300px;
  text-align: left;
  margin: 10px auto 30px auto;
  line-height: 20px;
}
.pop-title {
  font-size: 20px;
  margin-bottom: 30px;
}
.title {
  float: right;
}

</style>

