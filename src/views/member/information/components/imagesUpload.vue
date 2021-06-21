<template>
    <div v-show="value" class="images-upload">
        <div class="vicp-wrap">
            <div class="vicp-header">
                <span>头像上传</span>
                <span class="vicp-close" @click="off"><i class="vicp-icon4"></i></span>
            </div>
            <div class="crop-upload">
                <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img
                    v-if="imageUrl"
                    class="avatar"
                    :src="imageUrl"
                    >
                    <i
                    v-else
                    class="el-icon-plus avatar-uploader-icon"
                    ></i>
                </el-upload>
                <p>只支持JPG、PNGBMP,大小不超过3M</p>
            </div>
            <div class="vicp-button">
                <el-button type="primary" @click="off" plain>取消</el-button>
                <el-button type="primary" @click="onSubmit">保存</el-button>
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
            imageUrl: ''
        }
    },
    methods: {
        // 保存头像
        onSubmit() {
            if(this.imageUrl) {
                this.$parent.data.url = this.imageUrl
            }
            this.$emit('close')
        },
        // 关闭控件
        off() {
            this.$emit('close')
        },
        // 上传图像
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        }
    },
    components: {}
}
</script>
<style lang="scss" scoped>
.images-upload{
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
        height: 330px;
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
    // 头像上传
    .crop-upload{
        text-align: center;
        margin: 40px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 95px;
        height: 95px;
        line-height: 95px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar {
        width: 95px;
        height: 95px;
        display: block;
        border: 1px solid #ddd;
        border-radius: 50%;
        overflow: hidden;
    }
    .vicp-button{
        text-align: center;
    }
}
</style>