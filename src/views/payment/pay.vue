<template>
  <div class="app-container">
    <p class="title text-normal">
      <span style="cursor:pointer" @click="$router.push('/information/')"
        >{{ orderInfo.userName }}</span
      >
      | <span style="cursor:pointer" @click="$router.push('/order/list')">{{$t('payment_pay_1')}}</span>
    </p>

    <el-card class="box-card text-normal" style="clear: both">
      <corderinfo
        :orderInfo="orderInfo"
        :orderDetail="orderDetail"
        :orderItemList="orderItemList"
         v-if="orderInfo.failureTime!=undefined"
      ></corderinfo>
      <el-card style="margin-top: 20px">
        <div>
          <p v-if="orderInfo.payType === 0"><strong>{{$t('payment_pay_2')}}</strong></p>
          <p v-if="orderInfo.payType === 1"><strong>{{$t('payment_pay_3')}}</strong></p>
          <div class="online">
            <div
              v-for="item in payList"
              :key="item.id"
              class="item"
              @click="openPay(item.payCode)"
            >
              <template v-if="item.payCode === 'Wechat'">
                <img style="width: 100px" src="../../assets/images/vchat.png" />
              </template>

              <template v-if="item.payCode === 'Paypal'">
                <img
                  style="width: 100px"
                  src="../../assets/images/paypal.png"
                />
              </template>
              <template v-if="item.payCode === 'Alipay'">
                <img
                  style="width: 100px"
                  src="../../assets/images/alipay.png"
                />
              </template>

              <template v-if="item.payCode === 'WesternUnion'">
                <img
                  style="width: 100px"
                  src="../../assets/images/WesternUnion.png"
                />
              </template>

              <template v-if="item.payCode === 'MoneyGram'">
                <img style="width: 100px" src="../../assets/images/money.png" />
              </template>

              <template v-if="item.payCode === 'BankTransfer'">
                <img style="width: 100px" src="../../assets/images/bank.png" />
              </template>
            </div>
          </div>
        </div>
      </el-card>
    </el-card>
    <el-dialog title="" :visible.sync="dialogVisible" width="530px">
      <div class="text-normal" style="text-align: center">
        <div class="pop-title">{{PayCodeName}}</div>
        <p class="pop-info">{{$t('payment_pay_4')}}<br />{{$t('payment_pay_5')}}</p>
        <p>
          <!-- todo -->
          <el-button
            type="primary"
            style="margin-right: 30px"
            @click="openPay(payCode)"
            >{{$t('payment_pay_6')}}</el-button
          >
          <el-button type="primary" plain @click="confirmPay">{{$t('payment_pay_7')}}</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import corderinfo from "./components/orderinfo.vue";
import { orderPayInit } from "@/api/pay";
import { getResult } from "@/utils/resultValidate";

export default {
  data() {
    return {
      showDetail: false,
      dialogVisible: false,
      orderTimer: null,
      orderTimeCount: 0,
      orderInfo: {},
      orderDetail: {},
      orderItemList:[],
      payList: {},
      payCode: "",
      PayCodeName:""
    };
  },
  components: {
    corderinfo,
  },
  mounted() {
    let payResult = getResult(this.$route.query.orderId);
    payResult.then((hasPay) => {
      if (hasPay) {
        this.$router.push({
          path: "/order/detail",
          query: { id: this.$route.query.orderId },
        });
      } else {
        //订单详情数据
        let param = {};
        param.orderId = this.$route.query.orderId;
        orderPayInit(param).then((res) => {
          if (res.status === 200) {
            this.orderInfo = res.data;
            this.orderDetail = res.data.orderDetail;
            this.orderItemList = res.data.orderItemList;
            this.payList = res.data.payList;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });
  },
  methods: {
    openPay(code) {
      this.payCode = code;
      
//todo验证是否显示正确
      this.PayCodeName = this.payList.filter((item)=>{
        return item.payCode == this.payCode
      }).payName
      
      this.dialogVisible = true;
      let href = this.$router.resolve({
        path: "/payment/poppay",
        query: { payCode: code, orderId: this.orderInfo.orderId ,payMode: this.orderInfo.payType,},
      });
      window.open(href.href, "_blank");
    },
    confirmPay() {
      this.$router.push({
            path: "/payment/result",
            query: { orderId: this.orderInfo.orderId },
          });
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

