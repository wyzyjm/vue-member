<template>
  <div class="app-container">
    订单支付
    <div ref="qrcode"></div>
  </div>
</template>
<script>
// import QRCode from "qrcodejs2";
export default {
  data() {
    return {};
  },
  methods: {
    qrcode() {
      const qrcode1 = new QRCode(this.$refs.qrcode, {
        // 在属性ref="qrcode"的div里边添加二维码
        width: 120,
        height: 120, // 高度
        colorLight: "#ffffff",
        text: "ddeeee", // 二维码内容（接口返回的数字或者什么）
      });
    },
  },
  mounted() {
    this.qrcode();
  },
};
</script>
<style scoped>
</style>

