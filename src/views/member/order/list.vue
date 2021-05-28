<template>
  <div class="app-container">
    <page-title :pagetitle='title'>
			<slot slot="slot">搜索</slot>
		</page-title>
    <div>

      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane 
          v-for="(item, index) in tabsArr" 
          :key="index"
          :label="item.text" 
          :name="item.text"
          >
          <div v-if="list.length">
            <listItem :item="list" />
          </div>
          <div v-else class="notData">暂无数据</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import pageTitle from '@/views/components/pageTitle'
import listItem from './components/list-item'

export default {
  components: {
    pageTitle,
    listItem
  },
  data() {
    return {
      title: '我的订单',
      tabsModel: 123,
      activeName: '全部订单',
      tabsArr: [
				{
					text: "全部订单",
					apiType: "/information",
				},
				{
					text: "待付款",
					apiType: "/order/list",
				},
				{
					text: "待发货",
					apiType: "/form",
				},
				{
					text: "待收货",
					apiType: "/collection",
				},
				{
					text: "已完成",
					apiType: "/address",
				},
				{
					text: "已取消",
					apiType: "/memberCart",
				},
      ],
      list:[]
 
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>
<style lang='scss'>
.el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
    background-color: #ffffff;
    z-index: 1;
}
</style>

