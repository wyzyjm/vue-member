<template>
  <div class="modify">
    <div class="vicp-wrap">
      <!-- 弹窗标题 -->
      <div class="vicp-header">
        <!-- 标题 -->
        <span> {{ getHeadName }}</span>
        <!-- 关闭按钮 -->
        <span class="vicp-close" @click="off"><i class="vicp-icon4" /></span>
      </div>
      <!-- 弹窗内容 -->
      <div class="modify-cont">
        <el-form ref="modifyForm" :model="form" label-width="100px">
          <!-- 昵称 或 姓名 -->
          <el-form-item
            v-if="modifyType === 'name' || modifyType === 'nickName'"
            :label="modifyType === 'nickName' ? $t('member_information_components_modify_1') : $t('member_information_components_modify_2')"
            prop="nameValue"
            :rules="[
              {required:true, message: $t('member_information_components_modify_3'),trigger:'blur'}
            ]"
          >
            <el-input v-model="form.nameValue" />
          </el-form-item>

          <!-- 单行文本 -->
          <div v-else-if="selfDefining.attrType === 'txt'">
            <!-- 文字 -->
            <el-form-item
              v-if="modifyType === 'text' "
              :label="selfDefining.attrName"
              prop="modifyData"
              :rules="[
                {required:selfDefining.required,message:selfDefining.attrName+$t('member_information_components_modify_4'),trigger:'blur'},
                rules.text
              ]"
            >
              <el-input v-model="form.modifyData" :placeholder="selfDefining.description" />
            </el-form-item>

            <!-- 数字 -->
            <el-form-item
              v-if="modifyType === 'numberic' "
              :label="selfDefining.attrName"
              prop="modifyData"
              :rules="[
                {required:selfDefining.required, message:selfDefining.attrName+$t('member_information_components_modify_4'),trigger:'blur'},
                rules.numberic
              ]"
            >
              <el-input v-model.number="form.modifyData" :placeholder="selfDefining.description" />
            </el-form-item>

            <!-- 手机号 -->
            <el-form-item
              v-if="modifyType === 'mobile' "
              :label="selfDefining.attrName"
              prop="modifyData"
              :rules="[
                {required:selfDefining.required,message:selfDefining.attrName+$t('member_information_components_modify_4'),trigger:'blur'},
                rules.mobile
              ]"
            >
              <el-input v-model="form.modifyData" :placeholder="selfDefining.description" />
            </el-form-item>

            <!-- 电话号 -->
            <el-form-item
              v-if="modifyType === 'phone' "
              :label="selfDefining.attrName"
              prop="modifyData"
              :rules="[
                {required:selfDefining.required,message:selfDefining.attrName+$t('member_information_components_modify_4'),trigger:'blur'},
                rules.phone
              ]"
            >
              <el-input v-model="form.modifyData" :placeholder="selfDefining.description" />
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item
              v-if="modifyType === 'email' "
              :label="selfDefining.attrName"
              prop="modifyData"
              :rules="[
                {required:selfDefining.required,message:selfDefining.attrName+$t('member_information_components_modify_4'),trigger:'blur'},
                rules.email
              ]"
            >
              <el-input v-model="form.modifyData" :placeholder="selfDefining.description" />
            </el-form-item>

            <!-- 日期 -->
            <el-form-item v-if="modifyType === 'simpleDate'" :label="selfDefining.attrName" class="block">
              <el-date-picker
                v-model="form.modifyData"
                type="date"
                :placeholder="selfDefining.description"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              />
            </el-form-item>

            <!-- 日期时间 -->
            <el-form-item v-if="modifyType === 'allDate'" :label="selfDefining.attrName" class="block">
              <el-date-picker
                v-model="form.modifyData"
                type="datetime"
                :placeholder="selfDefining.description"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              />
              <!-- value-format="yyyy-MM-dd" -->

            </el-form-item>
          </div>

          <!-- 多行文本 -->
          <el-form-item v-else-if="selfDefining.attrType === 'multiTxt'" :label="selfDefining.attrName">
            <el-input
              v-model="form.modifyData"
              type="textarea"
              :placeholder="selfDefining.description|| $t('member_information_components_modify_5')"
            />
          </el-form-item>

          <!-- 选项型 -->
          <div v-else-if="selfDefining.attrType ==='select'">
            <!-- redio -->
            <el-form-item v-if="modifyType === 'redio'" :label="selfDefining.attrName">
              <el-radio-group v-model="form.modifyData">
                <el-radio
                  v-for="item in selfDefining.optionsData"
                  :key="item.key"
                  :label="item.value"
                  :name="item.value"
                />
              </el-radio-group>
            </el-form-item>
            <!-- checkbox 多选 -->
            <el-form-item v-if="modifyType === 'checkbox'" :label="selfDefining.attrName">
              <el-checkbox-group v-model="form.type">
                <el-checkbox
                  v-for="item in selfDefining.optionsData"
                  :key="item.key"
                  :label="item.value"
                  :name="item.value"
                />
              </el-checkbox-group>
            </el-form-item>
            <!-- 下拉单选 -->
            <el-form-item v-if="modifyType === 'selSigle'" :label="selfDefining.attrName">
              <el-select v-model="form.modifyData" :placeholder="$t('member_information_components_modify_6')">
                <el-option
                  v-for="item in selfDefining.optionsData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- 下拉多选 -->
            <el-form-item v-if="modifyType === 'selMulti'" :label="selfDefining.attrName">
              <el-select v-model="form.type" multiple :placeholder="$t('member_information_components_modify_6')">
                <el-option
                  v-for="item in selfDefining.optionsData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
              <!-- {{ form }} -->
            </el-form-item>
            <!-- 地址级联 -->
            <el-form-item v-if="modifyType === 'area'" :label="selfDefining.attrName">
              <el-form-item>
                <el-col :span="7">
                  <!-- 国家 -->
                  <el-form-item>
                    <!-- select选择器 -->
                    <el-select
                      v-model="addrForm.consigneeCountry"
                      :placeholder="$t('member_information_components_modify_7')"
                      @change="countryChange(addrForm.consigneeCountry)"
                    >
                      <el-option
                        v-for="(item, index) in frontData.conuntryOptions"
                        :key="item.name + index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="txtCenter">-</el-col>
                <!-- 省市区 -->
                <el-col :span="10">
                  <el-form-item>
                    <el-cascader
                      :key="addressKey"
                      v-model="addrForm.addressABC"
                      :options="frontData.addressData"
                      :props="{
                        value: 'code',
                        label: 'name',
                      }"
                    />
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-form-item>
          </div>

          <!-- 图片集 -->
          <el-form-item v-else-if="selfDefining.attrType === 'image'" :label="selfDefining.attrName">{{$t('member_information_components_modify_8')}}<!-- <img
                v-for="item in selfDefining.optionsData"
                :key="item.key"
                :src="item.type"
                :alt="item.type"
              > -->
            <!-- <UploadImgs
                :imgVal=
              /> -->
          </el-form-item>

          <!-- 附件集 -->
          <el-form-item v-else-if="selfDefining.attrType === 'file'" :label="selfDefining.attrName">{{$t('member_information_components_modify_9')}}<!-- <img
              v-for="item in selfDefining.optionsData"
              :key="item.key"
              :src="item.type"
              :alt="item.type"
            > -->
          </el-form-item>

          <div v-else>{{$t('member_information_components_modify_10')}}</div>
          <!-- 按钮区 -->
          <el-form-item class="align-center">
            <el-button plain type="primary" @click="off">{{$t('member_information_components_modify_11')}}</el-button>
            <el-button type="primary" @click="onSubmit">{{$t('member_information_components_modify_12')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import countryData from '@/views/components/resource/locList_zh_CN' // 国家
import { updateMember } from '@/api/member'

// 国家地区
import { getCountryData, getCurrentData, addressFormateData } from '@/utils/address'
export default {
  components: {
    // UploadImgs
  },
  props: {
    // 弹窗类型
    modifyType: {
      type: String,
      required: true,
      default: ''
    },
    // 默认信息
    // eslint-disable-next-line vue/require-default-prop
    selfDefining: {
      type: Object,
      required: false
    },
    // 会员id
    memberId: {
      type: String,
      required: true
    },
    // 昵称和姓名
    propname: {
      type: Object,
      required: true
    }
  },
  data() {
    // 数字
    var checkNumberic = (rule, value, callback) => {
      if (Number.isNaN(Number(value))) {
        callback(new Error(this.$t('member_information_components_modify_13')))
      } else {
        callback() // 输入正确
      }
    }
    // 手机号
    var checkMobile = (rule, value, callback) => {
      if (!value) return callback()
      var mobileReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))\d{8})$/
      if (!mobileReg.test(value)) {
        callback(new Error(this.$t('member_information_components_modify_14')))
      } else {
        callback()
      }
    }
    // 电话号
    var checkPhone = (rule, value, callback) => {
      if (!value) return callback()
      var mobileReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))\d{8})$/ // 缺少校验规则
      if (!mobileReg.test(value)) {
        callback(new Error(this.$t('member_information_components_modify_15')))
      } else {
        callback()
      }
    }
    // 邮箱
    var checkEmail = (rule, value, callback) => {
      if (!value) return callback()
      var mobileReg = /^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/
      if (!mobileReg.test(value)) {
        callback(new Error(this.$t('member_information_components_modify_16')))
      } else {
        callback()
      }
    }
    return {
      id: this.memberId, // 会员id
      // 编辑项目
      editItem: {
        0: {
          type: 'nickName',
          name: this.$t('member_information_components_modify_1')
        },
        1: {
          type: 'name',
          name: this.$t('member_information_components_modify_2')
        },
        2: {
          type: 'phone',
          name: this.$t('member_information_components_modify_17')
        },
        3: {
          type: 'email',
          name: this.$t('member_information_components_modify_18')
        },
        4: {
          type: 'attrName',
          name: this.$t('member_information_components_modify_19')
        }
      },
      // 弹窗表单信息
      form: {
        nameValue: this.propname || '', // 姓名 或 昵称
        modifyData: this.selfDefining.attrValue, // 修改数据
        type: this.selfDefining.attrValue ? this.selfDefining.attrValue.split(',') || [] : [], // 复选框, 下拉多选
        userDefined: false // 自定义项
      },
      // 表单校验规则
      rules: {
        text: { max: 128, message: this.$t('member_information_components_modify_20'), trigger: 'blur' }, // 文字
        numberic: { validator: checkNumberic, trigger: 'blur' }, // 数值
        mobile: { validator: checkMobile, trigger: 'blur' }, // 手机号
        phone: { validator: checkPhone, trigger: 'blur' }, // 电话
        email: { validator: checkEmail, trigger: 'blur' } // 邮箱
      },
      // 收货地址表单
      addrForm: {
        consigneeCountry: '', // 国家
        addressABC: ''// 省市区
      },
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
      // 省市区数据
      frontData: {
        conuntryOptions: '', // 国家
        addressData: '' // 省市区
      },
      addressKey: 1000 // 级联key
    }
  },
  // 计算属性
  computed: {
    // 获取手机号
    getHeadName() {
      let headName = ''
      if (this.modifyType !== 'nickName' && this.modifyType !== 'name') {
        headName = this.selfDefining.attrName
      } else {
        this.modifyType === 'nickName' ? headName = this.$t('member_information_components_modify_1') : headName = this.$t('member_information_components_modify_2')
      }
      return headName
    }
  },
  // 创建时
  created() {
    this.addressKey = this.addressKey + 1
    if (this.modifyType === 'area') {
      // 获取国家数据
      this.frontData.conuntryOptions = getCountryData()
    }
  },
  // 挂载时
  mounted() {
    },
  methods: {
    // 弹窗关闭
    off() {
      this.form.modifyData = '' // 清空输入的值
      this.form.type = '' // 清空筛选项的值
      this.form.nameValue = '' // 昵称 和 姓名
      this.$emit('close')
    },
    // 提交数据
    onSubmit() {
      this.$refs.modifyForm.validate(async valid => {
        if (!valid) return false
        let subdata = {}
        if (this.modifyType === 'name') {
          subdata = {
            bizId: this.id, // 会员id
            name: this.form.nameValue
          }
        } else if (this.modifyType === 'nickName') {
          subdata = {
            bizId: this.id, // 会员id
            nickname: this.form.nameValue
          }
        } else if (this.modifyType === 'checkbox') {
          subdata = {
            bizId: this.id, // 会员id
            itemValue: [
              {
                code: this.selfDefining.attrId, // 属性code
                dataType: this.selfDefining.attrType,
                dataSubType: this.modifyType,
                value: this.form.type.toString()
              }
            ]
          }
        } else if (this.modifyType === 'selMulti') {
          subdata = {
            bizId: this.id, // 会员id
            itemValue: [
              {
                code: this.selfDefining.attrId, // 属性code
                dataType: this.selfDefining.attrType,
                dataSubType: this.modifyType,
                value: this.form.type.toString()
              }
            ]
          }
        } else if (this.modifyType === 'area') {
          // 地区
          subdata = {
            bizId: this.id, // 会员id
            itemValue: [
              {
                code: this.selfDefining.attrId, // 属性code
                dataType: this.selfDefining.attrType,
                dataSubType: this.modifyType,
                value: this.addrForm.consigneeCountry.toString() + ',' + this.addrForm.addressABC.toString()
              }
            ]
          }
        } else {
          subdata = {
            bizId: this.id, // 会员id
            itemValue: [
              {
                code: this.selfDefining.attrId, // 属性code
                dataType: this.selfDefining.attrType,
                dataSubType: this.modifyType,
                value: this.form.modifyData.toString()
              }
            ]
          }
        }
        if (subdata.name || subdata.nickname || subdata.itemValue[0].value) {
          try {
            const res = await updateMember(subdata)
            if (res.data !== 1) return
            this.off() // 关闭弹窗
            location.reload() // 页面刷新
          } catch (error) {
          }
        } else {
          this.off() // 关闭弹窗
        }
      })
    },
    // 国家下拉框变化
    countryChange(code) {
      this.addressKey = this.addressKey + 1
      this.frontData.province = []
      if (this.$refs.provinceRef) {
        this.$refs.provinceRef.resetField() // 省重置
        this.$refs.cityRef.resetField() // 市重置
      }
      const proviceValue = getCurrentData(code) // 获取没有格式化后的省数据
      const provinceFormateValue = addressFormateData(proviceValue) // 格式化 省市区数据
      this.frontData.addressData = provinceFormateValue
    }
  }
}
</script>

