<template>
  <div class="app-container">
    <PageTitle :pagetitle="title">
    <!-- <slot slot="slot">搜索</slot> -->
    </PageTitle>
    <div v-if="data" class="content">
      <!-- 头像 -->
      <div class="block user">
        <el-image
          :src="data.user.avatar"
          class="uimges"
          @click="vicpWarpShow = true"
        />
        <div class="username">
          <p class="member-order"><SvgIcon name="icon-huiyuan" class="icon" />{{ data.user.memberLevel }}</p>
          <p>{{ data.user.userName }}</p>
        </div>
      </div>
      <!-- 基础信息 -->
      <div class="customList">
        <div class="item">
          <p>
            <span>昵称</span>
            <span>{{ data.user.nickName ? data.user.nickName : '还没有昵称' }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">编辑</el-button>
        </div>
        <div class="item">
          <p>
            <span>姓名</span>
            <span>{{ data.user.name ? data.user.name : '还没有姓名' }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">编辑</el-button>
        </div>
        <div class="item">
          <p>
            <span>手机</span>
            <span>{{ data.user.phoneHead }}{{ data.user.phone ? data.user.phone : '还没有手机号' }}</span>
          </p>
          <div>
            <el-button type="text" @click="setting">更换手机</el-button>
            <el-button type="text" @click="modifyShow = true">绑定手机</el-button>
            <el-button type="text">解绑手机</el-button>
          </div>
        </div>
        <div class="item">
          <p>
            <span>邮箱</span>
            <span>{{ data.user.email ? data.user.email : '还没有添加邮箱' }}</span>
          </p>
          <div>
            <el-button type="text" @click="modifyShow = true">更换邮箱</el-button>
            <el-button type="text" @click="modifyShow = true">绑定邮箱</el-button>
            <el-button type="text" @click="modifyShow = true">解绑邮箱</el-button>
          </div>
        </div>
        <div class="item">
          <p>
            <span>QQ</span>
            <span>{{ data.user.qq ? data.user.qq : '还没有绑定QQ' }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">解绑</el-button>
        </div>
        <div class="item">
          <p>
            <span>微信</span>
            <span>{{ data.user.weChat ? data.user.weChat : '还没有绑定微信' }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">解绑</el-button>
        </div>
        <div class="item">
          <p>
            <span>微博</span>
            <span>{{ data.user.weibo ? data.user.weibo : '还没有绑定微博' }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">解绑</el-button>
        </div>
        <div class="item">
          <p>
            <span>密码</span>
            <span>{{ data.user.pwd }}</span>
          </p>
          <el-button type="text" @click="modifyShow = true">重置密码</el-button>
        </div>
        <div
          v-for="(item, index) in data.customList"
          :key="index"
          class="item"
        >
          <p>
            <span>{{ item.attrName }}</span>
            <span>{{ item.description }}</span>
          </p>
          <div>
            <el-button type="text">编辑</el-button>
          </div>
        </div>
      </div>
      <!-- 修改内容 -->
      <images-upload
        v-show="vicpWarpShow"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
      <modify
        v-show="modifyShow"
        @close="close"
      />
    </div>
  </div>
</template>

<script>
import { memberDetail } from '@/api/table'
import PageTitle from '@/views/components/pageTitle'
import SvgIcon from '@/components/SvgIcon'
import imagesUpload from './components/imagesUpload'
import modify from './components/modify'

export default {
  components: {
    PageTitle,
    SvgIcon,
    imagesUpload,
    modify
  },
  data() {
    return {
      title: '我的资料',
      vicpWarpShow: false,
      modifyShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      data: null
    }
  },
  created() {
    this.getMemberDetail()
  },
  methods: {
    async getMemberDetail() {
      const data = {
        bizId: '854299120902660096',
        tenantId: '1600018169',
        instance: 'qinhui20210610'
      }
      // const detailData = await memberDetail(data)
      console.log(data, memberDetail)
    },
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
    p{
      text-align: left;
    }
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
.member-order{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.icon{
  font-size: 20px;
  display: inline-block;
  margin-right: 10px;
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
