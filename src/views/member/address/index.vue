<template>
  <div class="address-container">
    <!-- 头部 -->
    <PageTitle pagetitle="我的收货地址"></PageTitle>

    <div class="mt15 mb15">
      <el-button type="primary" @click="showDialog('create')" size="mini"
        >新增收货地址</el-button
      >
      <span class="ml15"
        >您已创建
        <span class="text-danger"> {{ logisticsInfoList.length }} </span
        >个,最多创建 <span class="text-danger"> {{ mostNum }} </span>个
      </span>
    </div>
    <el-card
      class="mb15"
      v-for="item in logisticsInfoList"
      :key="item.id"
      :body-style="cardBody"
    >
      <ul>
        <li>
          <span class="attrName"> 收货人: </span>
          <span class="attrValue">
            {{ item.consigneeName }}
            <span class="default" v-if="item.isDefault"> 默认地址 </span>
          </span>
        </li>
        <li>
          <span class="attrName"> 所在地区: </span>
          <span class="attrValue">
            {{ item.consigneeProvince }} {{ item.consigneeCity }}
            {{ item.consigneeCounty }}
          </span>
        </li>
        <li>
          <span class="attrName"> 固定电话: </span>
          <span class="attrValue">
            {{ item.consigneeTelHead }} - {{ item.consigneeTel }}
          </span>
        </li>
        <li>
          <span class="attrName"> 详情地址: </span>
          <span class="attrValue"> {{ item.consigneeAddr }} </span>
        </li>
        <li>
          <span class="attrName"> 手机: </span>
          <span class="attrValue">
            {{ item.consigneePhoneHead }} {{ item.consigneePhone }}</span
          >
        </li>
        <li>
          <span class="attrName"> 邮编: </span>
          <span class="attrValue"> {{ item.consigneeZipCode }} </span>
        </li>
      </ul>
      <div class="btn-group">
        <el-button
          type="text"
          v-if="!item.isDefault"
          @click="setDefault(item.id)"
          >设为默认地址</el-button
        >
        <el-button type="text" @click="eidtLogs(item)">编辑</el-button>
        <el-button type="text" @click="deleteAddress(item)">删除</el-button>
      </div>
    </el-card>

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

    <!-- @cancel="closeDialog"
      @confirm="confirmDialog" -->
  </div>
</template>
<script>
import PageTitle from "@/views/components/pageTitle"; // 头部
import AddressForm from "@/views/components/addressForm"; // 收货人地址
export default {
  data() {
    return {
      mostNum: 10, // 最多个数
      // 收货地址管理
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
      // 卡片body样式
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
  methods: {
    // 获取地址列表
    getList() {
      // 发起请求,重新渲染数据
      // this.logisticsInfoList = 后台返回值
    },
    // 弹窗展示
    showDialog(status) {
      const _this = this.$refs["addressDialog"]; // 直接修改弹窗数据
      _this.dialogFormVisible = true;
      _this.dialogStatus = status;
    },
    // 编辑
    eidtLogs(item) {
      this.current = JSON.parse(JSON.stringify(item)); // 赋值
      this.showDialog("edit");
    },
    // 设为默认
    setDefault(id) {
      console.log("设为默认", id);
      // 设为默认
      // 1. 根据id发送请求
      // 2. 成功后, 重新获取收货地址列表
      this.getList(); // 重新获取收货地址列表
    },
    // 删除 地址
    deleteAddress(item) {
      if (item.isDefault) {
        this.$message({
          message: "默认地址不可删除，建议将其他地址设为默认后再删除此地址",
          type: "warning",
        });
      } else {
        this.$confirm("您确定要删除该收货地址吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 1. 根据 id 发送删除请求
            // 2. 删除成功 重新获取列表
            this.getList(); // 重新获取收货地址列表
            console.log("删除地址", item.id);
          })
          .catch(() => {});
      }
    },
    // 弹窗确认事件
    confirmDialog(data, status) {
      console.log(data);
      this.current = {};
      if (status === "create") {
        console.log("这是创建收货地址");
      } else {
        console.log("这是编辑收货地址");
      }
      // 1. 向后台发送添加请求
      // 2. 成功后发起请求
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

