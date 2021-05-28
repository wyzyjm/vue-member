<template>
  <div class="app-container wrapper">
    <div class="order-title">
      <span>订单结算</span>
      <el-steps
        class="steps-wrapper"
        :active="stepActive"
        finish-status="success"
      >
        <el-step title="我的购物车"></el-step>
        <el-step title="填写核对订单信息"></el-step>
        <el-step title="成功提交订单"></el-step>
      </el-steps>
    </div>
    <p class="order-subtitle">填写并核对订单信息</p>
    <div class="order-details">
      <p><strong>收货人信息</strong></p>
      <el-button style="float: right; margin-top: -45px" type="text"
        >新增收货地址</el-button
      >
      <div :class="['address-list', { 'show-detail': showAInfo }]">
        <p style="color: #f56c6c" v-show="showAddATip">请添加收货信息</p>
        <div style="float: left; width: 100px">
          <el-radio-group v-model="radio">
            <el-radio style="margin-bottom: 10px" :label="3">disa</el-radio
            ><br />
            <el-radio style="margin-bottom: 10px" :label="6">sdfa</el-radio
            ><br />
            <el-radio style="margin-bottom: 10px" :label="9">asdfa</el-radio>
          </el-radio-group>
        </div>
        <div class="address-detail" style="overflow: hidden">
          <p>
            <span>dddddadf</span><span>ddddeeee</span
            ><el-button type="primary" size="mini">默认地址</el-button>
          </p>
          <p><span>ddddddadf</span> <span>erqer</span></p>
          <p><span>eerre</span></p>
        </div>
      </div>
      <p class="show-more" @click="showAddress">
        <span v-show="showAInfo">
          收起地址<i class="el-icon-d-arrow-right"></i>
        </span>
        <span v-show="!showAInfo">
          更多地址<i class="el-icon-d-arrow-left"></i>
        </span>
      </p>
      <el-divider></el-divider>
      <p><strong>配送方式</strong></p>

      <el-radio-group v-model="radio">
        <el-radio :label="3">备选项</el-radio>
        <el-radio :label="6">备选项</el-radio>
        <el-radio :label="9">备选项</el-radio>
      </el-radio-group>

      <el-divider></el-divider>
      <p><strong>支付方式</strong></p>
      <el-radio-group v-model="radio">
        <el-tooltip
          class="item"
          effect="light"
          content="即时到账，支持支付宝、微信、Paypal等支付方式"
          placement="bottom-end"
        >
          <el-radio :label="3"
            >备选项 <i class="el-icon-question"></i
          ></el-radio>
        </el-tooltip>

        <el-radio :label="6">备选项</el-radio>
        <el-radio :label="9">备选项</el-radio>
      </el-radio-group>
      <el-divider></el-divider>
      <p><strong>发票信息</strong></p>
      <div>电子发票 
        <template v-if="receipt==''">
        <el-button type="text" @click="openReceipt">开发票</el-button>
        </template>
        <template v-else>
          {{receipt}}  商品明细
          <el-button type="text" @click="openReceipt">修改</el-button>
        </template>
        </div>
      <el-divider></el-divider>
      <p><strong>给卖家留言</strong></p>
      <el-input
        type="textarea"
        placeholder="订单有要求，请先与商家协商，选填"
        v-model="textarea"
        maxlength="255"
        show-word-limit
        style="width: 520px"
      >
      </el-input>
      <el-divider></el-divider>
      <div style="float: right; text-align: right; line-height: 24px">
        共 <span class="text-danger">3</span> 件商品<br />
        商品总额： <span>¥ 300.00</span><br />
        运费总计： <span>¥ 5.00</span>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="order-foot background-grey text-grey">
      <div class="foot-price">
        <strong class="text-normal">实付：</strong
        ><span class="text-danger">¥350.00</span>
      </div>
      <div>寄送至：北京 大兴区 亦庄经济开发区 地盛西路1号数码庄园</div>
      <div>收货人：Daisy 182****4241</div>
    </div>
    <div class="trade-btn">
      <el-button type="primary">提交订单</el-button>
    </div>
    <receipt ref="getReceipt"></receipt>
  </div>
</template>
<script>
import receipt from "./components/receipt";
export default {
  data() {
    return {
      stepActive: 2,
      test: "",
      radio: 3,
      showAInfo: false,
      showAddATip: false,
      textarea:'',
      receipt:''
    };
  },
  components: {
    receipt,
  },
  mounted() {
    let a = this.showAInfo;
    console.log(a);
  },
  methods: {
    showAddress() {
      if (this.showAInfo) {
        this.showAInfo = false;
      } else {
        this.showAInfo = true;
      }
    },
    openReceipt(){
      this.$refs.getReceipt.dialogVisible = true;
    }
  },
};
</script>
<style scoped>
.order-title {
  border: 1px solid #ddd;
  padding: 36px;
}
.order-title span {
  display: inline-block;
  font-size: 20px;
  font-weight: normal;
}
.steps-wrapper {
  float: right;
  width: 720px;
}
.order-subtitle {
  margin: 20px 0;
  clear: both;
}
.order-details {
  padding: 5px 20px;
  border: 1px solid #ddd;
}
.order-foot {
  text-align: right;
  padding: 10px;

  clear: both;
  line-height: 24px;
}
.order-foot .foot-price {
  font-size: 18px;
}
.trade-btn {
  text-align: right;
}
.address-list {
  max-height: 38px;
  overflow: hidden;
}
.show-detail {
  max-height: 130px;
  overflow: auto;
}
.show-more {
  color: #999;
  clear: both;
  cursor: pointer;
}
.show-more i {
  transform: rotate(-90deg);
}
.address-detail {
  overflow: hidden;
}
.address-detail p {
  margin: 0 10px 10px 0;
  padding: 0px;
  line-height: 28px;
}
.address-detail span {
  margin-right: 10px;
}
</style>
<style >
.wrapper .el-radio__input {
  display: none;
}
.wrapper .el-radio__label {
  padding-left: 0;
}
.wrapper .el-radio {
  padding: 6px 25px;
  overflow: hidden;
  margin-right: 10px;
  border: 1px solid #ddd;
}
.wrapper .is-checked {
  border: 1px solid #409eff;
  position: relative;
}
.wrapper .is-checked::after {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-color: #409eff;
  -webkit-transform: skewY(-45deg);
  transform: skewY(-45deg);
  position: absolute;
  bottom: -10px;
  right: 0;
  z-index: 1;
}
.wrapper .is-checked::before {
  content: "";
  display: block;
  width: 4px;
  height: 6px;
  border-right: #ffffff solid 2px;
  border-bottom: #ffffff solid 2px;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 2;
}
</style>

