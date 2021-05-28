<template>
    <div v-show="value" class="modify">
        <div class="vicp-wrap">
            <div class="vicp-header">
                <span>昵称填写</span>
                <i class="vicp-close" @click="off"><i class="vicp-icon4"></i></i>
            </div>
            <div class="modify-cont">
                <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="昵称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="生日">
                    <el-col :span="6">
                    <el-date-picker type="date" placeholder="年" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="6">
                    <el-time-picker placeholder="月" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="单选">
                    <el-radio-group v-model="form.resource">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="复选框">
                    <el-checkbox-group v-model="form.type">
                    <el-checkbox label="写作" name="type"></el-checkbox>
                    <el-checkbox label="阅读" name="type"></el-checkbox>
                    <el-checkbox label="游戏" name="type"></el-checkbox>
                    <el-checkbox label="单光" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input type="textarea" v-model="form.desc" placeholder="详细地址"></el-input>
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

export default {
    props: {
        // 显示该控件与否
        value: {
            type: Boolean,
            default: true
        }
    },
	data() {
		return {
            form: {
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
        // 关闭控件
        off() {
            this.$emit('close')
        },
        onSubmit() {
            console.log('submit!');
        }
    },
	components: {}
};
</script>


<style lang="scss" scoped>
.modify{
    position: fixed;
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 10000;
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
        height: 70%;
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
        content: "";
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
            margin-left: -80px;
            text-align: center;
        }
    }
}
</style>