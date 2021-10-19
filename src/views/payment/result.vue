<template>
  <div class="app-container">
    <div class="wrapper" style="position: relative">
      <div class="result-content text-normal">
        <template v-if="resultInfo.isSuccess">
          <svg-icon
            name="icon-caozuochenggong"
            style="color: #1989fa"
            setsize="60"
          ></svg-icon>
          <p class="tips">{{$t('payment_result_1')}}</p>
        </template>
        <template v-else>
           <svg-icon
            name="icon-zhifushibai"
            style="color: #1989fa"
            setsize="60"
          ></svg-icon>
          <p class="tips">{{$t('payment_result_2')}}</p>
        </template>
        <div class="detail">
          <div v-for="item in resultInfo.orderNumberList" :key="item">{{$t('payment_result_3', [ item ])}}<br />
          </div>

          {{ resultInfo.payName }}：<span class="text-danger"
            >{{ resultInfo.currencySymbol }} {{ resultInfo.sumPayable }}</span
          >
        </div>
        <div v-if="resultInfo.isSuccess">
          <el-button type="primary" @click="linkTo">{{$t('payment_result_4')}}</el-button>
          <el-button type="primary" plain @click="linkToHome"
            >{{$t('payment_result_5')}}</el-button
          >
        </div>
        <div v-else>
          <el-button type="primary" @click="rePay">{{$t('payment_result_6')}}</el-button>
          <el-button type="primary" plain @click="linkTo">{{$t('payment_result_4')}}</el-button>
        </div>
        <el-divider></el-divider>
        <p>{{$t('payment_result_7')}}</p>
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
    linkTo() {
      this.$router.push({
        path: "/order/list",
        query: { orderId: this.$route.query.orderId },
      });
    },
    rePay() {
      this.$router.push({
        path: "/payment/pay",
        query: { payVal: 0, orderId: this.$route.query.orderId },
      });
    },
    linkToHome() {
      this.$router.push({ path: "/" });
    },
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

