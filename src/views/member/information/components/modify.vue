<template>
  <div
    v-show="value"
    class="modify"
  >
    <div class="vicp-wrap">
      <div class="vicp-header">
        <span v-if="modifyType != 'nickName' && modifyType != 'name'">{{ selfDefining.attrName }}</span>
        <span v-else>{{ modifyType === 'nickName' ? '昵称' : '姓名' }}</span>
        <span class="vicp-close" @click="off"><i class="vicp-icon4" /></span>
      </div>
      <div
        v-if="form"
        class="modify-cont"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="30%"
        >
          <el-form-item v-if="modifyType === 'name' || modifyType === 'nickName'" :label="modifyType === 'nickName' ? '昵称' : '姓名'">
            <el-input
              v-model="form.name"
            />
          </el-form-item>
          <el-form-item v-show="selfDefining.attrDetailType === 'simpleDate'" :label="selfDefining.attrName" class="block">
            <el-date-picker
              v-model="form.modifyData"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            />
          </el-form-item>
          <!-- 文字 -->
          <el-form-item v-if="selfDefining.attrDetailType === 'text'" :label="selfDefining.attrName">
            <el-input
              v-model="form.modifyData"
            />
          </el-form-item>
          <!-- 下拉单选 -->
          <el-form-item v-if="selfDefining.attrDetailType === 'selSigle'" :label="selfDefining.attrName">
            <el-select v-model="form.modifyData" placeholder="请选择">
              <el-option
                v-for="item in selfDefining.optionsData"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- 下拉多选 -->
          <el-form-item v-if="selfDefining.attrDetailType === 'selMulti'" :label="selfDefining.attrName">
            <el-select v-model="form.modifyData" multiple placeholder="请选择">
              <el-option
                v-for="item in selfDefining.optionsData"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- redio -->
          <el-form-item v-if="selfDefining.attrDetailType === 'redio' && modifyType != 'nickName' && modifyType != 'name'" :label="selfDefining.attrName">
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
          <el-form-item v-if="selfDefining.attrDetailType === 'checkbox'" :label="selfDefining.attrName">
            <el-checkbox-group v-model="form.type">
              <el-checkbox
                v-for="item in selfDefining.optionsData"
                :key="item.key"
                :label="item.value"
                :name="item.value"
              />
            </el-checkbox-group>
          </el-form-item>
          <!-- 图片集 -->
          <el-form-item v-if="selfDefining.attrType === 'image'" :label="selfDefining.attrName">
            图片集
            <img
              v-for="item in selfDefining.optionsData"
              :key="item.key"
              :src="item.type"
              :alt="item.type"
            >
          </el-form-item>
          <!-- 多行文本 -->
          <el-form-item v-if="selfDefining.attrDetailType === 'multiTxt'" :label="selfDefining.attrName">
            <el-input
              v-model="form.modifyData"
              type="textarea"
              placeholder="详细地址"
            />
          </el-form-item>
          <!-- 地址级联 -->
          <el-form-item v-if="selfDefining.attrDetailType === 'area'" :label="selfDefining.attrName">
            <el-form-item>
              <el-col :span="7">
                <!-- 国家/地区 必填 -->
                <el-form-item prop="consigneeCountry">
                  <!-- select选择器 -->
                  <el-select
                    v-model="addrForm.consigneeCountry"
                    placeholder="请选择国家"
                    @change="countryChange"
                  >
                    <el-option
                      v-for="(item, index) in frontData.conuntryOptions"
                      :key="index"
                      :label="item.Name"
                      :value="item.Name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="txtCenter">-</el-col>
              <!-- 级联选择 -->
              <el-col :span="7">
                <el-form-item ref="provinceRef" prop="consigneeProvince">
                  <el-select
                    v-model="addrForm.consigneeProvince"
                    placeholder="省份"
                    @change="provinceChange"
                  >
                    <el-option
                      v-for="item in frontData.province"
                      :key="item.Name"
                      :label="item.Name"
                      :value="item.Name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="txtCenter">-</el-col>
              <el-col :span="7">
                <el-form-item ref="cityRef" prop="consigneeCity">
                  <el-select v-model="addrForm.consigneeCity" placeholder="城市">
                    <el-option
                      v-for="item in frontData.city"
                      :key="item.Name"
                      :label="item.Name"
                      :value="item.Name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form-item>
          <el-form-item class="align-center">
            <el-button type="primary" @click="off" plain>取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import countryData from '@/views/components/resource/locList_zh_CN' // 国家
