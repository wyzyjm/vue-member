<template>
  <div>
    <div class="order-info">
      <span class="info">{{$t('payment_components_orderinfo_1')}}<!-- 订单号：{{ orderInfo.orderNo }} -->
      </span>
      <span class="right"
        >{{$t('payment_components_orderinfo_2')}}<strong class="text-danger" style="font-size: 24px"
          >{{ orderInfo.currencySymbol }}{{ orderInfo.amount }}
        </strong></span
      >
    </div>

    <div class="order-info">
      <template v-if="orderInfo.failureTime !== '0'">
        <div style="line-height: 40px">{{$t('payment_components_orderinfo_3')}}<span class="order-timer text-danger">
            <timer
              :endTime="parseInt(freshTime)"
              @timeEnd="
                $router.push({ path: '/order/list', query: { type: 0 } })
              "
              v-if="parseInt(freshTime) > 0"
            ></timer>
          </span>{{$t('payment_components_orderinfo_4')}}</div>
      </template>
    </div>
    <el-collapse accordion style="margin-top: 20px">
      <el-collapse-item v-for="item in orderItemList" :key="item.orderId">
        <template slot="title">{{$t('payment_components_orderinfo_5')}}<span style="font-weight: 700; margin-right: 30px"
            >{{ item.orderNo }}
          </span>
          <template v-if="orderItemList.length > 1">{{$t('payment_components_orderinfo_6')}}<span class="text-danger"
              >{{ orderInfo.currencySymbol }}{{ item.payableTotalAmount }}</span
            >
          </template>
          <span class="text-blue" style="flex: 1; text-align: right"
            >{{$t('payment_components_orderinfo_7')}}</span
          >
        </template>
        <p>
          <template v-if="orderDetail.reverseFlag">
            <span
              >{{$t('payment_components_orderinfo_8', [ orderDetail.consigneeAddr
              ,
                getAddress(
                  orderDetail.consigneeCountry,
                  orderDetail.consigneeProvince,
                  orderDetail.consigneeCity,
                  orderDetail.consigneeCounty,
                  orderDetail.reverseFlag
                )
              ])}}</span>
          </template>
          <template v-else>
            <span
              >{{$t('payment_components_orderinfo_9', [
                getAddress(
                  orderDetail.consigneeCountry,
                  orderDetail.consigneeProvince,
                  orderDetail.consigneeCity,
                  orderDetail.consigneeCounty,
                  orderDetail.reverseFlag
                )
              , orderDetail.consigneeAddr ])}}</span>
          </template>

          <span style="margin-right:10px">{{$t('payment_components_orderinfo_10', [ orderDetail.consigneeName ])}}</span>
          
          <template v-if="orderDetail.consigneePhone !== ''">
            <template v-if="orderDetail.consigneePhoneHead !== undefined">
              <span
                >+{{ orderDetail.consigneePhoneHead.split("+")[1] }}-{{
                  orderDetail.consigneePhone
                }}</span
              >
            </template>
          </template>
          <template v-else>
            <template v-if="orderDetail.consigneeTelHead !== undefined">
              <span
                >+{{ orderDetail.consigneeTelHead.split("+")[1] }}-{{
                  orderDetail.consigneeTel
                }}</span
              >
            </template>
          </template>
        </p>
        <div>
          <span class="product-name-title">{{$t('payment_components_orderinfo_11')}}</span>
          <div class="product-name-list">
            <span v-for="name in item.productName" :key="name">{{ name }}</span>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script >
import timer from "@/views/components/timer";
import { getAddressName } from "@/utils/address";
// import Timer from '@/views/components/timer.vue';
export default {
  name: "corderinfo",
  data() {
    return {
      showDetail: false,
      // orderInfo:{},
      // orderDetail:{},
      orderTimeCount: 0,
      // endTime:'121061'
      freshTime: 0,
    };
  },
  props: ["orderInfo", "orderDetail", "orderItemList"],
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
  components: {
    timer,
  },
  mounted() {
    this.freshTime =
      this.orderInfo.createTime / 1000 +
      Number(this.orderInfo.failureTime) -
      this.orderInfo.serverTime / 1000;
  },
  filters: {
    format(val) {
      let d = val / (60 * 60 * 24);
      let h = val / (60 * 60);
      let m = val / 60;
      let s = val % 60;
      if (val / 60 / 60 / 24 > 1) {
      }
    },
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
  margin-right: 0 !important;
}
.product-name-list {
  display: inline-block;
  vertical-align: top;
  line-height: 23px;
}
.product-name-list span {
  display: block;
}
</style>