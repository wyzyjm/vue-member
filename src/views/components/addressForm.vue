/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-default-prop */
<template>
  <el-dialog
    center
    :title="formType === 'create' ? `新增收货地址` : `编辑收货地址`"
    :visible.sync="dialogFormVisible"
    width="620px"
    @open="handleOpen"
    @close="dialogClose"
  >
    <div>
      <el-form ref="addrFormRef" label-width="90px" size="medium" :model="addrForm" :rules="addrFormRules">
        <!-- 国家/地区 必填 -->
        <el-form-item label="国家/地区" prop="consigneeCountry">
          <!-- select选择器 -->
          <el-select v-model="addrForm.consigneeCountry" placeholder="请选择国家" @change="countryChange">
            <el-option
              v-for="(item, index) in frontData.conuntryOptions"
              :key="index"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <!-- 收货人 必填 -->
        <el-form-item label="收货人" prop="consigneeName">
          <!-- 文本框 -->
          <el-input v-model.trim="addrForm.consigneeName" placeholder="请输入收货人姓名" maxlength="128" />
        </el-form-item>
        <div class="addressBox" :class="{ reverse: isReverse }">
          <!-- 州/省/地区 必填-->
          <el-form-item :label="isReverse ? '州/省/地区' : '区域'" prop="addressABC">
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
          <!-- 详情地址 必填-->
          <el-form-item :label="isReverse ? '街道地址' : '详情地址'" prop="consigneeAddr">
            <!-- textarea -->
            <el-input
              v-model.trim="addrForm.consigneeAddr"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 3 }"
              :placeholder="
                isReverse
                  ? '街道地址，邮政信箱，公司名称，转交方，公寓，套房，单元，大厦，楼层等'
                  : '街道、楼牌号等'
              "
              maxlength="255"
            />
          </el-form-item>
        </div>
        <!-- 手机区号 + 手机号 -->
        <el-form-item label="手机">
          <!-- select选择器+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneePhoneHead">
              <el-select v-model="addrForm.consigneePhoneHead" placeholder="请选择" filterable>
                <el-option
                  v-for="(item, index) in frontData.phoneCode"
                  :key="index"
                  :label="item.dialCode"
                  :value="item.dialCode"
                >
                  <span> {{ item.dialCode }} {{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="17">
            <el-form-item prop="consigneePhone">
              <el-input
                v-model.trim="addrForm.consigneePhone"
                type="tel"
                placeholder="请输入您的手机号码"
                @input="checkInputValue('consigneePhone')"
                @focus="phoneFocus($event, true)"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 固定电话 -->
        <el-form-item label="固定电话" class="telBox" :class="{ mb0: errorMsg }">
          <!-- 下拉+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneeTelHead">
              <el-select v-model="addrForm.consigneeTelHead" placeholder="请选择" filterable>
                <el-option
                  v-for="(item, index) in frontData.phoneCode"
                  :key="index"
                  :label="item.dialCode"
                  :value="item.dialCode"
                >
                  <span> {{ item.dialCode }} {{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="17">
            <el-form-item prop="consigneeTel">
              <el-input
                v-model.trim="addrForm.consigneeTel"
                type="tel"
                placeholder="请输入您的固定电话"
                @input="checkInputValue('consigneeTel')"
                @focus="phoneFocus"
              />
            </el-form-item>
          </el-col>
          <p v-show="errorMsg">温馨提示：手机号和固定电话不能同时为空</p>
        </el-form-item>

        <!-- 邮政编码 必填 -->
        <el-form-item label="邮政编码" class="zipCode" prop="consigneeZipCode">
          <!-- 文本框 -->
          <el-input
            v-model="addrForm.consigneeZipCode"
            type="text"
            placeholder="请输入邮政编码"
            @input="checkInputValue(`consigneeZipCode`)"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <!-- 取消 -->
      <el-button type="info" size="medium" @click="dialogFormVisible = false">取消</el-button>
      <!-- 确定 -->
      <el-button type="primary" size="medium" @click="saveAddrForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addAddressList,
  eidtAddressList,
  editOrderAddress
} from '@/api/address.js' // 接口
import {
  countries
} from '@/views/components/resource/phoneCodeCountries' // 手机区号
import {
  getCurrentData,
  addressFormateData,
  getCountryData
} from '@/utils/address.js' // 方法
export default {
  name: 'AddressForm',
  props: {
    // 编辑表单时接收表单信息
    addressFormProp: {
      type: Object,
      required: false,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => {
        return {}
      }
    }
  },

  // 数据
  data() {
    return {
      // 页面参数
      formType: 'create', // 哪种弹窗 create:创建 edit:编辑
      dialogFormVisible: false, // 是否显示弹窗

      isReverse: false, // 是否为外国
      receiverCode: '', // 地址id
      isAreaMust: true, // 省市区是否必填
      isDefault: 0, // 是否为默认收货地址
      orderId: '', // 订单id

      // 收货地址表单
      addrForm: {
        consigneeCountry: '', // 国家
        consigneeName: '', // 收货人名称
        consigneeAddr: '', // 详细地址
        addressABC: [], // 省市区code
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '', // 手机号
        consigneeTelHead: '', // 电话区号
        consigneeTel: '', // 电话号
        consigneeZipCode: '' // 邮政编码
      },
      // 收货地址表单 校验规则
      addrFormRules: {
        // 国家
        consigneeCountry: [{
          required: true,
          message: '请选择国家',
          trigger: 'change'
        }],
        // 收货人
        consigneeName: [{
          required: true,
          message: '请输入收件人名称',
          trigger: 'blur'
        }],
        // 收货地址
        consigneeAddr: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],
        // 省市区
        addressABC: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],
        // 手机号头部
        consigneePhoneHead: [{
          required: false,
          trigger: 'change'
        }],
        // 手机号
        consigneePhone: [{
          required: false,
          validator: (rule, value, callback) => {
            if (!value || value.indexOf('*') > 0) return callback()
            if (value && !/^\d{6,12}$/.test(value)) {
              return callback(new Error('请输入正确的手机号码'))
            } else {
              this.addrFormRules.consigneePhoneHead = [{
                required: true,
                message: '请选择手机区号',
                trigger: 'change'
              }]
              callback()
            }
          },
          trigger: 'blur'
        }],
        // 电话号头部
        consigneeTelHead: [{
          required: false,
          message: '请输入固话区号',
          trigger: 'change'
        }],
        // 电话号
        consigneeTel: [{
          required: false,
          validator: (rule, value, callback) => {
            if (!value || value.indexOf('*') > 0) return callback()
            if (!/^\d{6,12}$/.test(value)) {
              return callback(new Error('请输入正确的电话号码'))
            } else {
              this.addrFormRules.consigneeTelHead = [{
                required: true,
                message: '请输入固话区号',
                trigger: 'change'
              }]
              callback()
            }
          },
          trigger: 'blur'
        }],

        // 邮编
        consigneeZipCode: [{
          required: false,
          validator: (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入邮政编码'))
            } else if (!/^\d{3,12}$/.test(value)) {
              return callback(new Error('请输入正确的邮政编码'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      },
      // 省市区数据
      frontData: {
        conuntryOptions: '', // 国家
        addressData: [], // 省市区数据
        phoneCode: countries // 手机区号
      },
      errorMsg: false, // 是否显示提示语
      addressKey: 10000 // 省市区下拉
    }
  },
  created() {
    this.frontData.conuntryOptions = getCountryData() // 设置国家下拉数据
    this.frontData.addressData = [] // 省市区下拉数据为空
  },
  // 方法
  methods: {
    // 设置省市区下拉 数据
    setAreaSelectData(code) {
      const areaData = getCurrentData(code) // 获取数据
      // console.log("省市区下拉数据", areaData);
      if (areaData.length === 0) {
        this.isAreaMust = false // 没有省市区, 就不是必填
        this.addrFormRules.addressABC[0].required = false
      } else {
        this.isAreaMust = true // 没有省市区, 就不是必填
        this.addrFormRules.addressABC[0].required = true
      }
      const formatAreaData = addressFormateData(areaData) // 格式化数据
      this.frontData.addressData = formatAreaData // 设置
    },

    // 弹窗打开前
    handleOpen() {
      if (this.addressFormProp && this.formType === 'edit') {
        const propData = JSON.parse(JSON.stringify(this.addressFormProp)) // 拷贝传过来的值
        console.log('编辑地址,子组件接收到值了', propData)

        this.receiverCode = propData.id // 收货地址id
        this.isReverse = !!propData.reverseFlag // 设置是否反转
        this.orderId = propData.orderId ? propData.orderId : '' // 设置订单id号
        // this.reverseFlag = propData.reverseFlag ? propData.reverseFlag : 1 // 是否反转
        this.addrForm = {
          consigneeCountry: propData.consigneeCountry, // 国家
          consigneeName: propData.consigneeName, // 收货人名称
          addressABC: [], // 省市区
          consigneeAddr: propData.consigneeAddr, // 详细地址
          consigneePhoneHead: propData.consigneePhone
            ? propData.consigneePhoneHead
            : '', // 手机区号
          consigneePhone: propData.consigneePhone, // 手机号
          consigneeTelHead: propData.consigneeTel
            ? propData.consigneeTelHead
            : '', // 电话区号
          consigneeTel: propData.consigneeTel, // 电话号
          consigneeZipCode: propData.consigneeZipCode // 邮政编码
        }

        this.setAreaSelectData(this.addrForm.consigneeCountry) // 设置省市区 下拉数据
        if (propData.consigneeProvince) {
          this.addrForm.addressABC[0] = propData.consigneeProvince // 省
        }
        if (propData.consigneeCity) {
          this.addrForm.addressABC[1] = propData.consigneeCity // 市
        }
        if (propData.consigneeCounty) {
          this.addrForm.addressABC[2] = propData.consigneeCounty // 区
        }
      }
    },

    // 确定
    saveAddrForm() {
      this.$refs.addrFormRef.validate(async(valid) => {
        if (!valid) return
        if (!this.addrForm.consigneeTel && !this.addrForm.consigneePhone) { return (this.errorMsg = true) } // 手机号和电话号都没有
        this.errorMsg = false

        const copyData = JSON.parse(JSON.stringify(this.addrForm)) // 拷贝
        const data = {
          consigneeCountry: copyData.consigneeCountry, // 国家

          consigneeProvince: this.addrForm.addressABC[0]
            ? this.addrForm.addressABC[0]
            : '', // 省
          consigneeCity: this.addrForm.addressABC[1]
            ? this.addrForm.addressABC[1]
            : '', // 市
          consigneeCounty: this.addrForm.addressABC[2]
            ? this.addrForm.addressABC[2]
            : '', // 区
          consigneeAddr: copyData.consigneeAddr, // 详细地址

          consigneeName: copyData.consigneeName, // 收货人
          consigneePhoneHead: copyData.consigneePhoneHead, // 手机头部
          consigneePhone: copyData.consigneePhone, // 手机号
          consigneeTelHead: copyData.consigneeTelHead, // 电话头部
          consigneeTel: copyData.consigneeTel, // 电话号
          consigneeZipCode: copyData.consigneeZipCode, // 邮编
          receiverCode: this.receiverCode, // id
          reverseFlag: this.isReverse ? 1 : 0 // 是否反转
        }
        if (this.orderId) {
          data.orderId = this.orderId
          delete data.receiverCode
        }
        console.log(data)
        try {
          // 根据状态执行 不同请求

          let res
          switch (this.formType) {
            case 'create':
              res = await addAddressList(data)
              break
            case 'edit':
              res = this.orderId ? await editOrderAddress(data) : await eidtAddressList(data)
              break
          }

          if (res.status !== 200) return
          this.dialogFormVisible = false // 关闭弹窗
          this.$emit('confirm') // 派发父组件事件
        } catch (error) {
          console.log('失败', error)
        }
      })
    },

    // 弹窗关闭
    dialogClose() {
      this.$refs.addrFormRef.resetFields() // 重置表单
      this.addrFormRules.addressABC[0].required = true // 省市区必填
      this.addrFormRules.consigneePhoneHead[0].required = false // 手机区号非必填
      this.addrFormRules.consigneeTelHead[0].required = false // 电话区号非必填
      this.addrForm = {
        consigneeCountry: '', // 国家
        consigneeName: '', // 收货人名称
        consigneeAddr: '', // 详细地址
        addressABC: [], // 省市区
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '', // 手机号
        consigneeTelHead: '', // 电话区号
        consigneeTel: '', // 电话号
        consigneeZipCode: '' // 邮政编码
      }
      this.isReverse = false // 不反转
      this.receiverCode = '' // 没有id
      this.orderId = '' // 没有订单id
      this.$emit('addressFormDialogClose')
    },

    // 检验只能输入数字
    checkInputValue(typeName) {
      this.addrForm[typeName] = this.addrForm[typeName].replace(/[^\d]/g, '') // 只能输入数字
    },

    // 获取焦点, 清空内容
    phoneFocus(e, isPhoneInput) {
      console.log(e, isPhoneInput)
      e.target.value = '' // 清空输入框的值
      if (isPhoneInput) {
        this.addrForm.consigneePhone = '' // 手机
      } else {
        this.addrForm.consigneeTel = '' // 电话
      }
    },

    // 国家下拉框变化
    countryChange(val) {
      this.addressKey = this.addressKey + 1
      // 1. 清空省市下拉数据, 并重置
      this.frontData.addressData = []
      this.addrForm.addressABC = [] // 清空上次绑定的值
      // console.log(val);
      // 2. 判断是否反转
      if (val !== '1' && val !== 'KOR' && val !== 'PRK' && val !== 'JPN') {
        this.isReverse = true // 不是中国 就反转
      } else {
        this.isReverse = false // 是就不反转
      }
      // 3. 设置省市下拉数据
      this.setAreaSelectData(val)
    }
  }
}
</script>

<style lang="scss">
  .txtCenter {
    text-align: center;
  }

  .zipCode {
    margin-bottom: 0;
  }

  .addressBox {
    display: flex;
    flex-direction: column;

    &.reverse {
      flex-direction: column-reverse;
    }
  }

  .telBox {
    &.mb0 {
      margin-bottom: 0;
    }

    >div {
      display: flex;
      flex-wrap: wrap;
    }

    .el-form-item__error {
      position: relative;
      top: 0;
    }

    p {
      margin: 0;
      padding: 0;
      color: #f56c6c;
    }
  }
</style>
