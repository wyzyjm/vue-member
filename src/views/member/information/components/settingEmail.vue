<template>
  <div class="content">
    <!-- 步骤条 -->
    <ce-steps
      :active="active"
      :datalist="dataEmail[isType].list"
    />
    <!-- 中间图标 + 提示 -->
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" setsize="150" />
      <p>{{$t('member_information_components_settingemail_1')}}</p>
    </div>
    <!-- 设置完成 -->
    <div v-show="!submitedSuccess" class="step-icon">
      <svg-icon name="icon-caozuochenggong" class="icon" setsize="150" />
      <p>{{$t('member_information_components_settingemail_2')}}</p>
      <el-button
        type="primary"
        @click="goHome"
      >{{$t('member_information_components_settingemail_3')}}</el-button>
    </div>
    <div v-show="submitedSuccess" class="form-list">
      <!-- 修改邮箱 -->
      <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <!-- 输入邮箱 -->
        <el-form-item
          v-if="active === 1 || propData.emailType === 0"
          prop="email"
          :label="$t('member_information_components_settingemail_4')"
          :rules="[
            { required: propData.emailType !== 1 ? true : isCheck, message: $t('member_information_components_settingemail_5'), trigger: 'blur' },
            { type: 'email', message: $t('member_information_components_settingemail_6'), trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="dynamicValidateForm.email" :placeholder="$t('member_information_components_settingemail_7')" />
        </el-form-item>
        <!-- 有邮箱时 -->
        <el-form-item v-else :label="$t('member_information_components_settingemail_4')">
          <span>{{ propData.email }}</span>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item
          :label="$t('member_information_components_settingemail_8')"
          prop="yzm"
          class="item-get-code"
          :rules="{
            required: true, message: $t('member_information_components_settingemail_9'), trigger: 'blur'
          }"
        >
          <el-input v-model="dynamicValidateForm.yzm" autocomplete="off" :placeholder="$t('member_information_components_settingemail_10')" />
          <el-button class="get-code-btn" @click="getVerfyCode">{{ btnText }}</el-button>
        </el-form-item>
        <!-- 取消 下一步 提交 -->
        <el-form-item class="item-btn">
          <el-button @click="goHome">{{$t('member_information_components_settingemail_11')}}</el-button>
          <el-button v-show="!hasSubmited" type="primary" @click="next('dynamicValidateForm')">{{$t('member_information_components_settingemail_12')}}</el-button>
          <el-button v-show="active === 1" type="primary" @click="submitForm('dynamicValidateForm')">{{$t('member_information_components_settingemail_13')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
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

  /**
    type: 'email',
    emailType: type, // 0:绑定 1:更换 2:解绑
    email: this.data.user.email,
    memberId: this.data.user.memberId
   */
  data() {
    return {
      propData: this.setdata, // 传过来的数据
      isType: this.setdata.emailType, // 哪个类型
      active: 0, // 步骤条
      modifyType: true,
      modifyTitle: this.setdata.type,
      phoneType: this.setdata.phoneType,
      newPhoneInputeShow: false,
      getCodeMsg: false,
      hasSubmited: false,
      submitedSuccess: true,
      isConsistent: false, // 密码是否一致
      isGetVerfyCode: true,
      btnText: this.$t('member_information_components_settingemail_14'),
      btnDisabled: false,
      isCheck: false,
      isCheckYzm: false,
      dataEmail: {
        0: {
          list: [
            {
              title: this.$t('member_information_components_settingemail_15'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingemail_16'),
              description: ''
            }
          ]
        },
        1: {
          list: [
            {
              title: this.$t('member_information_components_settingemail_17'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingemail_18'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingemail_19'),
              description: ''
            }
          ]
        },
        2: {
          list: [
            {
              title: this.$t('member_information_components_settingemail_17'),
              description: ''
            },
            {
              title: this.$t('member_information_components_settingemail_20'),
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
      // 当前页面内容
      dynamicValidateForm: {
        email: '',
        yzm: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'dynamicValidateForm') { // 修改邮箱
            const data = {
              bizId: this.propData.memberId,
              bizType: this.propData.type,
              email: this.dynamicValidateForm.email,
              verifyCode: this.dynamicValidateForm.yzm
            }
            bingling(data).then(res => {
              res.data.code && res.data.code === '1001001022' && this.$message(this.$t('member_information_components_settingemail_22'))
              if (res.data === 1) {
                this.onSubmit()
              }
            }).catch(error => {
           })
          }
        } else {
          return false
        }
      })
    },
    // 下一步
    next(formName) {
      // 验证码 为空时
      if (this.dynamicValidateForm.yzm === '') {
        this.$message(this.$t('member_information_components_settingemail_24'))
        return
      }
      // 表单校验
      this.$refs[formName].validate((valid) => {
        if (!valid) return false // 校验不通过
        // 校验通过
        // 解绑邮箱
        if (this.propData.emailType === 2) {
          const data = {
            bizId: this.propData.memberId, // 会员ID
            bizType: this.propData.type, // 类型
            verifyCode: this.dynamicValidateForm.yzm // 二维码
          }
          unbundling(data).then(res => { // 解除绑定
            this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
            if (res.data === 1) {
              this.$message.success(this.$t('member_information_components_settingemail_25'))
              this.goHome()
            }
          }).catch(error => {
          })
        } else if (this.propData.emailType === 0) {
          //  修改邮箱提交
          const data = {
            bizId: this.propData.memberId,
            bizType: this.propData.type,
            email: this.dynamicValidateForm.email,
            verifyCode: this.dynamicValidateForm.yzm
          }
          bingling(data).then(res => {
            this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
            if (res.data === 1) {
              this.onSubmit()
            }
          }).catch(error => {
          })
        } else {
          if (!this.isCheckYzm) {
            this.$message(this.$t('member_information_components_settingemail_26'))
            return
          }
          this.checkCode()
        }
      })
    },
    onSubmit() {
      if (this.active++ > 2) this.active = 2
      this.submitedSuccess = false
    },
    // 获取验证码
    getVerfyCode() {
      // 更换邮箱 & 第二步骤 & 页面没有邮箱
      if (this.propData.emailType === 1 && this.active === 1 && this.dynamicValidateForm.email === '') {
        this.$message(this.$t('member_information_components_settingemail_27'))
        return
      }
      this.queryData()
    },
    // 接口获取验证码
    queryData() {
      // 绑定邮箱 & 邮箱为空
      if (this.propData.emailType === 0 && this.dynamicValidateForm.email === '') return
      let data = {}
      // 绑定邮箱 || 更换邮箱 & 第二步骤
      if (this.propData.emailType === 0 || this.propData.emailType === 1 && this.active === 1) {
        data = {
          bizType: this.propData.type,
          email: this.dynamicValidateForm.email
        }
      } else {
        data = {
          bizId: this.propData.memberId,
          bizType: this.propData.type
        }
      }
      generateCode(data).then(res => {
        if (res.data) {
          this.isCheckYzm = true
          if (this.btnDisabled) return
          this.btnDisabled = true
          this.btnText = this.$t('member_information_components_settingemail_29')
          let count = 60
          this.setIntID = setInterval(() => {
            count--
            if (count === 0) {
              clearInterval(this.setIntID)
              this.btnText = this.$t('member_information_components_settingemail_30')
              this.btnDisabled = false
              return
            }
            this.btnText = count < 10 ? this.$t('member_information_components_settingemail_31', [count]) : this.$t('member_information_components_settingemail_32', [count])
          }, 1000)
        } else {
          this.$message(this.$t('member_information_components_settingemail_33'))
        }
      }).catch(error => {
      })
    },

    // 校验验证码接口
    checkCode() {
      let data = {}
      if (this.propData.emailType === 1 && this.active === 0) {
        console.log('2')
        if (this.active++ >= 0) this.hasSubmited = true
        clearInterval(this.setIntID)
        this.btnText = this.$t('member_information_components_settingemail_14')
        this.btnDisabled = false
        this.isCheck = true
        this.dynamicValidateForm.yzm = ''
      } else if (this.propData.emailType === 1 && this.active === 1) {
        this.queryData()
      } else {
        data = {
          bizType: this.propData.type,
          verifyCode: this.dynamicValidateForm.yzm
        }
        validateVerifyCode(data).then(res => {
          if (res.data) {
            if (this.active++ >= 0) this.hasSubmited = true
            // this.dynamicValidateForm.yzm = ''
            clearInterval(this.setIntID)
            this.btnText = this.$t('member_information_components_settingemail_14')
            this.btnDisabled = false
            this.submitForm()
          } else {
            this.$message(this.$t('member_information_components_settingemail_26'))
          }
        }).catch(error => {
        })
      }
    },

    // 回到父页面
    goHome() {
      this.$refs['dynamicValidateForm'].resetFields()
      this.$parent.isShow = true
      location.reload() // 页面刷新
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
