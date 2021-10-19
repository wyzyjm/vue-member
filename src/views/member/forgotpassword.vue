<template>
  <div class="app-container forgetPwd" style="width: 600px; margin: 50px auto">
    <!-- 步骤条 -->
    <ce-steps :active="active" :datalist="dataPwd" style="width: 100%" />

    <div class="content-wrapper">

      <!-- 第一步: 验证 -->
      <div v-if="active == 0" style="text-align: center; line-height: 40px">
        <svg-icon name="icon-anquanzhuye" class="icon" setsize="60" />
        <p v-if="type == 'phone'">{{$t('member_forgotpassword_1')}}</p>
        <p v-else>{{$t('member_forgotpassword_2')}}</p>
      </div>
      <!-- 第二步: 重置 -->
      <div v-if="active == 1">
        <p style="color: rgb(230, 162, 60)">{{$t('member_forgotpassword_3')}}</p>
      </div>
      <!-- 第一步 -->
      <el-form
        v-if="active == 0"
        ref="validateForm"
        :model="validateForm"
        :rules="validateRules"
        label-width="100px"
      >
        <!-- 手机 -->
        <el-form-item v-if="type == 'phone'" :label="$t('member_forgotpassword_4')" prop="name">
          <el-input
            v-model="validateForm.name"
            placeholder=""
            class="input-with-select"
          >
            <el-select
              slot="prepend"
              v-model="validateForm.prename"
              filterable
              :placeholder="$t('member_forgotpassword_5')"
              style="width: 90px"
            >
              <el-option
                v-for="(item, index) in countries"
                :key="index"
                :label="item.dialCode"
                :value="item.dialCode + ',' + item.iso2"
              >
                <span style="float:left;padding-right:15px"> {{ item.dialCode }} </span>
                <span style="float: right; color: rgb(132, 146, 166); font-size: 13px;">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item v-else :label="$t('member_forgotpassword_6')" prop="mail">
          <el-input v-model="validateForm.mail" :placeholder="$t('member_forgotpassword_7')" />
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item :label="$t('member_forgotpassword_8')" prop="code">
          <el-input v-model="validateForm.code" :placeholder="$t('member_forgotpassword_9')">
            <!-- 获取验证码 -->
            <span
              v-show="!showTimer"
              slot="append"
              style="cursor: pointer"
              @click="getCode"
            > {{ btntxt }} </span>
            <!-- 计时 -->
            <span v-show="showTimer" slot="append">{{ count }}s</span>
          </el-input>
        </el-form-item>
        <!-- 下一步 -->
        <div style="width: 100%; margin: 0 auto">
          <el-button
            type="primary"
            style="width: 100%; margin: 0 auto"
            @click="goNext()"
          >{{$t('member_forgotpassword_10')}}</el-button>
        </div>
      </el-form>
      <!-- 第二步: 表单 -->
      <el-form
        v-show="active == 1"
        ref="ruleForm"
        label-width="120px"
        :model="ruleForm"
        status-icon
        :rules="rules"
      >
        <el-form-item :label="$t('member_forgotpassword_11')" prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            :placeholder="$t('member_forgotpassword_12')"
          />
        </el-form-item>
        <el-form-item :label="$t('member_forgotpassword_13')" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
            :placeholder="$t('member_forgotpassword_12')"
          />
        </el-form-item>
        <div style="width: 300px; margin: 0 auto">
          <el-button
            plain
            type="primary"
            style="width: 130px"
            @click="goPre()"
          >{{$t('member_forgotpassword_14')}}</el-button>
          <el-button
            type="primary"
            style="width: 130px; margin-left: 20px"
            @click="submitForm('ruleForm')"
          >{{$t('member_forgotpassword_15')}}</el-button>
        </div>
      </el-form>
      <!-- 第二步: 完成 -->
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
        <p style="margin-top: 20px">{{$t('member_forgotpassword_16')}}</p>
        <div>
          <el-button
            type="primary"
            style="width: 100%"
            @click="goLogin"
          >{{$t('member_forgotpassword_17')}}</el-button>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog :visible.sync="showCode" width="400px" center>
      <div style="width: 310px; margin: 0 auto">
        <slide-verify
          v-if="showCode"
          :l="42"
          :r="10"
          :w="310"
          :h="155"
          :imgs="codeImgs"
          slider-:text="$t('member_forgotpassword_18')"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ceSteps from '@/components/CeSteps' // 步骤条
