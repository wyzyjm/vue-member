<template>
  <div class="app-container">
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
          <el-badge slot="label" :value="200" :max="99" class="item">{{ item.text }}</el-badge>
          <listItem :list="list" />
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        background
        class="page"
        layout="prev, pager, next, jumper"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getList } from '@/api/table'
import PageTitle from '@/views/components/pageTitle'
import listItem from './components/list-item'

export default {
  components: {
    PageTitle,
    listItem
  },
  data() {
    return {
      title: '我的订单',
      searchVal: null,
      tabsModel: 123,
      activeName: '全部订单',
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
      total: 10, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.list
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 监听页码 变化
    handleCurrentChange(val) {
      console.log(`当前页:${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
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

