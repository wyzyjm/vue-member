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
        请您在
        <span class="order-timer text-danger">23分01秒</span>
        内完成支付，否则订单会被自动取消
        <el-button type="text" class="right" @click="viewDetail">订单详情
          <svg-icon v-if="showDetail" name="icon-shang"></svg-icon>
          <svg-icon v-else name="icon-xia"></svg-icon>
          </el-button>
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

      <el-card>
        <p class="pay-title">微信支付</p>
        <div class="vchat-wrapper">
          <p>
            距离二维码过期还剩
            <span>57</span> 秒，过期后请刷新页面重新获取二维码
          </p>
          <div class="vchat-img">
            <div class="code">
              <img src="../../assets/images/no-img.svg" />
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
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
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
              <el-button>Pay Later</el-button>
            </el-form-item>
          </el-form>
        </div>
        <span class="el-icon-arrow-left"></span>
        <el-button type="text">选择其他支付方式</el-button>
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
          <el-button type="primary" style="margin-right:30px" @click="dialogVisible = false"
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
      form: {
        firstname: "",
        lastname: "",
        money: "",
        number: "",
        currency: "",
        country: "",
        contents: "",
      },
      showDetail:false,
      dialogVisible: false,
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
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openPay() {
      this.dialogVisible = true;
    },
    viewDetail(){
      if(this.showDetail){
        this.showDetail = false
      }else{
        this.showDetail = true;
      }
    }
  },
};
</script>
<style scoped>
.pop-info{
  width:300px;
  text-align: left;
  margin: 10px auto 30px auto;
  line-height: 20px;
}
.pop-title{
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
}
.order-detail {
  line-height: 20px;
}
.order-detail span {
  margin-right: 10px;
}
.offline-wrapper {
  width: 800px;
  margin: 20px auto;
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
.pay-title {
  font-size: 20px;
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
}
.vchat-img .guide img {
  height: 390px;
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
}
.vchat-bg .text {
  display: inline-block;
  vertical-align: middle;
  line-height: 18px;
}
</style>

