<template>
  <div class="app-container wrapper">
    <div class="order-title">
      <span class="order-subtitle">订单结算</span>
      <div class="steps-wrapper">
        <ce-steps
          :active="stepActive"
          :datalist="datalist"
          style="padding: 0"
        />
      </div>
    </div>
    <p class="order-subtitle">填写并核对订单信息</p>

    <div class="order-details">
      <template v-if="!hasFormJson">
        <p><strong>收货人信息</strong></p>
        <el-button
          style="float: right; margin-top: -45px"
          type="text"
          @click="openAddress('create')"
        >新增收货地址</el-button>
        <div :class="['address-list', { 'show-detail': showAInfo }]">
          <!-- {{ logisticsInfoList }} -->
          <p v-if="logisticsInfoList.length == 0" style="color: #f56c6c">
            请添加收货信息
          </p>

          <div v-else class="address-group">
            <template v-if="logisticsInfoList.length > 0">
              <div
                v-for="(item, index) in logisticsInfoList"
                :key="item.id"
                :class="['address-item', { active: item.active }]"
                @click="choseAddress(index)"
              >
                <span class="name">{{ item.consigneeName }}</span>
                <div class="more">
                  <!-- <span>{{ item.consigneeCountry }}</span>
              <span>{{ item.consigneeProvince }}</span>
              <span>{{ item.consigneeCity }}</span> -->
                  <template v-if="item.reverseFlag">
                    <span>{{ item.consigneeAddr }}</span>
                    <span>
                      {{
                        getAddress(
                          item.consigneeCountry,
                          item.consigneeProvince,
                          item.consigneeCity,
                          item.consigneeCounty,
                          item.reverseFlag
                        )
                      }}</span>
                  </template>
                  <template v-else>
                    <span>
                      {{
                        getAddress(
                          item.consigneeCountry,
                          item.consigneeProvince,
                          item.consigneeCity,
                          item.consigneeCounty,
                          item.reverseFlag
                        )
                      }}</span>
                    <span>{{ item.consigneeAddr }}</span>
                  </template>
                  <template v-if="item.consigneePhone !== ''">
                    <span>+{{ item.consigneePhoneHead.split("+")[1] }}-{{
                      item.consigneePhone
                    }}</span>
                  </template>
                  <template v-else>
                    <span>+{{ item.consigneeTelHead.split("+")[1] }}-{{
                      item.consigneeTel
                    }}</span>
                  </template>
                </div>
                <span
                  v-if="item.isDefault"
                  class="default-address-icon"
                >默认地址</span>
                <div class="address-btns">
                  <el-button
                    v-if="!item.isDefault"
                    type="text"
                    size="mini"
                    @click.stop="setDefault(item.id)"
                  >设为默认</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="eidtAddress(item)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="deleteAddress(item)"
                  >删除</el-button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <p
          v-if="logisticsInfoList.length > 1"
          class="show-more"
          @click="showAddress"
        >
          <span v-show="showAInfo">
            收起地址<i class="el-icon-d-arrow-right" />
          </span>
          <span v-show="!showAInfo">
            更多地址<i class="el-icon-d-arrow-left" />
          </span>
        </p>
        <el-divider />
        <p><strong>配送方式</strong></p>

        <el-radio-group v-model="distributionVal">
          <el-radio
            v-for="item in distributionList"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <p><strong>表单信息</strong></p>
        <div>adsfjaldfjaldfj</div>
      </template>
      <el-divider />
      <p><strong>支付方式</strong></p>
      <el-radio-group v-model="payVal">
        <el-radio
          v-for="item in payList"
          :key="item.type"
          :disabled="!item.isAvailable"
          :label="item.type"
        >{{ item.typeName }}
          <el-tooltip
            class="item"
            effect="light"
            :content="item.prompt"
            placement="bottom-end"
          >
            <svg-icon name="icon-wenhao" />
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <el-divider />
      <div v-for="(item, index) in productlist" :key="item.skuId">
        <product-list
          :product-list="item.shoppingCartList"
          :currency-symbol="currency"
        />
        <p><strong>发票信息</strong></p>
        <div>
          电子发票
          <template v-if="receiptList[index].receiptInfo.invoiceTitle == ''">
            <el-button
              type="text"
              @click="openReceipt('new', index)"
            >开发票</el-button>
          </template>
          <template v-else>
            {{ receiptList[index].receiptInfo.invoiceTitle }}
            {{ receiptList[index].receiptInfo.invoiceContent }}
            <el-button
              type="text"
              @click="openReceipt('edit', index)"
            >修改</el-button>
          </template>
        </div>
        <el-divider />
        <p><strong>给卖家留言</strong></p>
        <el-input
          v-model="remarkAttrs[index].value"
          type="textarea"
          placeholder="订单有要求，请先与商家协商，选填"
          maxlength="255"
          show-word-limit
          style="width: 520px"
        />

        <el-divider />
        <div style="float: right; text-align: right; line-height: 24px">
          共 <span class="text-danger">{{ item.totalNum }}</span> 件商品<br>
          商品总额： <span>{{ currency }} {{ item.payableGoodsAmount }}</span><br>
          运费总计： <span>{{ currency }} {{ item.freightPrice }}</span>
        </div>

        <div style="clear: both" />
        <template v-if="index !== productlist.length - 1">
          <el-divider />
        </template>
      </div>
    </div>
    <div class="order-foot background-grey text-grey">
      <div class="foot-price">
        <strong class="text-normal">实付：</strong><span class="text-danger">{{ currency }}{{ realPayment }}</span>
      </div>
      <div>
        寄送至：
        <template v-if="addressInfo.reverseFlag">
          {{ addressInfo.consigneeAddr }}
          {{
            getAddress(
              addressInfo.consigneeCountry,
              addressInfo.consigneeProvince,
              addressInfo.consigneeCity,
              addressInfo.consigneeCounty,
              addressInfo.reverseFlag
            )
          }}
        </template>
        <template v-else>
          {{
            getAddress(
              addressInfo.consigneeCountry,
              addressInfo.consigneeProvince,
              addressInfo.consigneeCity,
              addressInfo.consigneeCounty,
              addressInfo.reverseFlag
            )
          }}
          {{ addressInfo.consigneeAddr }}
        </template>
      </div>
      <div>
        收货人：{{ addressInfo.consigneeName }}
        <template v-if="addressInfo.consigneePhone !== ''">
          <template v-if="addressInfo.consigneePhoneHead != undefined">
            +{{ addressInfo.consigneePhoneHead.split("+")[1] }}-{{
              addressInfo.consigneePhone
            }}
          </template>
        </template>
        <template v-else>
          <template v-if="addressInfo.consigneePhoneHead != undefined">
            +{{ addressInfo.consigneeTelHead.split("+")[1] }}-{{
              addressInfo.consigneeTel
            }}
          </template>
        </template>
      </div>
    </div>
    <div class="trade-btn">
      <el-button
        type="primary"
        :loading="orderLoading"
        :disabled="orderDisabled"
        @click="submit"
      >
        <template v-if="orderLoading"> 订单正在提交中</template>
        <template v-else>提交订单</template></el-button>
    </div>
    <receipt
      ref="getReceipt"
      :save-libray="false"
      @formData="getReceiptData"
    />
    <address-form
      ref="address"
      :address-form-prop="current"
      @confirm="confirmDialog"
      @getAddrId="getAddressId"
      @addressFormDialogClose="addressFormDialogClose"
    />

    <el-dialog title="提示" :visible.sync="messageVisible" width="30%">
      <span>{{ msgContent }}</span>
      <span slot="footer" class="dialog-footer">
        <!-- 价格有变动时候 -->
        <template v-if="msgCode === '10004'">
          <el-button
            type="default"
            @click="$router.push('/cart')"
          >返回购物车</el-button>
          <!-- todo query?? -->
          <el-button
            type="primary"
            @click="submit('continue')"
          >继续结算</el-button>
        </template>
        <!-- //运费有变动时候 -->
        <template v-else-if="msgCode === '10006'">
          <el-button
            type="default"
            @click="$router.push('/cart')"
          >返回购物车</el-button>
          <!-- 刷新运费价格 -->
          <el-button
            type="primary"
            @click="getProductList('pop')"
          >刷新运费价格</el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            @click="$router.push('/cart')"
          >返回购物车</el-button>
        </template>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ceSteps from '@/components/CeSteps'
