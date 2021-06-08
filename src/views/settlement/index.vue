<template>
  <div class="app-container wrapper">
    <div class="order-title">
      <span class="order-subtitle">订单结算</span>
      <div class="steps-wrapper">
        <ce-steps
          :active="stepActive"
          :datalist="datalist"
          style="padding: 0"
        ></ce-steps>
      </div>
    </div>
    <p class="order-subtitle">填写并核对订单信息</p>
    <div class="order-details">
      <p><strong>收货人信息</strong></p>
      <el-button
        style="float: right; margin-top: -45px"
        type="text"
        @click="openAddress('create')"
        >新增收货地址</el-button
      >
      <div :class="['address-list', { 'show-detail': showAInfo }]">
        <p style="color: #f56c6c" v-show="showAddATip">请添加收货信息</p>
        <div class="address-group">
          <div v-for="(item,index) in addressList" :key="item.id" :class="['address-item',{'active':item.active}]" @click="choseAddress(index)">
            <span class="name ">{{item.consigneeName}}</span>
            <div class="more">
              <span>{{item.consigneeName}}</span>
              <span>{{item.consigneeCountry}}</span>
              <span>{{item.consigneeProvince}}</span>
              <span>{{item.consigneeCity}}</span>
              <span>{{item.consigneeAddr}}</span>
              <span>{{item.consigneePhone}}</span>
              <span v-if="item.isDefault" class="default-address-icon">默认地址</span>
            </div>
            <div class="address-btns">
              <el-button v-if="!item.isDefault" type="text" size="mini">设为默认</el-button>
              <el-button type="text" size="mini">编辑</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </div>
          </div>
          
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

      <el-radio-group v-model="distributionVal">
        <el-radio
          v-for="item in distributionList"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-radio
        >
      </el-radio-group>
      <el-divider></el-divider>
      <p><strong>支付方式</strong></p>
      <el-radio-group v-model="payVal">
        <el-radio v-for="item in payList" :key="item.type" :disabled="!item.isAvailable" :label="item.type"
          >{{ item.typeName }}
          <el-tooltip
            class="item"
            effect="light"
            :content="item.prompt"
            placement="bottom-end"
          >
            <svg-icon name="icon-wenhao"></svg-icon>
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <el-divider></el-divider>
      <product-list :productList="productlist" :currencySymbol="currency"></product-list>
      <p><strong>发票信息</strong></p>
      <div>
        电子发票
        <template v-if="receipt == ''">
          <el-button type="text" @click="openReceipt">开发票</el-button>
        </template>
        <template v-else>
          {{ receipt }} 商品明细
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
        共 <span class="text-danger">{{totalNum}}</span> 件商品<br />
        商品总额： <span>{{currency}} {{totalPrice}}</span><br />
        运费总计： <span>{{currency}} {{freight}}</span>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="order-foot background-grey text-grey">
      <div class="foot-price">
        <strong class="text-normal">实付：</strong
        ><span class="text-danger">{{currency}}{{realPayment}}</span>
      </div>
      <div>寄送至：北京 大兴区 亦庄经济开发区 地盛西路1号数码庄园</div>
      <div>收货人：Daisy 182****4241</div>
    </div>
    <div class="trade-btn">
      <el-button type="primary" @click="submit">提交订单</el-button>
    </div>
    <receipt ref="getReceipt"></receipt>
    <address-form ref="address"></address-form>
  </div>
</template>
<script>
import ceSteps from "@/components/CeSteps";
import receipt from "./components/receipt";

import productList from "@/views/components/productList";
import addressForm from "@/views/components/addressForm";

