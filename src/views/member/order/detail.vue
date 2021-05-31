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
      productList: []
    }
  },
  methods: {
    
  }
}
</script>
<style scoped>

</style>

