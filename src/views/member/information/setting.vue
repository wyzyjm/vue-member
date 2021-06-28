<template>
  <div class="content">
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
      :datalist="datalist"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" />
      <p v-if="propData.type === 'pwd'">请将密码设置为8-20位，并且由字母，数字和符号两种以上组合</p>
      <p v-else>为确认是您本人操作，请完成身份认证</p>
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
      <div v-if="propData.type === 'p'">
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 80px;">手机号</label>
          <div class="el-form-item__content" style="margin-left: 80px;">
            <div data-v-53850f12="" class="el-input">
              <span>+86 183****4324</span>
              <el-input v-show="newPhoneInputeShow" v-model="formLabelAlign.name" />
            </div>
          </div>
        </div>
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="验证码" class="item-get-code">
            <el-input v-model="formLabelAlign.name" placeholder="短信验证码" />
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
              @click="next"
            >下一步</el-button>
            <el-button
              v-show="hasSubmited"
              type="primary"
              @click="onSubmit"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改密码 -->
      <div v-if="propData.type === 'pwd'">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="age" placeholder="请输入旧密码">
            <el-input v-model.number="ruleForm.age" />
          </el-form-item>
          <el-form-item label="新密码" prop="pass" placeholder="请输入新密码">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" placeholder="请确定新密码">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
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
            <el-input v-model="dynamicValidateForm.email" />
          </el-form-item>
        </el-form>
        <el-form ref="ruleEmail" :model="ruleEmail" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item v-if="active === 0 && propData.emailType !== 0" label="邮箱">
            <span>{{ propData.email }}</span>
          </el-form-item>
          <el-form-item label="验证码" prop="yzm" class="item-get-code">
            <el-input v-model="ruleEmail.yzm" autocomplete="off" />
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
    return {
      bizId: '854299120902660096',
      propData: this.setdata,
      active: 0,
      modifyType: true,
      modifyTitle: this.setdata.type,
      newPhoneInputeShow: false,
      getCodeMsg: false,
      hasSubmited: false,
      submitedSuccess: true,
      isConsistent: false, // 密码是否一致
      isGetVerfyCode: true,
      btnText: '获取验证码',
      btnDisabled: false,
      formLabelAlign: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      datalist: [
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
      ],
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
        ]
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
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
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
              } else if (formName === 'ruleEmail') { // 修改邮箱
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
      if (this.active === 1) {
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            console.log(1)
            this.queryData()
          } else {
            return false
          }
        })
      } else {
        this.queryData()
      }
    },
    goHome() {
      this.$refs['ruleEmail'].resetFields()
      this.$refs['dynamicValidateForm'].resetFields()
      this.$parent.isShow = true
    },
    // 校验验证码接口
    checkCode() {
      const data = {
        bizId: this.bizId,
        bizType: this.propData.type,
        verifyCode: this.ruleEmail.yzm
      }
      validateVerifyCode(data).then(res => {
        if (res.data) {
          console.log('1')
          if (this.active++ >= 0) this.hasSubmited = true
          this.ruleEmail.yzm = ''
          clearInterval(this.setIntID)
          this.btnText = '获取验证码'
          this.btnDisabled = false
        } else {
          this.$message('验证失败！')
        }
      })

      // 测试用
      // if (this.active++ >= 0) this.hasSubmited = true
      // this.ruleEmail.yzm = ''
      // clearInterval(this.setIntID)
      // this.btnText = '获取验证码'
      // this.btnDisabled = false
    },
    // 接口获取验证码
    queryData() {
      const data = {
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