import { updateMember } from '@/api/user'

export default {
  props: {
    // 显示该控件与否
    value: {
      type: Boolean,
      default: true
    },
    modifyType: {
      type: String,
      default: ''
    },
    selfDefining: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      bizId: '854299120902660096',
      // 编辑项目
      editItem: {
        0: {
          type: 'nickName',
          name: '昵称'
        },
        1: {
          type: 'name',
          name: '姓名'
        },
        2: {
          type: 'phone',
          name: '手机'
        },
        3: {
          type: 'email',
          name: '邮箱'
        },
        4: {
          type: 'attrName',
          name: '自定义'
        }
      },
      form: {
        name: '',
        modifyData: '', // 修改数据
        type: []
      },
      // 收货地址表单
      addrForm: {
        consigneeCountry: '', // 国家
        consigneeName: '', // 收货人名称
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '', // 手机号
        consigneeTelHead: '', // 电话区号
        consigneeTel: '', // 电话号
        consigneeAddr: '', // 详细地址
        consigneeProvince: '', // 省/州/地区
        consigneeCity: '', // 地区
        consigneeZipCode: '' // 邮政编码
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
        conuntryOptions: countryData.Location.CountryRegion, // 国家
        province: [], // 省
        city: [] // 市
      }
    }
  },
  methods: {
    // 关闭控件
    off() {
      this.form.modifyData = ''
      this.form.name = ''
      this.$emit('close')
    },
    // 提交数据
    async onSubmit() {
      let subdata = {}
      if (this.modifyType === 'name') {
        subdata = { bizId: this.bizId, name: this.form.name }
      } else if (this.modifyType === 'nickName') {
        subdata = { bizId: this.bizId, nickname: this.form.name }
      } else if (this.modifyType === 'checkbox') {
        subdata = { bizId: this.bizId, eg: [
          {
            key: this.modifyType,
            value: this.form.type
          }
        ]
        }
      } else {
        subdata = { bizId: this.bizId, eg: [
          {
            key: this.modifyType,
            value: this.form.modifyData
          }
        ]
        }
      }
      const res = await updateMember(subdata)
      if (res.status !== 200) return
      this.form.modifyData = ''
      this.form.name = ''
      this.$emit('close')
      // location.reload()
    },
    // 国家下拉框变化
    countryChange(val) {
      this.frontData.province = []
      this.frontData.city = []
      if (this.$refs.provinceRef) {
        this.$refs.provinceRef.resetField() // 省重置
        this.$refs.cityRef.resetField() // 市重置
      }

      countryData.Location.CountryRegion.map((item) => {
        if (item.Name !== val) return
        if (!item.State) return
        if (Array.isArray(item.State) && item.State.length > 0) {
          this.frontData.province = item.State ? item.State : [] // 有省
        } else {
          this.frontData.province = item.State.City ? item.State.City : [] // 无省份
        }
      })
    },
    // 省下拉
    provinceChange(val) {
      if (!this.frontData.province) return
      if (this.$refs.cityRef) {
        this.$refs.cityRef.resetField() // 市重置
      }
      this.frontData.province.map((item) => {
        if (item.Name === val) {
          this.frontData.city = item.City ? item.City : []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
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
        height: 3px;
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
    .vicp-icon4:hover {
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
    }
    .modify-cont{
        padding: 50px;
        .align-center{
            margin-left: -40%;
            margin-top: 100px;
            text-align: center;
        }
    }
}
</style>
