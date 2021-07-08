<template>
  <div class="app-container address-container">
    <!-- 头部 开始-->
    <PageTitle pagetitle="我的收货地址" />
    <!-- 头部 结束-->

    <!-- 新增+ 提示 开始 -->
    <div class="mt15 mb15">
      <!-- 新增按钮 -->
      <el-button
        type="primary"
        size="mini"
        @click="showAddressform('create')"
      >新增收货地址</el-button>
      <!-- 提示区域 -->
      <span
        class="ml15"
      >您已创建
        <span class="text-danger"> {{ logisticsInfoList.length }} </span>
        个,最多创建 <span class="text-danger"> {{ mostNum }} </span>个
      </span>
    </div>
    <!-- 新增+ 提示 结束 -->

    <!-- 收货地址列表 开始 -->
    <el-card
      v-for="(item, index) in logisticsInfoList"
      :key="item.id + index"
      class="mb15"
      :body-style="cardBody"
    >
      <!-- 每个卡片信息区 -->
      <ul v-loading="isLoading">
        <!-- 收货人 -->
        <li>
          <span class="attrName text-grey"> 收货人: </span>
          <span class="attrValue">
            {{ item.consigneeName }}
            <span v-if="item.isDefault" class="default"> 默认地址 </span>
          </span>
        </li>
        <li :class="{ reverse: item.reverseFlag }">
          <!-- 所在地区 -->
          <div v-if="item.consigneeProvince" class="reverseDiv">
            <span class="attrName text-grey"> 所在地区: </span>
            <span class="attrValue">
              {{
                getAddress(
                  item.consigneeCountry,
                  item.consigneeProvince,
                  item.consigneeCity,
                  item.consigneeCounty,
                  true
                )
              }}
            </span>
          </div>
          <!-- 详细地址 -->
          <div class="reverseDiv">
            <span class="attrName text-grey"> 详情地址: </span>
            <span class="attrValue"> {{ item.consigneeAddr }} </span>
          </div>
        </li>
        <!-- 手机区号 + 手机号 -->
        <li v-if="item.consigneePhone">
          <span class="attrName text-grey"> 手机: </span>
          <span class="attrValue">
            {{ item.consigneePhoneHead }} {{ item.consigneePhone }}</span>
        </li>
        <!-- 固定电话 -->
        <li v-if="item.consigneeTel">
          <span class="attrName text-grey"> 固定电话: </span>
          <span class="attrValue">
            {{ item.consigneeTelHead }} - {{ item.consigneeTel }}
          </span>
        </li>
        <!-- 邮编 -->
        <li v-if="item.consigneeZipCode">
          <span class="attrName text-grey"> 邮编: </span>
          <span class="attrValue"> {{ item.consigneeZipCode }} </span>
        </li>
      </ul>
      <!-- 按钮区 -->
      <div class="btn-group">
        <!-- 设为默认地址 -->
        <el-button
          v-if="!item.isDefault"
          type="text"
          @click="setDefault(item.id)"
        >设为默认地址</el-button>
        <!-- 编辑 -->
        <el-button type="text" @click="eidtAddress(item)">编辑</el-button>
        <!-- 删除 -->
        <el-button type="text" @click="deleteAddress(item)">删除</el-button>
      </div>
    </el-card>
    <!-- 收货地址列表 结束 -->

    <!-- 收货人地址弹窗 开始 -->
    <!--
      定义ref 向自组件传值 : dialogFormVisible:弹窗显示与隐藏  dialogStatus:弹窗类型 (create:新增  edit: 编辑)

      confirm事件 : 收货地址关闭触发的事件
     -->
    <AddressForm
      ref="addressDialog"
      :address-form-prop="current"
      @confirm="confirmDialog"
      @addressFormDialogClose="addressFormDialogClose"
    />
    <!-- 收货人地址弹窗 结束 -->

    <!-- <el-button type="primary" @click="addAddress">添加收货地址</el-button> -->
  </div>
</template>
<script>
import PageTitle from '@/views/components/pageTitle' // 头部
import AddressForm from '@/views/components/addressForm' // 收货人地址弹窗

import { getAddressName } from '@/utils/address'

import {
  getAddressList,
  addAddressList,
  setAddressList,
  deleteAddressList
} from '@/api/address' // 购物车api

