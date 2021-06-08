<template>
  <div class="app-container wrapper">
    <el-card>
      <corderinfo :orderInfo="orderInfo" :orderDetail="orderDetail"></corderinfo>
      <el-card class="box-card" style="margin-left: 40px; margin-top: 20px">
        <p class="pay-title">
          <strong>微信支付</strong>
          距离二维码过期还剩
          <span class="text-danger">57</span> 秒，过期后请刷新页面重新获取二维码

          <span class="text-danger"
            >二维码已过期，<el-button type="text">刷新</el-button>
            页面重新获取二维码</span
          >
        </p>
        <div class="vchat-wrapper">
          <div class="vchat-img">
            <div class="code">
              <div class="c-wrapper">
                <img
                  class="vcode-img border-grey"
                  src="../../assets/images/no-img.svg"
                />
                <div class="bg-wrapper"></div>
                <div class="c-fail">获取失败 点击重新获取二维码</div>
              </div>

              <div class="vchat-bg">
                <img src="../../assets/images/icon-red.png" /><span class="text"
                  >请使用微信扫一扫<br />扫描二维码支付</span
                >
              </div>
            </div>
            <div class="guide">
              <img src="../../assets/images/phone.png" />
            </div>
          </div>
        </div>
        <div class="offline-wrapper">
          <div>
            <p class="offline-title">
              <strong>{{ payInfo.payName }}</strong>
            </p>
            <div class="oreveiver-list">
              <!-- <div class="oreceiver-item" v-for="item in payeeList" :key="item.id">
                <span class="item-title"> {{item.attrName}}</span>
                <span>{{item.attrValue}}</span>
              </div> -->

              <div class="oreceiver-item">
                <span class="item-title"> First Name:</span>
                <span>hua</span>
              </div>
              <div class="oreceiver-item">
                <span class="item-title">Country:</span>
                <span>janpan</span>
              </div>
              <div class="oreceiver-item">
                <span class="item-title">Last Name:</span>
                <span>dddddddd</span>
              </div>

              <div class="oreceiver-item">
                <span class="item-title">Tel:</span>
                <span>dddddddd</span>
              </div>

              <div class="oreceiver-item">
                <span class="item-title">City:</span>
                <span>dddddddd</span>
              </div>
              <div class="oreceiver-item">
                <span class="item-title">Address:</span>
                <span>dddddddd</span>
              </div>
            </div>

            <!-- <div class="oreveiver-list">
              <div class="oreceiver-item">
                <span class="item-title"> Beneficiary’s Bank：:</span>
                <span>hua</span>
              </div>
              <div class="oreceiver-item">
                <span class="item-title">SWIFT BIC: </span>
                <span>janpan</span>
              </div>
              <div class="oreceiver-item">
                <span class="item-title">Beneficiary Name：</span>
                <span>dddddddd</span>
              </div>

              <div class="oreceiver-item">
                <span class="item-title">Account Number：</span>
                <span>dddddddd</span>
              </div>

              <div class="oreceiver-item">
                <span class="item-title">BANK Address：</span>
                <span>dddddddd</span>
              </div>
            </div> -->
            <div style="clear: both"></div>
            <el-divider></el-divider>
            <p class="offline-subtitle">{{ payInfo.payName }} info of Sender</p>
          </div>
          <!-- 西联支付+速汇金表单 -->
          <el-form
            ref="form"
            :model="form"
            label-width="120px"
            :rules="rules"
            style="width: 600px; margin: 0 auto"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item label="First Name" prop="firstname">
                  <el-input v-model="form.firstname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Last Name" prop="lastname">
                  <el-input v-model="form.lastname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Send Money" prop="money">
                  <el-input v-model="form.money"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="MTCN# No." prop="number">
                  <el-input v-model="form.number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="Currency" prop="currency">
                  <el-input v-model="form.currency"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="Country" prop="country">
                  <el-input v-model="form.country"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="Contents">
              <el-input type="textarea" v-model="form.contents"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"
                >Complete Order Now</el-button
              >
              <el-button @click="$router.push('/payment/pay')"
                >Pay Later</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 银行转账表单 -->
          <el-form
            ref="bankform"
            :model="bankform"
            label-width="170px"
            :rules="bankrules"
            style="width: 500px; margin: 0 auto"
          >
            <el-form-item label="Bank Transaction No." prop="number">
              <el-input v-model="bankform.number"></el-input>
            </el-form-item>
            <el-form-item label="Send money" prop="money">
              <el-input v-model="bankform.money"></el-input>
            </el-form-item>
            <el-form-item label="Currency" prop="currency">
              <el-input v-model="bankform.currency"></el-input>
            </el-form-item>
            <el-form-item label="Contents">
              <el-input type="textarea" v-model="bankform.contents"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit"
                >Complete Order Now</el-button
              >
              <el-button @click="$router.push('/order/list')"
                >Pay Later</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <span class="el-icon-arrow-left"></span>
        <el-button type="text" @click="$router.push('/payment/pay')"
          >选择其他支付方式</el-button
        >
      </el-card>
    </el-card>
  </div>
