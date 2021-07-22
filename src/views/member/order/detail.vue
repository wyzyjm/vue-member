<template>
  <div v-if="data" v-loading="loading" class="app-container">
    <!-- 订单详情 -->
    <!-- 进度条 -->
    <CeSteps :active="active" :datalist="datalist" class="border-bottom" />

    <!-- 订单编号、按钮 -->
    <div class="order-type">
      <div>订单号：{{ data.orderNumber }}
        <el-button id="orderNum" type="text" :data-clipboard-text="data.orderNumber" @click="copy">复制</el-button>
      </div>
      <div
        v-if="data.orderStatus == 10"
        class="col-danger"
      ><SvgIcon name="icon-shijian" />剩余{{ dataTime }}</div>
      <div>订单状态：<span class="font-20" :class="{'col-danger': data.orderStatus < 50, 'col-success': data.orderStatus === 50}">{{ statePayment[data.orderStatus].type }}</span></div>
      <div>
        <el-button v-if="data.orderStatus == 10 || data.orderStatus == 20 " type="text" @click.prevent="cancelOrder">取消订单</el-button>
        <el-button type="primary" plain @click="dialogTableVisible = true">查看发票信息</el-button>
        <el-button v-if="data.orderStatus == 10" type="primary" plain @click="showDialog('edit')">修改地址</el-button>
        <el-button v-if="data.orderStatus == 10" type="primary" @click="payOrder">付款</el-button>
        <el-button v-if="data.orderStatus == 30" type="primary" @click="confirmOrder">确认收货</el-button>
      </div>
    </div>

    <!-- 收货信息 -->
    <ul class="border detail">
      <li class="detail-item">
        <p class="title">商品清单/结算信息</p>
        <div class="item-list">
          <p v-if="data.consigneeInfo.consigneeName" class="consignee"><span>收货人：</span><span>{{ data.consigneeInfo.consigneeName }}</span></p>
          <p v-if="data.consigneeInfo.consigneeProvince" class="consignee"><span>所在地区：</span><span>{{ data.consigneeInfo.consigneeProvince + data.consigneeInfo.consigneeCity + data.consigneeInfo.consigneeCounty }}</span></p>
          <p v-if="data.consigneeInfo.consigneeAddr" class="consignee"><span>详细地址：</span><span>{{ data.consigneeInfo.consigneeAddr }}</span></p>
          <p v-if="data.consigneeInfo.consigneePhoneHead" class="consignee"><span>手机号码：</span><span>{{ data.consigneeInfo.consigneePhoneHead }} {{ data.consigneeInfo.consigneePhone }}</span></p>
          <p v-if="data.consigneeInfo.consigneeTelHead" class="consignee"><span>固定电话：</span><span v-if="data.consigneeInfo.consigneeTelHead">{{ data.consigneeInfo.consigneeTelHead }}-{{ data.consigneeInfo.consigneeTel }}</span></p>
          <p v-if="data.consigneeInfo.consigneeZipCode" class="consignee"><span>邮政编码：</span><span>{{ data.consigneeInfo.consigneeZipCode }}</span></p>
        </div>
      </li>
      <li v-if="data.payInfo" class="detail-item">
        <p class="title">订单信息</p>
        <div class="item-list">
          <span class="pr-10">支付方式：{{ data.payInfo.paymentTypeName ? data.payInfo.paymentTypeName : '' }}</span>
          <el-popover
            placement="bottom"
            width="260"
            trigger="click"
          >
            <!-- 微信、支付宝、paypal -->
            <div v-if="data.payInfo.paymentTypeId === 1 || data.payInfo.paymentTypeId === 2 || data.payInfo.paymentTypeId === 3" class="slot-content">
              <p>交易号：{{ data.payInfo.payOnline.tradeNo }}</p>
            </div>
            <!-- Bank Transfer 银行转账 -->
            <div v-if="data.payInfo.paymentTypeId === 4" class="slot-content">
              <p>Bank Transaction No.：{{ data.payInfo.bankTransfer.tradeNo }}</p>
              <p>Send money：{{ data.payInfo.bankTransfer.money }}</p>
              <p>Currency：{{ data.payInfo.bankTransfer.currency }}</p>
              <p>Contents：{{ data.payInfo.bankTransfer.content }}</p>
            </div>
            <!-- Western Union 西联> -->
            <div v-if="data.payInfo.paymentTypeId === 5" class="slot-content">
              <p>First Name：{{ data.payInfo.westernUnion.firstName }}</p>
              <p>Last Name：{{ data.payInfo.westernUnion.lastName }}</p>
              <p>Send money：{{ data.payInfo.westernUnion.money }}</p>
              <p>MTCN# No.：{{ data.payInfo.westernUnion.mtcnNo }}</p>
              <p>Currency：{{ data.payInfo.westernUnion.currency }}</p>
              <p>Contents：{{ data.payInfo.westernUnion.content }}</p>
            </div>
            <!-- Money Gram 速汇金> -->
            <div v-if="data.payInfo.paymentTypeId === 6" class="slot-content">
              <p>First Name：{{ data.payInfo.moneyGram.firstName }}</p>
              <p>Last Name：{{ data.payInfo.moneyGram.lastName }}</p>
              <p>Send money：{{ data.payInfo.moneyGram.money }}</p>
              <p>MTCN# No.：{{ data.payInfo.moneyGram.mtcnNo }}</p>
              <p>Currency：{{ data.payInfo.moneyGram.currency }}</p>
              <p>Contents：{{ data.payInfo.moneyGram.content }}</p>
            </div>
            <el-button slot="reference" type="text">支付信息<SvgIcon name="icon-xia" /></el-button>
          </el-popover>
        </div>
      </li>
      <li v-if="data.orderStatus > 20" class="detail-item">
        <p class="title">物流信息</p>
        <div v-if="data.logisticsInfo" class="item-list">
          <p class="consignee"><span>配送方式：</span><span>{{ data.logisticsInfo.distribution }}</span></p>
          <p class="consignee" :datatype="data.logisticsInfo.courierCompanyCode"><span>快递公司：</span><span>{{ data.logisticsInfo.courierCompany }}</span></p>
          <p class="consignee"><span>运单号：</span><span>{{ data.logisticsInfo.trackingNumber }}</span></p>
          <p class="consignee"><span>物流查询：</span><a target="_blank" :href="data.logisticsInfo.queryUrl" class="el-button--text">{{ data.logisticsInfo.queryUrl }}</a></p>
        </div>
      </li>
    </ul>

    <!-- 商品清单 -->
    <div class="border">
      <p class="title">商品清单/结算信息</p>
      <div class="product-list">
        <ProductList
          :productList="data.goodsList"
          :currencySymbol="data.currencySymbol"
        />
        <div class="message-board">
          <div>
            <p>给卖家留言：</p>
            <p id="sellerMsg">{{ data.sellerMsg }}</p>
          </div>
          <div class="message-pay">
            <p>共 <span class="col-danger font-20">{{ inTotal }}</span> 件商品</p>
            <p>商品总额：  {{ data.currencySymbol }} {{ data.totalAmount }}</p>
            <p>运费总计：  {{ data.currencySymbol }} {{ data.freight ? data.freight : 0 }}</p>
            <p class="col-danger font-20">实付金额： <span class="font-bold">{{ data.currencySymbol }} {{ data.sumPayable }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <AddressForm
      ref="addressDialog"
      @confirm="confirmDialog"
      :addressFormProp="current"
    />

    <!-- 查看发票信息 -->
    <el-dialog v-if="data.electronicInvoice" center title="发票信息" width="500px" :visible.sync="dialogTableVisible">
      <div class="invoice">
        <p class="invoice-item"><span>发票抬头</span><span>{{ data.electronicInvoice.invoiceTitle }}</span></p>
        <p v-if="data.electronicInvoice.invoiceType === 2" class="invoice-item"><span>纳税人识别号</span><span>{{ data.electronicInvoice.taxNum }}</span></p>
        <p class="invoice-item"><span>发票内容</span><span>{{ data.electronicInvoice.invoiceContent }}</span></p>
        <p class="invoice-item"><span>收票人手机</span><span>{{ data.electronicInvoice.takerPhone }}</span></p>
        <p class="invoice-item"><span>收票人邮箱</span><span>{{ data.electronicInvoice.takerEmail }}</span></p>
        <p v-if="data.orderStatus > 40" class="invoice-item"><span>电子发票</span><a class="el-button--text" target="_blank" :href="data.electronicInvoice.invoiceDownLinks[0]" :download="data.electronicInvoice.invoiceTitle">点击下载</a></p>
      </div>
      <div slot="footer">
        <!-- 取消 -->
        <el-button type="info" size="medium" @click="dialogTableVisible = false">关闭</el-button>
        <!-- 确定 -->
        <el-button
          v-if="data.orderStatus == 10"
          type="primary"
          size="medium"
          @click="showReceipt"
        >修改</el-button>
      </div>
    </el-dialog>

    <Receipt
      ref="receiptDialog"
      :saveLibray="receiptSaveLibray"
      @formData="receiptConfirmDialog"
    />
  </div>
</template>
<script>
import ClipboardJS from 'clipboard'
import { orderDetail, cancelOrder, confirmOrder } from '@/api/order'
import CeSteps from '@/components/CeSteps'
import SvgIcon from '@/components/SvgIcon'
import AddressForm from '@/views/components/addressForm' // 收货人地址弹窗
import Receipt from '@/views/components/receipt' // 修改发票弹窗
import ProductList from '@/views/components/productList'

export default {
  components: {
    CeSteps,
    SvgIcon,
    AddressForm,
    Receipt,
    ProductList
  },
  data() {
    return {
      active: 0,
      data: null,
      loading: true,
      current: {}, // 弹窗传值
      currencySymbol: null,
      dialogTableVisible: false,
      payShow: false,
      receiptSaveLibray: false,
      day: '',
      hour: '',
      minute: '',
      seconds: '',
      dataTime: '',
      datalist: [],
      inTotal: 0,
      // 订单状态
      statePayment: {
        10: {
          type: '待付款'
        },
        20: {
          type: '待确认收款'
        },
        30: {
          type: '待发货'
        },
        40: {
          type: '待收货'
        },
        50: {
          type: '已完成'
        },
        60: {
          type: '已关闭'
        }
      },
      stepsList: {
        0: {
          description: null,
          title: '待发货'
        },
        1: {
          description: null,
          title: '待收货'
        },
        2: {
          description: null,
          title: '已完成'
        },
        3: {
          description: null,
          title: '待确认付款'
        }
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 初始化数据
    getDetail() {
      orderDetail({ orderId: this.$route.query.id }).then(res => {
        this.data = res.data.data.order
        const orderStatusDetailList = res.data.data.order.orderStatusDetailList
        orderStatusDetailList.forEach((item) => {
          this.datalist.push({
            title: item.content,
            description: this.formatDate(item.time)
          })
        })
        this.active = this.datalist.length - 1
        console.log(this.datalist)
        // 待付款状态下开启倒计时
        if (this.data.orderStatus === 10) {
          this.timeDown(this.data.failureTime)
        }
        // 支付流程控制进度条 ORDER_SUBMIT(订单提交),PAYMENT_PROCESS(支付流程),DELIVERY_PROCESS(发货流程),TRADE_SUCCESS(交易成功)
        if (this.data.orderProcessNodes && this.data.orderProcessNodes.indexOf('DELIVERY_PROCESS') !== -1) {
          this.datalist.push(this.stepsList[1])
        } else if (this.data.orderProcessNodes && this.data.orderProcessNodes.indexOf('PAYMENT_PROCESS') !== -1) {
          this.datalist.push(this.stepsList[1])
        } else if (this.data.orderProcessNodes && this.data.orderProcessNodes.indexOf('TRADE_SUCCESS') !== -1) {
          this.datalist.push(this.stepsList[2])
        } else if (this.data.orderStatus === 40) {
          this.datalist.push(this.stepsList[1])
          this.active = this.datalist.length
        }
        this.current = { orderId: this.data.orderId, ...this.data.consigneeInfo }
        this.sumTotal(this.data.goodsList)
        this.loading = false
      })
    },
    // 修改发票弹窗
    showReceipt() {
      this.dialogTableVisible = false
      const _this = this.$refs['receiptDialog']
      _this.dialogVisible = true
    },
    // 发票弹出确认事件
    receiptConfirmDialog(status) {
      this.data.electronicInvoice.invoiceTitle = status.type === 1 ? status.name : status.companyName // 发票抬头
      this.data.electronicInvoice.invoiceType = status.type // 发票类型
      this.data.electronicInvoice.invoiceContent = status.catalog // 发票内容
      this.data.electronicInvoice.takerEmail = status.mail // 邮箱
      this.data.electronicInvoice.takerPhone = status.phone // 手机
      this.data.electronicInvoice.takerPhoneHead = status.phonePrefix
      if (status.type === 2) {
        this.data.electronicInvoice.taxNum = status.companyNumber // 纳税人识别号
      }
    },
    // 修改地址弹窗 显示
    showDialog(status) {
      const _this = this.$refs['addressDialog'] // 获取当前弹窗组件实例
      _this.dialogFormVisible = true // 修改弹窗 显示状态
      _this.dialogStatus = status // 修改弹窗 类型 create:创建 | edit:编辑
      _this.formType = status
    },
    // 地址弹窗确认事件
    confirmDialog(data, addFormData, status) {
      this.current = {}
      console.log('编辑完收货地址后信息处理', data)
    },
    // 确认收货
    confirmOrder() {
      this.$confirm('确认收到所有商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        confirmOrder({ orderId: this.data.orderId}).then(res => {
          if (res.data.code !== '0') return
          location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    // 取消订单
    cancelOrder() {
      this.$confirm('确定取消该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        cancelOrder({ orderId: this.data.orderId }).then(res => {
          if (res.data.code !== '0') return
          location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    /**
     * 支付订单 支付方式
     * 0:在线支付  1:线下支付 2:货到付款
     * **/
    payOrder() {
      this.$router.push({
        path: '/payment/pay',
        query: {
          orderId: this.data.orderId,
          payVal: this.data.payInfo ? this.data.payInfo.paymentTypeId : '' // 后台缺少参数
        }
      })
    },
    // 复制
    copy() {
      const _this = this
      const clipboard = new ClipboardJS('#orderNum')
      clipboard.on('success', e => {
        _this.$message('复制成功')
        clipboard.destory()
      })
      clipboard.on('error', e => {
        clipboard.destory()
      })
    },
    // 时间转换
    toDou(n) {
      return n < 10 ? '0' + n : '' + n
    },
    formatDate(date) {
      date = new Date(Number(date))
      var o = {
        'Y': date.getFullYear(),
        'M': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 小时
        'm': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      const dateTime = `${o.Y}-${this.toDou(o.M)}-${this.toDou(o.d)}  ${this.toDou(o.h)}:${this.toDou(o.m)}:${this.toDou(o.s)}`
      return dateTime
    },
    timeDown(leftTime) {
      clearInterval(this.setIntID)
      if (leftTime <= 0) {
        return '0时0分0秒'
      }
      this.setIntID = setInterval(() => {
        leftTime--
        if (leftTime === 0) {
          clearInterval(this.setIntID)
          return
        }
        this.day = parseInt(leftTime / (24 * 60 * 60))
        this.hour = this.toDou(parseInt((leftTime / (60 * 60)) % 24))
        this.minute = this.toDou(parseInt((leftTime / 60) % 60))
        this.seconds = this.toDou(parseInt(leftTime % 60))
        if (this.day >= 1) {
          this.dataTime = `${this.day}天${this.hour}时${this.minute}分${this.seconds}秒`
        } else if (this.hour >= 1) {
          this.dataTime = `${this.hour}时${this.minute}分${this.seconds}秒`
        } else if (this.minute >= 1) {
          this.dataTime = `${this.minute}分${this.seconds}秒`
        } else if (this.seconds >= 1) {
          this.dataTime = `${this.seconds}秒`
        }
      }, 1000)
    },
    // 计算订单总数量
    sumTotal(data) {
      data.forEach(item => {
        this.inTotal = this.inTotal + item.quantity
      })
    }
  }
}
</script>
<style scoped>
ul,li{
  list-style: none;
  padding: 0;
  margin: 0;
}
.font-20{
  font-size: 20px;
}
.font-bold{
  font-weight: bold;
}
.col-danger{
  color: #F56C6C;
}
.col-success{
  color:#67C23A
}
.pr-10 {
  padding-right: 10px;
}
.border{
  border: 1px solid #C0C4CC;
}
.border-bottom{
  border-bottom: 1px solid #C0C4CC;
}
.border-top{
  border-top: 1px solid #C0C4CC;
}
.border-right{
  border-right: 1px solid #C0C4CC;
}
.order-type{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}
.detail{
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.detail-item{
  flex: 1;
}
.title{
  background-color: rgb(242, 242, 242);
  margin: 0;
  padding: 15px 20px;
}
.product-list{
  margin: 0 40px;
}
.item-list{
  height: 260px;
  padding: 10px;
  margin: 20px 10px;
  overflow-y: auto;
  border-right: 1px solid #C0C4CC;
}
.detail-item:last-child .item-list{
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
    background-color: #E0E0E0;
    border-radius: 6px;
}

.item-list::-webkit-scrollbar-button {
    height: 0;
    background: none;
}
.consignee{
  display: flex;
}
.consignee span{
  width: 100px;
  text-align: right;
  line-height: 1.3;
}
.consignee span:nth-child(2){
  width: calc(100% - 110px);
  text-align: left;
}
.message-board{
  display: flex;
  justify-content: space-between;
}
.message-board textarea{
  width: 500px;
  height: 100px;
  resize: vertical;
  border: none;
}
.message-pay{
  text-align: right;
}
.invoice{
  min-height: 150px;
  margin-left: 22%;
  line-height: 2.5;
}
.invoice-item span:nth-child(1){
  width: 120px;
  text-align: right;
  display: inline-block;
  margin-right: 10px;
}
</style>

