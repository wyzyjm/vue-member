<template>
  <div class="app-container">
    <div class="wrapper" style="position: relative">
      <div class="result-content text-normal">
        <template v-if="resultInfo.isSuccess">
          <svg-icon
          name="icon-caozuochenggong"
          style="font-size: 60px; color: #1989fa"
        ></svg-icon>
          <p class="tips">购买成功，我们尽快为您处理！</p>
        </template>
        <template v-else>
          <p class="tips">支付失败，支付遇到问题，请尝试重新支付！</p>
        </template>
        <div class="detail">
          订单号：{{ resultInfo.orderNumber }}<br />
          {{ resultInfo.payName }}：<span class="text-danger"
            >{{ resultInfo.currencySymbol }} {{ resultInfo.sumPayable }}</span
          >
        </div>
        <div v-if="resultInfo.isSuccess">
          <el-button type="primary" @click="linkTo">查看订单详情</el-button>
          <el-button type="primary" plain @click="linkToHome">返回首页</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="rePay">重新支付</el-button>
          <el-button type="primary" plain @click="linkTo">查看订单详情</el-button>
        </div>
        <el-divider></el-divider>
        <p>重要提醒：不点击陌生链接、不泄露银行卡和验证码信息，谨防诈骗！</p>
      </div>
    </div>
  </div>
</template>
<script>
import { payResult } from "@/api/pay";
export default {
  data() {
    return {
      resultInfo: {},
    };
  },
  mounted() {
    let param = {};
    param.orderId = this.$route.query.orderId;
    payResult(param).then((res) => {
      if (res.status === 200) {
        this.resultInfo = res.data;
      } else {
        this.$message.error(res.msg);
      }
    });
  },
  methods: {
    linkTo(){
      this.$router.push({path:'/order/detail',query:{id:this.$route.query.orderId}})
    },
    rePay(){
       this.$router.push({path:'/payment/pay',query:{payVal:0,orderId:this.$route.query.orderId}})
    },
    linkToHome(){
         this.$router.push({path:'/'})
   
    }

  },
};
</script>
<style scoped>
.result-content {
  width: 930px;
  height: 400px;
  margin: auto;
  margin-top: 100px;
  text-align: center;
}
.result-content .tips {
  font-size: 20px;
}
.result-content .detail {
  line-height: 30px;
  margin-bottom: 30px;
}
</style>