</template>
<script>
import corderinfo from './components/orderinfo.vue'
export default {
  data() {
    return {
      rules: {
        firstname: [
          { required: true, message: "请输入名字", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
        lastname: [
          { required: true, message: "请输入姓", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
        money: [
          { required: true, message: "请输入汇款金额", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        number: [
          { required: true, message: "请输入MTCN#号", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        currency: [
          { required: true, message: "请输入币种", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        country: [
          { required: true, message: "请输入国家", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
      },
      bankrules: {
        number: [
          { required: true, message: "请输入银行交易号", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],
        money: [
          { required: true, message: "请输入汇款金额", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
            trigger: "blur",
          },
        ],

        currency: [
          { required: true, message: "请输入币种", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        firstname: "",
        lastname: "",
        money: "",
        number: "",
        currency: "",
        country: "",
        contents: "",
      },
      bankform: {
        number: "",
        money: "",
        currency: "",
        contents: "",
      },
      payInfo: {},
      payeeList: [],
      orderInfo: {},
      orderDetail: {},
    };
  },
  components:{
    corderinfo
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert("submit!");
          this.$router.push("/payment/result");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    viewDetail() {
      if (this.showDetail) {
        this.showDetail = false;
      } else {
        this.showDetail = true;
      }
    },
  },
  mounted() {
    let data = {
      payId: 23456,
      payName: "Western Union",
      qrEffectiveTime: 23145476,
      qrImg: "../二维码.png",
      payeeList: [
        {
          attrName: "配置名称",
          attrValue: "属性值",
        },
      ],
    };
    this.payInfo = data;
    this.payeeList = data.payeeList;

    //data
    let data2 = {
      orderId: 88,
      userId: 99,
      userName: "小明",
      orderNo: "202105111523178740",
      amount: 2420.0,
      currencySymbol: "￥",
      createTime: 23454567879,
      failureTime: 3600,
      payType: 0,
      payList: [
        {
          id: 1,
          payName: "微信支付",
          payImg: "../../../src/assets/images/vchat.png",
        },
        {
          id: 2,
          payName: "支付宝",
          payImg: "../../assets/images/alipay.png",
        },
        {
          id: 3,
          payName: "paypal",
          payImg: "../../assets/images/paypal.png",
        },
      ],
      orderDetail: {
        id: 123,
        consigneeName: "收货人名称",
        consigneeProvince: "省",
        consigneeCity: "市",
        consigneeCounty: "区",
        consigneeAddr: "详细地址值",
        consigneePhoneHead: "0086",
        consigneePhone: 18636908524,
        productName: ["商品名称", "手机", "电脑", "电动车"],
      },
    };
    // for(let i in data){
    //  this.$set(this.orderInfo,i,data[i])
    // }
    this.orderInfo = data2
    this.orderDetail = data2.orderDetail;
    this.payList = data2.payList;
    console.log(this.orderInfo);
  },
};
</script>
<style scoped>
.offline-wrapper {
  width: 800px;
  margin: 20px auto;
}
.pay-title strong {
  font-size: 20px;
  margin-right: 20px;
  font-weight: normal;
}
.vchat-img {
  margin-left: 200px;
}
.vchat-img .code {
  display: inline-block;
  vertical-align: middle;
  width: 300px;
  text-align: center;
}
.vchat-img .guide {
  display: inline-block;
  vertical-align: middle;
  width: 400px;
  margin-left: 30px;
}
.vchat-img .guide img {
  height: 370px;
}
.vchat-bg img {
  vertical-align: middle;
  margin-right: 30px;
}
.vchat-img .vchat-bg {
  width: 300px;
  background-color: #f56c6c;
  color: white;
  margin: 0 auto;
  padding: 8px;
  margin-top: 10px;
}
.vchat-bg .text {
  display: inline-block;
  vertical-align: middle;
  line-height: 18px;
}

.order-info {
  display: flex;
}
.order-info .info {
  font-size: 18px;
}
.order-info .right {
  flex: 1;
  text-align: right;
  line-height: 30px;
  cursor: pointer;
}
.order-detail {
  line-height: 20px;
}
.order-detail span {
  margin-right: 10px;
}
.vcode-img {
  width: 300px;
  padding: 5px;
  height: 300px;
}
.c-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
}
.c-wrapper .bg-wrapper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.3;
}
.c-fail {
  position: absolute;
  top: calc(50% - 15px);
  width: 80%;
  left: 10%;
  line-height: 30px;
  height: 30px;
  display: block;
  background-color: #fff;
  z-index: 100;
}
.oreveiver-list {
  width: 400px;
  margin: 10px auto;
}
.oreceiver-item {
  width: 50%;
  float: left;
  line-height: 30px;
}
.oreceiver-item .item-title {
  display: inline-block;
  width: 120px;
  text-align: right;
  padding-right: 10px;
}
.offline-title {
  text-align: center;
  font-size: 20px;
}
.offline-subtitle {
  text-align: center;
}
</style>


