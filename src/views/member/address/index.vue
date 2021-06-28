<template>
  <div class="app-container address-container">
    <!-- 头部 开始-->
    <PageTitle pagetitle="我的收货地址"></PageTitle>
    <!-- 头部 结束-->

    <!-- 新增+ 提示 开始 -->
    <div class="mt15 mb15">
      <!-- 新增按钮 -->
      <el-button type="primary" size="mini" @click="showAddressform('create')"
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
      v-for="(item, index) in logisticsInfoList"
      :key="item.id + index"
      :body-style="cardBody"
    >
      <!-- 每个卡片信息区 -->
      <ul v-loading="isLoading">
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
            {{
              getAddress(
                item.consigneeCountry,
                item.consigneeProvince,
                item.consigneeCity,
                item.consigneeCounty
              )
            }}
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
      定义ref 向自组件传值 : dialogFormVisible:弹窗显示与隐藏  dialogStatus:弹窗类型 (create:新增  edit: 编辑)

      confirm事件 : 收货地址关闭触发的事件
     -->
    <AddressForm
      ref="addressDialog"
      :addressFormProp="current"
      @confirm="confirmDialog"
    ></AddressForm>
    <!-- 收货人地址弹窗 结束 -->

    <!-- <el-button type="primary" @click="addAddress">添加收货地址</el-button> -->
  </div>
</template>
<script>
import PageTitle from "@/views/components/pageTitle"; // 头部
import AddressForm from "@/views/components/addressForm"; // 收货人地址弹窗

// import * as utils from "@/utils/index";

import address from "@/views/components/resource/locList_zh_CN.js"; // 国家josn

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
      joinAddress: "", // 地址链接
      // data
      // 收货地址信息列表
      logisticsInfoList: [],

      // 样式
      cardBody: {
        display: "flex",
        justifyContent: "space-between",
      },

      current: {}, // 弹窗传值

      isLoading: true, // loading加载
    };
  },
  // 组件
  components: {
    PageTitle, // 头部
    AddressForm, // 编辑收货地址
  },
  created() {
    this.getList(); // 获取收货地址
  },
  methods: {
    // 获取地址列表
    async getList() {
      this.isLoading = true;
      try {
        const res = await getAddressList();

        console.log(res);
        if (res.status !== 200) return;
        this.logisticsInfoList = res.data.addressList;
        this.isLoading = false;
      } catch (error) {
        console.log("获取收货地址失败", error);
      }
    },
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

    // 设为默认地址
    async setDefault(id) {
      /**
       * 1. 获取当前id
       * 2. 根据id发送请求
       * 3. 请求成功, 赋值
       * 4. 重新渲染收货地址列表
       */
      const params = {
        tenantId: 1600018169,
        receiverCode: id,
      };
      try {
        const res = await setAddressList(params); // 设为默认
        // console.log(res);
        if (!res.data) return;
        this.getList(); // 重新获取收货地址列表
      } catch (error) {
        console.log(error);
      }
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
        const params = {
          receiverCode: item.id,
          tenantId: 1600018169,
        };
        try {
          const res = await deleteAddressList(params);
          // console.log(res);
          if (res.status !== 200) return;
          this.getList(); // 重新获取收货地址列表
        } catch (error) {
          console.log("删除失败", error);
        }
      } catch (error) {
        console.log("取消,不删除");
      }
    },

    // 编辑
    eidtAddress(item) {
      this.current = JSON.parse(JSON.stringify(item)); // 赋值
      this.showAddressform("edit");
    },

    // 弹窗 显示
    showAddressform(status) {
      if (status === "create" && this.logisticsInfoList.length === 10)
        return this.$message({
          message: "抱歉，地址信息最多可创建10条，请删除一条在创建吧!",
          type: "warning",
        });
      const _this = this.$refs["addressDialog"]; // 获取当前弹窗组件实例
      _this.dialogFormVisible = true; // 修改弹窗 显示状态
      _this.formType = status; // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 弹窗确认事件
    confirmDialog() {
      this.current = {}; // 清空当前值
      this.getList(); // 重新获取收货地址列表
    },
  },
  computed: {
    getAddress: function () {
      return (country, province, city, area) => {
        if (!country) return; // 没有国家 返回
        var _country = "",
          _a = "",
          _b = "",
          _c = ""; // 省市区
        address.Location.CountryRegion.map((item) => {
          if (item["-Code"] !== country) return;
          _country = item["-Name"]; // 获取国家名称
          if (!item.State) return; //  只返回一个国家
          if (Array.isArray(item.State)) {
            item.State.map((i) => {
              if (i["-Code"] !== province) return;
              _a = i["-Name"]; // 获取省
              if (!i.City) return; // 不存在市

              i.City.map((v) => {
                if (v["-Code"] !== city) return;
                _b = v["-Name"];

                if (!v.Region) return; // 不存在区

                if (Array.isArray(v.Region)) {
                  v.Region.map((c) => {
                    if (c["-Code"] !== area) return; // 不存在区
                    _c = c["-Name"];
                  });
                } else {
                  if (v.Region["-Code"] !== area) return;
                  _c = v.Region["-Name"];
                }
              });
            });
          } else {
            item.State.City.map((i) => {
              if (i["-Code"] !== province) return;
              _a = i["-Name"];
            });
          }
        });
        return _a + _b + _c;
      };
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
