<template>
  <div class="app-container address-container">
    <!-- 头部 开始-->
    <PageTitle pagetitle="我的收货地址"></PageTitle>
    <!-- 头部 结束-->

    <!-- 新增+ 提示 开始 -->
    <div class="mt15 mb15">
      <!-- 新增按钮 -->
      <el-button type="primary" size="mini" @click="showDialog('create')"
        >新增收货地址</el-button
      >
      <!-- 提示区域 -->
      <span class="ml15"
        >您已创建
        <span class="text-danger"> {{ logisticsInfoList.length }} </span
        >个,最多创建 <span class="text-danger"> {{ mostNum }} </span>个
      </span>
    </div>
    <!-- 新增+ 提示 结束 -->

    <!-- 收货地址列表 开始 -->
    <el-card
      class="mb15"
      v-for="item in logisticsInfoList"
      :key="item.id"
      :body-style="cardBody"
    >
      <!-- 每个卡片信息区 -->
      <ul>
        <!-- 收货人 -->
        <li>
          <span class="attrName text-grey"> 收货人: </span>
          <span class="attrValue">
            {{ item.consigneeName }}
            <span class="default" v-if="item.isDefault"> 默认地址 </span>
          </span>
        </li>
        <!-- 所在地区 -->
        <li>
          <span class="attrName text-grey"> 所在地区: </span>
          <span class="attrValue">
            {{ item.consigneeProvince }} {{ item.consigneeCity }}
            {{ item.consigneeCounty }}
          </span>
        </li>
        <!-- 详细地址 -->
        <li>
          <span class="attrName text-grey"> 详情地址: </span>
          <span class="attrValue"> {{ item.consigneeAddr }} </span>
        </li>
        <!-- 手机区号 + 手机号 -->
        <li>
          <span class="attrName text-grey"> 手机: </span>
          <span class="attrValue">
            {{ item.consigneePhoneHead }} {{ item.consigneePhone }}</span
          >
        </li>
        <!-- 固定电话 -->
        <li>
          <span class="attrName text-grey"> 固定电话: </span>
          <span class="attrValue">
            {{ item.consigneeTelHead }} - {{ item.consigneeTel }}
          </span>
        </li>
        <!-- 邮编 -->
        <li>
          <span class="attrName text-grey"> 邮编: </span>
          <span class="attrValue"> {{ item.consigneeZipCode }} </span>
        </li>
      </ul>
      <!-- 按钮区 -->
      <div class="btn-group">
        <!-- 设为默认地址 -->
        <el-button
          type="text"
          v-if="!item.isDefault"
          @click="setDefault(item.id)"
          >设为默认地址</el-button
        >
        <!-- 编辑 -->
        <el-button type="text" @click="eidtAddress(item)">编辑</el-button>
        <!-- 删除 -->
        <el-button type="text" @click="deleteAddress(item)">删除</el-button>
      </div>
    </el-card>
    <!-- 收货地址列表 结束 -->

    <!-- 收货人地址弹窗 开始 -->
    <!-- 
      定义ref 向自组件传值 : dialogFormVisible:弹窗显示与隐藏  dialogStatus:弹窗类型 create:新增  edit: 编辑
      confirm事件 : 收货地址关闭触发的事件, 会把 收货信息传回来
      编辑收货地址: 直接修改自组建值
     -->
    <AddressForm
      ref="addressDialog"
      :setAddrForm="current"
      @confirm="confirmDialog"
    ></AddressForm>
    <!-- 收货人地址弹窗 结束 -->
  </div>
</template>
<script>
import PageTitle from "@/views/components/pageTitle"; // 头部
import AddressForm from "@/views/components/addressForm"; // 收货人地址弹窗

import {
  getAddressList,
  addAddressList,
  setAddressList,
  deleteAddressList,
  eidtAddressList,
} from "@/api/address"; // 购物车api

