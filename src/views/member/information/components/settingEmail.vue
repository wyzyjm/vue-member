<template>
  <div class="content">
    <ce-steps
      :active="active"
      :datalist="dataEmail[isType].list"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" />
      <p>为确认是您本人操作，请完成身份认证</p>
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
      <!-- 修改邮箱 -->
        <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            v-if="active === 1 || propData.emailType === 0"
            prop="email"
            label="邮箱"
            :rules="[
              { required: propData.emailType !== 1 ? true : isCheck, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]"
          >
            <el-input v-model="dynamicValidateForm.email" placeholder="请输入新的邮箱地址" />
          </el-form-item>
           <!-- v-if="active === 0 && propData.emailType !== 0" -->
          <el-form-item v-else label="邮箱">
            <span>{{ propData.email }}</span>
          </el-form-item>
          <el-form-item
            label="验证码"
            prop="yzm"
            class="item-get-code"
            :rules="{
              required: true, message: '验证码不能为空', trigger: 'blur'
            }"
          >
            <el-input v-model="dynamicValidateForm.yzm" autocomplete="off" placeholder="邮箱验证码" />
            <el-button class="get-code-btn" @click="getVerfyCode">{{ btnText }}</el-button>
          </el-form-item>
          <el-form-item class="item-btn">
            <el-button @click="goHome">取消</el-button>
            <el-button v-show="!hasSubmited" type="primary" @click="next('dynamicValidateForm')">下一步</el-button>
            <el-button v-show="active === 1" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import { generateCode, validateVerifyCode, bingling, unbundling } from '@/api/user'

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
    return {
      bizId: this.setdata.bizId,
      propData: this.setdata,
      isType: this.setdata.emailType,
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
      isCheck: false,
      isCheckYzm: false,
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
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      dynamicValidateForm: {
        email: '',
        yzm: ''
      }
    }
  },
  methods: {
    submitForm(formName) {
      // this.$refs['dynamicValidateForm'].validate((valid) => {
      //   if (valid) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (formName === 'dynamicValidateForm') { // 修改邮箱
                const data = {
                  bizId: this.bizId,
                  bizType: this.propData.type,
                  email: this.dynamicValidateForm.email,
                  verifyCode: this.dynamicValidateForm.yzm
                }
                bingling(data).then(res => {
                  this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
                  if (res.data === 1) {
                    this.onSubmit()
                  }
                })
              }
            } else {
              return false
            }
          })
      //   }
      // })
    },
    // 下一步
    /*
    * bizType // 业务类型 mobile:手机， email:邮箱
    *
    */

    next(formName) {
      if (this.dynamicValidateForm.yzm === '') {
        this.$message('验证码不能为空！')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.propData.emailType === 2) {
            const data = {
              bizId: this.bizId,
              bizType: this.propData.type,
              verifyCode: this.dynamicValidateForm.yzm
            }
            unbundling(data).then(res => { // 解除绑定
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.$message.success('解绑成功！')
                this.goHome()
              }
            })

          } else if (this.propData.emailType === 0) {
            //  修改邮箱提交
            const data = {
              bizId: this.bizId,
              bizType: this.propData.type,
              email: this.dynamicValidateForm.email,
              verifyCode: this.dynamicValidateForm.yzm
            }
            bingling(data).then(res => {
              this.$message(res.data.errorMsg ? res.data.errorMsg : res.msg)
              if (res.data === 1) {
                this.onSubmit()
              }
            })

          } else {
            if(!this.isCheckYzm) {
              this.$message('验证失败！')
              return
            }
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
      
      if (this.propData.emailType === 1 && this.active === 1 && this.dynamicValidateForm.email === '' ) {
        this.$message('请输入您的邮箱！')
        return
      }
      this.queryData()
    },
    // 校验验证码接口
    checkCode() {
      let data = {}
      if (this.propData.emailType === 1 && this.active === 0) {
        console.log('2')
        if (this.active++ >= 0) this.hasSubmited = true
        clearInterval(this.setIntID)
        this.btnText = '获取验证码'
        this.btnDisabled = false
        this.isCheck = true
        this.dynamicValidateForm.yzm = ''
      } else if (this.propData.emailType === 1 && this.active === 1) {
        this.queryData()
      } else {
        data = {
          bizId: this.bizId,
          bizType: this.propData.type,
          verifyCode: this.dynamicValidateForm.yzm
        }
        validateVerifyCode(data).then(res => {
          if (res.data) {
            if (this.active++ >= 0) this.hasSubmited = true
            // this.dynamicValidateForm.yzm = ''
            clearInterval(this.setIntID)
            this.btnText = '获取验证码'
            this.btnDisabled = false
            this.submitForm()
          } else {
            this.$message('验证失败！')
          }
        })
      }
    },
    // 接口获取验证码
    queryData() {
        if (this.propData.emailType === 0 && this.dynamicValidateForm.email === '') {
          return
        }
        let data = {}
        if(this.propData.emailType === 0 || this.propData.emailType === 1 && this.active === 1) {
          data = {
            bizType: this.propData.type,
            email: this.dynamicValidateForm.email
          }
        } else {
          data = {
            bizId: this.bizId,
            bizType: this.propData.type
          }
        }
        generateCode(data).then(res => {
          if (res.data) {
            this.isCheckYzm = true
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
      // }
    },
    goHome() {
      this.$refs['dynamicValidateForm'].resetFields()
      this.$parent.isShow = true
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
