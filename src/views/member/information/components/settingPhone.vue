<template>
  <div class="content">
    <ce-steps
      :active="active"
      :datalist="dataPhone[phoneType].item"
    />
    <!-- 中间图标 + 底部文字 -->
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" setsize="100" />
      <p>
        <span v-if="propData.phoneType === 0">{{$t('member_information_components_settingphone_1')}}</span>
        <span v-else>{{$t('member_information_components_settingphone_2')}}</span>
      </p>
    </div>

    <!-- 修改手机号页面 -->
    <div v-show="submitedSuccess" class="form-list">
      <el-form ref="formLabelAlign" label-width="80px" :model="formLabelAlign" class="demo-dynamic">
        <!-- 绑定手机号 -->
        <el-form-item v-if="phoneType === 0 || active === 1" :label="$t('member_information_components_settingphone_3')">
          <!-- select选择器+文本框 -->
          <el-col :span="7">
            <el-form-item
              prop="consigneePhoneHead"
              :rules="{
                required: phoneType === 0 ? true : isConsigneePhoneHead, message: $t('member_information_components_settingphone_4'), trigger: 'blur'
              }"
            >
              <el-select
                v-model="formLabelAlign.consigneePhoneHead"
                :placeholder="$t('member_information_components_settingphone_4')"
                filterable
              >
                <el-option
                  v-for="(item, index) in frontData.phoneCode"
                  :key="index"
                  :label="item.dialCode"
                  :value="`${item.dialCode},${item.iso2}`"
                >
                  <span style="float:left;padding-right:15px"> {{ item.dialCode }} </span>
                  <span style="float: right; color: rgb(132, 146, 166); font-size: 13px;">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="16">
            <el-form-item
              prop="consigneePhone"
              :rules="{
                required: phoneType === 0 ? true : isConsigneePhone, message: $t('member_information_components_settingphone_5'), trigger: 'blur'
              }"
            >
              <el-input
                v-model.trim="formLabelAlign.consigneePhone"
                type="tel"
                :placeholder="$t('member_information_components_settingphone_5')"
                @input="checkInputValue('consigneePhone')"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <!-- 更换 手机号 -->
        <el-form-item v-else :label="$t('member_information_components_settingphone_3')">
          <span>{{ getPhone }}</span>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item
          :label="$t('member_information_components_settingphone_6')"
          prop="phoneYzm"
          class="item-get-code"
          :rules="{
            required: true, message: $t('member_information_components_settingphone_7'), trigger: 'blur'
          }"
        >
          <el-input
            v-model="formLabelAlign.phoneYzm"
            :placeholder="$t('member_information_components_settingphone_8')"
          />
          <el-button class="get-code-btn" @click="getVerfyCode">{{ btnText }}</el-button>
        </el-form-item>

        <!-- 底部按钮 -->
        <el-form-item class="item-btn">
          <!-- 取消 -->
          <el-button
            type="primary"
            plain
            @click="cancel"
          >{{$t('member_information_components_settingphone_9')}}</el-button>
          <!-- 下一步 -->
          <el-button
            v-show="!hasSubmited"
            type="primary"
            @click="next('formLabelAlign')"
          >{{$t('member_information_components_settingphone_10')}}</el-button>
          <!-- 保存 -->
          <el-button
            v-show="hasSubmited"
            type="primary"
            @click="submitForm('formLabelAlign')"
          >{{$t('member_information_components_settingphone_11')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设置完成 -->
    <div v-show="!submitedSuccess" class="step-icon">
      <svg-icon name="icon-caozuochenggong" class="icon" setsize="100" />
      <p>{{$t('member_information_components_settingphone_12')}}</p>
      <el-button type="primary" @click="goHome">{{$t('member_information_components_settingphone_13')}}</el-button>
    </div>
  </div>
</template>
<script>
import countryData from '@/views/components/resource/locList_zh_CN' // 国家
import { countries } from '@/views/components/resource/phoneCodeCountries-zhCN' // 手机区号
import ceSteps from '@/components/CeSteps' // 侧边栏
import svgIcon from '@/components/SvgIcon' // icon
import { generateCode, validateVerifyCode, bingling, unbundling } from '@/api/member' // 接口

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
  //
  /**
    setdata :{
        memberId: this.data.user.memberId, // 会员id
        type: 'mobile', // 手机
        phoneType: type, // 类型 0:绑定 1:更换 2:解绑
        phone: this.data.user.phone, // 手机
        phoneHead: this.data.user.phoneHead // 手机头部
    }
   */
  data() {
    // 校验 手机号
    var checkPhone = (rule, value, callback) => {
      if (!value || value.indexOf('*') > 0) return callback()
      if (value && !/^\d{0,11}$/.test(value)) {
        return callback(new Error(this.$t('member_information_components_settingphone_14')))
      } else {
        callback()
      }
    }
    return {
      propData: this.setdata, // 传参
      phoneType: this.setdata.phoneType, // 手机类型 0:添加手机号, 1:更换手机号 2:解绑手机号
      active: 0, // ?
      hasSubmited: false,
      submitedSuccess: true, // 页面布局 显示与隐藏
      btnText: this.$t('member_information_components_settingphone_15'), // 获取验证码文字
      btnDisabled: false, // 禁止点击
      isConsigneePhone: false, // 是否验证手机号
      isConsigneePhoneHead: false, // 验证手机区号
      // 传参时用
      formLabelAlign: {
        phoneYzm: '',
        consigneePhoneHead: this.setdata.phoneHead || '', // 手机区号
        consigneePhone: this.setdata.phone || '' // 手机号
      },
      dataPhone: {
        0: {
          item: [
            {
              title: this.$t('member_information_components_settingphone_16'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingphone_17'),
              description: ''
            }
          ]
        },
        1: {
          item: [
            {
              title: this.$t('member_information_components_settingphone_18'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingphone_19'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingphone_17'),
              description: ''
            }
          ]
        },
        2: {
          item: [
            {
              title: this.$t('member_information_components_settingphone_18'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingphone_20'),
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
  // 计算属性
  computed: {
    // 获取手机号 头部 + 手机号
    getPhone() {
      let phone = ''
      if (!this.propData.phone) {
        phone = this.$t('member_information_components_settingphone_21')
        return phone
      }
      if (this.propData.phoneHead) {
        const phoneHead = this.propData.phoneHead.split(',')[0]
        if (phoneHead.includes('+')) {
          phone = phoneHead + ' ' + this.propData.phone
        } else {
          phone = '+' + phoneHead + ' ' + this.propData.phone
        }
      }
      return phone
    }
  },
  // 创建
  created() {
    console.log(this.$t('member_information_components_settingphone_22'), this.setdata)
  },
  methods: {
    // 修改密码
    submitForm(formName) {
      if (this.formLabelAlign.consigneePhoneHead === '') {
        this.$message(this.$t('member_information_components_settingphone_23'))
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            bizId: this.propData.memberId, // 会员id
            bizType: this.propData.type, // 类型
            // mobilePrefix: this.formLabelAlign.consigneePhoneHead.replace('+', ''), // 手机号前缀
            mobilePrefix: this.formLabelAlign.consigneePhoneHead, // 手机号前缀 不去+
            mobile: this.formLabelAlign.consigneePhone, // 手机号
            verifyCode: this.formLabelAlign.phoneYzm // 短信验证码
          }
          bingling(data).then(res => {
            this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg) // 后端提示信息
            if (res.data === 1) {
              this.onSubmit()
            }
          }).catch(error => {
            console.log(this.$t('member_information_components_settingphone_25'), error)
          })
        } else {
          return false
        }
      })
    },
    // 下一步, 校验验证码
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 解绑手机
          if (this.propData.phoneType === 2) {
            const data = {
              bizId: this.propData.memberId, // 会员id
              bizType: this.propData.type,
              verifyCode: this.formLabelAlign.phoneYzm
            }
            unbundling(data).then(res => { // 解除绑定
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.goHome()
              }
            }).catch(error => {
              console.log(this.$t('member_information_components_settingphone_25'), error)
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
      // 绑定手机
      if (this.phoneType === 0) {
        this.submitForm('formLabelAlign')
      } else {
        // 更换手机
        data = {
          bizId: this.propData.memberId, // 会员id
          bizType: this.propData.type, // 业务类型
          verifyCode: this.formLabelAlign.phoneYzm // 验证码
        }
        // 校验 验证码
        validateVerifyCode(data).then(res => {
          if (res.data) {
            // 验证成功
            if (this.active++ >= 0) this.hasSubmited = true
            this.formLabelAlign.phoneYzm = '' // 清空验证码
            this.formLabelAlign.consigneePhone = '' // 清空手机号
            this.formLabelAlign.consigneePhoneHead = '' // 清空手机号头部
            clearInterval(this.setIntID) // 清除定时器
            this.btnText = this.$t('member_information_components_settingphone_15') // 重置按钮文字
            this.btnDisabled = false // 可以点击
            this.isConsigneePhone = true
            this.isConsigneePhoneHead = true
          } else {
            this.$message(this.$t('member_information_components_settingphone_26'))
          }
        }).catch(error => {
          console.log(this.$t('member_information_components_settingphone_25'), error)
        })
      }
    },
    // 获取验证码
    getVerfyCode() {
      // 绑定手机
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
        return
      }

      this.queryData()
    },
    // 接口获取验证码
    queryData() {
      let data = {}
      console.log(this.setdata.phoneType, this.setdata.phoneType, this.active)
      debugger
      // 更换手机号,第一次 或者 解绑手机号
      if ((this.setdata.phoneType === 1 && this.active === 0) || this.setdata.phoneType === 2) {
        data = {
          bizId: this.propData.memberId, // 会员id
          bizType: this.propData.type, // 业务类型
          mobilePrefix: this.formLabelAlign.consigneePhoneHead.replace('+', ''), // 手机号前缀
          mobile: this.formLabelAlign.consigneePhone // 手机号
        }
      } else if (this.setdata.phoneType === 1 && this.active === 1) {
        // 更换手机号 添加新的手机号后 无需传会员id
        data = {
          bizType: this.propData.type, // 业务类型
          mobilePrefix: this.formLabelAlign.consigneePhoneHead.replace('+', ''), // 手机号前缀
          mobile: this.formLabelAlign.consigneePhone // 手机号
        }
      } else {
        // 绑定手机号 无需传会员id
        data = {
          bizType: this.propData.type, // 业务类型
          mobilePrefix: this.formLabelAlign.consigneePhoneHead.replace('+', ''), // 手机号前缀
          mobile: this.formLabelAlign.consigneePhone // 手机号
        }
      }
      console.log(this.$t('member_information_components_settingphone_27'), data)
      generateCode(data).then(res => {
        if (res.data) {
          if (this.btnDisabled) return
          this.btnDisabled = true
          this.btnText = this.$t('member_information_components_settingphone_28')
          let count = 60
          this.setIntID = setInterval(() => {
            count--
            if (count === 0) {
              clearInterval(this.setIntID)
              this.btnText = this.$t('member_information_components_settingphone_15')
              this.btnDisabled = false
              return
            }
            this.btnText = count < 10 ? this.$t('member_information_components_settingphone_29', [count]) : this.$t('member_information_components_settingphone_30', [count])
          }, 1000)
        } else {
          this.$message(this.$t('member_information_components_settingphone_31'))
        }
      }).catch(error => {
        console.log(this.$t('member_information_components_settingphone_25'), error)
      })
    },
    goHome() {
      this.$refs['formLabelAlign'].resetFields()
      this.$parent.isShow = true
      location.reload()
    },
    // 取消修改
    cancel() {
      // 重置表单
      this.$refs['formLabelAlign'].resetFields()
      this.$parent.isShow = true // 父级显示
    },
    // 检验只能输入数字
    checkInputValue(typeName) {
      this.formLabelAlign[typeName] = this.formLabelAlign[typeName].replace(/[^\d]/g, '') // 只能输入数字
    }
  }
}
</script>

<style lang="scss" scoped>
 .txtCenter {
    text-align: center;
  }

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
