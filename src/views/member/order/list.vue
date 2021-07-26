<template>
  <div v-if="list" class="app-container">
    <PageTitle :pagetitle="title">
      <slot slot="slot">
        <div class="search">
          <el-input
            v-model="searchVal"
            class="input_inner"
            placeholder="商品名称/商品编号/订单号"
          />
          <el-button
            class="get-code-btn"
            icon="el-icon-search"
            @click="search"
          />
        </div>
      </slot>
    </PageTitle>
    <div v-loading="loading">
      <el-tabs
        class="tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabsArr"
          :key="index"
        >
          <el-badge v-if="item.status === 10 && orderCount.notPayCount != 0" slot="label" :value="orderCount.notPayCount" :max="99" class="item" :name="item.status">{{ item.text }}</el-badge>
          <el-badge v-else-if="item.status === 20 && orderCount.notConfirmCount != 0" slot="label" :value="orderCount.notConfirmCount" :max="99" class="item" :name="item.status">{{ item.text }}</el-badge>
          <el-badge v-else-if="item.status === 30 && orderCount.notDeliverCount != 0" slot="label" :value="orderCount.notDeliverCount" :max="99" class="item" :name="item.status">{{ item.text }}</el-badge>
          <el-badge v-else-if="item.status === 40 && orderCount.hasDeliverCount != 0" slot="label" :value="orderCount.hasDeliverCount" :max="99" class="item" :name="item.status">{{ item.text }}</el-badge>
          <el-badge v-else slot="label" class="item" :name="item.status">{{ item.text }}</el-badge>
          <ListItem
            v-if="list.length > 0"
            ref="listItem"
            :list="list"
          />
          <p v-else class="text-center">您还没有相关订单哦~</p>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        v-if="pagination.totalCount"
        background
        class="page"
        layout="prev, pager, next, jumper"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        :total="pagination.totalCount"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { orderList, orderStatus } from '@/api/order'
import PageTitle from '@/views/components/pageTitle'
import ListItem from './components/list-item'

export default {
  components: {
    PageTitle,
    ListItem
  },
  data() {
    return {
      title: '我的订单',
      loading: true,
      searchVal: '',
      activeName: '全部订单',
      orderCount: {},
      orderType: '',
      tabsIndex: 0,
      tabsArr: [
        {
          text: '全部订单',
          type: 0,
          status: null
        },
        {
          text: '待付款',
          type: 1,
          status: 10
        },
        {
          text: '待确认收款',
          type: 2,
          status: 20
        },
        {
          text: '待发货',
          type: 3,
          status: 30
        },
        {
          text: '待收货',
          type: 4,
          status: 40
        },
        {
          text: '已完成',
          type: 5,
          status: 50
        },
        {
          text: '已取消',
          type: 6,
          status: 60
        }
      ],
      list: [],
      pagination: {},
      currentPage: 1,
      kWord: ''
    }
  },
  created() {
    this.initList()
  },
  methods: {
    initList() {
      const listQuery = {
        currentPage: this.currentPage,
        pageSize: 20
      }
      if (this.searchVal.trim() !== '') {
        listQuery.keyWord = this.searchVal.trim()
      }
      if (this.orderType !== '') {
        listQuery.orderStatus = this.orderType
      }
      orderList(listQuery).then(res => {
        this.list = res.data.data.list
        this.pagination = res.data.data.pagination
        this.initorderStatus()
      })
    },
    initorderStatus() {
      orderStatus().then(res => {
        this.orderCount = res.data.data
        this.loading = false
      })
    },
    // tab事件
    handleClick(tab) {
      this.tabsIndex = tab.index
      if (tab.index === '0') {
        this.orderType = ''
      } else {
        this.orderType = tab.index * 10
      }
      this.loading = true
      this.currentPage = 1
      this.initList()
    },
    // 监听页码 变化
    handleCurrentChange(val) {
      console.log(`当前页:${val}`)
      this.currentPage = val
      this.initList()
    },
    search() {
      this.currentPage = 1
      this.initList()
    }
  }
}
</script>
<style lang="scss" scoped>
.text-center{
  text-align: center;
  line-height: 300px;
}
  .search{
    width: 300px;
    position: relative;
    bottom: 10px;
    .get-code-btn{
        position: absolute;
        right: 1px;
        top: 1px;
        border: none;
    }
  }
.item {
  margin-top: 10px;
  line-height: 23px;
}
.tabs{
  min-height: 300px;
}
</style>
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
.page {
  text-align: center;
  margin-top: 30px;
}
</style>

