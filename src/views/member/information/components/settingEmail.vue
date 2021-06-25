<template>
  <div class="content">
    email44444
    <ce-steps
      v-if="propData.type === 'email'"
      :active="active"
      :datalist="dataEmail[propData.emailType].list"
    />
    <ce-steps
      v-else-if="propData.type === 'pwd'"
      :active="active"
      :datalist="dataPwd"
    />
    <ce-steps
      v-else
      :active="active"
      :datalist="dataPhone[phoneType].item"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" />
      <p v-if="propData.type === 'pwd'">请将密码设置为8-20位，并且由字母，数字和符号两种以上组合</p>
      <p v-else>
        <span v-if="propData.type === 'mobile' && propData.phoneType === 0">请绑定您的手机号码</span>
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
      <div v-if="propData.type === 'mobile'">
        <el-form ref="formLabelAlign" label-width="80px" :model="formLabelAlign" class="demo-dynamic">
          
          <!-- 手机区号 + 手机号 -->
          <el-form-item v-if="phoneType === 0" label="手机号">
            <!-- select选择器+文本框 -->
            <el-col :span="7">
              <el-form-item
                prop="consigneePhoneHead"
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
            <span>+{{ setdata.phoneHead.substring(0,setdata.phoneHead.lastIndexOf(",")) }} {{ setdata.phone }}</span>
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
              @click="goHome"
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
      </div>
      <!-- 修改密码 -->
      <div v-if="propData.type === 'pwd'">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="age">
            <el-input v-model.number="ruleForm.age" placeholder="请输入旧密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" placeholder="请确定新密码" />
          </el-form-item>
          <el-form-item class="item-btn">
            <el-button @click="goHome">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改邮箱 -->
      <div v-if="propData.type === 'email'">
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            v-if="active === 1 || propData.emailType === 0"
            prop="email"
            label="邮箱"
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="dynamicValidateForm.email" placeholder="请输入新的邮箱地址" />
          </el-form-item>
        </el-form>
        <el-form ref="ruleEmail" :model="ruleEmail" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item v-if="active === 0 && propData.emailType !== 0" label="邮箱">
            <span>{{ propData.email }}</span>
          </el-form-item>
          <el-form-item label="验证码" prop="yzm" class="item-get-code">
            <el-input v-model="ruleEmail.yzm" autocomplete="off" placeholder="邮箱验证码" />
            <el-button class="get-code-btn" @click="getVerfyCode">{{ btnText }}</el-button>
          </el-form-item>
          <el-form-item class="item-btn">
            <el-button @click="goHome">取消</el-button>
            <el-button v-show="!hasSubmited" type="primary" @click="next('ruleEmail')">下一步</el-button>
            <el-button v-show="active === 1" type="primary" @click="submitForm('ruleEmail')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import countryData from '@/views/components/resource/locList_zh_CN' // 国家
