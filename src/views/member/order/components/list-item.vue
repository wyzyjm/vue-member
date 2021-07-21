<template>
  <div class="item-card">
    <div class="item-card-title">
      <span>商品信息</span>
      <span>单价</span>
      <span>数量</span>
      <span>收货人</span>
      <span>实付款</span>
      <span>订单状态</span>
      <span class="operate">操作</span>
    </div>
    <ul class="item-card-content" :data="list">
      <li
        v-for="data in list"
        :id="data.id"
        :key="data.id"
        class="order"
      >
        <div class="col-9 order-id">
          <span>下单时间：{{ formatDate(data.createTime) }}</span><span class="ml-20">订单号：{{ data.orderNumber }}</span>
        </div>
        <ul class="order-list">
          <li class="order-item">
            <div class="goods">
              <div
                v-for="item in data.orderProductSkuList"
                :id="item.id"
                :key="item.id"
                class="goods-information"
              >
                <div class="goods-cont">
                  <Custom-img :src="item.skuImg" class="goods-img" />
                  <div class="goods-title">
                    <p>{{ item.skuName }}</p>
                    <p class="col-9">
                      <span
                        v-for="skuSpec in item.skuSpec"
                        :key="skuSpec.specId"
                      >
                        <i v-if="skuSpec.specValue">{{ skuSpec.specName }}：{{ skuSpec.specValue }}；</i>
                      </span>
                    </p>
                  </div>
                </div>
                <div class="col-danger goods-price">
                  <span>{{ data.currencySymbol }}{{ item.skuPrice }}</span>
                </div>
                <div class="goods-num"><span>{{ item.quantity }}</span></div>
              </div>
            </div>
            <div><span>{{ data.consigneeName }}</span></div>
            <div class="actual-payment">
              <p>{{ data.currencySymbol }}{{ data.sumPayable }}</p>
              <p class="col-9 border-bottom p-y m-y">含运费{{ data.currencySymbol }}{{ data.freight }}</p>
              <p class="col-9">{{ data.paymentTypeName }}</p>
            </div>
            <div :class="{'col-danger':data.orderStatus != 50}">
              <span>{{ statePayment[data.orderStatus].type }}</span>
            </div>
            <div class="operate">
              <div v-if="data.orderStatus == 10">
                <!-- 1、永久有效    0、不是永久有效 -->
                <CountDown v-if="data.forever === 0" class="p-y col-danger" :counttime="data.failureTime" />
                <el-button type="primary" @click="paymentOrder(data)">付款</el-button>
              </div>
              <el-button v-if="data.orderStatus == 40" type="primary" @click.prevent="confirmReceipt(data.id)">确认收货</el-button>
              <el-button type="text" @click.prevent="viewOrder(data.id)">查看订单</el-button>
              <el-popover
                v-if="data.orderStatus == 40"
                placement="bottom-end"
                width="200"
                trigger="hover"
              >
                <el-timeline :reverse="reverse">
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp"
                  >
                    {{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
                <!-- <el-button slot="reference" type="text" @click.prevent="checkLogistics">查看物流</el-button> -->
              </el-popover>
              <el-button v-else-if="data.orderStatus != 20 && data.orderStatus != 30 && data.orderStatus != 50 && data.orderStatus != 60" type="text" @click.prevent="cancel(data.id)">取消订单</el-button>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>

import CustomImg from '@/components/CustomImg'
import CountDown from './count-down'
import { confirmOrder, cancelOrder } from '@/api/order'

export default {
  components: {
    CustomImg,
    CountDown
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    memberid: {
      type: String,
      default: ''
    },
    tabsindex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showAlt: false,
      memberId: this.memberid ? this.memberid : '',
      time: '',
      day: '', // 天
      hour: '', // 小时
      minute: '', // 分钟
      seconds: '', // 秒数
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
      reverse: true,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  computed: {
  },
  methods: {
    confirmReceipt(id) {
      this.$confirm('确认收到所有商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        confirmOrder({ orderId: id, memberId: this.memberId }).then(res => {
          if (res.data.data.code !== '0') return
          location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    cancel(id) {
      this.$confirm('确定取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        cancelOrder({ orderId: id, memberId: this.memberId }).then(res => {
          if (res.data.data.code !== '0') return
          location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    // 查看详情
    viewOrder(id) {
      this.$router.push({
        path: '/order/detail',
        query: {
          id: id
        }
      })
    },
    // 查看物流
    // checkLogistics(id) {
    //   console.log(id)
    //   this.$router.push('/order/detail')
    // },
    /**
     * 支付订单 支付方式
     * 0:在线支付  1:线下支付 2:货到付款
     * **/
    paymentOrder(item) {
      this.$router.push({
        path: '/payment/pay',
        query: {
          orderId: item.id,
          payVal: item.payMode
        }
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
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
ul,li,i{
  list-style: none;
}

.col-9{
  color: #999999;
}
.col-danger{
  color: #F56C6C;
}
.p-y{
  padding: 5px 0;
}
.m-y{
  margin: 5px;
}
.ml-20{
  margin-left: 20px;
}
.border-bottom{
  border-bottom: 1px solid rgba(222, 222, 224, 1);
}
.item-card-title{
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(245, 245, 245, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(222, 222, 224, 1);
  >span{
    width: 100px;
    text-align: center;
  }
  >span:nth-child(1){
    width: 320px;
  }
  .operate{
    width: 140px;
    display: flex;
    flex-direction: column;
  }
}
.order-id{
  width: 100%;
  padding: 15px 10px;
  background-color: rgba(245, 245, 245, 1);
}
.order-item{
  display: table-row;
  justify-content: space-around;
  align-items: center;
  border-left:1px solid rgba(222, 222, 224, 1);
  border-bottom:1px solid rgba(222, 222, 224, 1);
  >div{
    width: 100px;
    height: 100%;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    border-right:1px solid rgba(222, 222, 224, 1);
    border-bottom:1px solid rgba(222, 222, 224, 1);
  }
  >div:nth-child(1){
    width: 520px;
    border-bottom:none;
  }
  .goods-information{
    width: 100%;
    display: table-row;
    position: relative;
    >div{
      width: 100px;
      height: 130px;
      display: table-cell;
      vertical-align: middle;
      border-bottom:1px solid rgba(222, 222, 224, 1);
    }
    >div:nth-child(1){
      width: 320px;
      text-align: left;
      border-left:1px solid rgba(222, 222, 224, 1);
    }
    .goods-cont{
      display: flex;
      align-items: center;
    }
    .goods-title{
      width: 200px;
      height: 100%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      p{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.5;
      }
    }
    .goods-img{
      width: 120px;
      height: 120px;
      margin:0 10px;
      overflow: hidden;
    }
  }
  .operate{
    width: 140px;
  }
  button{
    padding: 5px 8px;
    margin-bottom: 3px;
  }
  .el-button+.el-button{
    margin-left: 0;
  }
}
</style>