<style lang='scss' scoped>
.txtCenter {
    text-align: center;
  }
.modify{
    position: fixed;
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
    .vicp-wrap {
        -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
        position: fixed;
        display: block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        z-index: 10000;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 600px;
        height: 50%;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 2px;
        -webkit-animation: vicp 0.12s ease-in;
        animation: vicp 0.12s ease-in;
    }
    .vicp-header{
        background: #f5f5f5;
        padding: 15px;
        text-align: center;
    }
    .line{
        text-align: center;
    }
    .vicp-close {
        position: absolute;
        right: 8px;
        top: 8px;
    }
    .vicp-icon4 {
        position: relative;
        display: block;
        width: 30px;
        height: 30px;
        cursor: pointer;
        -webkit-transition: -webkit-transform 0.18s;
        transition: -webkit-transform 0.18s;
        transition: transform 0.18s;
        transition: transform 0.18s, -webkit-transform 0.18s;
        -webkit-transform: rotate(0);
        -ms-transform: rotate(0);
        transform: rotate(0);
    }
    .vicp-icon4::after,
    .vicp-icon4::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 4px;
        width: 20px;
        height: 2px;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        background-color: #999;
    }
    .vicp-icon4::after {
        -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }
    .modify-cont{
        padding: 50px;
        // .el-form-item{
        //   display: flex;
        //   justify-content: center;
        // }
        .align-center{
          // margin-left: -40%;
            margin-top: 100px;
            // text-align: center;
        }
    }
    .el-form-item__label{
      width: 100px;
    }
}
</style>