// import { getdata1 } from "@/api/settlement";
export default {
  data() {
    return {
      datalist: [
        {
          title: "我的购物车",
          description: "",
        },
        {
          title: "填写核对订单信息",
          description: "",
        },
        {
          title: "成功提交订单",
          description: "",
        },
      ],
      stepActive: 1,
      test: "",
      radio: 3,
      showAInfo: false,
      showAddATip: false,
      textarea: "",
      receipt: "",
      productlist: [
        {
          productId: 144,
          skuId: 271,
          skuName: "货品名称",
          skuImg:
            "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
          skuPrice: 22222210.0,
          quantity: 11,
          aggregateAmount: 1210.0,
          skuSpec: [
            {
              specName: "内存",
              specValue: "8+256g",
            },
          ],
          productUrl: "/product/144. html",
        },
      ],
      distributionVal: "",
      distributionList: [
        {
          id: 1,
          name: "快递发货",
        },
      ],
      payVal: "",
      payList: [
        {
          id: 402,
          type: 0,
          typeName: "在线支付",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvailable:true
        },
        {
          id: 403,
          type: 1,
          typeName: "线下支付",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvailable:true
        },
        {
          id: 404,
          type: 2,
          typeName: "货到付款",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvailable:false
        },
      ],
      addressList: [
        {
          id: 1,
          consigneeName: "小明是收货人",
          consigneeCountry: "中国",
          consigneeProvince: "河南省",
          consigneeCity: "新乡市",
          consigneeCounty: "辉县市",
          consigneeAddr: "百泉镇御龙湾",
          consigneeZipCode: 453600,
          consigneePhoneHead: 222,
          consigneePhone: 18365478219,
          consigneeTelHead: 373,
          consigneeTel: 6769083,
          isDefault: true,
          active:true
        },
        {
          id: 2,
          consigneeName: "小明是收货人2",
          consigneeCountry: "中国",
          consigneeProvince: "河南省",
          consigneeCity: "新乡市",
          consigneeCounty: "辉县市",
          consigneeAddr: "百泉镇御龙湾",
          consigneeZipCode: 453600,
          consigneePhoneHead: 222,
          consigneePhone: 18365478219,
          consigneeTelHead: 373,
          consigneeTel: 6769083,
          isDefault: false,
          active:false
        }
      ],
      freight:0,
      realPayment:0,
      totalNum:10,
      totalPrice:1233.0,
      currency:"¥"
    };
  },
  components: {
    receipt,
    ceSteps,
    addressForm,
    productList,
  },
  mounted() {
    // getdata1().then((res) => {
    //   if (res.data.success) {
    //     let data = res.data.data;
    //     if ("distributionList" in data.distributionList) {
    //       this.distributionList = data.distributionList;
    //     }
    //   }
    // });
    this.distributionVal = this.distributionList[0].id;
    this.payVal = this.payList[0].type;
    let data1 = {
      // 物流信息集合
      distributionList: [
        {
          id: 1,
          name: "快递发货",
        },
      ],
      // 支付方式集合
      payList: [
        {
          id: 1,
          type: 0,
          typeName: "在线支付",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvaiable:true
        },

        {
          id: 1,
          type: 1,
          typeName: "线下支付",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvaiable:true
        },

        {
          id: 1,
          type: 2,
          typeName: "货到付款",
          prompt: "即时到账，支持支付宝、微信、Paypal等支付方式",
          isAvaiable:true
        },
      ],
    };
  },
  methods: {
    openAddress(type) {
      this.$refs.address.dialogFormVisible = true;
      this.$refs.address.dialogStatus = type;
    },
    showAddress() {
      if (this.showAInfo) {
        this.showAInfo = false;
      } else {
        this.showAInfo = true;
      }
    },
    openReceipt() {
      this.$refs.getReceipt.dialogVisible = true;
    },
    choseAddress(index){
      for(let i=0;i<this.addressList.length;i++){
        this.addressList[i].active = false;
      }
      this.addressList[index].active = true;
      let activeItem = JSON.stringify(this.addressList[index]);
      this.addressList.splice(index,1)
      this.addressList.unshift(JSON.parse(activeItem))

    },
    submit(){
      this.$router.push({path:'/payment/pay',query:{payVal:this.payVal}})
    }
  },
};
</script>
<style scoped>
.address-group {
  line-height: 26px;
}
.address-item {
  display: flex;
  margin: 10px 0;
  cursor: pointer;
}
.address-item .more {
  max-width: 600px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.address-item .more span {
  margin-left: 10px;
}
.address-item .name {
  padding: 0 26px;
  border: 1px solid #ddd;
}
.address-item:hover {
  background-color: #ecf5ff;
}
.address-item.active{
  background-color: #ecf5ff;
}
.address-item.active .name{
  border: 1px solid #409eff;
  position: relative;
  overflow: hidden;
}
.address-btns {
  flex: 1;
  text-align: right;
}
.address-item.active .name::after {
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
.address-item.active .name::before {
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
.order-title {
  border: 1px solid #ddd;
  padding: 10px;
}
.order-title .order-subtitle {
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
  height: 45px;
  overflow: hidden;
}
.show-detail {
  height: auto;
  max-height: 120px;
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
.default-address-icon {
  background: #409eff;
  padding: 2px 4px;
  color: white;
  font-style: normal;
  font-size: 12px;
}
</style>

