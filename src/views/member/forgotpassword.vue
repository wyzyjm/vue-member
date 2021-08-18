<template>
  <div class="app-container" style="width: 600px; margin: 50px auto">
    <ce-steps :active="active" :datalist="dataPwd" style="width: 100%" />
    <div style="width: 400px; margin: 0 auto">
      <div v-if="active == 0" style="text-align: center; line-height: 40px">
        <svg-icon name="icon-anquanzhuye" class="icon" setsize="60" />
        <p v-if="type == 'phone'">为确认是您本人安全，请输入您常用手机号</p>
        <p v-else>为确认是您本人安全，请输入您常用邮箱</p>
      </div>
      <div v-if="active == 1">
        <p style="color: rgb(230, 162, 60)">
          密码设置为8-20位，并且由字母，数字和符号两种以上组合
        </p>
      </div>
      <el-form
        v-if="active == 0"
        :model="validateForm"
        :rules="validateRules"
        ref="validateForm"
        label-width="100px"
      >
        <el-form-item v-if="type == 'phone'" label="手机" prop="name">
          <el-input
            placeholder=""
            v-model="validateForm.name"
            class="input-with-select"
          >
            <el-select
              v-model="validateForm.prename"
              slot="prepend"
              filterable
              placeholder="请选择"
              style="width: 90px"
            >
              <el-option
                v-for="(item, index) in countries"
                :key="index"
                :label="item.dialCode"
                :value="item.dialCode + ',' + item.iso2"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="邮箱" prop="mail">
          <el-input placeholder="请输入邮箱" v-model="validateForm.mail">
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input placeholder="请输入验证码" v-model="validateForm.code">
            <span
              v-show="!showTimer"
              slot="append"
              @click="getCode"
              style="cursor: pointer"
              >获取验证码</span
            >
            <span slot="append" v-show="showTimer">{{ count }}s</span>
          </el-input>
        </el-form-item>
        <div style="width: 100%; margin: 0 auto">
          <el-button
            type="primary"
            style="width: 100%; margin: 0 auto"
            @click="goNext()"
            >下一步</el-button
          >
        </div>
      </el-form>
      <el-form
        v-show="active == 1"
        label-width="120px"
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        :rules="rules"
      >
        <el-form-item label="设置新密码" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <div style="width: 300px; margin: 0 auto">
          <el-button plain type="primary" style="width: 130px" @click="goPre()"
            >上一步</el-button
          >
          <el-button
            type="primary"
            style="width: 130px; margin-left: 20px"
            @click="submitForm('ruleForm')"
            >确 认</el-button
          >
        </div>
      </el-form>
      <div
        v-if="active == 2"
        style="
          width: 300px;
          margin: 20px auto;
          text-align: center;
          line-height: 50px;
        "
      >
        <svg-icon name="icon-caozuochenggong" class="icon" setsize="60" />
        <p style="margin-top: 20px">找回密码成功</p>
        <div>
          <el-button type="primary" style="width: 100%">重新登录</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showCode" width="400px" center>
      <div style="width: 310px; margin: 0 auto">
        <slide-verify
          v-if="showCode"
          :l="42"
          :r="10"
          :w="310"
          :h="155"
          :imgs="codeImgs"
          slider-text="向右滑动"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
        ></slide-verify>
        <!-- <div>{{ msg }}</div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ceSteps from "@/components/CeSteps";
import svgIcon from "@/components/SvgIcon";
import { countries } from "@/views/components/resource/phoneCodeCountries-zhCN"; // 手机区号
import { emailValidate, validatePassType } from "@/utils/index";
import {
  getRandomCaptcha,
  getByAccountRSA,
  saveLoginPwdRSA,
  checkForgetPwdRSA,
  generateCode,
} from "@/api/password";

import { addAddressList } from "@/api/address";
import { captchaImgs } from "@/utils/get-captcha";
import { setRSApass } from "@/utils/rsa";