export default {
  data() {
    return {
      // 页面参数
      mostNum: 10, // 最多个数

      // data
      // 收货地址信息列表
      logisticsInfoList: [
        {
          id: 1,
          consigneeName: "小明是收货人小明是收货人小明是收货人小明是收货人",
          consigneeCountry: "中国",
          consigneeProvince: "河南省",
          consigneeCity: "新乡市",
          consigneeCounty: "辉县市",
          consigneeAddr:
            "百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾",
          consigneeZipCode: 453600,
          consigneePhoneHead: "+86",
          consigneePhone: 18365478219,
          consigneeTelHead: "0373",
          consigneeTel: 6769083,
          isDefault: true,
        },
        {
          id: 2,
          consigneeName: "小红是收货人",
          consigneeCountry: "中国",
          consigneeProvince: "河南省",
          consigneeCity: "新乡市",
          consigneeCounty: "辉县市",
          consigneeAddr:
            "百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾百泉镇御龙湾",
          consigneeZipCode: 453600,
          consigneePhoneHead: "+86",
          consigneePhone: 18365478219,
          consigneeTelHead: "0373",
          consigneeTel: 6769083,
          isDefault: false,
        },
        {
          id: 3,
          consigneeName: "小黑是收货人",
          consigneeCountry: "中国",
          consigneeProvince: "河南省",
          consigneeCity: "新乡市",
          consigneeCounty: "辉县市",
          consigneeAddr: "百泉镇御龙湾",
          consigneeZipCode: 453600,
          consigneePhoneHead: "+86",
          consigneePhone: 18365478219,
          consigneeTelHead: "0373",
          consigneeTel: 6769083,
          isDefault: false,
        },
      ],

      // 样式
      cardBody: {
        display: "flex",
        justifyContent: "space-between",
      },

      current: {}, // 弹窗传值
    };
  },
  components: {
    PageTitle,
    AddressForm,
  },
  created(){
    this.getList()
  },
  methods: {
    // 租户id 1600018169
    // 获取地址列表
    async getList() {
      // 发起请求,重新渲染数据
      // this.logisticsInfoList = 后台返回值
      try {
        const {data : res} = await getAddressList({ tenantId: 1600018169 });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    // 设为默认地址
    setDefault(id) {
      /**
       * 1. 获取当前id
       * 2. 根据id发送请求
       * 3. 请求成功, 赋值
       * 4. 重新渲染收货地址列表
       */
      console.log("设为默认", id);
      this.getList(); // 重新获取收货地址列表
    },
    // 编辑
    eidtAddress(item) {
      this.current = JSON.parse(JSON.stringify(item)); // 赋值
      this.showDialog("edit");
    },
    // 删除 地址
    async deleteAddress(item) {
      // 是默认 地址, 进行提示,不可删除
      if (item.isDefault)
        return this.$message({
          message: "默认地址不可删除，建议将其他地址设为默认后再删除此地址",
          type: "warning",
        });
      /**
       * 1. 不是默认地址
       * 2. 进行提示, 是否要删除
       * 3. 确认删除
       * 4. 根据 id 发送删除请求
       * 5. 删除成功 重新获取列表
       */
      try {
        const result = await this.$confirm(
          "您确定要删除该收货地址吗?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (result !== "confirm") return; // 不是确认,直接停止
        console.log("删除地址", item.id);
        this.getList(); // 重新获取收货地址列表
      } catch (error) {
        console.log("取消,不删除");
      }
    },

    // 弹窗 显示
    showDialog(status) {
      const _this = this.$refs["addressDialog"]; // 获取当前弹窗组件实例
      _this.dialogFormVisible = true; // 修改弹窗 显示状态
      _this.dialogStatus = status; // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 弹窗确认事件
    confirmDialog(data, addFormData, status) {
      /**
       * 1. 获取子组件传过来的 表单信息, 和 状态
       * 2. 根据状态, 对将表单信息进行处理
       */
      console.log(data);
      this.current = {};
      if (status === "create") {
        console.log("这是创建收货地址");
      } else {
        console.log("这是编辑收货地址");
      }
      this.getList();
    },
  },
};
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
    line-height: 28px;
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