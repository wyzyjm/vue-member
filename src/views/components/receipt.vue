<template>
  <div class="app-container wrapper">
    <el-dialog title="发票信息" :visible.sync="dialogVisible" width="550px">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="发票抬头">
          <el-radio-group v-model="form.type" @change="changeType">
            <el-radio :label="1">个人</el-radio>
            <el-radio :label="2">单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="form.type === 1">
          <el-form-item label="个人名称" prop="name">
            <el-input v-model="form.name" style="width: 310px"></el-input>
          </el-form-item>
        </div>
        <div v-show="form.type !== 1">
          <el-form-item label="单位名称" prop="companyName">
            <el-input
              v-model="form.companyName"
              style="width: 310px"
            ></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="companyNumber">
            <el-input
              v-model="form.companyNumber"
              style="width: 310px"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="发票内容">
          <el-radio-group v-model="form.catalog">
            <el-radio label="商品明细">商品明细</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收票人手机" prop="phone">
          <!-- 手机区号+手机号 -->
          <el-col :span="6">
            <el-form-item>
              <el-select
                v-model="form.phonePrefix"
                placeholder="请选择"
                filterable
                style="width: 100px"
              >
                <el-option
                  v-for="(item, index) in frontData.phoneCode"
                  :key="index"
                  :label="item.dialCode"
                  :value="`${item.iso2}${item.dialCode}`"
                >
                  <span> {{ item.dialCode }} {{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="phone">
              <el-input
                v-model="form.phone"
                style="width: 200px; margin-left: 10px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="收票人邮箱" prop="mail">
          <el-input v-model="form.mail" style="width: 310px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { telValidate, emailValidate } from "@/utils/index.js";
import { addUpdateInvoice, getSettle, getSettleById } from "@/api/settlement";

import { countries } from "@/views/components/resource/phoneCodeCountries"; // 手机区号
export default {
  props: {
    saveLibray: {
      type: Boolean,
      default: true,
    },
    invoiceId:{
      type:String,
      default:''
    }

  },
computed:{
    getPhonePrefix(){
      if(this.form.phonePrefix&&this.form.phonePrefix.split("+").length==2){
        return "+"+this.form.phonePrefix.split("+")[1]
      }else{
        return ''
      }
    }
  },

  data() {
    // 手机号验证
    const telFormValidate = (rule, value, callback) => {
      if (value !== "") {
        if (!/^\d{6,12}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      form: {
        invoiceId: "",
        type: 1,
        name: "",
        catalog: "商品明细",
        phone: "",
        mail: "",
        phonePrefix: "",
        companyName: "",
        companyNumber: "",
      },
      rules: {
        name: [{ required: true, message: "请输入个人名称", trigger: "blur" }],
        companyName: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
        ],
        companyNumber: [
          { required: true, message: "请输入纳税人识别号", trigger: "blur" },
        ],
        mail: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ validator: telFormValidate, trigger: "change" }],
      },
      loading: false,
      // 省市区数据
      frontData: {
        // 手机区号
        phoneCode: countries,
      },
    };
  },
  methods: {
    changeType() {
      this.$refs.form.clearValidate();
    },
    submit() {
      let checked = true;
      this.loading = true;
      if (this.form.type === 1) {
        if (this.form.name == "") {
          this.$refs.form.validateField("name");
          checked = false;
        }
      } else {
        if (this.form.companyName === "") {
          // this.$refs.form.validateField("companyName");
          checked = false;
        }
        if (this.form.companyNumber === "") {
          // this.$refs.form.validateField("companyNumber");
          checked = false;
        }
      }
      if (this.form.phone != "" && !telValidate(this.form.phone)) {
        // this.$refs.form.validateField("companyNumber");
        checked = false;
      }

      if (this.form.mail != "" && !emailValidate(this.form.mail)) {
        // this.$refs.form.validateField("companyNumber");
        checked = false;
      }

      if (checked) {
        if (this.saveLibray) {
          let params = {};
          if (this.form.invoiceId != "") {
            params.invoiceId = this.form.invoiceId; //发票id
          }
          params.email = this.form.mail; //邮箱
          params.invoiceContent = this.form.catalog; //发票内容
          params.invoiceTitle =
            this.form.type === 1 ? this.form.name : this.form.companyName; //发票抬头
          params.invoiceType = this.form.type; //发票类型
          params.phone = this.form.phone; //手机
          params.phonePrefix = this.form.phonePrefix;
          if (this.form.type === 2) {
            params.taxpayerId = this.form.companyNumber; //纳税人识别号
          }
          addUpdateInvoice(params).then((res) => {
            if (res.status === 200) {
              this.loading = false;
              this.dialogVisible = false;
              this.form.invoiceId = res.data;
              this.$emit("formData", this.form);
            } else {
              this.$message.error(res.msg);
            }
          });
        }else{
          this.loading = false;
          this.dialogVisible = false;
          this.$emit("formData", this.form);
        }
      } else {
        this.loading = false;
      }
    },
    backContent(data) {
      this.form.type = data.invoiceType;
      if (data.invoiceType === 1) {
        this.form.name = data.invoiceTitle;
      } else {
        this.form.companyName = data.invoiceTitle;
        this.form.companyNumber = data.taxpayerId;
      }
      this.form.catalog = data.invoiceContent;
      this.form.phone = data.phone;
      this.form.mail = data.email;
      this.form.phonePrefix = data.phonePrefix;
    },
  },
  mounted() {
     if(this.invoiceId!=''){
      this.form.invoiceId = this.invoiceId
    }

    if (this.form.invoiceId === "") {
      getSettle().then((res) => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            let data = res.data[0];
            this.backContent(data);
          }
        }
      });
    } else {
      let params = {};
      params.id = this.form.invoiceId;
      getSettleById(params).then((res) => {
        if (res.status === 200) {
          if (res.data != null) {
            let data = res.data;
            this.backContent(data);
          }
        }
      });
    }
  },
};
</script>
<style scoped>
</style>
<style >
.el-form-item.is-error .no-error .el-input__inner {
  border-color: #dcdfe6;
}
</style>

