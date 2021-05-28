<template>
    <div class="content">
        <el-steps :active="active" align-center class="step-bar">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
        </el-steps>
        <div class="step-icon" v-show="submitedSuccess">
            <i class="el-icon-document-checked icon"></i>
            <p>为确认是您本人操作，请完成身份认证</p>
        </div>
        <div class="step-icon" v-show="!submitedSuccess">
            <i class="el-icon-success icon"></i>
            <p>设置完成！</p>
        </div>
        <div class="form-list" v-show="submitedSuccess">
            <div class="el-form-item">
                <label class="el-form-item__label" style="width: 80px;">手机号</label>
                <div class="el-form-item__content" style="margin-left: 80px;">
                    <div data-v-53850f12="" class="el-input">
                        <span>+86 183****4324</span>
                        <el-input v-show="newPhoneInputeShow" v-model="formLabelAlign.name"></el-input>
                    </div>
                </div>
            </div>
            <el-form label-width="80px" :model="formLabelAlign">
                <el-form-item label="验证码" class="item-get-code">
                    <el-input v-model="formLabelAlign.name" placeholder="短信验证码"></el-input>
                    <el-button @click="getVerfyCode" class="get-code-btn">{{btnText}}</el-button>
                </el-form-item>
                <el-form-item class="item-btn">
                    <el-button type="primary" plain @click="exit">取消</el-button>
                    <el-button
                    v-show="!hasSubmited"
                    type="primary"
                    @click="next"
                    >下一步</el-button>
                    <el-button
                    type="primary"
                    v-show="hasSubmited"
                    @click="onSubmit">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            active: 1,
            newPhoneInputeShow: false,
            getCodeMsg: false,
            hasSubmited: false,
            submitedSuccess: true,
            btnText: '获取验证码',
            btnDisabled: false,
            formLabelAlign: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
        };
    },

    methods: {
        exit() {
            this.$router.push('/information')
        },
        next() {
            if(this.formLabelAlign.name){
                if(this.active++ > 0) this.hasSubmited = true;
            } else {
                this.$message('请输入验证码！');
            }
        },
        onSubmit() {
            console.log('submit!');
            if(this.active++ > 2) this.active = 2;
            this.submitedSuccess = false;
        },
        getVerfyCode() {
            if (this.btnDisabled) return;
            this.btnDisabled = true;
            this.btnText = '60s后重新获取';
            let count = 60;
            this.setIntID = setInterval(() => {
                count--;
                if (count === 0) {
                clearInterval(this.setIntID);
                this.btnText = '获取验证码';
                this.btnDisabled = false;
                return;
                }
                this.btnText = count < 10 ? `0${count}s后重新获取` : `${count}s后重新获取`;
            }, 1000);
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