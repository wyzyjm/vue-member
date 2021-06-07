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
      v-for="(data) in list"
      :key="data.id"
      :id="data.id"
      class="order">
          <div class="order-id">
            <span>下单时间：{{data.createTime}}</span><span class="ml-20">订单号：{{data.orderNumber}}</span>
          </div>
          <ul class="order-list">
            <li class="order-item">
              <div class="goods">
                <div 
                v-for="(item, i) in data.orderProductSkuList"
                :key="i"
                class="goods-information">
                  <div class="goods-cont">
                    <a :href="item.goodsUrl" class="goods-img">
                      <custom-img :src="item.skuImg"></custom-img>
                    </a>
                    <div class="goods-title">
                      <p>{{item.skuName}}</p>
                      <p class="col-9">
                        <span 
                        v-for="(skuSpec, s) in item.skuSpec"
                        :key="s"
                        >
                        {{skuSpec.specName}}：{{skuSpec.specValue}}；</span>
                      </p>
                    </div>
                  </div>
                  <div class="col-danger goods-price">
                    <span>{{data.currencySymbol}}{{item.skuPrice}}</span>
                  </div>
                  <div class="goods-num"><span>{{item.quantity}}</span></div>
                </div>
              </div>
              <div><span>{{data.consigneeName}}</span></div>
              <div class="actual-payment">
                <p>¥{{data.sumPayable}}</p>
                <p class="col-9 border-bottom p-y m-y">含运费¥{{data.freight}}</p>
                <p class="col-9">{{data.paymentTypeName}}</p>
              </div>
              <div :class="{'col-danger':data.orderStatus != 3}">
                <span>{{statePayment[data.orderStatus].type}}</span>
              </div>
              <div class="operate">
                <div v-if="data.orderStatus == 0">
                  <p class="p-y col-danger"><svg-icon name="icon-shijian"></svg-icon> 剩余1时58分</p>
                  <el-button type="primary">付款</el-button>
                </div>
                <el-button v-if="data.orderStatus == 2" type="primary" @click.prevent="confirmReceipt(data.id)">确认收货</el-button>
                <el-button type="text" @click.prevent="viewOrder(data.id)">查看订单</el-button>
                <el-popover
                  v-if="data.orderStatus == 2" 
                  placement="bottom-end"
                  width="200"
                  trigger="hover">
                    <el-timeline :reverse="reverse">
                      <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :timestamp="activity.timestamp">
                        {{activity.content}}
                      </el-timeline-item>
                    </el-timeline>
                  <el-button type="text" slot="reference" @click.prevent="checkLogistics">查看物流</el-button>
                </el-popover>
                <el-button v-else-if="data.orderStatus != 3" type="text" @click.prevent="cancelOrder">取消订单</el-button>
              </div>
            </li>
          </ul>
      </li>
    </ul>
  </div>
</template>

<script>

import customImg from '@/components/CustomImg'
import svgIcon from '@/components/SvgIcon'

export default {
  data() {
    return {
      showAlt: false,
      // 订单状态
      statePayment: {
        0: {
          type: '待付款'
        },
        1: {
          type: '待发货'
        },
        2: {
          type: '待收货'
        },
        3: {
          type: '已完成'
        },
        4: {
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
  components: {
    customImg,
    svgIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
  },
  methods: {
    viewOrder(id) {
      this.$router.push(`/order/detail?orderId=${id}`)
    },
    checkLogistics(id) {
      console.log(id);
      this.$router.push('/order/detail')
    },
    confirmReceipt(id) {
      console.log(id);
      this.$confirm('确认收到所有商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          console.log('确认成功!');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });          
        });
    },
    cancelOrder() {
      this.$confirm('确定取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        console.log('订单取消成功!');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });          
      });
    }
  },
  showAltType(i) {
    console.log(i)
    this.showAlt = this.showAlt;
  }
};
</script>

<style lang="scss" scoped>
*{
  padding: 0;
  margin: 0;
}
ul,li{
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