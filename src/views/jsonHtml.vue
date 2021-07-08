<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="货品bizId" prop="cargoId">
    <el-input v-model="ruleForm.cargoId"></el-input>
  </el-form-item>
  <el-form-item label="购买数量" prop="buyAmount">
     <el-input v-model="ruleForm.buyAmount"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import {cartAdd} from '@/api/cart'
  export default {
    data() {
      return {
        ruleForm: {
          cargoId: '',
          buyAmount: '',
        
        },
        rules: {
          cargoId: [
            { required: true, message: '货品bizId', trigger: 'blur' }
            
          ],
          buyAmount: [
            { type: 'number',required: true, message: '购买数量', trigger: 'change' }
          ],
          
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log(formName)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
     async addCart(){
       let res = await cartAdd()
      }
    }
  }
</script>
<style  scoped>

</style>