import receipt from '@/views/components/receipt'

import productList from '@/views/components/productList'
import addressForm from '@/views/components/addressForm'
import {
  payModeInitInfo,
  calculateFare,
  addOrder,
  skuItem
} from '@/api/settlement'
import {
  getAddressList,
  addAddressList,
  setAddressList,
  deleteAddressList,
  eidtAddressList
} from '@/api/address' // 收货地址api

import { getAddressName } from '@/utils/address'
import { isDesignMode } from '@/utils/index'
export default {
  components: {
    receipt,
    ceSteps,
    addressForm,
    productList
  },
  data() {
    return {
      datalist: [
        {
          title: '我的购物车',
          description: ''
        },
        {
          title: '填写核对订单信息',
          description: ''
        },
        {
          title: '成功提交订单',
          description: ''
        }
      ],
      stepActive: 1,
      showAInfo: false,
      remark: [],
      receiptInfo: {
        invoiceId: '',
        email: '',
        invoiceContent: '',
        invoiceTitle: '',
        invoiceType: '1',
        phone: '',
        taxpayerId: '',
        phonePrefix: ''
      },
      productlist: [],
      distributionVal: '',
      distributionList: [],
      payVal: '',
      payList: [],
      logisticsInfoList: [],
      freight: 0,
      realPayment: 0,
      totalNum: 0,
      totalPrice: 0,
      currency: '¥',
      orderLoading: false,
      orderDisabled: false,
      addressInfo: {},
      messageVisible: false,
      addressActive: 0,
      editFormItem: {
        consigneeCountry: '', // 国家
        consigneeName: '', // 收货人名称
        consigneePhoneHead: '', // 手机区号
        consigneePhone: '', // 手机号
        consigneeTelHead: '', // 电话区号
        consigneeTel: '', // 电话号
        consigneeAddr: '', // 详细地址
        consigneeProvince: '', // 省/州/地区
        consigneeCity: '', // 地区
        consigneeZipCode: '', // 邮政编码
        consigneeCounty: '',
        receiverCode: ''
      },
      msgContent: '',
      msgCode: '',
      orderId: '',
      current: {}, // 弹窗传值
      hasFormJson: true,
      remarkAttrs: [],
      receiptList: [],
      receiptIndex: null,
      newAddressId: null
    }
  },
  computed: {
    getAddress: function() {
      return getAddressName
    }
  },
  mounted() {
    if (
      this.$route.query.skuId == undefined &&
        this.$route.query.shoppingCartIds == undefined
    ) {
      if (!isDesignMode()) {
        this.$router.push('/cart')
      } else {
        this.getList()
      }
    } else {
      if (this.$route.query.formData == undefined) {
        this.hasFormJson = false
      } else {
        this.hasFormJson = true
      }
      // 获取收货地址
      this.getList()
    }
  },
  methods: {
    // 获取地址列表
    async getList() {
      try {
        const res = await getAddressList()
        if (res.status !== 200) return
        // console.log(res);
        this.logisticsInfoList = res.data.addressList
        console.log('newaddressId' + this.newAddressId)
        if (this.newAddressId !== null) {
          let newIndex = null
          for (let i = 0; i < this.logisticsInfoList.length; i++) {
            if (this.logisticsInfoList[i].id == this.newAddressId) {
              newIndex = i
              this.addressInfo = this.logisticsInfoList[i]
            }
          }
          this.choseAddress(newIndex)
        }
        if (this.addressInfo.id === undefined) {
          this.addressInfo = this.logisticsInfoList[0]
          this.choseAddress(0)
        } else {
          for (let i = 0; i < this.logisticsInfoList.length; i++) {
            if (this.addressInfo.id == this.logisticsInfoList[i].id) {
              this.addressInfo = this.logisticsInfoList[i]
              this.choseAddress(i)
            }
          }
        }

        // this.choseAddress(newIndex)
        console.log('addressInfo', this.addressInfo)
        console.log('newlist--', this.logisticsInfoList)
        // 商品清单
        this.getProductList()
        // 获取支付方式，配送方式
        this.getPayMode(this.addressInfo.id)
        console.log(typeof this.addressInfo.consigneePhoneHead)
      } catch (error) {
        console.log('获取收货地址失败', error)
      }
    },
    // 设为默认地址
    async setDefault(id) {
      /**
       * 1. 获取当前id
       * 2. 根据id发送请求
       * 3. 请求成功, 赋值
       * 4. 重新渲染收货地址列表
       */
      const params = {
        receiverCode: id
      }
      try {
        const res = await setAddressList(params) // 设为默认

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
          // console.log(res);
          if (res.status !== 200) return
          if (item.id == this.addressInfo.id) {
            this.addressInfo = {}
          }
          this.getList() // 重新获取收货地址列表
        } catch (error) {
          console.log('删除失败', error)
        }
      } catch (error) {
        console.log('取消,不删除')
      }
    },
    // 弹窗 显示
    showDialog(status) {
      const _this = this.$refs['address'] // 获取当前弹窗组件实例
      _this.dialogFormVisible = true // 修改弹窗 显示状态
      _this.formType = status // 修改弹窗 类型 create:创建 | edit:编辑
    },
    // 编辑
    async eidtAddress(item) {
      this.current = JSON.parse(JSON.stringify(item)) // 赋值
      this.showDialog('edit')
      this.editFormItem = item
    },
    // 弹窗确认事件
    confirmDialog() {
      this.current = {} // 清空当前值
      this.getList() // 重新获取收货地址列表
    },
    // 弹窗关闭
    addressFormDialogClose() {
      this.current = {} // 清空传入的 值
    },
    // 收货地址弹窗
    openAddress(type) {
      if (type === 'create' && this.logisticsInfoList.length === 10) {
        this.$message({
          message: '抱歉，地址信息最多可创建10条，请删除一条在创建吧!',
          type: 'warning'
        })
        return
      }

      this.$refs.address.dialogFormVisible = true
      this.$refs.address.dialogStatus = type
    },
    async getAddressId(id) {
      this.newAddressId = id === undefined ? null : id
    },
    // 展开收起地址
    showAddress() {
      if (this.showAInfo) {
        this.showAInfo = false
      } else {
        this.showAInfo = true
      }
    },
    getPayMode(id) {
      // 获取支付方式列表
      const params = {}
      // 如果有表单，receiveCode不传
      if (!this.hasFormJson) {
        params.receiveCode = id
      }

      if (this.$route.query.shoppingCartIds !== undefined) {
        params.shoppingCartCodes = this.$route.query.shoppingCartIds
      }
      // 商品详情过来结算
      if (this.$route.query.skuId !== undefined) {
        params.skuId = this.$route.query.skuId
        params.templateId = this.$route.query.templateId
      }
      payModeInitInfo(params).then((res) => {
        if (res.status === 200) {
          const data = res.data

          if (data.hasOwnProperty('distributionList')) {
            this.distributionList = data.distributionList
          }
          if (data.hasOwnProperty('payList')) {
            this.payList = data.payList
          }
          if (this.distributionList.length > 0) {
            this.distributionVal = this.distributionList[0].id
          }

          if (this.payList.length > 0) {
            this.payVal = this.payList[0].type
          }
        }
      })
    },
    getReceiptData(data) {
      const index = this.receiptIndex

      // this.receiptList[index].receiptInfo.invoiceId = data.invoiceId;
      this.receiptList[index].receiptInfo.email = data.mail
      this.receiptList[index].receiptInfo.invoiceContent = data.catalog
      if (data.type == 1) {
        this.receiptList[index].receiptInfo.invoiceTitle = data.name
      } else {
        this.receiptList[index].receiptInfo.invoiceTitle = data.companyName
      }

      this.receiptList[index].receiptInfo.invoiceType = data.type
      this.receiptList[index].receiptInfo.phone = data.phone
      this.receiptList[index].receiptInfo.taxpayerId = data.companyNumber
      this.receiptList[index].receiptInfo.phonePrefix = data.phonePrefix
    },
    openReceipt(status, index) {
      this.receiptIndex = index
      this.$refs.getReceipt.dialogVisible = true
      if (status == 'edit') {
        if (this.receiptList[index].receiptInfo.invoiceType === 1) {
          this.$refs.getReceipt.form.type = 1
          this.$refs.getReceipt.form.name = this.receiptList[
            index
          ].receiptInfo.invoiceTitle
        } else {
          this.$refs.getReceipt.form.type = 2
          this.$refs.getReceipt.form.companyName = this.receiptList[
            index
          ].receiptInfo.invoiceTitle
          this.$refs.getReceipt.form.companyNumber = this.receiptList[
            index
          ].receiptInfo.taxpayerId
        }
        this.$refs.getReceipt.form.phone = this.receiptList[
          index
        ].receiptInfo.phone
        this.$refs.getReceipt.form.mail = this.receiptList[
          index
        ].receiptInfo.email
        this.$refs.getReceipt.form.invoiceId = this.receiptList[
          index
        ].receiptInfo.invoiceId
        this.$refs.getReceipt.form.phonePrefix = this.receiptList[
          index
        ].receiptInfo.phonePrefix
      }
    },
    choseAddress(index) {
      this.newAddressId = null
      for (let i = 0; i < this.logisticsInfoList.length; i++) {
        this.logisticsInfoList[i].active = false
      }
      this.addressActive = index
      this.addressInfo = this.logisticsInfoList[index]
      this.getPayMode(this.addressInfo.id)
      this.logisticsInfoList[index].active = true
      const activeItem = JSON.stringify(this.logisticsInfoList[index])
      this.logisticsInfoList.splice(index, 1)
      this.logisticsInfoList.unshift(JSON.parse(activeItem))
      this.getProductList()
    },
    // 商品清单
    getProductList(type) {
      const params = {}
      if (this.$route.query.shoppingCartIds !== undefined) {
        params.shoppingCartCodes = this.$route.query.shoppingCartIds
      }
      if (this.$route.query.skuId !== undefined) {
        params.skuId = this.$route.query.skuId
        params.templateId = this.$route.query.templateId
        params.quantity = this.$route.query.quantity
      }
      params.receiverAddressId = this.addressInfo.id
      skuItem(params).then((res) => {
        if (res.status === 200) {
          if (res.data.orderSplitResponseVOList.length > 0) {
            this.productlist = res.data.orderSplitResponseVOList
            this.currency = res.data.currencySymbol
            this.totalNum = res.data.totalNum
            this.totalPrice = res.data.totalPrice
            this.realPayment = res.data.totalPrice
            if (type == 'pop') {
              this.messageVisible = false
            }
            for (let i = 0; i < this.productlist.length; i++) {
              this.remarkAttrs.push({ value: '' })
              this.receiptList.push({
                receiptInfo: {
                  email: '',
                  invoiceContent: '',
                  invoiceTitle: '',
                  invoiceType: '1',
                  phone: '',
                  taxpayerId: '',
                  phonePrefix: ''
                }
              })
            }

            // 获取收货地址list
            // if (!this.hasFormJson) {
            //   this.getList();
            // }
            // this.calculateFare();
            // this.getPayMode();
          } else {
            this.$router.push('/order/list')
          }
        }
      })
    },
    // 合并到skuItem商品清单接口，暂时注释掉
    // calculateFare(type) {
    //   //计算运费
    //   let params = {};
    //   let productSkuSelected = [];
    //   for (let i = 0; i < this.productlist.length; i++) {
    //     productSkuSelected.push({
    //       buyAmount: this.productlist[i].quantity,
    //       skuId: this.productlist[i].skuId,
    //       appId: this.productlist[i].appId,
    //       templateId: this.productlist[i].templateId,
    //     });
    //   }
    //   params.productSkuSelected = productSkuSelected;
    //   params.receiveCode = this.addressInfo.id;
    //   calculateFare(params).then((res) => {
    //     if (res.status === 200) {
    //       this.freight = res.data.freight;
    //       this.realPayment = res.data.realPayment;
    //       if (type == "pop") {
    //         this.messageVisible = false;
    //       }
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    submit(type) {
      try {
        this.orderLoading = true
        this.orderDisabled = true
        const params = {}
        params.currencySymbol = this.currency
        params.distributionId = this.distributionVal
        // params.electronicInvoiceId = this.receiptInfo.invoiceId;
        params.payModeId = this.payVal
        params.receiverAddressId = this.addressInfo.id
        // params.remark = this.remark;
        // params.freight = this.freight;
        if (type == 'continue') {
          params.continueSettleFlag = true
        }
        const shoppingCartList = []
        let totalFreight = 0
        const volist = this.productlist
        for (let i = 0; i < this.productlist.length; i++) {
          shoppingCartList.push(...this.productlist[i].shoppingCartList)
          totalFreight += this.productlist[i].freightPrice
          volist[i].remark = this.remarkAttrs[i].value
          volist[i].electronicInvoice = this.receiptList[i].receiptInfo
        }

        params.shoppingCartList = shoppingCartList
        params.orderSplitResponseVOList = volist

        params.freight = totalFreight

        addOrder(params).then((res) => {
          if (res.status === 200) {
            if (
              res.data.code === '10005' ||
              res.data.code === '10001' ||
              res.data.code === '10002' ||
              res.data.code === '10003' ||
              res.data.code === '10004' ||
              res.data.code === '10006'
            ) {
              this.msgCode = res.data.code
              this.msgContent = res.data.msg
              this.messageVisible = true
              this.orderLoading = false
              this.orderDisabled = false
              return
            }
            if (res.data.code === '200') {
              this.orderId = res.data.data
              if (this.payVal == 2 || this.totalPrice == 0) {
                this.$router.push({
                  path: '/payment/result',
                  query: { orderId: this.orderId }
                })
              } else {
                this.$router.push({
                  path: '/payment/pay',
                  query: { payVal: this.payVal, orderId: this.orderId }
                })
              }
            }
          } else {
            this.$message.error(res.data.msg)
          }
          this.orderLoading = false
          this.orderDisabled = false
        })
      } catch (error) {
        console.log(error)
        this.$message.error('对不起，系统异常，请稍后再试')
      }
    }
  }
}
</script>
<style scoped>
.address-group {
  line-height: 26px;
}
.address-item {
  display: flex;
  margin: 10px 0;
  cursor: pointer;
}
.address-item .more {
  max-width: 600px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.address-item .more span {
  margin-left: 10px;
}
.address-item .name {
  padding: 0 26px;
  border: 1px solid #ddd;
}
.address-item:hover {
  background-color: #ecf5ff;
}
.address-item.active {
  background-color: #ecf5ff;
}
.address-item.active .name {
  border: 1px solid #409eff;
  position: relative;
  overflow: hidden;
}
.address-btns {
  flex: 1;
  text-align: right;
}
.address-item.active .name::after {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-color: #409eff;
  -webkit-transform: skewY(-45deg);
  transform: skewY(-45deg);
  position: absolute;
  bottom: -10px;
  right: 0;
  z-index: 1;
}
.address-item.active .name::before {
  content: "";
  display: block;
  width: 4px;
  height: 6px;
  border-right: #ffffff solid 2px;
  border-bottom: #ffffff solid 2px;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 2;
}
.order-title {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 30px;
}
.order-title .order-subtitle {
  display: inline-block;
  font-size: 20px;
  font-weight: normal;
}
.steps-wrapper {
  float: right;
  width: 720px;
}
.order-subtitle {
  margin: 20px 0;
  clear: both;
}
.order-details {
  padding: 5px 20px;
  border: 1px solid #ddd;
}
.order-foot {
  text-align: right;
  padding: 10px;

  clear: both;
  line-height: 24px;
}
.order-foot .foot-price {
  font-size: 18px;
}
.trade-btn {
  margin-top: 10px;
  text-align: right;
  margin-bottom: 40px;
}
.address-list {
  height: 45px;
  overflow: hidden;
}
.show-detail {
  height: auto;
  max-height: 120px;
  overflow: auto;
}
.show-more {
  color: #999;
  clear: both;
  cursor: pointer;
}
.show-more i {
  transform: rotate(-90deg);
}
.address-detail {
  overflow: hidden;
}
.address-detail p {
  margin: 0 10px 10px 0;
  padding: 0px;
  line-height: 28px;
}
.address-detail span {
  margin-right: 10px;
}
</style>
<style >
.wrapper .el-radio__input {
  display: none;
}
.wrapper .el-radio__label {
  padding-left: 0;
}
.wrapper .el-radio {
  padding: 6px 25px;
  overflow: hidden;
  margin-right: 10px;
  border: 1px solid #ddd;
}
.wrapper .is-checked {
  border: 1px solid #409eff;
  position: relative;
}
.wrapper .is-checked::after {
  content: "";
  display: block;
  width: 16px;
  height: 16px;
  background-color: #409eff;
  -webkit-transform: skewY(-45deg);
  transform: skewY(-45deg);
  position: absolute;
  bottom: -10px;
  right: 0;
  z-index: 1;
}
.wrapper .is-checked::before {
  content: "";
  display: block;
  width: 4px;
  height: 6px;
  border-right: #ffffff solid 2px;
  border-bottom: #ffffff solid 2px;
  -webkit-transform: rotate(35deg);
  transform: rotate(35deg);
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 2;
}
.default-address-icon {
  background: #409eff;
  padding: 0px 4px;
  color: white;
  font-style: normal;
  font-size: 12px;
  margin-left: 10px;
  margin-top: 3px;
  height: 20px;
  line-height: 20px;
}
</style>

