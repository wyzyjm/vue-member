<template>
  <div class="content">
    <ce-steps
      :active="active"
      :datalist="dataPhone[phoneType].item"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" />
      <p>
        <span v-if="propData.phoneType === 0">请绑定您的手机号码</span>
        <span v-else>为确认是您本人操作，请完成身份认证</span>
      </p>
    </div>
    <div v-show="!submitedSuccess" class="step-icon">
      <svg-icon name="icon-caozuochenggong" class="icon" />
      <p>设置完成！</p>
      <el-button
        type="primary"
        @click="goHome"
      >返回首页</el-button>
    </div>
    <div v-show="submitedSuccess" class="form-list">
      <!-- 修改手机号 -->
      <!-- <div v-if="propData.type === 'mobile'"> -->
      <el-form ref="formLabelAlign" label-width="80px" :model="formLabelAlign" class="demo-dynamic">
        <!-- 手机区号 + 手机号 -->
        <el-form-item v-if="phoneType === 0 || active === 1" label="手机号">
          <!-- select选择器+文本框 -->
          <el-col :span="7">
            <el-form-item
              prop="consigneePhoneHead"
              :rules="{
                required: phoneType === 0 ? true : isConsigneePhoneHead, message: '请选择', trigger: 'blur'
              }"
            >
              <el-select
                v-model="formLabelAlign.consigneePhoneHead"
                placeholder="请选择"
                filterable
              >
                <el-option
                  v-for="(item, index) in frontData.phoneCode"
                  :key="index"
                  :label="item.dialCode"
                  :value="`${item.dialCode},${item.iso2}`"
                >
                  <span> {{ item.dialCode }} {{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="16">
            <el-form-item
              prop="consigneePhone"
              :rules="{
                required: phoneType === 0 ? true : isConsigneePhone, message: '请输入您的手机号码', trigger: 'blur'
              }"
            >
              <el-input
                v-model.trim="formLabelAlign.consigneePhone"
                type="tel"
                placeholder="请输入您的手机号码"
                @input="checkInputValue('consigneePhone')"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-else label="手机号">
          <span>{{ setdata.phoneHead ? '+' : '' }}{{ setdata.phoneHead.substring(0,setdata.phoneHead.lastIndexOf(",")) }} {{ setdata.phone }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="phoneYzm"
          class="item-get-code"
          :rules="{
            required: true, message: '验证码不能为空', trigger: 'blur'
          }"
        >
          <el-input
            v-model="formLabelAlign.phoneYzm"
            placeholder="短信验证码"
          />
          <el-button class="get-code-btn" @click="getVerfyCode">{{ btnText }}</el-button>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button
            type="primary"
            plain
            @click="cancel"
          >取消</el-button>
          <el-button
            v-show="!hasSubmited"
            type="primary"
            @click="next('formLabelAlign')"
          >下一步</el-button>
          <el-button
            v-show="hasSubmited"
            type="primary"
            @click="submitForm('formLabelAlign')"
          >保存</el-button>
        </el-form-item>
      </el-form>
      <!-- </div> -->
    </div>
  </div>
</template>
<script>
import countryData from '@/views/components/resource/locList_zh_CN' // 国家
import { countries } from '@/views/components/resource/phoneCodeCountries' // 手机区号
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import { generateCode, validateVerifyCode, bingling, unbundling } from '@/api/member'

export default {
  components: {
    ceSteps,
    svgIcon
  },
  props: {
    setdata: {
      type: Object,
      required: true
    }
  },
  data() {
    // 校验 手机号
    var checkPhone = (rule, value, callback) => {
      if (!value || value.indexOf('*') > 0) return callback()
      if (value && !/^\d{0,11}$/.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      bizId: this.setdata.bizId,
      propData: this.setdata,
      active: 0,
      phoneType: this.setdata.phoneType,
      hasSubmited: false,
      submitedSuccess: true,
      btnText: '获取验证码',
      btnDisabled: false,
      isConsigneePhone: false, // 是否验证手机号
      isConsigneePhoneHead: false, // 验证手机区号
      formLabelAlign: {
        phoneYzm: '',
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '' // 手机号
      },
      dataPhone: {
        0: {
          item: [
            {
              title: '绑定手机',
              description: ''
            },
            {
              title: '更换成功',
              description: ''
            }
          ]
        },
        1: {
          item: [
            {
              title: '验证身份',
              description: ''
            },
            {
              title: '更换手机',
              description: ''
            },
            {
              title: '更换成功',
              description: ''
            }
          ]
        },
        2: {
          item: [
            {
              title: '验证身份',
              description: ''
            },
            {
              title: '解绑成功',
              description: ''
            }
          ]
        }
      },
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      rules: {
        // 手机号头部
        consigneePhoneHead: [
          { required: true, trigger: 'blur' }
        ],
        // 手机号
        consigneePhone: [
          { required: false, validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 省市区数据
      frontData: {
        conuntryOptions: countryData.Location.CountryRegion, // 国家
        province: [], // 省
        city: [], // 市
        phoneCode: countries // 手机区号
      }
    }
  },
  methods: {
    // 修改密码
    submitForm(formName) {
      if (this.formLabelAlign.consigneePhoneHead === '') {
        this.$message('区号不能为空1！')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            bizId: this.bizId,
            bizType: this.propData.type,
            mobilePrefix: this.formLabelAlign.consigneePhoneHead, // 手机号前缀
            mobile: this.formLabelAlign.consigneePhone, // 手机号
            verifyCode: this.formLabelAlign.phoneYzm
          }
          bingling(data).then(res => {
            this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
            if (res.data === 1) {
              this.onSubmit()
            }
          })
        } else {
          return false
        }
      })
    },
    // 下一步
    /*
    * bizType // 业务类型 mobile:手机， email:邮箱
    *
    */
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.propData.phoneType === 2) {
            const data = {
              bizId: this.bizId,
              bizType: this.propData.type,
              verifyCode: this.formLabelAlign.phoneYzm
            }
            unbundling(data).then(res => { // 解除绑定
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.goHome()
              }
            })
          } else {
            this.checkCode()
          }
        } else {
          return false
        }
      })
    },
    onSubmit() {
      if (this.active++ > 2) this.active = 2
      this.submitedSuccess = false
    },
    // 校验验证码接口
    checkCode() {
      let data = {}
      if (this.phoneType === 0) {
        this.submitForm('formLabelAlign')
      } else {
        data = {
          bizId: this.bizId,
          bizType: this.propData.type,
          verifyCode: this.formLabelAlign.phoneYzm
        }
        validateVerifyCode(data).then(res => {
          if (res.data) {
            if (this.active++ >= 0) this.hasSubmited = true
            this.formLabelAlign.phoneYzm = ''
            this.formLabelAlign.consigneePhone = ''
            clearInterval(this.setIntID)
            this.btnText = '获取验证码'
            this.btnDisabled = false
            this.isConsigneePhone = true
            this.isConsigneePhoneHead = true
          } else {
            this.$message('验证失败！')
          }
        })
      }
    },
    // 获取验证码
    getVerfyCode() {
      if (this.phoneType === 0 && this.active === 0 && this.formLabelAlign.consigneePhoneHead === '') {
        // this.$message('区号不能为空！')
        this.$refs['formLabelAlign'].validate((valid) => {
          if (valid) {
            return true
          } else {
            return false
          }
        })
        return
      }
      if (this.phoneType === 0 && this.active === 0 && this.formLabelAlign.consigneePhone === '') {
        // this.$message('请输入您的手机号码！')
        this.$refs['formLabelAlign'].validate((valid) => {
          if (valid) {
            return true
          } else {
            return false
          }
        })
        return
      }
      if (this.phoneType === 1 && this.active === 1 && this.formLabelAlign.consigneePhoneHead === '') {
        // this.$message('区号不能为空！')
        this.$refs['formLabelAlign'].validate((valid) => {
          if (valid) {
            return true
          } else {
            return false
          }
        })
        return
      }
      if (this.phoneType === 1 && this.active === 1 && this.formLabelAlign.consigneePhone === '') {
        // this.$message('请输入您的手机号码！')
        return
      }
      this.queryData()
    },
    // 接口获取验证码
    queryData() {
      let data = {}
      if (this.setdata.phoneType === 0 || this.active === 1) {
        data = {
          bizType: this.propData.type,
          mobilePrefix: this.formLabelAlign.consigneePhoneHead.replace('+', ''), // 手机号前缀
          mobile: this.formLabelAlign.consigneePhone // 手机号
        }
      } else {
        data = {
          bizId: this.bizId,
          bizType: this.propData.type
        }
      }
      generateCode(data).then(res => {
        if (res.data) {
          if (this.btnDisabled) return
          this.btnDisabled = true
          this.btnText = '60s后重新获取'
          let count = 60
          this.setIntID = setInterval(() => {
            count--
            if (count === 0) {
              clearInterval(this.setIntID)
              this.btnText = '获取验证码'
              this.btnDisabled = false
              return
            }
            this.btnText = count < 10 ? `0${count}s后重新获取` : `${count}s后重新获取`
          }, 1000)
        } else {
          this.$message('发送失败，请稍后重试！')
        }
      })
    },
    goHome() {
      this.$refs['formLabelAlign'].resetFields()
      this.$parent.isShow = true
      location.reload()
    },
    cancel() {
      this.$refs['formLabelAlign'].resetFields()
      this.$parent.isShow = true
    },
    // 检验只能输入数字
    checkInputValue(typeName) {
      this.formLabelAlign[typeName] = this.formLabelAlign[typeName].replace(/[^\d]/g, '') // 只能输入数字
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
    width: 700px;
    margin: 0 auto;
}
.step-icon{
    text-align: center;
    margin: 50px;
    .icon{
        font-size: 150px;
        color: #409EFF;
    }
}
.form-list{
    width: 80%;
    margin: 0 auto;
    .item-btn{
        margin: 0;
        text-align: center;
    }
    .item-get-code{
        position: relative;
        .get-code-btn{
            position: absolute;
            right: 1px;
            top: 1px;
            border: none;
        }
    }
}
</style>
