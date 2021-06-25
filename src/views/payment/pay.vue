<template>
  <div class="app-container">
    <p class="title text-normal">
      <span @click="$router.push('/information/')"
        >{{ orderInfo.userName }}账户名称</span
      >
      | <span @click="$router.push('/order/list')">我的订单</span>
    </p>

    <el-card class="box-card text-normal" style="clear: both">
      <corderinfo
        :orderInfo="orderInfo"
        :orderDetail="orderDetail"
      ></corderinfo>
      <el-card style="margin-top: 20px">
        <div >
          <p v-if="orderInfo.payType === 0"><strong>在线支付</strong></p>
          <p v-if="orderInfo.payType === 1"><strong>线下支付</strong></p>
          <div class="online">
            <div
              v-for="item in payList"
              :key="item.id"
              class="item"
              @click="openPay(item.payCode)"
            >
              <template v-if="item.payCode==='Wechat'">
                <img style="width: 100px" src="../../assets/images/vchat.png" />
              </template>
              

              <template v-if="item.payCode==='Paypal'">
                <img style="width: 100px" src="../../assets/images/paypal.png" />
              </template>
              <template v-if="item.payCode==='Alipay'">
                <img style="width: 100px" src="../../assets/images/alipay.png" />
              </template>

              <template v-if="item.payCode==='WesternUnion'">
                <img style="width: 100px" src="../../assets/images/WesternUnion.png" />
              </template>

              <template v-if="item.payCode==='MoneyGram'">
                <img style="width: 100px" src="../../assets/images/money.png" />
              </template>

              <template v-if="item.payCode==='BankTransfer'">
                <img style="width: 100px" src="../../assets/images/bank.png" />
              </template>

            </div>
            
            </div>
          </div>
         
        
        
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
          <!-- todo -->
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
import corderinfo from "./components/orderinfo.vue";
import { orderPayInit } from "@/api/pay";
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
      // selectPayCode:""
    };
  },
  components: {
    corderinfo,
  },
  mounted() {
    //订单详情数据
    let param = {};
    param.orderId = this.$route.query.orderId;
    orderPayInit(param).then((res) => {
      if (res.status === 200) {
        this.orderInfo = res.data;
        this.orderDetail = res.data.orderDetail;
        this.payList = res.data.payList;
      } else {
        this.$message.error(res.msg);
      }
    });
   
  },
  methods: {
    openPay(code) {
      this.dialogVisible = true;
      let href = this.$router.resolve({ path: "/payment/poppay", query: {payCode:code,orderId:this.orderInfo.orderId} });
      window.open(href.href,'_blank')
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

