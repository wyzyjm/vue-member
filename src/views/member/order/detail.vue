<template>
  <div v-if="data" v-loading="loading" class="app-container">
    <PageTitle :pagetitle="title" />
    <!-- 订单详情 -->
    <!-- 进度条 -->
    <CeSteps :active="active" :datalist="datalist" class="border-bottom" />

    <!-- 订单编号、按钮 -->
    <div class="order-type">
      <div>{{$t('member_order_detail_1', [ data.orderNumber ])}}<el-button
          id="orderNum"
          type="text"
          :data-clipboard-text="data.orderNumber"
          @click="copy"
          >{{$t('member_order_detail_2')}}</el-button
        >
      </div>
      <div
        v-if="data.orderStatus == 10 && data.forever === 0"
        class="col-danger"
      >
        <SvgIcon name="icon-shijian" />{{$t('member_order_detail_3', [ dataTime ])}}</div>
      <div>{{$t('member_order_detail_4')}}<span
          class="font-20"
          :class="{
            'col-danger': data.orderStatus < 50,
            'col-success': data.orderStatus === 50,
          }"
          >{{ statePayment[data.orderStatus].type }}</span
        >
      </div>
      <div>
        <el-button
          v-if="data.orderStatus == 10 || data.orderStatus == 20"
          type="text"
          @click.prevent="cancelOrder"
          >{{$t('member_order_detail_5')}}</el-button
        >
        <el-button
          v-if="data.electronicInvoice"
          type="primary"
          plain
          @click="dialogTableVisible = true"
          >{{$t('member_order_detail_6')}}</el-button
        >
        <el-button
          v-if="data.orderStatus == 10"
          type="primary"
          plain
          @click="showDialog('edit')"
          >{{$t('member_order_detail_7')}}</el-button
        >
        <el-button
          v-if="data.orderStatus == 10"
          type="primary"
          @click="payOrder"
          >{{$t('member_order_detail_8')}}</el-button
        >
        <el-button
          v-if="data.orderStatus == 40"
          type="primary"
          @click="confirmOrder"
          >{{$t('member_order_detail_9')}}</el-button
        >
      </div>
    </div>

    <!-- 收货信息 -->
    <ul
      class="border detail"
      :style="{
        display: data.goodsList[0].formJson == 'null' ? 'flex' : 'block',
      }"
    >
      <li class="detail-item">
        <p class="title" v-show="data.goodsList[0].formJson == 'null'">{{$t('member_order_detail_10')}}</p>
        <div class="item-list" v-if="data.goodsList[0].formJson == 'null'">
          
          <p v-if="data.consigneeInfo.consigneeName" class="consignee">
            <span>{{$t('member_order_detail_11')}}</span
            ><span>{{ data.consigneeInfo.consigneeName }}</span>
          </p>
          <div :class="{ reverse: data.consigneeInfo.reverseFlag }">
            <p v-if="data.consigneeInfo.consigneeProvince" class="consignee">
              <span>{{$t('member_order_detail_12')}}</span
              ><span>
                {{
                  getAddress(
                    data.consigneeInfo.consigneeCountry,
                    data.consigneeInfo.consigneeProvince,
                    data.consigneeInfo.consigneeCity,
                    data.consigneeInfo.consigneeCounty,
                    data.consigneeInfo.reverseFlag
                  )
                }}</span
              >
            </p>
            <p v-if="data.consigneeInfo.consigneeAddr" class="consignee mb-10">
              <span>{{$t('member_order_detail_13')}}</span
              ><span>{{ data.consigneeInfo.consigneeAddr }}</span>
            </p>
          </div>
          <p v-if="data.consigneeInfo.consigneePhone" class="consignee">
            <span>{{$t('member_order_detail_14')}}</span
            ><span
              >{{
                data.consigneeInfo.consigneePhoneHead.substring(
                  data.consigneeInfo.consigneePhoneHead.lastIndexOf("+")
                )
              }}
              {{ data.consigneeInfo.consigneePhone }}</span
            >
          </p>
          <p v-if="data.consigneeInfo.consigneeTel" class="consignee">
            <span>{{$t('member_order_detail_15')}}</span
            ><span
              >{{
                data.consigneeInfo.consigneeTelHead.substring(
                  data.consigneeInfo.consigneeTelHead.lastIndexOf("+")
                )
              }}-{{ data.consigneeInfo.consigneeTel }}</span
            >
          </p>
          <p v-if="data.consigneeInfo.consigneeZipCode" class="consignee">
            <span>{{$t('member_order_detail_16')}}</span
            ><span>{{ data.consigneeInfo.consigneeZipCode }}</span>
          </p>
        </div>
        <div v-else>
          <p class="title">{{$t('member_order_detail_17')}}</p>
          <div
            v-for="(tableItem, tableIndex) in formJson.subForm"
            :key="tableIndex + 'table'"
            style="width: 100%"
          >
            <el-table :data="tableItem.list" style="width: 100%">
              <el-table-column
                :label="item.label"
                v-for="(item, index) in tableItem.head"
                :key="index"
              >
                <template slot-scope="scope">
                  {{ tableItem.list[scope.$index][item.key] }}
                </template>
              </el-table-column>
            </el-table>
            <br />
          </div>
          <div
            style="margin-left: 10px; line-height: 34px"
            v-for="(item, index) in formJson.normal"
            :key="index"
          >
            {{ item.label }}：{{ item.value }}
          </div>
          <br />
        </div>
      </li>
      <li v-if="data.payInfo" class="detail-item">
        <p class="title">{{$t('member_order_detail_18')}}</p>
        <div
          class="item-list display-flex"
          :style="{
            height: data.goodsList[0].formJson == 'null' ? '260px' : '50px',
            'margin-top': data.goodsList[0].formJson == 'null' ? '20px' : '-10px',
          }"
        >
          <p class="pr-10">{{$t('member_order_detail_19')}}<i class="col-grey-6">{{
              data.payInfo.paymentTypeName
                ? data.payInfo.paymentTypeName
                : data.payInfo.payModeName
            }}</i>
          </p>
          <el-popover
            v-if="
              data.orderStatus > 10 &&
              data.orderStatus < 60 &&
              data.payInfo.paymentTypeId !== 7
            "
            placement="bottom"
            width="260"
            trigger="click"
          >
            <!-- 微信、支付宝、paypal -->
            <div
              v-if="
                data.payInfo.paymentTypeId === 1 ||
                data.payInfo.paymentTypeId === 2 ||
                data.payInfo.paymentTypeId === 3
              "
              class="slot-content"
            >
              <p class="payInfo-item">
                <span>{{$t('member_order_detail_20')}}</span
                ><span>{{
                  JSON.parse(data.payInfo.payOnline.tradeNo).tradeNo
                }}</span>
              </p>
            </div>
            <!-- Bank Transfer 银行转账 -->
            <div v-if="data.payInfo.paymentTypeId === 4" class="slot-content">
              <p class="payInfo-item">
                <span>Bank Transaction No.：</span
                ><span>{{ data.payInfo.bankTransfer.tradeNo }}</span>
              </p>
              <p class="payInfo-item">
                <span>Send money：</span
                ><span>{{ data.payInfo.bankTransfer.money }}</span>
              </p>
              <p class="payInfo-item">
                <span>Currency：</span
                ><span>{{ data.payInfo.bankTransfer.currency }}</span>
              </p>
              <p class="payInfo-item">
                <span>Contents：</span
                ><span>{{ data.payInfo.bankTransfer.content }}</span>
              </p>
            </div>
            <!-- Western Union 西联> -->
            <div v-if="data.payInfo.paymentTypeId === 5" class="slot-content">
              <p class="payInfo-item">
                <span>First Name：</span
                ><span>{{ data.payInfo.westernUnion.firstName }}</span>
              </p>
              <p class="payInfo-item">
                <span>Last Name：</span
                ><span>{{ data.payInfo.westernUnion.lastName }}</span>
              </p>
              <p class="payInfo-item">
                <span>Send money：</span
                ><span>{{ data.payInfo.westernUnion.money }}</span>
              </p>
              <p class="payInfo-item">
                <span>MTCN# No.：</span
                ><span>{{ data.payInfo.westernUnion.mtcnNo }}</span>
              </p>
              <p class="payInfo-item">
                <span>Currency：</span
                ><span>{{ data.payInfo.westernUnion.currency }}</span>
              </p>
              <p class="payInfo-item">
                <span>Contents：</span
                ><span>{{ data.payInfo.westernUnion.content }}</span>
              </p>
            </div>
            <!-- Money Gram 速汇金> -->
            <div v-if="data.payInfo.paymentTypeId === 6" class="slot-content">
              <p class="payInfo-item">
                <span>First Name：</span
                ><span>{{ data.payInfo.moneyGram.firstName }}</span>
              </p>
              <p class="payInfo-item">
                <span>Last Name：</span
                ><span>{{ data.payInfo.moneyGram.lastName }}</span>
              </p>
              <p class="payInfo-item">
                <span>Send money：</span
                ><span>{{ data.payInfo.moneyGram.money }}</span>
              </p>
              <p class="payInfo-item">
                <span>MTCN# No.：</span
                ><span>{{ data.payInfo.moneyGram.mtcnNo }}</span>
              </p>
              <p class="payInfo-item">
                <span>Currency：</span
                ><span>{{ data.payInfo.moneyGram.currency }}</span>
              </p>
              <p class="payInfo-item">
                <span>Contents：</span
                ><span>{{ data.payInfo.moneyGram.content }}</span>
              </p>
            </div>
            <el-button slot="reference" type="text" class="mt5"
              >{{$t('member_order_detail_18')}}<SvgIcon name="icon-xia"
            /></el-button>
          </el-popover>
        </div>
      </li>
      <li
        v-if="data.logisticsInfo && data.goodsList[0].formJson == 'null'"
        class="detail-item"
      >
        <p class="title">{{$t('member_order_detail_21')}}</p>
        <div class="item-list">
          <p v-if="data.logisticsInfo.distribution" class="consignee">
            <span>{{$t('member_order_detail_22')}}</span
            ><span>{{ data.logisticsInfo.distribution }}</span>
          </p>
          <p
            v-if="data.logisticsInfo.courierCompanyCode"
            class="consignee"
            :datatype="data.logisticsInfo.courierCompanyCode"
          >
            <span>{{$t('member_order_detail_23')}}</span
            ><span>{{ data.logisticsInfo.courierCompany }}</span>
          </p>
          <p v-if="data.logisticsInfo.trackingNumber" class="consignee">
            <span>{{$t('member_order_detail_24')}}</span
            ><span>{{ data.logisticsInfo.trackingNumber }}</span>
          </p>
          <p
            v-if="data.logisticsInfo.queryUrl"
            v-show="false"
            class="consignee"
          >
            <span>{{$t('member_order_detail_25')}}</span
            ><a
              target="_blank"
              :href="data.logisticsInfo.queryUrl"
              class="el-button--text"
              >{{ data.logisticsInfo.queryUrl }}</a
            >
          </p>
        </div>
      </li>
    </ul>

    <!-- 商品清单 -->
    <div class="border">
      <p class="title">{{$t('member_order_detail_26')}}</p>
      <div class="product-list">
        <ProductList
          :product-list="data.goodsList"
          :currency-symbol="data.currencySymbol"
        />
        <div class="message-board">
          <div>
            <p v-if="data.sellerMsg">{{$t('member_order_detail_27')}}</p>
            <p v-if="data.sellerMsg" id="sellerMsg">{{ data.sellerMsg }}</p>
          </div>
          <div class="message-pay">
            <p>{{$t('member_order_detail_28')}}<span class="col-danger font-20">{{ inTotal }}</span>{{$t('member_order_detail_29')}}</p>
            <p class="col-grey-6">{{$t('member_order_detail_30', [ data.currencySymbol , data.totalAmount ])}}</p>
            <p class="col-grey-6">{{$t('member_order_detail_31', [ data.currencySymbol , data.freight ? data.freight : 0 ])}}</p>
            <p class="col-danger font-20">{{$t('member_order_detail_32')}}<span class="font-bold"
                >{{ data.currencySymbol }} {{ data.sumPayable }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <AddressForm
      ref="addressDialog"
      :address-form-prop="current"
      @confirm="confirmDialog"
    />

    <!-- 查看发票信息 -->
    <el-dialog
      v-if="data.electronicInvoice"
      center
      :title="$t('member_order_detail_33')"
      width="500px"
      :visible.sync="dialogTableVisible"
    >
      <div class="invoice">
        <p class="invoice-item">
          <span>{{$t('member_order_detail_34')}}</span
          ><span>{{ data.electronicInvoice.invoiceTitle }}</span>
        </p>
        <p v-if="data.electronicInvoice.invoiceType === 2" class="invoice-item">
          <span>{{$t('member_order_detail_35')}}</span
          ><span>{{ data.electronicInvoice.taxNum }}</span>
        </p>
        <p class="invoice-item">
          <span>{{$t('member_order_detail_36')}}</span
          ><span>{{ data.electronicInvoice.invoiceContent }}</span>
        </p>
        <p class="invoice-item">
          <span>{{$t('member_order_detail_37')}}</span
          ><span
            >{{
              data.electronicInvoice.takerPhoneHead.substring(
                data.electronicInvoice.takerPhoneHead.lastIndexOf("+")
              )
            }}
            {{ data.electronicInvoice.takerPhone }}</span
          >
        </p>
        <p v-if="data.electronicInvoice.takerEmail" class="invoice-item">
          <span>{{$t('member_order_detail_38')}}</span
          ><span>{{ data.electronicInvoice.takerEmail }}</span>
        </p>
        <p
          v-if="
            data.orderStatus > 40 && data.electronicInvoice.invoiceDownLinks
          "
          class="invoice-item-last"
        >
          <span>{{$t('member_order_detail_39')}}</span>
          <span class="invoice-list">
            <a
              v-for="(item, index) in data.electronicInvoice.invoiceDownLinks"
              :key="index"
              :href="item"
              target="_blank"
              class="el-button--text invoice-view"
              >{{ item }}</a
            >
          </span>
        </p>
      </div>
      <div slot="footer">
        <!-- 取消 -->
        <el-button type="info" size="medium" @click="dialogTableVisible = false"
          >{{$t('member_order_detail_40')}}</el-button
        >
        <!-- 确定 -->
        <el-button
          v-if="data.orderStatus == 10"
          type="primary"
          size="medium"
          @click="showReceipt"
          >{{$t('member_order_detail_41')}}</el-button
        >
      </div>
    </el-dialog>

    <Receipt
      ref="receiptDialog"
      :invoiceId="
        data.electronicInvoice != undefined
          ? data.electronicInvoice.invoiceId
          : ''
      "
      @formData="receiptConfirmDialog"
    />
  </div>
</template>
<script>
import ClipboardJS from "clipboard";
import { orderDetail, cancelOrder, confirmOrder } from "@/api/order";
import PageTitle from "@/views/components/pageTitle";
import CeSteps from "@/components/CeSteps";
import SvgIcon from "@/components/SvgIcon";
import AddressForm from "@/views/components/addressForm"; // 收货人地址弹窗
import Receipt from "@/views/components/receipt"; // 修改发票弹窗
import ProductList from "@/views/components/productList";
import { getAddressName } from "@/utils/address";

export default {
  components: {
    CeSteps,
    SvgIcon,
    AddressForm,
    Receipt,
    ProductList,
    PageTitle,
  },
  data() {
    return {
      active: 0,
      data: null,
      title: this.$t('member_order_detail_42'),
      loading: true,
      current: {}, // 弹窗传值
      currencySymbol: null,
      dialogTableVisible: false,
      payShow: false,
      receiptSaveLibray: false,
      day: "",
      hour: "",
      minute: "",
      seconds: "",
      dataTime: "",
      datalist: [],
      invoiceDownLinks: [],
      inTotal: 0,
      // 订单状态
      statePayment: {
        10: {
          type: this.$t('member_order_detail_43'),
        },
        20: {
          type: this.$t('member_order_detail_44'),
        },
        30: {
          type: this.$t('member_order_detail_45'),
        },
        40: {
          type: this.$t('member_order_detail_46'),
        },
        50: {
          type: this.$t('member_order_detail_47'),
        },
        60: {
          type: this.$t('member_order_detail_48'),
        },
      },
      stepsList: {
        0: {
          description: null,
          title: this.$t('member_order_detail_45'),
        },
        1: {
          description: null,
          title: this.$t('member_order_detail_46'),
        },
        2: {
          description: null,
          title: this.$t('member_order_detail_47'),
        },
        3: {
          description: null,
          title: this.$t('member_order_detail_49'),
        },
      },
      formJson: {
        subForm: [],
        normal: [],
      },
    };
  },
  computed: {
    getAddress: function () {
      return getAddressName;
    },
  },
  created() {
    this.getDetail();
    console.log(123);
  },
  methods: {
    // 初始化数据
    getDetail() {
      orderDetail({ orderId: this.$route.query.id })
        .then((res) => {
          this.data = res.data.data.order;
          const orderStatusDetailList =
            res.data.data.order.orderStatusDetailList;
          orderStatusDetailList.forEach((item) => {
            this.datalist.push({
              title: item.content,
              description: this.formatDate(item.time),
            });
          });
          this.active = this.datalist.length - 1;
          console.log(this.datalist);
          // 待付款状态下开启倒计时
          if (this.data.orderStatus === 10) {
            this.timeDown(
              this.data.createTime / 1000 + Number(this.data.failureTime)
            );
          }
          // 支付流程控制进度条 ORDER_SUBMIT(订单提交),PAYMENT_PROCESS(支付流程),DELIVERY_PROCESS(发货流程),TRADE_SUCCESS(交易成功)
          if (
            this.data.orderProcessNodes &&
            this.data.orderProcessNodes.indexOf("DELIVERY_PROCESS") !== -1
          ) {
            if (this.data.orderStatus === 40) {
              this.datalist.push(this.stepsList[1]);
              this.active = this.datalist.length;
            } else if (this.data.orderStatus === 30) {
              this.datalist.push(this.stepsList[1]);
            } else if (
              this.data.orderStatus === 50 ||
              this.data.orderStatus === 60 ||
              (this.data.payInfo && this.data.payInfo.paymentTypeId === 7)
            ) {
              this.datalist.push();
            } else {
              this.datalist.push(this.stepsList[0], this.stepsList[1]);
            }
          } else {
            if (this.data.orderStatus < 50) {
              this.datalist.push(this.stepsList[2]);
            }
          }
          // if (this.data.electronicInvoice.invoiceDownLinks) {
          //   const subInvoice = this.data.electronicInvoice.invoiceDownLinks.replace(/(\n)/, ',')
          //   this.invoiceDownLinks.push(subInvoice)
          // }
          this.current = {
            orderId: this.data.orderId,
            ...this.data.consigneeInfo,
          };
          this.sumTotal(this.data.goodsList);
          this.loading = false;
          if (this.data.goodsList[0].formJson !== "null") {
            this.formJson=JSON.parse(this.data.goodsList[0].formJson);
          }
          // this.formJson = this.data.goodsList[0].formJson==null?null:JSON.parse(this.data.goodsList[0].formJson);
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    // 修改发票弹窗
    showReceipt() {
      this.dialogTableVisible = false;
      const _this = this.$refs["receiptDialog"];
      _this.dialogVisible = true;
      _this.form.invoiceId = this.data.electronicInvoice.invoiceId;
    },
    // 发票弹出确认事件
    receiptConfirmDialog(status) {
      this.data.electronicInvoice.invoiceTitle =
        status.type === 1 ? status.name : status.companyName; // 发票抬头
      this.data.electronicInvoice.invoiceType = status.type; // 发票类型
      this.data.electronicInvoice.invoiceContent = status.catalog; // 发票内容
      this.data.electronicInvoice.takerEmail = status.mail; // 邮箱
      this.data.electronicInvoice.takerPhone = status.phone; // 手机
      this.data.electronicInvoice.takerPhoneHead = status.phonePrefix;
      if (status.type === 2) {
        this.data.electronicInvoice.taxNum = status.companyNumber; // 纳税人识别号
      }
    },
    // 修改地址弹窗 显示
    showDialog(status) {
      console.log(this.current);
      const _this = this.$refs["addressDialog"]; // 获取当前弹窗组件实例
      _this.dialogFormVisible = true; // 修改弹窗 显示状态
      _this.dialogStatus = status; // 修改弹窗 类型 create:创建 | edit:编辑
      _this.formType = status;
    },
    // 地址弹窗确认事件
    confirmDialog(data) {
      this.loading = true;
      location.reload();
    },
    // 确认收货
    confirmOrder() {
      this.$confirm(this.$t('member_order_detail_51'), this.$t('member_order_detail_52'), {
        confirmButtonText: this.$t('member_order_detail_53'),
        cancelButtonText: this.$t('member_order_detail_54'),
      })
        .then(() => {
          confirmOrder({ orderId: this.data.orderId })
            .then((res) => {
              if (res.data.code !== "0") return;
              location.reload();
            })
            .catch((error) => {
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('member_order_detail_55'),
          });
        });
    },
    // 取消订单
    cancelOrder() {
      this.$confirm(this.$t('member_order_detail_56'), this.$t('member_order_detail_52'), {
        confirmButtonText: this.$t('member_order_detail_53'),
        cancelButtonText: this.$t('member_order_detail_54'),
      })
        .then(() => {
          cancelOrder({ orderId: this.data.orderId })
            .then((res) => {
              if (res.data.code !== "0") return;
              location.reload();
            })
            .catch((error) => {
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('member_order_detail_55'),
          });
        });
    },
    /**
     * 支付订单 支付方式
     * 0:在线支付  1:线下支付 2:货到付款
     * **/
    payOrder() {
      this.$router.push({
        path: "/payment/pay",
        query: {
          orderId: this.data.orderId,
          payVal: this.data.payInfo ? this.data.payInfo.paymentTypeId : "", // 后台缺少参数
        },
      });
    },
    // 复制
    copy() {
      const _this = this;
      const clipboard = new ClipboardJS("#orderNum");
      clipboard.on("success", (e) => {
        _this.$message(this.$t('member_order_detail_57'));
        clipboard.destory();
      });
      clipboard.on("error", (e) => {
        clipboard.destory();
      });
    },
    // 时间转换
    toDou(n) {
      return n < 10 ? "0" + n : "" + n;
    },
    formatDate(date) {
      date = new Date(Number(date));
      var o = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1, // 月份
        d: date.getDate(), // 日
        h: date.getHours(), // 小时
        m: date.getMinutes(), // 分
        s: date.getSeconds(), // 秒
        q: Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
      };
      const dateTime = `${o.Y}-${this.toDou(o.M)}-${this.toDou(
        o.d
      )}  ${this.toDou(o.h)}:${this.toDou(o.m)}:${this.toDou(o.s)}`;
      return dateTime;
    },
    // 倒计时
    timeDown(leftTime) {
      clearInterval(this.setIntID);
      leftTime = leftTime - this.data.systemTime / 1000;
      if (leftTime <= 0) {
        this.dataTime = this.$t('member_order_detail_58');
        return;
      }
      this.setIntID = setInterval(() => {
        leftTime--;
        if (leftTime <= 0) {
          clearInterval(this.setIntID);
          location.reload();
          return;
        }
        this.day = parseInt(leftTime / (24 * 60 * 60));
        this.hour = this.toDou(parseInt((leftTime / (60 * 60)) % 24));
        this.minute = this.toDou(parseInt((leftTime / 60) % 60));
        this.seconds = this.toDou(parseInt(leftTime % 60));
        if (this.day >= 1) {
          this.dataTime = this.$t('member_order_detail_59', [this.day,this.hour,this.minute,this.seconds]);
        } else if (this.hour >= 1) {
          this.dataTime = this.$t('member_order_detail_60', [this.hour,this.minute,this.seconds]);
        } else if (this.minute >= 1) {
          this.dataTime = this.$t('member_order_detail_61', [this.minute,this.seconds]);
        } else if (this.seconds >= 1) {
          this.dataTime = this.$t('member_order_detail_62', [this.seconds]);
        } else {
          this.dataTime = this.$t('member_order_detail_58');
        }
      }, 1000);
    },
    // 计算订单总数量
    sumTotal(data) {
      for(let i=0;i<data.length;i++){
        this.inTotal =+ data[i].quantity;
      }
      
    },
    invoiceDownload() {
      const files = this.data.electronicInvoice.invoiceDownLinks
        ? this.data.electronicInvoice.invoiceDownLinks
        : []; // 所有文件
      files.forEach((url) => {
        const aHtml = document.createElement("a"); // 创建a标签
        const e = document.createEvent("MouseEvents"); // 创建鼠标事件对象
        e.initEvent("click", false, false); // 初始化事件对象
        aHtml.target = "_blank";
        aHtml.href = url; // 设置下载地址
        aHtml.download = ""; // 设置下载文件名
        aHtml.dispatchEvent(e);
      });
    },
  },
};
</script>
<style scoped>
ul,
li,
i {
  list-style: none;
  padding: 0;
  margin: 0;
  font-style: normal;
}
p {
  padding: 0;
  margin: 0;
  margin: 15px 0;
}
.font-20 {
  font-size: 20px;
}
.font-bold {
  font-weight: bold;
}
.col-danger {
  color: #f56c6c;
}
.col-success {
  color: #67c23a;
}
.col-grey-9 {
  color: #999999;
}
.col-grey-6 {
  color: #666666;
}
.pr-10 {
  padding-right: 10px;
}
.border {
  border: 1px solid #c0c4cc;
}
.border-bottom {
  border-bottom: 1px solid #c0c4cc;
}
.border-top {
  border-top: 1px solid #c0c4cc;
}
.border-right {
  border-right: 1px solid #c0c4cc;
}
.order-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}
.mt5 {
  margin-top: 5px;
}
.display-flex {
  display: flex;
}
.detail {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
/* .detail p{
  margin-bottom: 1rem;
} */
.detail-item {
  flex: 1;
}
.title {
  background-color: rgb(242, 242, 242);
  margin: 0;
  padding: 15px 20px;
}
.product-list {
  margin: 0 40px;
}
.item-list {
  color: #999;
  height: 260px;
  padding: 10px;
  margin: 20px 10px;
  overflow-y: auto;
  border-right: 1px solid #c0c4cc;
}
.detail-item:last-child .item-list {
  border-right: none;
}
.item-list::-webkit-scrollbar {
  width: 8px;
  height: 10px;
  background: none;
}

.item-list::-webkit-scrollbar-track {
  background: none;
}

.item-list::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 6px;
}

.item-list::-webkit-scrollbar-button {
  height: 0;
  background: none;
}
.consignee {
  display: flex;
}
.consignee span {
  width: 100px;
  text-align: right;
  line-height: 1.3;
}
.consignee span:nth-child(2) {
  color: #666;
  width: calc(100% - 110px);
  max-width: 400px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.message-board {
  display: flex;
  justify-content: space-between;
}
#sellerMsg {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  color: #999999;
}
.message-pay {
  text-align: right;
}
.invoice-item,
.invoice-item-last {
  display: flex;
  margin-bottom: 30px;
}
.invoice-item span {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.invoice-item span:nth-child(1) {
  width: 220px;
  text-align: right;
  margin-right: 10px;
}
.invoice-item-last span {
  width: 200px;
}
.invoice-item-last span:nth-child(1) {
  width: 220px;
  max-height: 150px;
  overflow-y: auto;
  text-align: right;
  margin-right: 10px;
}
.reverse {
  display: flex;
  flex-direction: column-reverse;
}
.reverse p {
  margin: 0;
}
.reverse .mb-10 {
  margin-bottom: 10px;
}
.payInfo-item {
  display: flex;
  flex-direction: row;
}
.payInfo-item span {
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.payInfo-item span:nth-child(1) {
  width: 42%;
  text-align: right;
  margin-right: 10px;
}
.invoice-list {
  overflow-y: auto;
  max-height: 120px;
}
.invoice-view {
  color: #1989fa;
  margin-bottom: 15px;
  overflow-y: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>

