<template>
  <div class="app-container wrapper">
    <el-dialog title="发票信息" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="发票抬头">
          <el-radio-group v-model="form.type" @change="changeType">
            <el-radio :label="0">个人</el-radio>
            <el-radio :label="1">单位</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="form.type === 0">
          <el-form-item label="个人名称" prop="name">
            <el-input v-model="form.name" style="width: 310px"></el-input>
          </el-form-item>
        </div>
        <div v-show="form.type !== 0">
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
            <el-radio :label="0">商品明细</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收票人手机" prop="tel">
          <el-select
            class="no-error"
            v-model="form.regionNo"
            placeholder=""
            style="width: 70px"
          >
            <el-option label="+86" value="86"></el-option>
          </el-select>
          <el-input
            v-model="form.tel"
            style="width: 200px; margin-left: 10px"
          ></el-input>
        </el-form-item>
        <el-form-item label="收票人邮箱" prop="mail">
          <el-input v-model="form.mail" style="width: 310px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { telValidate, emailValidate } from "@/utils/index.js";
export default {
  data() {
    // 手机号验证
    const telFormValidate = (rule, value, callback) => {
      if (value !== "") {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      form: {
        type: 0,
        name: "hello",
        catalog: 0,
        tel: "",
        mail: "",
        regionNo:"86",
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
        tel: [{ validator: telFormValidate, trigger: "change" }],
      },
    };
  },
  methods: {
    changeType() {
      this.$refs.form.clearValidate();
    },
    submit() {
      let checked = true;
      if (this.form.type === 0) {
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
      if (this.form.tel != "" && !telValidate(this.form.tel)) {
        // this.$refs.form.validateField("companyNumber");
        checked = false;
      }

      if (this.form.mail != "" && !emailValidate(this.form.mail)) {
        // this.$refs.form.validateField("companyNumber");
        checked = false;
      }
      if (checked) {
        if (this.form.type === 0) {
          this.$parent.receipt = this.form.name;
        } else {
          this.$parent.receipt = this.form.companyName;
        }
        this.dialogVisible = false;
        console.log("success");
      }
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>
<style >
.el-form-item.is-error .no-error .el-input__inner {
  border-color: #dcdfe6;
}
</style>

