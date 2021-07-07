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
    <div>
      <el-tabs
        class="tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="(item, index) in tabsArr"
          :key="index"
        >
          <el-badge v-if="item.type === 0" slot="label" :value="orderCount.notPayCount" :max="99" class="item">{{ item.text }}</el-badge>
          <el-badge v-else-if="item.type === 1" slot="label" :value="orderCount.notDeliverCount" :max="99" class="item">{{ item.text }}</el-badge>
          <el-badge v-else-if="item.type === 2" slot="label" :value="orderCount.hasDeliverCount" :max="99" class="item">{{ item.text }}</el-badge>
          <el-badge v-else slot="label" class="item">{{ item.text }}</el-badge>
          <ListItem
            v-if="list.length > 0"
            ref="listItem"
            v-loading="loading"
            :list="list"
            :memberid="memberId"
            :tabsindex="tabsIndex"
          />
          <p v-else class="text-center">您还没有相关订单哦~</p>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
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
      memberId: '852198699132313600',
      title: '我的订单',
      loading: true,
      searchVal: '',
      activeName: '全部订单',
      orderCount: {
        hasDeliverCount: 0,
        notDeliverCount: 0,
        notPayCount: 0
      },
      orderType: '',
      tabsIndex: 0,
      tabsArr: [
        {
          text: '全部订单',
          type: null
        },
        {
          text: '待付款',
          type: 0
        },
        {
          text: '待发货',
          type: 1
        },
        {
          text: '待收货',
          type: 2
        },
        {
          text: '已完成',
          type: 3
        },
        {
          text: '已取消',
          type: 4
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
        pageSize: 20,
        memberId: this.memberId,
        keyWord: this.searchVal.trim(),
        orderStatus: this.orderType
      }
      orderList(listQuery).then(res => {
        this.list = res.data.data.list
        this.pagination = res.data.data.pagination
        this.loading = false
        this.initorderStatus()
      })
    },
    initorderStatus() {
      orderStatus({ memberId: this.memberId }).then(res => {
        this.orderCount.hasDeliverCount = res.data.data.hasDeliverCount
        this.orderCount.notDeliverCount = res.data.data.notDeliverCount
        this.orderCount.notPayCount = res.data.data.notPayCount
      })
    },
    // tab事件
    handleClick(tab) {
      this.tabsIndex = tab.index
      if (tab.index === '0') {
        this.orderType = ''
      } else {
        this.orderType = tab.index - 1
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

