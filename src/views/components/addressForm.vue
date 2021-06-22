<template>
  <el-dialog
    center
    :title="dialogStatus === 'create' ? `新增收货地址` : `编辑收货地址`"
    :visible.sync="dialogFormVisible"
    width="620px"
    @open="handleOpen"
    @close="dialogClose"
  >
    <div>
      <el-form
        label-width="90px"
        size="medium"
        :model="addrForm"
        :rules="addrFormRules"
        ref="addrFormRef"
      >
        <!-- 国家/地区 必填 -->
        <el-form-item label="国家/地区" prop="consigneeCountry">
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
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 收货人 必填 -->
        <el-form-item label="收货人" prop="consigneeName">
          <!-- 文本框 -->
          <el-input
            v-model.trim="addrForm.consigneeName"
            placeholder="请输入收货人姓名"
          ></el-input>
        </el-form-item>

        <!-- 街道地址 必填-->
        <el-form-item label="街道地址" prop="consigneeAddr">
          <!-- textarea -->
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3 }"
            placeholder="街道地址，邮政信箱，公司名称，转交方，公寓，套房，单元，大厦，楼层等"
            v-model.trim="addrForm.consigneeAddr"
          ></el-input>
        </el-form-item>
        <!-- 州/省/地区 必填-->
        <el-form-item label="州/省/地区">
          <!-- 级联选择 -->
          <el-col :span="10">
            <el-form-item prop="consigneeProvince" ref="provinceRef">
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
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="10">
            <el-form-item prop="consigneeCity" ref="cityRef">
              <el-select v-model="addrForm.consigneeCity" placeholder="城市">
                <el-option
                  v-for="item in frontData.city"
                  :key="item.Name"
                  :label="item.Name"
                  :value="item.Name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 手机区号 + 手机号 -->
        <el-form-item label="手机">
          <!-- select选择器+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneePhoneHead">
              <el-select
                v-model="addrForm.consigneePhoneHead"
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
          <el-col :span="17">
            <el-form-item prop="consigneePhone">
              <el-input
                type="tel"
                placeholder="请输入您的手机号码"
                v-model.trim="addrForm.consigneePhone"
                @input="checkInputValue('consigneePhone')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 固定电话 -->
        <el-form-item label="固定电话">
          <!-- 下拉+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneeTelHead">
              <el-input
                v-model="addrForm.consigneeTelHead"
                placeholder="固话区号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="17">
            <el-form-item prop="consigneeTel">
              <el-input
                type="tel"
                placeholder="请输入您的固定电话"
                v-model.trim="addrForm.consigneeTel"
                @input="checkInputValue('consigneeTel')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <!-- 邮政编码 必填 -->
        <el-form-item label="邮政编码" class="zipCode" prop="consigneeZipCode">
          <!-- 文本框 -->
          <el-input
            type="text"
            placeholder="请输入邮政编码"
            v-model="addrForm.consigneeZipCode"
            @input="checkInputValue(`consigneeZipCode`)"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <!-- 取消 -->
      <el-button type="info" size="medium" @click="dialogFormVisible = false"
        >取消</el-button
      >
      <!-- 确定 -->
      <el-button type="primary" size="medium" @click="saveAddrForm"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import countryData from "@/views/components/resource/locList_zh_CN"; // 国家
