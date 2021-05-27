<template>
  <div class="app-container collection">
    <!-- 头部 -->
    <PageTitle pagetitle="我的收藏"></PageTitle>
    <div class="page-container">
      <!-- 导航栏 -->
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.id"
          :label="item.collectName"
          :name="item.collectType"
        >
          <!-- 内容区 开始 -->
          <div class="cotent">
            {{ item.collectName }}
          </div>
          <!-- 内容区 结束 -->
        </el-tab-pane>
      </el-tabs>

      <!-- 分页 开始 -->
      <el-pagination class="page" background layout="prev, pager, next" :total="1000">
      </el-pagination>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>
<script>
import PageTitle from "@/views/components/pageTitle"; // 头部
export default {
  data() {
    return {
      activeName: "0", // 高亮哪一个
      tabList: [], // tab栏数据
      collectList: [], // 收藏列表
    };
  },
  components: {
    PageTitle,
  },
  created() {
    this.getTabList();
  },
  methods: {
    // 获取tab栏
    getTabList() {
      // 1. 请求tab栏数据
      this.tabList = [
        {
          id: 23245,
          userId: 34567,
          collectName: "产品收藏",
          collectType: "0",
        },
        {
          id: 34543543,
          userId: 34567,
          collectName: "课程收藏",
          collectType: "1",
        },
        {
          id: 2354565464245,
          userId: 34567,
          collectName: "咨询收藏",
          collectType: "2",
        },
      ];
      // 2. 请求第一栏 内容
    },
  },
};
</script>
<style  lang="scss">
.collection .el-tabs__nav-wrap::after {
  height: 0;
}
.page{
  text-align: center;
  margin-top: 30px;
}
</style>

