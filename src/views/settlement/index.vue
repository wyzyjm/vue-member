<template>
  <div class="app-container wrapper">
    <h1 class="order-title">订单结算</h1>
    <h3 class="order-subtitle">填写并核对订单信息</h3>
    <div class="order-details"></div>
    <div class="order-foot">
      <p>实付：¥350.00</p>
      <p>寄送至：北京 大兴区 亦庄经济开发区 地盛西路1号数码庄园</p>
      <p>收货人：Daisy 182****4241</p>
      
    </div>
    <div class="trade-btn">
        <el-button type="primary">提交订单</el-button>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.order-title {
  border: 1px solid #ddd;
  padding: 20px;
}
.order-subtitle {
  margin: 20px 0;
}
.order-foot {
  background: #e4e4e4;
  text-align: right;
  padding: 10px;
}
.trade-btn{
  text-align: right;
}
</style>

