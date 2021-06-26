<template>
  <div class="content">
    <ce-steps
      :active="active"
      :datalist="dataPwd"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" />
      <p>请将密码设置为8-20位，并且由字母，数字和符号两种以上组合</p>
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
      <!-- 修改密码 -->
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model.number="ruleForm.oldPwd" placeholder="请输入旧密码" />
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
  </div>
</template>
<script>
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import { updatePwd } from '@/api/user'

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
    var checkOldpwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      }
      setTimeout(() => {
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
    return {
      bizId: this.setdata.bizId,
      propData: this.setdata,
      active: 0,
      modifyType: true,
      phoneType: this.setdata.phoneType,
      submitedSuccess: true,
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
        oldPwd: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPwd: [
          { validator: checkOldpwd, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getModifyType()
  },
  methods: {
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          return false
        }
      })
    },
    // 判断修改手机、邮箱或密码，根据状态显示对应表单
    getModifyType() {
      this.modifyType = false
    },
    onSubmit() {
      if (this.active++ > 2) this.active = 2
      this.submitedSuccess = false
    },
    goHome() {
      this.$refs['ruleForm'].resetFields()
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
