<template>
  <div class="app-container">
    <p class="title text-normal">
      <span>jfdiajkhkd账户名称</span> | <span>我的订单</span>
    </p>

    <el-card class="box-card text-normal" style="clear: both">
      <div class="order-info">
        <span class="info">
          订单提交成功，请尽快付款！订单号：154561619986</span
        >
        <span class="right"
          >应付金额：<strong class="text-danger" style="font-size: 24px"
            >￥139.00 </strong
          >元</span
        >
      </div>
      <div class="order-info">
        <div style="line-height:40px">
          请您在
          <span class="order-timer text-danger">23分01秒</span>
          内完成支付，否则订单会被自动取消
        </div>

        <span  :class="['right', { 'text-blue': showDetail }]" @click="viewDetail"
          >订单详情
          <svg-icon v-if="showDetail" name="icon-shang"></svg-icon>
          <svg-icon v-else name="icon-xia"></svg-icon>
        </span>
      </div>
      <el-divider></el-divider>
      <div class="order-detail" v-show="showDetail">
        <p>
          <span
            >收货地址：北京朝阳区小红门乡小红门鸿博家园D区7号楼2单元2301</span
          >
          <span>收货人：**绪</span>
          <span>****2562</span>
        </p>
        商品名称：大艺电动扳手2106-5无刷锂电扳手电动螺丝刀冲击扳手套筒起子工具冲击钻无线钻孔机手持家用手电钻工具
        无刷扳手（88F双电标配+套筒礼包）,德阳酱油 树德森酱油
        纯粮酿造味极鲜调味汁 原味晒露黄豆酱油1.8L/瓶 720天阳光自然酿造
        黄豆酱油680ml+陈醋680ml【2瓶组合装
      </div>
      <el-card style="margin-top: 20px">
        <p><strong>在线支付</strong></p>

        <div class="online">
          <div class="item" @click="openPay">
            <img style="width: 100px" src="../../assets/images/vchat.png" />
          </div>
          <div class="item">
            <img style="width: 100px" src="../../assets/images/alipay.png" />
          </div>
          <div class="item">
            <img style="width: 100px" src="../../assets/images/paypal.png" />
          </div>
        </div>
        <p><strong>线下支付</strong></p>
        <div class="offline">
          <div class="item">
            <img style="width: 100px" src="../../assets/images/bank.png" />
          </div>
          <div class="item">
            <img style="width: 100px" src="../../assets/images/money.png" />
          </div>
          <div class="item">
            <img
              style="width: 100px"
              src="../../assets/images/WesternUnion.png"
            />
          </div>
        </div>
      </el-card>
    </el-card>
    <el-dialog title="" :visible.sync="dialogVisible" width="530px">
      <div class="text-normal" style="text-align: center">
        <div class="pop-title">支付宝支付</div>
        <p class="pop-info">
          1、如果未完成付款，请点击继续付款
          <br />2、如果您已完成，请点击“已完成付款”
        </p>
        <p>
          <el-button
            type="primary"
            style="margin-right: 30px"
            @click="dialogVisible = false"
            >重新支付</el-button
          >
          <el-button type="primary" plain @click="dialogVisible = false"
            >已完成付款</el-button
          >
        </p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showDetail: false,
      dialogVisible: false,
    };
  },
  methods: {
    openPay() {
      this.dialogVisible = true;
    },
    viewDetail() {
      if (this.showDetail) {
        this.showDetail = false;
      } else {
        this.showDetail = true;
      }
    },
    timerCount(maxtime) {
      if (maxtime > 0) {
        let mins = Math.floor(maxtime / 60);
        let seconds = Math.floor(maxtime % 60);
        --maxtime;
      } else {
        clearInterval();
      }
    },
    // var maxtime = 10 * 60; //
    //    function CountDown() {
    //      if (maxtime >= 0) {
    //        minutes = Math.floor(maxtime / 60);
    //        seconds = Math.floor(maxtime % 60);
    //        msg =  minutes + "分" + seconds + "秒";
    //        document.all["timer"].innerHTML = msg;

    //          --maxtime;
    //      } else{
    //        clearInterval(timer);
    //        alert("时间到，结束!");
    //      }
    //    }
    //    timer = setInterval("CountDown()", 1000);
  },
};
</script>
<style scoped>

.online,
.offline{
  margin-bottom:150px;
}
.online .item,
.offline .item {
  display: inline-block;
  vertical-align: middle;
  width: 180px;
}
.online::after {
  display: block;
  content: "";
  clear: both;
}
.pop-info {
  width: 300px;
  text-align: left;
  margin: 10px auto 30px auto;
  line-height: 20px;
}
.pop-title {
  font-size: 20px;
  margin-bottom: 30px;
}
.title {
  float: right;
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
  cursor:pointer
}
.order-detail {
  line-height: 20px;
}
.order-detail span {
  margin-right: 10px;
}
</style>