import svgIcon from '@/components/SvgIcon' // 图标
import { countries } from '@/views/components/resource/phoneCodeCountries-zhCN' // 手机区号
import { emailValidate, validatePassType } from '@/utils/index' // 工具方法
import {
  getRandomCaptcha,
  getByAccountRSA,
  saveLoginPwdRSA,
  checkForgetPwdRSA,
  generateCode
} from '@/api/password'

// import { addAddressList } from '@/api/address'
import { captchaImgs } from '@/utils/get-captcha'
import { setRSApass } from '@/utils/rsa'

export default {
  components: {
    ceSteps,
    svgIcon
  },

  data() {
    // 手机号校验
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('member_forgotpassword_19')))
      } else {
        if (!/^\d{6,12}$/.test(value)) {
          return callback(new Error(this.$t('member_forgotpassword_20')))
        } else {
          callback()
        }
      }
    }
    // 邮箱校验
    var validateMail = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error(this.$t('member_forgotpassword_21')))
      } else {
        if (!emailValidate(value)) {
          return callback(new Error(this.$t('member_forgotpassword_22')))
        } else {
          callback()
        }
      }
    }
    // 验证码校验
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error(this.$t('member_forgotpassword_23')))
      } else {
        callback()
      }
    }
    // 第一次输入密码
    var validatePass = (rule, value, callback) => {
      console.log(rule, value)
      if (value === '') {
        callback(new Error(this.$t('member_forgotpassword_24')))
      } else {
        if (!validatePassType(value)) {
          callback(new Error(this.$t('member_forgotpassword_25')))
        } else if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
          callback()
        } else {
          callback()
        }
      }
    }
    // 校验两次密码是否相同
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('member_forgotpassword_26')))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t('member_forgotpassword_27')))
      } else {
        callback()
      }
    }
    return {
      btntxt: this.$t('member_forgotpassword_28'),
      active: 0, // 默认为0,
      // 表单值
      validateForm: {
        name: '', // 手机号
        prename: '+86,CN', // 手机号头部
        code: '',
        mail: ''
      },
      // 手机区号
      countries: countries,
      dataPwd: [
        {
          title: this.$t('member_forgotpassword_29'),
          description: ''
        },
        {
          title: this.$t('member_forgotpassword_30'),
          description: ''
        },
        {
          title: this.$t('member_forgotpassword_31'),
          description: ''
        }
      ],
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      // 表单校验规则
      validateRules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        mail: [{ validator: validateMail, trigger: 'blur' }],
        code: [{ validator: validateCode, trigger: 'blur' }]
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      type: 'phone', // 默认手机 | 邮箱
      msg: '',
      showCode: false,
      codeImgs: captchaImgs,
      codeNum: null,
      uuid: null,
      showTimer: false, // 是否显示数字
      count: 60
    }
  },
  created() {},
  mounted() {
    this.type = this.$route.query.type // 获取类型,  手机 | 邮箱
  },
  methods: {
    validateName() {
      if (
        this.validateForm.name !== '' &&
        /\d{6,12}/.test(this.validateForm.name)
      ) {
        return true
      } else {
        return false
      }
    },
    // 获取验证码
    getCode() {
      if (this.type == 'phone') {
        // 手机校验
        if (this.validateName()) {
          this.exists()
        }
      } else {
        // 邮箱校验
        if (emailValidate(this.validateForm.mail)) {
          this.exists()
        }
      }
    },
    // 匹配账号是否存在
    exists() {
      // eslint-disable-next-line prefer-const
      let dataPrams = {}
      let type = 2
      let account = ''
      if (this.type === 'phone') {
        account = this.validateForm.name
      } else {
        type = 3
        account = this.validateForm.mail
      }
      // eslint-disable-next-line prefer-const
      let str = `account=${account}&category=2&mobilePrefix=${this.validateForm.prename}&type=${type}`
      console.log(str)
      dataPrams.rsaCode = setRSApass(str)
      getByAccountRSA(dataPrams).then((res) => {
        if (res.status === 200) {
          if (res.data.code === '200') {
            this.showCode = true
            this.onRefresh()
            // 当账号存在时，打开滑块验证码界面，并且获取服务端随机验证码标识
            this.getRandomCaptcha()
          } else {
            this.$message({
              message: this.$t('member_forgotpassword_32'),
              type: 'error'
            })
          }
        }
      })
    },
    // 获取随机验证码标识
    getRandomCaptcha() {
      getRandomCaptcha().then((res) => {
        if (res.status == 200) {
          this.codeNum = res.data.captcha
          this.uuid = res.data.uuid
        }
      })
    },
    // 滑块验证码通过后发送短信验证码
    onSuccess() {
      this.showCode = false
      const params = {}
      params.bizType = this.type == 'phone' ? 'mobile' : 'email'
      params.email = this.validateForm.mail
      params.mobile = this.validateForm.name
      params.mobilePrefix = this.validateForm.prename
      params.randomCaptcha = this.codeNum
      params.uuid = this.uuid
      generateCode(params).then((res) => {
        if (res.status == 200) {
          this.showTimer = true
          const TIMER_COUNT = 60
          this.count = TIMER_COUNT
          const timer = setInterval(() => {
            if (this.count > 1) {
              this.count--
            } else {
              clearInterval(timer)
              this.showTimer = false // 计时去除
              this.btntxt = this.$t('member_forgotpassword_33') // 设置文件
            }
          }, 1000)
          this.$message({
            message: this.$t('member_forgotpassword_34'),
            type: 'success'
          })
        } else {
          this.$message({
            message: this.$t('member_forgotpassword_35'),
            type: 'error'
          })
        }
      })
    },
    onFail() {
      this.msg = ''
    },
    onRefresh() {
      this.msg = ''
    },
    // 下一步按钮，验证会员是否可以重置密码
    goNext() {
      const params = {}
      if (this.type == 'phone') {
        var type = 2
        var account = this.validateForm.name
      } else {
        var type = 3
        var account = this.validateForm.mail
      }

      if (type == 2) {
        if (
          !/^\d{6,12}$/.test(this.validateForm.name) ||
          account == '' ||
          this.validateForm.code == ''
        ) {
          this.$refs.validateForm.validateField('name')
          this.$refs.validateForm.validateField('code')
          return false
        }
      } else {
        if (
          !emailValidate(this.validateForm.mail) ||
          account == '' ||
          this.validateForm.code == ''
        ) {
          this.$refs.validateForm.validateField('mail')
          this.$refs.validateForm.validateField('code')
          return false
        }
      }

      const str = `account=${account}&randomCaptcha=${this.codeNum}&uuid=${this.uuid}&mobilePrefix=${this.validateForm.prename}&retrieveType=${type}&verificationCode=${this.validateForm.code}`
      params.rsaCode = setRSApass(str)
      console.log(setRSApass(str))
      console.log(str)
      checkForgetPwdRSA(params).then((res) => {
        if (res.status == 200) {
          if (res.data.code == '200') {
            this.$refs['validateForm'].clearValidate()
            this.$refs['ruleForm'].clearValidate()
            this.active = 1
            this.btntxt = this.$t('member_forgotpassword_28')
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
          }
        }
      })
    },
    // 上一步
    goPre() {
      this.$refs['ruleForm'].clearValidate()
      this.active = 0
    },
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {}
          if (this.type == 'phone') {
            var type = 2
            var account = this.validateForm.name
          } else {
            var type = 3
            var account = this.validateForm.mail
          }
          const str = `account=${account}&confirmPassword=${this.ruleForm.pass}&password=${this.ruleForm.checkPass}&retrieveType=${type}&verificationCode=${this.validateForm.code}`
          console.log(str)
          params.rsaCode = setRSApass(str)
          saveLoginPwdRSA(params).then((res) => {
            if (res.status == 200) {
              if (res.data.code == '200') {
                this.active = 2
              }
            }
          })
        } else {
          return false
        }
      })
    },
    // 去登录
    goLogin() {
      window.location.href = window.location.origin + '/login.html'
    }
  }
}
</script>

<style lang="scss">

.forgetPwd {
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
  .content-wrapper {
    width: 400px;
    margin: 0 auto;
  }
  .content-wrapper .icon {
    color: #409eff;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: transparent;
  }
}
</style>

