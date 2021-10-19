<template>
  <div class="content">
    <ce-steps
      :active="active"
      :datalist="dataPwd"
    />
    <div v-show="submitedSuccess" class="step-icon">
      <svg-icon name="icon-anquanzhuye" class="icon" setsize="150" />
      <p>{{$t('member_information_components_settingpwd_1')}}</p>
    </div>
    <div v-show="!submitedSuccess" class="step-icon">
      <svg-icon name="icon-caozuochenggong" class="icon" setsize="150" />
      <p>{{$t('member_information_components_settingpwd_2')}}</p>
      <el-button
        type="primary"
        @click="goHome"
      >{{$t('member_information_components_settingpwd_3')}}</el-button>
    </div>
    <div v-show="submitedSuccess" class="form-list">
      <!-- 修改密码 -->
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('member_information_components_settingpwd_4')" prop="oldPwd">
          <el-input v-model="ruleForm.oldPwd" :placeholder="$t('member_information_components_settingpwd_5')" />
        </el-form-item>
        <el-form-item :label="$t('member_information_components_settingpwd_6')" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" :placeholder="$t('member_information_components_settingpwd_7')" />
        </el-form-item>
        <el-form-item :label="$t('member_information_components_settingpwd_8')" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" :placeholder="$t('member_information_components_settingpwd_9')" />
        </el-form-item>
        <el-form-item class="item-btn">
          <el-button @click="cancel">{{$t('member_information_components_settingpwd_10')}}</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('member_information_components_settingpwd_11')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
import ceSteps from '@/components/CeSteps'
import svgIcon from '@/components/SvgIcon'
import { updatePwd } from '@/api/member'

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
        return callback(new Error(this.$t('member_information_components_settingpwd_12')))
      }
      setTimeout(() => {
        callback()
      }, 100)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('member_information_components_settingpwd_13')))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('member_information_components_settingpwd_14')))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t('member_information_components_settingpwd_15')))
      } else {
        callback()
      }
    }
    return {
      propData: this.setdata,
      active: 0,
      modifyType: true,
      phoneType: this.setdata.phoneType,
      submitedSuccess: true,
      dataPwd: [
        {
          title: this.$t('member_information_components_settingpwd_16'),
          description: ''
        },
        {
          title: this.$t('member_information_components_settingpwd_17'),
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
          const newPwd = md5(this.ruleForm.pass)
          const data = {
            bizId: this.propData.memberId,
            oldPassword: this.propData.oldPassword,
            newPassword: newPwd
          }
          updatePwd(data).then(res => {
            this.$message(res.msg)
            if (res.data === 1) {
              this.onSubmit()
            }
          }).catch(error => {
            console.log(this.$t('member_information_components_settingpwd_18'), error)
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
      location.reload()
    },
    cancel() {
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
