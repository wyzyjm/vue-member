<template>
  <div class="app-container">
    <page-title :pagetitle="title" />
    <div
      v-if="
        cartList.length > 0 ||
          unvalidList.length > 0 ||
          data.shoppingCartList.length > 0
      "
    >
      <div class="cartList">
        <div v-if="cartList.length > 0">
          <el-table
            ref="cartList"
            :data="cartList"
            class="productTable"
            @selection-change="selectProductFun"
            @select="selectData"
            @select-all="selectData"
          >
            <!-- 索引列 -->
            <el-table-column
              type="selection"
              width="40"
              class-name="checkboxTd"
              align="center"
              :selectable="selectInit"
            />
            <el-table-column :label="$t('cart_index_1')">
              <template slot-scope="scope">
                <div class="product">
                  <div class="productImg">
                    <custom-img :src="scope.row.skuImg" />
                  </div>
                  <div class="productInfo">
                    <p class="title">
                      {{ scope.row.skuName }}
                    </p>
                    <p class="text-grey spec">
                      <span
                        v-for="(item, index) in scope.row.skuSpec"
                        :key="index"
                        class="specItem"
                      >
                        {{ item.specName }} : {{ item.specValue }}；
                      </span>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 单价 -->
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_2')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span class="strongMark">
                  {{ data.currencySymbol }}
                  {{ scope.row.skuPrice }}
                </span>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_3')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :step="1"
                  size="small"
                  :min="scope.row.moq || 1"
                  :max="scope.row.stock"
                  :class="{'is-disabledmin':scope.row.moq > scope.row.quantity ,'is-disabledmax': scope.row.stock<scope.row.quantity}"
                  @change="((val,oldVal)=>{changeQuantity(val,oldVal, scope)})"
                />
                <span v-if="scope.row['stock'] == undefined ||(scope.row['stock'] <scope.row.quantity)" class="span-danger">{{$t('cart_index_4')}}</span>
                <template v-else>
                  <span v-if="scope.row['moq']== undefined || (scope.row['moq'] > scope.row.quantity)" class="span-danger">{{$t('cart_index_5', [ scope.row.moq ])}}</span>
                </template>
              </template>
            </el-table-column>
            <!-- 小计 -->
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_6')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span class="strongMark">
                  {{ data.currencySymbol }}
                  {{ scope.row.subtotal }}
                </span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_7')"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="removeProduct(scope)"
                >{{$t('cart_index_8')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="unvalidList.length > 0">
          <p>{{$t('cart_index_9')}}</p>
          <el-table
            :data="unvalidList"
            class="productTable unvalidTable"
          >
            <el-table-column
              width="40"
              class-name="checkboxTd"
              align="center"
            >
              <template>
                <span class="unvalide">{{$t('cart_index_10')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('cart_index_1')">
              <template slot-scope="scope">
                <div class="product">
                  <div class="productImg">
                    <custom-img :src="scope.row.skuImg" />
                  </div>
                  <div class="productInfo">
                    <p class="title">
                      {{ scope.row.skuName }}
                    </p>
                    <p class="text-grey spec">
                      <span
                        v-for="(item, index) in scope.row.skuSpec"
                        :key="index"
                        class="specItem"
                      >
                        {{ item.specName }} : {{ item.specValue }}；
                      </span>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_2')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span class="strongMark">
                  {{ data.currencySymbol }}
                  {{ scope.row.skuPrice }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_3')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :step="1"
                  step-strictly
                  size="small"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_6')"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <span class="strongMark">
                  {{ data.currencySymbol }}
                  {{ scope.row.subtotal }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuName"
              :label="$t('cart_index_7')"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="removeProduct(scope)"
                >{{$t('cart_index_8')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="operate clearfix">
        <div class="plop">
          <el-checkbox
            v-model="checkAll"
            :disabled="cartList.length == 0"
            class="selectAll"
            :indeterminate="isIndeterminate"
            @change="selectAllFun"
          >{{$t('cart_index_11')}}</el-checkbox>
          <el-button type="text" :disabled="plDisabled" @click="delectMore(selectProduct,1)">{{$t('cart_index_12')}}</el-button>
          <el-button type="text" :disabled="plUntileDisabled" @click="delectMore(unvalidList,0)">{{$t('cart_index_13')}}</el-button>
        </div>
        <div class="tjop">
          <span
            class="totalCount"
          >{{$t('cart_index_14')}}<span class="strongMark">{{
              selectProduct.length
            }}</span>{{$t('cart_index_15')}}</span>
          <span
            class="totalPrice"
          >{{$t('cart_index_16')}}<span
            class="strongMark"
          >{{ data.currencySymbol }}{{ data.totalPrice }}</span></span>
          <el-button
            class="submitBtn"
            type="primary"
            :disabled="plDisabled"
            @click="submit()"
          >{{$t('cart_index_17')}}</el-button>
        </div>
      </div>
    </div>
    <div v-else class="noData">
      <div class="empty">
        <div class="icon">
          <svg-icon name="icon-qicheqianlian-" setsize="76" />
        </div>
        <p>{{$t('cart_index_18')}}</p>

        <el-button type="primary" size="small" plain @click="backHome">{{$t('cart_index_19')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import pageTitle from '../components/pageTitle'
import {
  cartData,
  cartDel,
  cartUpdate,
  updateSelected,
  selectSettle
} from '@/api/cart'
export default {
  components: {
    pageTitle
  },
  data() {
    return {
      title: this.$t('cart_index_20'),
      checkAll: false,
      isIndeterminate: false,
      selectProduct: [],
      cartList: [],
      unvalidList: [],
      data: {
        totalPrice: 5,
        totalNum: 8,
        currencySymbol: '',
        shoppingCartList: [
        ]
      }
    }
  },
  computed: {
    plDisabled() {
      return this.selectProduct.length === 0
    },
    plUntileDisabled() {
      return this.unvalidList.length === 0
    }
  },
  mounted() {
    this.renderData()
  },
  updated() {
    // this.renderData();
  },
  methods: {
    // 初始化数据
    async renderData() {
      // this.data =[];
      const res = await cartData()
      this.cartList = []
      this.unvalidList = []
      //   console.log('cart data', res)
      if (res.status === 200) {
        this.data = res.data
        this.data.totalPrice = 0
        this.data.shoppingCartList.forEach((e, i) => {
          if (!e['moq']) {
            e['moq'] = undefined
          }
          if (!e['stock']) {
            e['stock'] = undefined
          }
          if (e.statusTip == 1) {
            this.cartList.push(e)
          } else {
            this.unvalidList.push(e)
          }
        })
        console.log(this.cartList)
        this.$nextTick(() => {
          this.cartList.forEach((e, i) => {
            if (e.selected === 1 && this.$refs.cartList) {
              this.$refs.cartList.toggleRowSelection(e, true)
            }
          })
        })
      }
    },
    // 删除
    removeProduct(obj) {
      this.$confirm(this.$t('cart_index_26'), this.$t('cart_index_27'), {
        confirmButtonText: this.$t('cart_index_28'),
        cancelButtonText: this.$t('cart_index_29'),
        type: 'warning'
      }).then(async() => {
        const a_shoppingCartCode = obj.row.shoppingCartCode.replace(/^\"|\"$/g, '')
        const json = { shoppingCartIds: a_shoppingCartCode }
        const res = await cartDel(json)
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: this.$t('cart_index_30')
          })
          this.renderData()
        }
      }).catch((err) => {
        console.log(err)
      })
        .then(async() => {
          const a_shoppingCartCode = obj.row.shoppingCartCode.replace(
            /^\"|\"$/g,
            ''
          )
          const json = { shoppingCartIds: a_shoppingCartCode }
          const res = await cartDel(json)
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.renderData()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 批量删除
    delectMore(list, titleNum) {
      const title = titleNum == 1 ? this.$t('cart_index_31') : this.$t('cart_index_32')
      const arrSelect = list
      if (arrSelect.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('cart_index_33')
        })
      } else {
        this.$confirm(title, this.$t('cart_index_27'), {
          confirmButtonText: this.$t('cart_index_28'),
          cancelButtonText: this.$t('cart_index_29'),
          type: 'warning'
        }).then(async() => {
          let arr_shoppingCartCode = ''
          arrSelect.forEach(item => {
            arr_shoppingCartCode += item.shoppingCartCode + ','
          })
          const json = { shoppingCartIds: arr_shoppingCartCode }
          const res = await cartDel(json)
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: this.$t('cart_index_30')
            })
            this.renderData()
          }
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: this.$t('cart_index_34')
          })
        })
      }

    },
    selectData(val, row) {
      debugger
      let arr = []
      if (row) {
        arr.push(row)
      } else {
        if (val.length == 0) {
          arr = this.cartList
        } else {
          arr = val
        }
      }
      arr.forEach(e => {
        const select = val.find(n => n.shoppingCartCode == e.shoppingCartCode)
        if (select) {
          e.selected = 1
        } else {
          e.selected = 0
        }
      })

      this.updateStatu(arr)
    },
    // 表格选择
    selectProductFun(val) {
      const list = val

      this.selectProduct = list
      // 出去不可点击的
      let cartListLength = 0
      const dataCartList = this.cartList
      this.cartList.forEach((item, i) => {
        if (!item['disabled']) {
          cartListLength++
        }
      })
      this.isIndeterminate = val.length > 0 && val.length < cartListLength
      this.checkAll = val.length === cartListLength

      this.totalPrice()
    },
    // 状态的请求
    async updateStatu(obj) {
      const arrJson = []
      obj.forEach(e => {
        arrJson.push({
          selected: e.selected,
          shoppingCartId: this.delstr(e.shoppingCartCode),
          skuId: this.delstr(e.skuId)
        })
      })

      const res = await updateSelected(arrJson)
      if (res.code == 200) {
        // 修改成功
      }
    },
    // 全选
    selectAllFun(val) {
      console.log(val)
      if (val) {
        this.cartList.forEach(e => {
          if (!e['disabled']) {
            this.$refs.cartList.toggleRowSelection(e, true)
          }
        })
        this.selectData(this.cartList)
      } else {
        this.$refs.cartList.clearSelection()
        this.selectData([])
      }
      this.isIndeterminate = false
    },

    // 选中合计
    totalPrice() {
      this.data.totalPrice = 0
      this.selectProduct.forEach(item => {
        this.data.totalPrice += parseFloat(item.subtotal)
      })

      this.data.totalPrice = this.data.totalPrice.toFixed(2)
    },

    // 修改购物车
    async changeQuantity(currentValue, oldValue, item) {
      const obj = item.row
      let timer = null
      if (obj['moq'] && obj.quantity < obj['moq'] && currentValue < oldValue) {
        timer = setTimeout(() => {
          this.$message({
            type: 'info',
            message: this.$t('cart_index_35') + obj.moq + '！'
          })
          this.$set(this.cartList[item.$index], 'quantity', oldValue)
        }, 0)

        return false
      } else if (
        obj['stock'] &&
        obj['stock'] < obj.quantity &&
        currentValue > oldValue
      ) {
        timer = setTimeout(() => {
          this.$message({
            type: 'info',
            message: this.$t('cart_index_36')

          })
          this.$set(this.cartList[item.$index], 'quantity', oldValue)
        }, 0)
      } else {
        if (timer) {
          clearTimeout(timer)
        }
        const shoppingCartCode = this.delstr(obj.shoppingCartCode)
        const skuId = this.delstr(obj.skuId)
        const json = {
          buyAmount: obj.quantity,
          selected: obj.selected,
          shoppingCartId: shoppingCartCode,
          skuId: skuId
        }
        const res = await cartUpdate(json)
        if (res.status == 200) {
          this.data.shoppingCartList.forEach(item => {
            if (item.shoppingCartCode == obj.shoppingCartCode) {
              item.subtotal = res.data.subtotal
            }
          })
          this.totalPrice()
          this.cartList[item.$index]['disabled'] = 0
          console.log(this.cartList[item.$index])
        }
      }
    },

    selectInit(row, index) {
      if (
        row.moq > row.quantity ||
        row.quantity > row.stock ||
        !row.stock ||
        !row.moq
      ) {
        this.cartList[index].disabled = 1
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },

    // 结算
    async submit() {
      let json = {
        buyAmount: 0,
        cargoId: 0,
        goodsId: 0,
        shoppingCartId: 0,
        unitPrice: 0,
        currencySymbol: '￥',
        appId: '',
        templateId: ''
      }

      const arr = []
      let btnDis = false
      this.selectProduct.forEach(item => {
        if (item.moq > item.quantity || item.stock < item.quantity) {
          this.$message({
            type: 'info',
            message: this.$t('cart_index_37')
          })
          btnDis = true
        }
        json = {
          quantity: item.quantity,
          skuId: this.delstr(item.skuId),
          productId: this.delstr(item.productId),
          shoppingCartCode: this.delstr(item.shoppingCartCode),
          skuPrice: item.skuPrice,
          currencySymbol: item.currency,
          appId: item.appId,
          templateId: item.templateId
        }
        arr.push(json)
      })
      if (btnDis) return
      const res = await selectSettle(arr)

      switch (res.data.code) {
        case '10001':
          this.$message({
            type: 'info',
            message: this.$t('cart_index_37')
          })
          break
        case '10002':
          this.$message({
            type: 'info',
            message: this.$t('cart_index_38')
          })
          break
        case '10003':
          this.$message({
            type: 'info',
            message: this.$t('cart_index_39')
          })
          break
        case '10004':
          this.$message({
            type: 'info',
            message: this.$t('cart_index_40')
          })
          break
        case '10005':
          this.$message({
            type: 'info',
            message: this.$t('cart_index_41')
          })
          break
        case '200':
          this.renderData()
          let dataIDs = ''
          let appId = ''
          let templateId = ''
          arr.forEach(item => {
            const temp = item.templateId
            dataIDs += item.shoppingCartCode + ','
            appId += item.appId + ','
            templateId += temp || null + ','
          })
          this.$router.push({
            path: '/settlement',
            query: {
              shoppingCartIds: dataIDs,
              appId: appId,
              templateId: templateId
            }
          })
          break
      }

      console.log(this.$router)
    },
    // 去除引号
    delstr(ss) {
      if (ss) {
        const str = ss.replace(/^\"|\"$/g, '')
        return str
      }
    },
    // 跳转首页
    backHome() {
      window.location.href = window.location.origin
    }
  }
}
</script>
<style>
.checkboxTd .cell {
  padding: 0 10px;
}
.unvalidTable .checkboxTd .cell {
  padding: 0;
}
.productTable {
  color: #000;
}
.productTable .el-table__header-wrapper th {
  background: #f0f0f0;
}
.is-disabledmin .el-input-number__decrease,
.is-disabledmax .el-input-number__increase {
  border-color: #e4e7ed;
  color: #e4e7ed;
  cursor: no-drop;
}
</style>
<style scoped>
.strongMark {
  color: #f56c6c;
  font-weight: bold;
}
.cartList {
  padding: 20px 0;
}
.productTable {
  margin-bottom: 50px;
  border: 1px solid #eee;
}
.product {
  position: relative;
  height: 80px;
}
.productImg {
  width: 80px;
  height: 80px;
  position: absolute;
  left: 0;
  top: 0;
}
.productImg img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.productInfo {
  padding-left: 100px;
}
.title {
  margin: 0;
  padding: 0;
  line-height: 26px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.spec {
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
  padding-top: 8px;
}
.unvalide {
  background: #c5c5c5;
  color: #fff;
  border-radius: 8px;
  padding: 2px 5px;
  font-size: 12px;
}
.selectAll {
  margin-right: 30px;
  margin-left: 10px;
}
.operate {
  border: 1px solid #eee;
}
.plop {
  float: left;
}
.tjop {
  float: right;
}
.submitBtn {
  margin-left: 30px;
  border-radius: 0;
}
.totalPrice {
  padding-left: 30px;
}
.noData {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty {
  padding-left: 110px;
  position: relative;
}
.icon {
  width: 100px;
  font-size: 76px;
  color: #409eff;
  position: absolute;
  left: 0;
  top: 0;
}

.span-danger {
  color: #f56c6c;
  font-size: 12px;
}
</style>