import { countries } from '@/views/components/resource/phoneCodeCountries' // 手机区号
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import { updatePwd, generateCode, validateVerifyCode, bingling, unbundling } from '@/api/user'

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
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      }
      setTimeout(() => {
        // const md5Value = this.$md5(value)
        // if (md5Value !== this.propData.oldPassword) {
        //   callback(new Error('密码输入错误，请重新输入'))
        // } else {
        //   callback()
        // }
        callback()
      }, 100)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱不能为空'))
      } else {
        if (this.dynamicValidateForm.email !== '') {
          this.$refs.ruleEmail.validateField('checkEmail')
        }
        callback()
      }
    }
    var checkYzm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else {
        if (this.ruleEmail.yzm !== '') {
          this.$refs.ruleEmail.validateField('checkYzm')
        }
        callback()
      }
    }
    // 校验 手机号
    var checkPhone = (rule, value, callback) => {
      if (!value || value.indexOf('*') > 0) return callback()
      if (value && !/^\d{0,11}$/.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    // 校验 固定电话
    var checkTel = (rule, value, callback) => {
      if (!value) return callback()
      if (!/^\d{7,8}$/.test(value)) {
        return callback(new Error('请输入正确的电话号码'))
      } else {
        callback()
      }
    }
    return {
      bizId: this.setdata.bizId,
      propData: this.setdata,
      active: 0,
      modifyType: true,
      modifyTitle: this.setdata.type,
      phoneType: this.setdata.phoneType,
      newPhoneInputeShow: false,
      getCodeMsg: false,
      hasSubmited: false,
      submitedSuccess: true,
      isConsistent: false, // 密码是否一致
      isGetVerfyCode: true,
      btnText: '获取验证码',
      btnDisabled: false,
      isConsigneePhone: false, // 是否验证手机号
      formLabelAlign: {
        selectMobile: '',
        phoneYzm: '',
        input3: '',
        consigneeCountry: '', // 国家
        consigneeName: '', // 收货人名称
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '', // 手机号
        consigneeTelHead: '', // 电话区号
        consigneeTel: '', // 电话号
        consigneeAddr: '', // 详细地址
        consigneeProvince: '', // 省/州/地区
        consigneeZipCode: '' // 邮政编码
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
      dataEmail: {
        0: {
          list: [
            {
              title: '绑定邮箱',
              description: ''
            },
            {
              title: '绑定成功',
              description: ''
            }
          ]
        },
        1: {
          list: [
            {
              title: '验证身份',
              description: ''
            },
            {
              title: '更换邮箱',
              description: ''
            },
            {
              title: '更换成功',
              description: ''
            }
          ]
        },
        2: {
          list: [
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
      dataPwd: [
        {
          title: '重设密码',
          description: ''
        },
        {
          title: '重设成功',
          description: ''
        }
      ],
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      ruleEmail: {
        email: '',
        yzm: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        yzm: [
          { validator: checkYzm, trigger: 'blur' }
        ],
        // 手机号头部
        consigneePhoneHead: [
          { required: false, trigger: 'change' }
        ],
        // 手机号
        consigneePhone: [
          { required: false, validator: checkPhone, trigger: 'blur' }
        ],
        // 电话号头部
        consigneeTelHead: [
          { required: false, trigger: 'change' }
        ],
        // 电话号
        consigneeTel: [
          { required: false, validator: checkTel, trigger: 'blur' }
        ]
      },
      // 省市区数据
      frontData: {
        conuntryOptions: countryData.Location.CountryRegion, // 国家
        province: [], // 省
        city: [], // 市
        phoneCode: countries // 手机区号
      },
      dynamicValidateForm: {
        email: ''
      }
    }
  },
  created() {
    this.getModifyType()
  },
  methods: {
    // 修改密码
    submitForm(formName) {
      if (this.propData.type === 'pwd') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'ruleForm') { // 修改密码提交
              const md5 = this.$md5(this.ruleForm.pass)
              const data = {
                bizId: this.bizId,
                oldPassword: this.propData.oldPassword,
                newPassword: md5
              }
              updatePwd(data).then(res => {
                this.$message(res.msg)
                if (res.data === 1) {
                  this.onSubmit()
                }
              })
            }
          } else {
            return false
          }
        })
      } else if (this.propData.type === 'mobile') {
        if (this.formLabelAlign.consigneePhoneHead === '') {
          this.$message('区号不能为空！')
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
              this.$message(res.msg)
              if (res.data === 1) {
                this.onSubmit()
              }
            })

            // 测试
            // this.onSubmit()
          } else {
            return false
          }
        })
      } else {
        const data = {
                    bizId: this.bizId,
                    bizType: this.propData.type,
                    email: this.dynamicValidateForm.email,
                    verifyCode: this.ruleEmail.yzm
                  }
                  bingling(data).then(res => {
                    this.$message(res.msg)
                    if (res.data === 1) {
                      this.onSubmit()
                    }
                  })
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            this.$refs[formName].validate((valid) => {
              if (valid) {

                
                if (formName === 'ruleEmail') { // 修改邮箱
                  const data = {
                    bizId: this.bizId,
                    bizType: this.propData.type,
                    email: this.dynamicValidateForm.email,
                    verifyCode: this.ruleEmail.yzm
                  }
                  bingling(data).then(res => {
                    this.$message(res.msg)
                    if (res.data === 1) {
                      this.onSubmit()
                    }
                  })

                  // 测试
                  // this.onSubmit()
                }
              } else {
                return false
              }
            })
          }
        })
      }
    },
    // 判断修改手机、邮箱或密码，根据状态显示对应表单
    getModifyType() {
      if (this.modifyTitle === 'pwd') {
        this.modifyType = false
      }
    },
    // 下一步
    /*
    * bizType // 业务类型 mobile:手机， email:邮箱
    *
    */

    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.propData.type === 'email' && this.propData.emailType === 2) {
            const data = {
              bizId: this.bizId,
              bizType: this.propData.type,
              verifyCode: this.ruleEmail.yzm
            }
            unbundling(data).then(res => { // 解除绑定
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.$message.success('解绑成功！')
                this.goHome()
              }
            })

            // 测试
            // this.$message.success('解绑成功！')
            // this.goHome()
          } else if (this.propData.type === 'mobile' && this.propData.phoneType === 2) {
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

            // 测试
            // this.$message.success('解绑成功！')
            // this.goHome()
          } else if (this.propData.type === 'email' && this.propData.emailType === 0) {
            //  修改邮箱提交
            const data = {
              bizId: this.bizId,
              bizType: this.propData.type,
              email: this.dynamicValidateForm.email,
              verifyCode: this.ruleEmail.yzm
            }
            bingling(data).then(res => {
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.onSubmit()
              }
            })

            // 测试
            // this.onSubmit()
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
    // 获取验证码
    getVerfyCode() {
      if (this.modifyTitle === 'mobile' && this.phoneType === 0 && this.formLabelAlign.consigneePhoneHead === '') {
        this.$message('区号不能为空！')
        return
      }
      if (this.modifyTitle === 'mobile' && this.phoneType === 0 && this.formLabelAlign.consigneePhone === '') {
        this.$message('请输入您的手机号码！')
        return
      }
      if (this.active === 1 && this.setdata.type === 'email') {
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            this.queryData()
          } else {
            return false
          }
        })
      } else {
        this.queryData()
      }
    },
    // 校验验证码接口
    checkCode() {
      let data = {}
      if (this.propData.type === 'email' && this.propData.emailType === 1 && this.active === 0) {
        console.log('2')
        if (this.active++ >= 0) this.hasSubmited = true
        this.formLabelAlign.consigneePhone = ''
        clearInterval(this.setIntID)
        this.btnText = '获取验证码'
        this.btnDisabled = false
        this.isConsigneePhone = this.propData.type === 'mobile' ? true : false
      } else {
        data = {
          bizId: this.bizId,
          bizType: this.propData.type,
          verifyCode: this.ruleEmail.yzm
        }
        validateVerifyCode(data).then(res => {
          if (res.data) {
            console.log('1')
            if (this.active++ >= 0) this.hasSubmited = true
            // this.ruleEmail.yzm = ''
            this.formLabelAlign.consigneePhone = ''
            clearInterval(this.setIntID)
            this.btnText = '获取验证码'
            this.btnDisabled = false
            this.isConsigneePhone = this.propData.type === 'mobile' ? true : false
            this.submitForm()
          } else {
            this.$message('验证失败！')
          }
        })
      }



      // 测试用
      // if (this.active++ >= 0) this.hasSubmited = true
      // this.ruleEmail.yzm = ''
      // this.formLabelAlign.consigneePhone = ''
      // clearInterval(this.setIntID)
      // this.btnText = '获取验证码'
      // this.btnDisabled = false
      // if (this.propData.type === 'mobile') {
      //   this.$refs['formLabelAlign'].resetFields()
      //   this.isConsigneePhone = true
      // }
    },
    // 接口获取验证码
    queryData() {
      let data = {}
      if (this.propData.type === 'email' && this.propData.emailType === 1 && this.active === 1) {
        // data = {
        //   bizId: this.bizId,
        //   bizType: this.propData.type,
        //   email: this.dynamicValidateForm.email
        // }
        this.checkCode()
      } else {
        data = {
          bizId: this.bizId,
          bizType: this.propData.type
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
      }

      // 测试
      // if (this.btnDisabled) return
      // this.btnDisabled = true
      // this.btnText = '60s后重新获取'
      // let count = 60
      // this.setIntID = setInterval(() => {
      //   count--
      //   if (count === 0) {
      //     clearInterval(this.setIntID)
      //     this.btnText = '获取验证码'
      //     this.btnDisabled = false
      //     return
      //   }
      //   this.btnText = count < 10 ? `0${count}s后重新获取` : `${count}s后重新获取`
      // }, 1000)
    },
    goHome() {
      if (this.propData.type === 'email') {
        this.$refs['ruleEmail'].resetFields()
        this.$refs['dynamicValidateForm'].resetFields()
      } else if (this.propData.type === 'pwd') {
        this.$refs['ruleForm'].resetFields()
      } else {
        this.$refs['formLabelAlign'].resetFields()
      }
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
