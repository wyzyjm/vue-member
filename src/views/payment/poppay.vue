<template>
  <div
    class="app-container wrapper"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <p class="title text-normal">
      <span style="cursor: pointer" @click="$router.push('/information/')">{{
        orderInfo.userName
      }}</span>
      |
      <span style="cursor: pointer" @click="$router.push('/order/list')"
        >我的订单</span
      >
    </p>
    <el-card class="text-normal" style="clear: both">
      <corderinfo
        :orderInfo="orderInfo"
        :orderDetail="orderDetail"
        v-if="orderInfo.failureTime != undefined"
      ></corderinfo>
      <el-card class="box-card" style="margin-left: 40px; margin-top: 20px">
        <template v-if="$route.query.payMode === '0'">
          <template v-if="$route.query.payCode == 'Wechat'">
            <p class="pay-title">
              <strong>微信支付</strong>
              <template v-if="!failTime">
                <span class="v-tip-tip">
                  距离二维码过期还剩
                  <span class="text-danger">
                    <timer
                      :endTime="codeTimer"
                      @timeEnd="failTime = true"
                      v-if="codeTimer != ''"
                    ></timer>
                  </span>

                  ，过期后请刷新页面重新获取二维码
                </span>
              </template>
              <template v-else>
                <span class="text-danger"
                  >二维码已过期，<el-button type="text" @click="createPay"
                    >刷新</el-button
                  >
                  页面重新获取二维码</span
                >
              </template>
            </p>
            <div class="vchat-wrapper">
              <div class="vchat-img">
                <div class="code">
                  <div class="c-wrapper">
                    <template v-if="!failTime">
                      <div id="qrcode" ref="qrcode"></div>
                    </template>
                    <template v-else>
                      <div class="bg-wrapper" @click="createPay"></div>
                      <div class="c-fail">获取失败 点击重新获取二维码</div>
                    </template>
                  </div>

                  <div class="vchat-bg">
                    <img src="../../assets/images/icon-red.png" /><span
                      class="text"
                      >请使用微信扫一扫<br />扫描二维码支付</span
                    >
                  </div>
                </div>
                <div class="guide">
                  <img src="../../assets/images/phone.png" />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div id="aliPayWrapper" style="width: 700px; margin: 0 auto"></div>
          </template>
        </template>

        <template v-else>
          <div class="offline-wrapper">
            <div>
              <p class="offline-title">
                <strong>{{ payInfo.code }}</strong>
              </p>
              <template v-if="payInfo.code !== 'BankTransfer'">
                <div class="oreveiver-list">
                  <div class="oreceiver-item">
                    <span class="item-title"> First Name:</span>
                    <span>{{ payInfo.receiverFirstName }}</span>
                  </div>
                  <div class="oreceiver-item">
                    <span class="item-title">Country:</span>
                    <span>{{ payInfo.receiverCountry }}</span>
                  </div>
                  <div class="oreceiver-item">
                    <span class="item-title">Last Name:</span>
                    <span>{{ payInfo.receiverLastName }}</span>
                  </div>

                  <div class="oreceiver-item">
                    <span class="item-title">Tel:</span>
                    <span>{{ payInfo.receiverPhone }}</span>
                  </div>

                  <div class="oreceiver-item">
                    <span class="item-title">City:</span>
                    <span>{{ payInfo.receiverCity }}</span>
                  </div>
                  <div class="oreceiver-item">
                    <span class="item-title">Address:</span>
                    <span>{{ payInfo.receiverAddr }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="oreveiver-list bank-info">
                  <div class="oreceiver-item">
                    <span class="item-title"> Beneficiary’s Bank：:</span>
                    <span>{{ payInfo.receiverBank }}</span>
                  </div>
                  <div class="oreceiver-item">
                    <span class="item-title">SWIFT BIC: </span>
                    <span>{{ payInfo.swiftCode }}</span>
                  </div>
                  <div class="oreceiver-item">
                    <span class="item-title">Beneficiary Name：</span>
                    <span>{{ payInfo.receiverName }}</span>
                  </div>

                  <div class="oreceiver-item">
                    <span class="item-title">Account Number：</span>
                    <span>{{ payInfo.receiverAccount }}</span>
                  </div>

                  <div class="oreceiver-item">
                    <span class="item-title">BANK Address：</span>
                    <span>{{ payInfo.receiverBankAddr }}</span>
                  </div>
                </div>
              </template>
              <div style="clear: both"></div>
              <el-divider></el-divider>
              <p class="offline-subtitle">{{ payInfo.code }} info of Sender</p>
            </div>
            <!-- 西联支付+速汇金表单 -->
            <template v-if="payInfo.code !== 'BankTransfer'">
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
                  <el-button type="primary" @click="onSubmit('form')"
                    >Complete Order Now</el-button
                  >
                  <el-button
                    @click="
                      $router.push({
                        path: '/order/detail',
                        query: { id: orderInfo.orderId },
                      })
                    "
                    >Pay Later</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
            <template v-else>
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
                  <el-input
                    type="textarea"
                    v-model="bankform.contents"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit('bankform')"
                    >Complete Order Now</el-button
                  >
                  <el-button @click="$router.push('/order/list')"
                    >Pay Later</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
          </div>
        </template>
        <span class="el-icon-arrow-left"></span>
        <el-button type="text" @click="backToPay">选择其他支付方式</el-button>
      </el-card>
    </el-card>
  </div>
</template>
<script>
import corderinfo from "./components/orderinfo.vue";
import timer from "@/views/components/timer";
import QRCode from "qrcodejs2";
import { getResult } from "@/utils/resultValidate";
import {
  saveOffLineTransfer,
  getPayModeByCode,
  orderPayInit,
  createPayment,
} from "@/api/pay";
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
      orderInfo: {},
      orderDetail: {},
      codeTimer: "",
      aliPayForm: "",
      failTime: false,
      loading: false,
    };
  },
  components: {
    corderinfo,
    timer,
  },
  methods: {
    //线下支付提交
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let params = {};
          if (this.payInfo.code !== "BankTransfer") {
            //西联支付/速汇金
            params.amount = this.form.money;
            params.currency = this.form.currency;
            params.draweeCountry = this.form.country;
            params.draweeFirstName = this.form.firstname;
            params.draweeLastName = this.form.lastname;
            params.draweeRemark = this.form.contents;
            params.mtcnNo = this.form.number;
          } else {
            //银行转帐
            params.transactionNumber = this.bankform.number;
            params.amount = this.bankform.money;
            params.currency = this.bankform.currency;
            params.draweeRemark = this.bankform.contents;
          }

          //公共
          params.code = this.payInfo.code;
          params.orderId = this.orderInfo.orderId;

          saveOffLineTransfer(params).then((res) => {
            if (res.status === 200) {
              this.$router.push({
                path: "/payment/result",
                query: { orderId: this.orderInfo.orderId },
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.warning("请检查表单项！");
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
    //线上支付
    createPay() {
      this.failTime = false;
      let params = {};
      params.callbackUrl =
        window.location.origin +
        "/payment/result?orderId=" +
        this.orderInfo.orderId;
      params.orderId = this.orderInfo.orderId;
      params.payCode = this.$route.query.payCode;
      createPayment(params).then((res) => {
        if (res.status === 200) {
          this.loading = false;
          if (this.$route.query.payCode == "Wechat") {
            this.codeTimer = res.data.qrEffectiveTime;
            this.$refs.qrcode.innerHTML = "";
            let qrcode = new QRCode("qrcode", {
              width: 300, // 二维码宽度
              height: 300, // 二维码高度
              text: res.data.qrImg,
            });
          } else if (this.$route.query.payCode == "Alipay") {
            this.aliPayForm = res.data.qrImg;
            var oframe = document.createElement("iframe");
            oframe.id = "oframe";
            oframe.width = 700;
            oframe.height = 400;
            oframe.style.border = 0;
            oframe.scrolling = "no";
            oframe.src = "about:blank";
            document.getElementById("aliPayWrapper").appendChild(oframe);
            var doc =
              document.getElementById("oframe").contentWindow.document ||
              document.getElementById("oframe").contentDocument;
            doc.write(this.aliPayForm);
            doc.close();
          } else if (this.$route.query.payCode == "Paypal") {
            window.location.href = res.data.qrImg;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    backToPay() {
      this.$router.push({
        path: "/payment/pay",
        query: {
          payVal: this.$route.query.payMode,
          orderId: this.orderInfo.orderId,
        },
      });
    },
  },
  mounted() {
    let orderResult = getResult(this.$route.query.orderId);
    orderResult.then((hasPay) => {
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
            // endTime
            this.orderDetail = res.data.orderDetail;
            this.payList = res.data.payList;

            //receive信息
            //线上支付不需要请求该接口
            if (this.$route.query.payMode == 1) {
              let codeParams = {};

              codeParams.code = this.$route.query.payCode;
              getPayModeByCode(codeParams).then((res) => {
                if (res.status === 200) {
                  this.payInfo = res.data;
                } else {
                  this.$message.error(res.msg);
                }
              });
            } else {
              //线上支付
              this.loading = true;
              this.createPay();
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });
    // if(orderResult){
    //   this.$router.push({path:'/order/detail',query:{id:this.$route.query.orderId}})
    // }
  },
};
</script>
<style scoped>
.offline-wrapper {
  width: 800px;
  margin: 20px auto;
}
.pay-title {
  height: 40px;
  line-height: 40px;
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
  width: 500px;
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
.bank-info .item-title {
  width: 150px;
}
.bank-info {
  width: 670px;
}
.offline-title {
  text-align: center;
  font-size: 20px;
}
.offline-subtitle {
  text-align: center;
}
.v-tip-title {
  display: inline-block;
  vertical-align: middle;
  height: 40px;
  line-height: 40px;
}
.title {
  float: right;
}
</style>