export default {
  components: {
    ceSteps,
    svgIcon,
  },

  data() {
    var validateName = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("手机号不能为空"));
      } else {
        if (!/^\d{6,12}$/.test(value)) {
          return callback(new Error("请输入正确的手机号格式"));
        } else {
          callback();
        }
      }
    };
    var validateMail = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("邮箱不能为空"));
      } else {
        if (!emailValidate(value)) {
          return callback(new Error("邮箱格式不正确！"));
        } else {
          callback();
        }
      }
    };
    var validateCode = (rule,value,callback)=>{
      if(value==''){
        return callback(new Error('验证码不能为空'))
      }else{
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      console.log(rule, value);
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (!validatePassType(value)) {
          callback(new Error("8-20位，并且由字母，数字和符号两种以上组合"));
        } else if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
          callback();
        } else {
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      validateForm: {
        name: "",
        prename: "+86,CN",
        code: "",
        mail: "",
      },
      countries: countries,
      dataPwd: [
        {
          title: "验证身份",
          description: "",
        },
        {
          title: "重置密码",
          description: "",
        },
        {
          title: "完成",
          description: "",
        },
      ],
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      validateRules: {
        name: [{ validator: validateName, trigger: "blur" }],
        mail: [{ validator: validateMail, trigger: "blur" }],
        code:[{validator:validateCode,trigger:'blur'}]
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      type: "phone",
      msg: "",
      showCode: false,
      codeImgs: captchaImgs,
      codeNum: null,
      uuid: null,
      showTimer: false,
      count: 60,
    };
  },
  created() {},
  mounted() {
    this.type = this.$route.query.type;
  },
  methods: {
    validateName() {
      if (
        this.validateForm.name !== "" &&
        /\d{6,12}/.test(this.validateForm.name)
      ) {
        return true;
      } else {
        return false;
      }
    },

    getCode() {
      if (this.type == "phone") {
        if (this.validateName()) {
          this.getByAccountRSA();
        }
      } else {
        if (emailValidate(this.validateForm.mail)) {
          this.getByAccountRSA();
        }
      }
    },
    //匹配账号是否存在
    getByAccountRSA() {
      let params = {};
      if (this.type == "phone") {
        var type = 2;
        var account = this.validateForm.name;
      } else {
        var type = 3;
        var account = this.validateForm.mail;
      }
      let str = `account=${account}&category=2&mobilePrefix=${this.validateForm.prename}&type=${type}`;
      console.log(str);
      params.rsaCode = setRSApass(str);
      getByAccountRSA(params).then((res) => {
        if (res.status == 200) {
          if (res.data.code == "200") {
            this.showCode = true;
            this.onRefresh();
            //当账号存在时，打开滑块验证码界面，并且获取服务端随机验证码标识
            this.getRandomCaptcha();
          } else {
            this.$message({
              message: "账号不存在",
              type: "error",
            });
          }
        }
      });
    },
    //获取随机验证码标识
    getRandomCaptcha() {
      getRandomCaptcha().then((res) => {
        if (res.status == 200) {
          this.codeNum = res.data.captcha;
          this.uuid = res.data.uuid;
        }
      });
    },
    //滑块验证码通过后发送短信验证码
    onSuccess() {
      this.showCode = false;
      let params = {};
      params.bizType = this.type == "phone" ? "mobile" : "email";
      params.email = this.validateForm.mail;
      params.mobile = this.validateForm.name;
      params.mobilePrefix = this.validateForm.prename;
      params.randomCaptcha = this.codeNum;
      params.uuid = this.uuid;

      generateCode(params).then((res) => {
        if (res.status == 200) {
          this.showTimer = true;
          const TIMER_COUNT = 60;
          this.count = TIMER_COUNT;
          let timer = setInterval(() => {
            if (this.count > 1) {
              this.count--;
            } else {
              clearInterval(timer);
              this.showTimer = false;
            }
          }, 1000);
          this.$message({
            message: "验证码发送成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "验证码发送失败",
            type: "error",
          });
        }
      });
    },
    onFail() {
      this.msg = "";
    },
    onRefresh() {
      this.msg = "";
    },
    //下一步按钮，验证会员是否可以重置密码
    goNext() {
      let params = {};
      if (this.type == "phone") {
        var type = 2;
        var account = this.validateForm.name;
      } else {
        var type = 3;
        var account = this.validateForm.mail;
      }

      if (type == 2) {
        if (
          !/^\d{6,12}$/.test(this.validateForm.name) ||
          account == "" ||
          this.validateForm.code == ""
        ){
          this.$refs.validateForm.validateField('name');
          this.$refs.validateForm.validateField('code');
          return false;
        }
      } else {
        if (
          !emailValidate(this.validateForm.mail) ||account==''||
          this.validateForm.code == ""
        ){
           this.$refs.validateForm.validateField('mail');
          this.$refs.validateForm.validateField('code');
          return false;
        }
      }

      let str = `account=${account}&randomCaptcha=${this.codeNum}&uuid=${this.uuid}&mobilePrefix=${this.validateForm.prename}&retrieveType=${type}&verificationCode=${this.validateForm.code}`;
      params.rsaCode = setRSApass(str);
      console.log(setRSApass(str));
      console.log(str);
      checkForgetPwdRSA(params).then((res) => {
        if (res.status == 200) {
          if (res.data.code == "200") {
            this.$refs["validateForm"].clearValidate();
            this.$refs["ruleForm"].clearValidate();
            this.active = 1;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        }
      });
    },
    goPre() {
      this.$refs["ruleForm"].clearValidate();
      this.active = 0;
    },
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          if (this.type == "phone") {
            var type = 2;
            var account = this.validateForm.name;
          } else {
            var type = 3;
            var account = this.validateForm.mail;
          }
          let str = `account=${account}&confirmPassword=${this.ruleForm.pass}&password=${this.ruleForm.checkPass}&retrieveType=${type}&verificationCode=${this.validateForm.code}`;
          console.log(str);
          params.rsaCode = setRSApass(str);
          saveLoginPwdRSA(params).then((res) => {
            if (res.status == 200) {
              if (res.data.code == "200") {
                this.active = 2;
              }
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 700px;
  margin: 0 auto;
}
.step-icon {
  text-align: center;
  margin: 50px;
  .icon {
    font-size: 150px;
    color: #409eff;
  }
}
.form-list {
  width: 80%;
  margin: 0 auto;
  .item-btn {
    margin: 0;
    text-align: center;
  }
  .item-get-code {
    position: relative;
    .get-code-btn {
      position: absolute;
      right: 1px;
      top: 1px;
      border: none;
    }
  }
}
</style>

  