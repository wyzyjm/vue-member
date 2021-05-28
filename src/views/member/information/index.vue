<template>
  <div class="app-container">
    <page-title :pagetitle='title'>
			<!-- <slot slot="slot">搜索</slot> -->
		</page-title>
    <div class="content">
        <!-- 头像 -->
        <div class="block user">
            <el-image
            :src="data.url"
            class="uimges"
            @click="vicpWarpShow = true"></el-image>
          <div class="username">
              <p><i></i>{{data.user.levelName}}</p>
              <p>{{data.user.userName}}</p>
          </div>
        </div>
        <!-- 基础信息 -->
        <div class="customList">
          <div class="item">
            <p>
              <span>昵称</span>
              <span>还没有昵称</span>
            </p>
            <el-button type="text" @click="modifyShow = true">编辑</el-button>
          </div>
          <div
            v-for="(item, index) in data.customList"
            :key="index"
            class="item">
            <p>
              <span>{{item.attrName}}</span>
              <span>{{item.description ? item.description : '还没有姓名'}}</span>
            </p>
            <div>
              <el-button type="text">编辑</el-button>
              <el-button type="text" @click="setting">更换手机号</el-button>
            </div>
          </div>
        </div>
        <!-- 修改内容 -->
        <images-upload 
        v-show="vicpWarpShow"
        @close="close"
        @crop-upload-success="cropSuccess"/>
        <modify
        v-show="modifyShow"
        @close="close"
        />
    </div>
  </div>
</template>

<script>
// import { getData } from '@/api/information'
import pageTitle from "@/views/components/pageTitle"
import imagesUpload from './components/imagesUpload'
import modify from './components/modify'

export default {
  components: { 
    imagesUpload,
    modify,
    pageTitle
  },
  data() {
    return {
			title: "我的资料",
      vicpWarpShow: false,
      modifyShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      data: {
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        user: {
            "userId": 123,
            "levelId": 34,
            "levelName": "黄金会员",
            "userName": "用户名",
            "nickName": "昵称",
                "name": "姓名",
            "avatar": "头像路径",
            "phone": "手机",
            "email": "zhongqi@300.cn",
            "qq": "1423568976",
            "weChat": "微信",
            "weibo": "微博",
            "pwd": "密码"
        },
        customList: [{
            "attrId": 1234,
            "attrName": "自定义属性名称",
            "attrValue": "属性值", 
            "attrDetailType": 0,
            "attrDetailType": "text",
            "description": "提示语",
            "optionsData": "篮球,乒乓球,羽毛球,各种球", 
            "unit": "kg",
            "required": true
        }]
      }
    }
  },
  created() {
  },
  methods: {
    cropSuccess(resData) {
      this.vicpWarpShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.vicpWarpShow = false
      this.modifyShow = false
    },
    setting() {
      this.$router.push('/informationSetting')
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding:40px 0 0 130px;
  width: 70%;
}
.user{
  display: flex;
  margin-left: 130px;
  margin-bottom: 50px;
  position: relative;
  .username{
    text-align: center;
  }
  &::after{
    content: '编辑头像';
    width: 100px;
    text-align: center;
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba($color: #000000, $alpha: 0.3);
  }
  .uimges{
    margin-right: 30px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
}
.item{
  display: flex;
  justify-content: space-between;
  span{
    margin-right: 30px;
  }
  span:nth-child(1){
    width: 100px;
    display: inline-block;
    text-align: right;
  }
}
</style>
