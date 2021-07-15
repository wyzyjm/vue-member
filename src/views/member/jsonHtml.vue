<template>
  <div class="el-content">
    	<page-title :pagetitle="title"> </page-title>
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForms">
      <el-form-item label="货品bizId" prop="cargoId">
        <el-input v-model="ruleForm.cargoId" placeholder="请输入货品ID"></el-input>
      </el-form-item>
      <el-form-item label="购买数量" prop="buyAmount">
        <el-input v-model="ruleForm.buyAmount" type='number' placeholder="请输入购买数量"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium ">加入购物车列表</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
   
</template>
<script>
import pageTitle from "../components/pageTitle";
import {addCarts} from '@/api/menu'
  export default {
    data() {
      return {
        title:'添加购物车列表',
        ruleForm: {
          cargoId:'854418768679460864',
          buyAmount: 3,
        
        },
        rules: {
          cargoId: [
            { required: true, message: '货品bizId', trigger: 'blur' }
            
          ],
          buyAmount: [
            { required: true, message: '购买数量', trigger: 'blur' }
          ],
          
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addCart(this.ruleForm)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
     
     async addCart(formName){
        let res = await addCarts(formName);
        let data = res
        if(data.status == 200){
           this.$message({
                  message: '恭喜你，这是一条成功消息',
                  type: 'success'
            });
          
          this.ruleForm.cargoId='';
          this.ruleForm.buyAmount=''
        }else{
          this.$message({
                  message: '添加失败',
                  type: 'info'
            });
        }
       
      }
    },
    components:{
      pageTitle
    }
  }
</script>
<style  scoped>
.el-content{
  margin: 0px auto;
}
.ruleForms{
  margin-top: 50px;
}
</style>