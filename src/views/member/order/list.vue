<template>
  <div class="app-container">
    <page-title :pagetitle='title'>
      <el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
		</page-title>
    <div>

      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane 
          v-for="(item, index) in tabsArr" 
          :key="index"
          :label="item.text" 
          :name="item.text"
          >
            <listItem :list="list" />
        </el-tab-pane>
      </el-tabs>
      
      <el-pagination
        class="page"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getList } from '@/api/table'
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
      searchVal: '1',
      tabsModel: 123,
      activeName: '全部订单',
      tabsArr: [
				{
					text: "全部订单",
          type: null
				},
				{
					text: "待付款",
          type: 0
				},
				{
					text: "待发货",
          type: 1
				},
				{
					text: "待收货",
          type: 2
				},
				{
					text: "已完成",
          type: 3
				},
				{
					text: "已取消",
          type: 4
				},
      ],
      list:[],
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
      console.log(tab, event);
    },
    // 监听页码 变化
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
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

