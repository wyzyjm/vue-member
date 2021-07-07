<template>
  <div>
    <div class="order-info">
      <span class="info">
        订单提交成功，请尽快付款！订单号：{{ orderInfo.orderNo }}</span
      >
      <span class="right"
        >应付金额：<strong class="text-danger" style="font-size: 24px"
          >{{ orderInfo.currencySymbol }}{{ orderInfo.amount }} </strong
        ></span
      >
    </div>
    <div class="order-info">
      <template v-if="orderInfo.failureTime!=='0'">
      <div style="line-height: 40px">
        请您在
        <span class="order-timer text-danger">
          <timer :endTime="orderInfo.failureTime" @timeEnd="$router.push({ path: '/order/list', query: { type: 0 } });
      "></timer>
        </span>
        内完成支付，否则订单会被自动取消
      </div>
      </template>
      <span :class="['right', { 'text-blue': showDetail }]" @click="viewDetail"
        >订单详情
        <svg-icon v-if="showDetail" name="icon-shang"></svg-icon>
        <svg-icon v-else name="icon-xia"></svg-icon>
      </span>
    </div>
    <el-divider></el-divider>
    <div class="order-detail" v-show="showDetail">
      <p>
        <span
          >收货地址：{{
                getAddress(
                  orderDetail.consigneeCountry,
                  orderDetail.consigneeProvince,
                  orderDetail.consigneeCity,
                  orderDetail.consigneeCounty,
                  true
                )
              }}
              {{ orderDetail.consigneeAddr }}
          </span>
          
        <span>收货人：{{ orderDetail.consigneeName }}</span>
        <span>{{ orderDetail.consigneePhone }}</span>
      </p>
      <div>
        <span class="product-name-title">商品名称：</span>
        <div class="product-name-list">
          <span v-for="item in orderDetail.productName" :key="item">{{
            item
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
import timer from "@/views/components/timer"
import { getAddressName } from "@/utils/address";
// import Timer from '@/views/components/timer.vue';
export default {
  name:"corderinfo",
  data() {
    return {
      showDetail: false,
      // orderInfo:{},
      // orderDetail:{},
      orderTimeCount:0,
      // endTime:'121061'
    };
  },
  props:[
    'orderInfo',
    'orderDetail'
  ],
  // watch: {
  //   orderTimeCount: function (newVal) {
  //     if (newVal === 0) {
  //       clearInterval(this.orderTimer);
  //       this.$router.push({ path: "/order/list", query: { type: 0 } });
  //     }
  //   },
  // },
  computed: {
    getAddress: function () {
      return getAddressName;
    },
  },
  components:{
    timer
  },
  mounted(){
    // let datajson = { timer: 3365, date: 2344 };
    this.orderTimeCount = this.orderInfo.failureTime;
    if (this.orderTimeCount > 0) {
      this.orderTimer = setInterval(() => {
        this.orderTimeCount--;
      }, 1000);
    }

    
  },
  filters:{
    format(val){
      let d = val/(60*60*24);
      let h = val/(60*60);
      let m = val/(60);
      let s = val%60;
      if(val/60/60/24>1){

      }
    }
  },
  methods: {
    viewDetail() {
      if (this.showDetail) {
        this.showDetail = false;
      } else {
        this.showDetail = true;
      }
    },
  },
};
</script>
<style scoped>
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
.product-name-title {
  display: inline-block;
  vertical-align: top;
  margin-right: 0!important;
}
.product-name-list {
  display: inline-block;
  vertical-align: top;
  line-height: 20px;
}
.product-name-list span {
  display: block;
}
</style>