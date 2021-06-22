<template>
  <div class="app-container">
    <el-table
      :data="productList"
      style="width: 100%">
      <el-table-column
        label="商品信息">
        <template slot-scope="{row}">
          <div class="product">
            <div class="productImg">
              <custom-img
                :src="row.skuImg"
              ></custom-img>
            </div>
            <div class="productInfo">
              <p class="title">
                {{ row.skuName }}
              </p>
              <p class="text-grey spec">
                <span
                  class="specItem"
                  v-for="(item, index) in row.skuSpec"
                  :key="index"
                >
                  {{ item.specName }} :
                  {{ item.specValue }}；
                </span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="单价"
        width="180">
        <template slot-scope="{row}">
          <span class="col-danger">{{currencySymbol}}{{ row.skuPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        width="180">
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="小计"
        width="180">
        <template slot-scope="{row}">
          <span class="col-danger">{{currencySymbol}}{{ row.subtotal }}</span>
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
    }
  },
  components: {
  },
  data() {
    return {
    }
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
  .el-table th{
    background: rgba(242, 242, 242, 1);
  }
  .col-danger{
    color: #F56C6C;
  }
</style>

