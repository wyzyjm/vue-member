<template>
  <div class="app-container">
      订单详情
    <product-list :productList="productList"></product-list>
  </div>
</template>
<script>
import productList from '@/views/components/productList'

export default {
  components: {
    productList
  },
  data() {
    return {
      productList: [{
          "productId": 144,
          "skuId": 271,
          "skuName": "货品名称",
          "skuImg": "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
          "skuPrice": 1121210.0,
          "quantity": 11,
          "aggregateAmount": 1210.0,
          "skuSpec": [{
              "specName": "内存",
              "specValue": "8+256g"
          }],
          "productUrl": "/product/144. html"
      },{
          "productId": 144,
          "skuId": 271,
          "skuName": "货品名称",
          "skuImg": "/repository/image / 1 f6fa47f - d790 - 4907 - 95 cc - 1 c06f290f71b.jpg",
          "skuPrice": 110.0,
          "quantity": 11,
          "aggregateAmount": 1210.0,
          "skuSpec": [{
              "specName": "内存",
              "specValue": "8+256g"
          }],
          "productUrl": "/product/144. html"
      }]
    }
  },
  methods: {
    
  }
}
</script>
<style scoped>

</style>

