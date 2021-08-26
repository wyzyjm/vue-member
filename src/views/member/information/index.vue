<template>
  <div class="app-container">
    <PageTitle :pagetitle="title">
    <!-- <slot slot="slot">搜索</slot> -->
    </PageTitle>
    <div v-if="isShow" v-loading="loading">
      <div v-if="data && data.user" class="content">
        <!-- 头像 -->
        <div class="block user">
          <el-image
            :src="avatar"
            class="uimges"
            @click="vicpWarpShow = true"
          />
          <div class="username">
            <p class="font-w">{{ data.user.userName }}</p>
            <p class="member-order"><SvgIcon name="icon-huiyuan" class="icon" setsize="16" />{{ data.user.memberLevel }}</p>
          </div>
        </div>
        <!-- 基础信息 -->
        <div class="customList">
          <!-- 昵称 -->
          <div class="item">
            <p>
              <span>昵称</span>
              <span>{{ data.user.nickName ? data.user.nickName : '还没有昵称' }}</span>
            </p>
            <el-button type="text" @click="modify('nickName')">编辑</el-button>
          </div>
          <!-- 姓名 -->
          <div class="item">
            <p>
              <span>姓名</span>
              <span>{{ data.user.name ? data.user.name : '还没有姓名' }}</span>
            </p>
            <el-button type="text" @click="modify('name')">编辑</el-button>
          </div>
          <!-- 手机 -->
          <div class="item">
            <p>
              <span>手机</span>
              <span>{{ data.user.phoneHead.substring(0,data.user.phoneHead.lastIndexOf(",")) }} {{ data.user.phone ? data.user.phone : '还没有手机号' }}</span>
            </p>
            <div>
              <el-button v-if="!data.user.phone" type="text" @click="updatePhone(0)">绑定手机</el-button>
              <el-button v-if="data.user.phone" type="text" @click="updatePhone(1)">更换手机</el-button>
              <el-button v-if="data.user.phone" type="text" @click="updatePhone(2)">解绑手机</el-button>
            </div>
          </div>
          <!-- 邮箱 -->
          <div class="item">
            <p>
              <span>邮箱</span>
              <span>{{ data.user.email ? data.user.email : '还没有添加邮箱' }}</span>
            </p>
            <div>
              <el-button v-if="!data.user.email" type="text" @click="updateEmail(0)">绑定邮箱</el-button>
              <el-button v-if="data.user.email" type="text" @click="updateEmail(1)">更换邮箱</el-button>
              <el-button v-if="data.user.email" type="text" @click="updateEmail(2)">解绑邮箱</el-button>
            </div>
          </div>
          <!-- 密码 -->
          <div class="item">
            <p>
              <span>密码</span>
              <span>{{ data.user.pwd ? '******' : '' }}</span>
            </p>
            <el-button type="text" @click="updatePwd(data.user.pwd)">重设密码</el-button>
          </div>
          <!-- 自定义项 -->
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
              <el-button type="text" @click="selfDefiningTerm(item)">编辑</el-button>
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
          :self-defining="selfDefining"
          :modify-type="modifyType"
          @close="close"
        />
      </div>
    </div>
    <div v-else>
      <SettingEmail v-if="showModule === 0" :setdata="dataList" />
      <SettingPwd v-if="showModule === 1" :setdata="dataList" />
      <SettingPhone v-if="showModule === 2" :setdata="dataList" />
    </div>
  </div>
</template>

<script>
import { memberDetail } from '@/api/member'
import PageTitle from '@/views/components/pageTitle'
import SvgIcon from '@/components/SvgIcon'
import imagesUpload from './components/imagesUpload'
import modify from './components/modify'
import SettingEmail from './components/settingEmail'
import SettingPwd from './components/settingPwd'
import SettingPhone from './components/settingPhone'

export default {
  components: {
    PageTitle,
    SvgIcon,
    imagesUpload,
    modify,
    SettingEmail,
    SettingPwd,
    SettingPhone
  },
  data() {
    return {
      avatar: '',
      loading: false,
      title: '我的资料',
      vicpWarpShow: false,
      modifyShow: false,
      modifyType: '',
      selfDefining: {},
      imagecropperKey: 0,
      data: null,
      dataList: {},
      isShow: true,
      showModule: 0 // 显示哪个修改, 默认 邮箱,1:密码, 2:手机号
    }
  },
  created() {
    this.getMemberDetail()
  },
  methods: {
    async getMemberDetail() {
      try {
        const detailData = await memberDetail()
        this.data = detailData.data
        this.avatar = 'https://pre-omo-oss-image.site.cn/' + this.data.user.avatar
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('请求失败', error)
      }
    },
    cropSuccess(resData) {
      this.vicpWarpShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    modify(itemType) {
      this.modifyShow = true
      this.modifyType = itemType
    },
    // 自定义项
    selfDefiningTerm(item) {
      if (item.attrType === 'image') {
        this.$message('开发中!')
        return
      }
      this.modifyShow = true
      this.modifyType = item.attrDetailType
      this.selfDefining = item
    },
    close() {
      this.vicpWarpShow = false
      this.modifyShow = false
    },
    // 设置手机
    updatePhone(type) {
      // 传参
      this.dataList = {
        memberId: this.data.user.memberId, // 会员id
        type: 'mobile', // 手机
        phoneType: type, // 类型
        phone: this.data.user.phone, // 手机
        phoneHead: this.data.user.phoneHead // 手机头部
      }
      this.isShow = false // 本身页面隐藏
      this.showModule = 2 // 显示编辑手机UI
    },
    // 重置密码
    updatePwd(pwd) {
      this.dataList = {
        type: 'pwd',
        oldPassword: pwd
      }
      this.isShow = false
      this.showModule = 1
    },
    // 设置邮箱
    updateEmail(type) {
      this.dataList = {
        type: 'email',
        emailType: type,
        email: this.data.user.email,
        memberId: this.data.user.memberId
      }
      this.isShow = false
      this.showModule = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.font-w{
  font-weight: 700
}
.content{
  padding:40px 0 0 0px;
  width: 70%;
  margin: 0 auto;
}
.user{
  display: flex;
  margin-left: 130px;
  margin-bottom: 50px;
  position: relative;
  .username{
    padding-top: 20px;
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
  color: #333;
  font-size: 20px;
  display: inline-block;
  margin-right: 10px;
  margin-top: -3px;
}
.item{
  display: flex;
  justify-content: space-between;
  color:rgb(153, 153, 153);
  >p{
    display: flex;
  }
  span{
    width: 200px;
    margin-right: 30px;
  }
  span:nth-child(1){
    width: 100px;
    display: inline-block;
    text-align: right;
  }
}
.images-upload[data-v-44c3f0b4]{
  z-index: 10;
}
</style>
