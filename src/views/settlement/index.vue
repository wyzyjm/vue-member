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
        <!-- {{ logisticsInfoList }} -->
        <p style="color: #f56c6c" v-if="logisticsInfoList.length == 0">
          请添加收货信息
        </p>

        <div v-else class="address-group">
          <div
            v-for="(item, index) in logisticsInfoList"
            :key="item.id"
            :class="['address-item', { active: item.active }]"
            @click="choseAddress(index)"
          >
            <span class="name">{{ item.consigneeName }}</span>
            <div class="more">
              <span>{{ item.consigneeName }}</span>
              <span>{{ item.consigneeCountry }}</span>
              <span>{{ item.consigneeProvince }}</span>
              <span>{{ item.consigneeCity }}</span>
              <span>{{ item.consigneeAddr }}</span>
              <span>{{ item.consigneePhone }}</span>
            </div>
            <span v-if="item.isDefault" class="default-address-icon"
              >默认地址</span
            >
            <div class="address-btns">
              <el-button
                v-if="!item.isDefault"
                type="text"
                size="mini"
                @click.stop="setDefault(item.id)"
                >设为默认</el-button
              >
              <el-button type="text" size="mini" @click.stop="eidtAddress(item)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click.stop="deleteAddress(item)"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <p
        v-if="logisticsInfoList.length > 1"
        class="show-more"
        @click="showAddress"
      >
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
        <el-radio
          v-for="item in payList"
          :key="item.type"
          :disabled="!item.isAvailable"
          :label="item.type"
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
      <product-list
        :productList="productlist"
        :currencySymbol="currency"
      ></product-list>
      <p><strong>发票信息</strong></p>
      <div>
        电子发票
        <template v-if="receiptInfo.invoiceId == ''">
          <el-button type="text" @click="openReceipt('new')">开发票</el-button>
        </template>
        <template v-else>
          {{ receiptInfo.invoiceTitle }} {{ receiptInfo.invoiceContent }}
          <el-button type="text" @click="openReceipt('edit')">修改</el-button>
        </template>
      </div>
      <el-divider></el-divider>
      <p><strong>给卖家留言</strong></p>
      <el-input
        type="textarea"
        placeholder="订单有要求，请先与商家协商，选填"
        v-model="remark"
        maxlength="255"
        show-word-limit
        style="width: 520px"
      >
      </el-input>
      <el-divider></el-divider>
      <div style="float: right; text-align: right; line-height: 24px">
        共 <span class="text-danger">{{ totalNum }}</span> 件商品<br />
        商品总额： <span>{{ currency }} {{ totalPrice }}</span
        ><br />
        运费总计： <span>{{ currency }} {{ freight }}</span>
      </div>
      <div style="clear: both"></div>
    </div>
    <div class="order-foot background-grey text-grey">
      <div class="foot-price">
        <strong class="text-normal">实付：</strong
        ><span class="text-danger">{{ currency }}{{ realPayment }}</span>
      </div>
      <div>
        寄送至：{{ addressInfo.consigneeCountry }}
        {{ addressInfo.consigneeProvince }}
        {{ addressInfo.consigneeCity }}
        {{ addressInfo.consigneeCounty }}
        {{ addressInfo.consigneeAddr }}
      </div>
      <div>
        收货人：{{ addressInfo.consigneeName }} {{ addressInfo.consigneePhone }}
      </div>
    </div>
    <div class="trade-btn">
      <el-button
        type="primary"
        @click="submit"
        :loading="orderLoading"
        :disabled="orderDisabled"
      >
        <template v-if="orderLoading"> 订单正在提交中</template>
        <template v-else>提交订单</template></el-button
      >
    </div>
    <receipt ref="getReceipt" @formData="getReceiptData"></receipt>
    <address-form
      ref="address"
      :setAddrForm="editFormItem"
      @confirm="getConfirm"
    ></address-form>

    <el-dialog title="提示" :visible.sync="messageVisible" width="30%">
      <span>{{ msgContent }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- 价格有变动时候 -->
        <template v-if="msgCode === '10004'">
          <el-button type="default" @click="$router.push('/cart')"
            >返回购物车</el-button
          >
          <!-- todo query?? -->
          <el-button type="primary" @click="$router.push('/payment/pay')"
            >继续结算</el-button
          >
        </template>
        <!-- //运费有变动时候 -->
        <template v-else-if="msgCode === '10006'">
          <el-button type="default" @click="$router.push('/cart')"
            >返回购物车</el-button
          >
          <!-- todo query?? -->
          <el-button type="primary" @click="calculateFare('pop')"
            >刷新运费价格</el-button
          >
        </template>
        <template v-else>
          <el-button type="primary" @click="$router.push('/cart')"
            >返回购物车</el-button
          >
        </template>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ceSteps from "@/components/CeSteps";
import receipt from "@/views/components/receipt";

import productList from "@/views/components/productList";
import addressForm from "@/views/components/addressForm";
import {
  payModeInitInfo,
  calculateFare,
  addOrder,
  skuItem,
} from "@/api/settlement";
import {
  getAddressList,
  addAddressList,
  setAddressList,
  deleteAddressList,
  eidtAddressList,
} from "@/api/address"; // 收货地址api

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
      showAInfo: false,
      remark: "",
      receiptInfo: {
        invoiceId: "",
        email: "",
        invoiceContent: "",
        invoiceTitle: "",
        invoiceType: "1",
        phone: "",
        taxpayerId: "",
        phonePrefix: "",
      },
      productlist: [],
      distributionVal: "",
      distributionList: [],
      payVal: "",
      payList: [],
      logisticsInfoList: [],
      freight: 0,
      realPayment: 0,
      totalNum: 0,
      totalPrice: 0,
      currency: "¥",
      orderLoading: false,
      orderDisabled: false,
      addressInfo: {},
      messageVisible: false,
      addressActive: 0,
      editFormItem: {
        consigneeCountry: "", // 国家
        consigneeName: "", // 收货人名称
        consigneePhoneHead: "", // 手机区号
        consigneePhone: "", // 手机号
        consigneeTelHead: "", // 电话区号
        consigneeTel: "", // 电话号
        consigneeAddr: "", // 详细地址
        consigneeProvince: "", // 省/州/地区
        consigneeCity: "", // 地区
        consigneeZipCode: "", // 邮政编码
        consigneeCounty: "",
        receiverCode: "",
      },
      msgContent: "",
      msgCode: "",
      orderId: "",
    };
  },
  components: {
    receipt,
    ceSteps,
    addressForm,
    productList,
  },
  mounted() {
    if (
      this.$route.query.skuId == undefined &&
      this.$route.query.shoppingCartIds == undefined
    ) {
      this.$router.push("/cart");
    } else {
      //获取收货地址list
      this.getList();
      //获取支付方式，配送方式
      this.getPayMode();
      //商品清单
      this.getProductList();
    }
  },
  methods: {
    // 获取地址列表
    async getList() {
      try {
        const res = await getAddressList();
        if (res.status !== 200) return;
        // console.log(res);
        this.logisticsInfoList = res.data.addressList;

        for (let i = 0; i < this.logisticsInfoList.length; i++) {
          if (i == 0) {
            this.logisticsInfoList[i].active = true;
          } else {
            this.logisticsInfoList[i].active = false;
          }
        }
        this.addressInfo = this.logisticsInfoList[0];
      } catch (error) {
        console.log("获取收货地址失败", error);
      }
    },
    // 设为默认地址
    async setDefault(id) {
      /**
       * 1. 获取当前id
       * 2. 根据id发送请求
       * 3. 请求成功, 赋值
       * 4. 重新渲染收货地址列表
       */
      const params = {
        receiverCode: id,
      };
      try {
        const res = await setAddressList(params); // 设为默认

        if (!res.data) return;
        this.getList(); // 重新获取收货地址列表
      } catch (error) {
        console.log(error);
      }
    },

    // 删除 地址
    async deleteAddress(item) {
      // 是默认 地址, 进行提示,不可删除
      if (item.isDefault)
        return this.$message({
          message: "默认地址不可删除，建议将其他地址设为默认后再删除此地址",
          type: "warning",
        });
      /**
       * 1. 不是默认地址
       * 2. 进行提示, 是否要删除
       * 3. 确认删除
       * 4. 根据 id 发送删除请求
       * 5. 删除成功 重新获取列表
       */
      try {
        const result = await this.$confirm(
          "您确定要删除该收货地址吗?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (result !== "confirm") return; // 不是确认,直接停止
        const params = {
          receiverCode: item.id,
          tenantId: 1600018169,
        };
        try {
          const res = await deleteAddressList(params);
          // console.log(res);
          if (res.status !== 200) return;
          this.getList(); // 重新获取收货地址列表
        } catch (error) {
          console.log("删除失败", error);
        }
      } catch (error) {
        console.log("取消,不删除");
      }
    },
    // 弹窗 显示
    showDialog(status) {
      const _this = this.$refs["address"]; // 获取当前弹窗组件实例
      _this.dialogFormVisible = true; // 修改弹窗 显示状态
      _this.dialogStatus = status; // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 编辑
    async eidtAddress(item) {
      this.current = JSON.parse(JSON.stringify(item)); // 赋值
      this.showDialog("edit");
      this.editFormItem = item;
    },
    //修改后重新刷新列表
    getConfirm() {
      this.getList();
    },
    // 收货地址弹窗
    openAddress(type) {
      this.$refs.address.dialogFormVisible = true;
      this.$refs.address.dialogStatus = type;
    },
    //展开收起地址
    showAddress() {
      if (this.showAInfo) {
        this.showAInfo = false;
      } else {
        this.showAInfo = true;
      }
    },
    getPayMode() {
      //获取支付方式列表
      payModeInitInfo().then((res) => {
        if (res.status === 200) {
          let data = res.data;

          if (data.hasOwnProperty("distributionList")) {
            this.distributionList = data.distributionList;
          }
          if (data.hasOwnProperty("payList")) {
            this.payList = data.payList;
          }
          if (this.distributionList.length > 0) {
            this.distributionVal = this.distributionList[0].id;
          }

          if (this.payList.length > 0) {
            this.payVal = this.payList[0].type;
          }
        }
      });
    },
    getReceiptData(data) {
      this.receiptInfo.invoiceId = data.invoiceId;
      this.receiptInfo.email = data.mail;
      this.receiptInfo.invoiceContent = data.catalog;
      if (data.type == 1) {
        this.receiptInfo.invoiceTitle = data.name;
      } else {
        this.receiptInfo.invoiceTitle = data.companyName;
      }

      this.receiptInfo.invoiceType = data.type;
      this.receiptInfo.phone = data.phone;
      this.receiptInfo.taxpayerId = data.companyNumber;
      this.receiptInfo.phonePrefix = data.phonePerfix;
    },
    openReceipt(status) {
      this.$refs.getReceipt.dialogVisible = true;
      if (status == "edit") {
        if (this.receiptInfo.invoiceType === 1) {
          this.$refs.getReceipt.form.type = 1;

          this.$refs.getReceipt.form.name = this.receiptInfo.invoiceTitle;
        } else {
          this.$refs.getReceipt.form.type = 2;
          this.$refs.getReceipt.form.companyName = this.receiptInfo.invoiceTitle;
          this.$refs.getReceipt.form.companyNumber = this.receiptInfo.taxpayerId;
        }
        this.$refs.getReceipt.form.phone = this.receiptInfo.phone;
        this.$refs.getReceipt.form.mail = this.receiptInfo.email;
        this.$refs.getReceipt.form.invoiceId = this.receiptInfo.invoiceId;
      }
    },
    choseAddress(index) {
      console.log("我执行了选择地址操作");
      for (let i = 0; i < this.logisticsInfoList.length; i++) {
        this.logisticsInfoList[i].active = false;
      }
      this.addressActive = index;
      this.addressInfo = this.logisticsInfoList[index];
      console.log(this.logisticsInfoList[index]);
      this.logisticsInfoList[index].active = true;
      let activeItem = JSON.stringify(this.logisticsInfoList[index]);
      this.logisticsInfoList.splice(index, 1);
      this.logisticsInfoList.unshift(JSON.parse(activeItem));
      this.calculateFare();
    },
    getProductList() {
      let params = {};
      if (this.$route.query.shoppingCartIds !== undefined) {
        params.shoppingCartIds = this.$route.query.shoppingCartIds;
      }
      if (this.$route.query.skuId !== undefined) {
        params.skuId = this.$route.query.skuId;
      }
      skuItem(params).then((res) => {
        if (res.status === 200) {
          this.productlist = res.data.shoppingCartList;
          this.currency = res.data.currencySymbol;
          this.totalNum = res.data.totalNum;
          this.totalPrice = res.data.totalPrice;
          this.calculateFare();
        }
      });
    },
    calculateFare(type) {
      //计算运费
      let params = {};
      let productSkuSelected = [];
      for (let i = 0; i < this.productlist.length; i++) {
        productSkuSelected.push({
          buyAmount: this.productlist[i].quantity,
          skuId: this.productlist[i].skuId,
        });
      }
      params.productSkuSelected = productSkuSelected;
      params.receiveCode = this.addressInfo.id;
      calculateFare(params).then((res) => {
        if (res.status === 200) {
          this.freight = res.data.freight;
          this.realPayment = res.data.realPayment;
          if (type == "pop") {
            this.messageVisible = false;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submit() {
      try {
        this.orderLoading = true;
        this.orderDisabled = true;
        let params = {};
        params.currencySymbol = this.currency;
        params.distributionId = this.distributionVal;
        params.electronicInvoiceId = this.receiptInfo.invoiceId;
        params.payModeId = this.payVal;
        params.receiverAddressId = this.addressInfo.id;
        params.remark = this.remark;
        params.freight = this.freight;
        let shoppingCartList = [];
        for (let i = 0; i < this.productlist.length; i++) {
          shoppingCartList.push({
            productId: this.productlist[i].productId,
            quantity: this.productlist[i].quantity,
            shoppingCartCode: this.productlist[i].shoppingCartCode,
            skuId: this.productlist[i].skuId,
            skuPrice: this.productlist[i].skuPrice,
          });
        }
        params.shoppingCartList = shoppingCartList;

        addOrder(params).then((res) => {
          if (res.status === 200) {
            if (
              res.data.code === "10005" ||
              res.data.code === "10001" ||
              res.data.code === "10002" ||
              res.data.code === "10003" ||
              res.data.code === "10004"
            ) {
              this.msgCode = res.data.code;
              this.msgContent = res.data.msg;
              this.messageVisible = true;
              this.orderLoading = false;
              this.orderDisabled = false;
              return;
            }
            if (res.data.code === "200") {
              this.orderId = res.data.data;
              if (this.payVal == 2) {
                this.$router.push({
                  path: "/payment/result",
                  query: { orderId: this.orderId },
                });
              } else {
                this.$router.push({
                  path: "/payment/pay",
                  query: { payVal: this.payVal, orderId: this.orderId },
                });
              }
            }
          } else {
            this.$message.error(res.data.msg);
          }
          this.orderLoading = false;
          this.orderDisabled = false;
        });
      } catch (error) {
        this.$message.error("对不起，系统异常，请稍后再试");
      }
    },
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
.address-item.active {
  background-color: #ecf5ff;
}
.address-item.active .name {
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
  margin-top: 30px;
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
  padding: 0px 4px;
  color: white;
  font-style: normal;
  font-size: 12px;
  margin-left: 10px;
  margin-top: 3px;
  height: 20px;
  line-height: 20px;
}
</style>

