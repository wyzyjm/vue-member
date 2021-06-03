<template>
  <div class="app-container">
    <div class="wrapper" style="position: relative">
      <div class="result-content text-normal">
        <svg-icon
          name="icon-caozuochenggong"
          style="font-size: 70px; color: #409eff"
        ></svg-icon>
        <p class="tips">购买成功，我们尽快为您处理！</p>
        <div class="detail">
          订单号：234569000-90<br />
          微信支付：<span class="text-danger">￥231.00</span>
        </div>
        <div>
          <el-button type="primary">查看订单详情</el-button>
          <el-button type="primary" plain>返回首页</el-button>
        </div>
        <el-divider></el-divider>
        <p>重要提醒：不点击陌生链接、不泄露银行卡和验证码信息，谨防诈骗！</p>
      </div>
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