export default {
  // 组件
  components: {
    PageTitle, // 头部
    AddressForm // 编辑收货地址
  },
  data() {
    return {
      // 页面参数
      mostNum: 10, // 最多个数
      joinAddress: '', // 地址链接
      // data
      // 收货地址信息列表
      logisticsInfoList: [],

      // 样式
      cardBody: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      current: {}, // 弹窗传值
      isLoading: true // loading加载
    }
  },
  computed: {
    getAddress: function() {
      return getAddressName
    }
  },
  created() {
    this.getList() // 获取收货地址
  },
  methods: {
    // 获取地址列表
    async getList() {
      this.isLoading = true
      try {
        const res = await getAddressList()

        console.log('收货地址信息', res)
        if (res.status !== 200) return
        this.logisticsInfoList = res.data.addressList
        this.isLoading = false
      } catch (error) {
        console.log('获取收货地址失败', error)
      }
    },

    // 设为默认地址
    async setDefault(id) {
      const params = {
        receiverCode: id // 收货地址id
      }
      try {
        const res = await setAddressList(params) // 设为默认
        // console.log(res);
        if (!res.data) return
        this.getList() // 重新获取收货地址列表
      } catch (error) {
        console.log(error)
      }
    },

    // 删除 地址
    async deleteAddress(item) {
      // 是默认 地址, 进行提示,不可删除
      if (item.isDefault) {
        return this.$message({
          message: '默认地址不可删除，建议将其他地址设为默认后再删除此地址',
          type: 'warning'
        })
      }
      /**
       * 1. 不是默认地址
       * 2. 进行提示, 是否要删除
       * 3. 确认删除
       * 4. 根据 id 发送删除请求
       * 5. 删除成功 重新获取列表
       */
      try {
        const result = await this.$confirm(
          '您确定要删除该收货地址吗?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        if (result !== 'confirm') return // 不是确认,直接停止
        const params = {
          receiverCode: item.id
        }
        try {
          const res = await deleteAddressList(params)
          if (res.status !== 200) return
          this.getList() // 重新获取收货地址列表
        } catch (error) {
          console.log('删除失败', error)
        }
      } catch (error) {
        console.log('取消,不删除')
      }
    },

    // 编辑
    eidtAddress(item) {
      this.current = JSON.parse(JSON.stringify(item)) // 赋值
      this.showAddressform('edit')
    },
    // 弹窗关闭
    addressFormDialogClose() {
      this.current = {} // 清空传入的 值
    },

    // 弹窗 显示
    showAddressform(status) {
      if (status === 'create' && this.logisticsInfoList.length === 10) {
        return this.$message({
          message: '抱歉，地址信息最多可创建10条，请删除一条在创建吧!',
          type: 'warning'
        })
      }
      const _this = this.$refs['addressDialog'] // 获取当前弹窗组件实例
      _this.dialogFormVisible = true // 修改弹窗 显示状态
      _this.formType = status // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 弹窗确认事件
    confirmDialog() {
      this.current = {} // 清空当前值
      this.getList() // 重新获取收货地址列表
    }

    // 新增收货地址
    // async addAddress() {
    //   var num = 3;
    //   const data = {
    //     consigneeCountry: "中国",
    //     consigneeAddr: "详细地址",
    //     consigneeProvince: "河南省",
    //     consigneeCity: "郑州市",

    //     consigneeCounty: "县",
    //     consigneeName: `我是第${num}个收货人`,
    //     consigneePhone: "18336908347",
    //     consigneePhoneHead: "0086",
    //     consigneeTel: "6769038",
    //     consigneeTelHead: "8633",
    //     consigneeZipCode: "453600",
    //     receiverCode: "新增",
    //   };
    //   try {
    //     const { status } = await addAddressList(data);
    //     if (status !== 200) return;
    //     this.getList(); // 重新获取列表
    //   } catch (error) {
    //     console.log("新增失败", error);
    //   }
    // },
  }
}
</script>
<style scoped lang="scss">
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ml15 {
  margin-left: 15px;
}
.mt15 {
  margin-top: 15px;
}
.mb15 {
  margin-bottom: 15px;
}
.address-container {
  li {
    display: flex;
    flex-wrap: wrap;
    line-height: 28px;
    &.reverse {
      flex-direction: column-reverse;
    }
    .reverseDiv {
      width: 100%;
    }
    .attrName {
      display: inline-block;
      width: 60px;
      text-align: right;
      flex-shrink: 0;
      margin-right: 8px;
    }
    .attrValue {
      color: #606266;
    }
    .default {
      background-color: rgba(64, 158, 255, 1);
      color: #fff;
      font-size: 12px;
      align-self: auto;
    }
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    min-width: 200px;
  }
}
</style>
