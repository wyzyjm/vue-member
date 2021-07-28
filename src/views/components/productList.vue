<template>
  <div class="app-container">
    <div v-if="showBack" class="title">
      商品信息
      <template>
        <span
          style="flex: 1; text-align: right; font-size: 10px"
          class="text-blue"
          @click="$router.push('/cart/')"
        >&laquo;修改购买商品</span>
      </template>
    </div>

    <el-table :data="productList" style="width: 100%">
      <el-table-column label="商品信息">
        <template slot-scope="{ row }">
          <div class="product">
            <div class="productImg">
              <custom-img :src="row.skuImg" />
            </div>
            <div class="productInfo">
              <p class="title">
                {{ row.skuName }}
              </p>
              <p class="text-grey spec">
                <span
                  v-for="(item, index) in row.skuSpec"
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
      <el-table-column label="单价" width="180">
        <template slot-scope="{ row }">
          <span class="col-danger">{{ currencySymbol }}{{ row.skuPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小计" width="180">
        <template slot-scope="{ row }">
          <span class="col-danger">{{ currencySymbol }}{{ row.subtotal }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    currencySymbol: {
      type: String,
      default: true
    },
    productList: {
      type: Array,
      default: () => []
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {}
  }
}
</script>
<style scoped>
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
.productInfo p{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.el-table th {
  background: rgba(242, 242, 242, 1);
}
.col-danger {
  color: #f56c6c;
}
</style>