import { countries } from "@/views/components/resource/phoneCodeCountries"; // 手机区号
import { addAddressList, eidtAddressList } from "@/api/address.js";
export default {
  name: "AddressForm",
  props: {
    // 编辑表单时接收表单信息
    setAddrForm: {
      type: Object,
      required: false,
    },
  },

  // 数据
  data() {
    // 校验 手机号
    var checkPhone = (rule, value, callback) => {
      if (!value || value.indexOf("*") > 0) return callback();
      if (value && !/^\d{0,11}$/.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    // 校验 固定电话
    var checkTel = (rule, value, callback) => {
      if (!value) return callback();
      if (!/^\d{7,8}$/.test(value)) {
        return callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    // 校验 邮编
    var checkZipCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入邮政编码"));
      } else {
        callback();
      }
    };

    return {
      // 页面参数
      dialogStatus: "create", // 哪种弹窗 create:创建 edit:编辑
      dialogFormVisible: false, // 是否显示弹窗

      // 收货地址表单
      addrForm: {
        consigneeCountry: "", // 国家
        consigneeName: "", // 收货人名称
        consigneePhoneHead: "", // 手机区号
        consigneePhone: "", // 手机号
        consigneeTelHead: "", // 电话区号
        consigneeTel: "", // 电话号
        consigneeAddr: "", // 详细地址
        consigneeProvince: "", // 省/州/地区
        consigneeCity: "", // 地区
        consigneeZipCode: "", // 邮政编码
      },
      // 收货地址表单 校验规则
      addrFormRules: {
        // 国家
        consigneeCountry: [
          { required: true, message: "请选择国家", trigger: "change" },
        ],
        // 收货人
        consigneeName: [
          { required: true, message: "请输入收件人名称", trigger: "blur" },
        ],
        // 收货地址
        consigneeAddr: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        // 手机号头部
        consigneePhoneHead: [{ required: false, trigger: "change" }],
        // 手机号
        consigneePhone: [
          { required: false, validator: checkPhone, trigger: "blur" },
        ],
        // 电话号头部
        consigneeTelHead: [{ required: false, trigger: "change" }],
        // 电话号
        consigneeTel: [
          { required: false, validator: checkTel, trigger: "blur" },
        ],
        // 省份
        consigneeProvince: [
          {
            required: false,
            message: "请选择省份",
            trigger: "change",
          },
        ],
        // 市
        consigneeCity: [
          {
            required: false,
            message: "请选择市",
            trigger: "change",
          },
        ],
        // 邮编
        consigneeZipCode: [
          { required: true, validator: checkZipCode, trigger: "blur" },
        ],
      },
      // 省市区数据
      frontData: {
        conuntryOptions: countryData.Location.CountryRegion, // 国家
        province: [], // 省
        city: [], // 市
        phoneCode: countries, // 手机区号
      },
    };
  },
  // 方法
  methods: {
    // 弹窗打开前
    handleOpen() {
      if (this.setAddrForm && this.dialogStatus === "edit") {
        this.addrForm = JSON.parse(JSON.stringify(this.setAddrForm)); // 表单赋值
      } else {
        this.addrForm = {
          consigneeCountry: "", // 国家
          consigneeName: "", // 收货人名称
          consigneePhoneHead: "", // 手机区号
          consigneePhone: "", // 手机号
          consigneeTelHead: "", // 电话区号
          consigneeTel: "", // 电话号
          consigneeAddr: "", // 详细地址
          consigneeProvince: "", // 省/州/地区
          consigneeCity: "", // 地区
          consigneeZipCode: "", // 邮政编码};
        };
      }
      this.countryChange(this.addrForm.consigneeCountry); // 设置国家
      this.provinceChange(this.addrForm.consigneeProvince); // 设置市
    },

    // 确定
    saveAddrForm() {
      /**
       * 1. 表单预校验
       * 2. 校验通过,
       * 3. 是否有id,且是编辑eidt, 得到参数
       * 4. 发送请求
       * 5. 关闭弹窗
       * 6. 派发给父组件一个事件
       */
      this.$refs.addrFormRef.validate(async (valid) => {
        if (!valid) return;
        const copyData = JSON.parse(JSON.stringify(this.addrForm)); // 拷贝
        const data = {
          consigneeCountry: copyData.consigneeCountry, // 国家
          consigneeProvince: copyData.consigneeProvince, // 省
          consigneeCity: copyData.consigneeCity, // 市
          consigneeAddr: copyData.consigneeAddr, // 详细地址

          consigneeCounty: copyData.consigneeCounty
            ? copyData.consigneeCounty
            : "", // 县

          consigneeName: copyData.consigneeName, // 收货人
          consigneePhoneHead: copyData.consigneePhoneHead, // 手机头部
          consigneePhone: copyData.consigneePhone, // 手机号
          consigneeTelHead: copyData.consigneeTelHead, // 电话头部
          consigneeTel: copyData.consigneeTel, // 电话号
          consigneeZipCode: copyData.consigneeZipCode,
          receiverCode: copyData.id ? copyData.id : "", // id
        };
        try {
          // 根据状态执行 不同请求
          const { status } =
            this.dialogStatus === "create"
              ? await addAddressList(data)
              : await eidtAddressList(data);
          if (status !== 200) return;
          this.dialogFormVisible = false; // 关闭弹窗
          this.$emit("confirm"); // 派发父组件事件
        } catch (error) {
          console.log("失败", error);
        }
      });
    },
    // 弹窗关闭
    dialogClose() {
      this.$refs.addrFormRef.resetFields(); // 重置表单
    },
    // 检验只能输入数字
    checkInputValue(typeName) {
      this.addrForm[typeName] = this.addrForm[typeName].replace(/[^\d]/g, ""); // 只能输入数字
    },
    // 国家下拉框变化
    countryChange(val) {
      this.frontData.province = [];
      this.frontData.city = [];
      if (this.$refs.provinceRef) {
        this.$refs.provinceRef.resetField(); // 省重置
        this.$refs.cityRef.resetField(); // 市重置
      }

      countryData.Location.CountryRegion.map((item) => {
        if (item.Name !== val) return;
        if (!item.State) return;
        if (Array.isArray(item.State) && item.State.length > 0) {
          this.frontData.province = item.State ? item.State : []; // 有省
        } else {
          this.frontData.province = item.State.City ? item.State.City : []; // 无省份
        }
      });
    },
    // 省下拉
    provinceChange(val) {
      if (!this.frontData.province) return;
      if (this.$refs.cityRef) {
        this.$refs.cityRef.resetField(); // 市重置
      }
      this.frontData.province.map((item) => {
        if (item.Name === val) {
          this.frontData.city = item.City ? item.City : [];
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.txtCenter {
  text-align: center;
}
.zipCode {
  margin-bottom: 0;
}
</style>
