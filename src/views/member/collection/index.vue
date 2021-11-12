<template>
  <div class="app-container collection">
    <!-- 头部 开始-->
    <PageTitle :pagetitle="$t('member_collection_index_1')" />
    <!-- 头部 结束-->

    <!-- 主体区 开始 -->
    <div class="page-container">
      <!-- 功能 + 内容区 开始 -->
      <div class="fun-area">
        <!-- 导航栏 -->
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.id"
            v-loading="isLoading"
            :label="item.collectName"
            :name="item.collectType"
          >
            <!-- 内容区 开始 -->
            <!-- 无内容提示 -->
            <div v-if="total === 0" class="no-content-tip">{{$t('member_collection_index_2')}}</div>

            <!-- 有内容 -->
            <ul v-else class="content">
              <li v-for="item in collectList" :key="item.id">
                <!-- 批量操作 -->
                <div
                  v-show="isBatch"
                  class="mask"
                  :class="{ 'mask-light': selectList.indexOf(item.id) != -1 }"
                  @click="addCollect(item.id)"
                >
                  <svg-icon name="icon-dui" class="icon-dui" />
                </div>
                <!-- 取消收藏 -->
                <div
                  class="cancel"
                  :class="{ dn: isBatch }"
                  @click="aloneCancelCollect(item.id)"
                >{{$t('member_collection_index_3')}}</div>
                <!-- 内容状态 -->
                <div v-if="item.status !== 0" class="status">
                  <!-- 已下架 -->
                  <div v-if="item.status === 1">{{$t('member_collection_index_4')}}</div>
                  <!-- 无货 -->
                  <div v-else-if="item.status === 2">{{$t('member_collection_index_5')}}</div>
                  <!-- 已下架 -->
                  <div v-else>{{$t('member_collection_index_6')}}</div>
                </div>
                <!-- 链接内容 -->
                <a :href="item.href">
                  <!-- 图片 开始 -->
                  <custom-img
                    :src="item.imgUrl"
                    :title="item.title"
                    :alt="item.title"
                    class="img"
                  />
                  <!-- 图片 结束-->

                  <!-- 标题 开始 -->
                  <p class="title">{{ item.title }}</p>
                  <!-- 标题 结束-->

                  <!-- 价格 开始 -->
                  <p>
                    <b class="retailPrice text-danger">
                      {{ item.currencySymbol }}{{ item.retailPrice }}
                    </b>
                    <del class="price text-grey">
                      {{ item.currencySymbol }}{{ item.price }}
                    </del>
                  </p>
                  <!-- 价格 结束-->
                </a>
              </li>
            </ul>
            <!-- 内容区 结束 -->
          </el-tab-pane>
        </el-tabs>

        <div v-if="collectList.length !== 0" class="btn-group">
          <!-- 批量操作按钮 -->
          <el-button
            v-show="!isBatch"
            type="primary"
            size="mini"
            plain
            @click="batchOperate"
          >{{$t('member_collection_index_7')}}</el-button>
          <!-- 全选 -->
          <el-checkbox
            v-show="isBatch"
            v-model="allChecked"
            @change="allCheckedFn"
          >{{$t('member_collection_index_8')}}</el-checkbox>
          <!-- 取消收藏 文本按钮 -->
          <el-button
            v-show="isBatch"
            type="text"
            class="cancel-btn"
            @click="cancelCollect"
          >{{$t('member_collection_index_3')}}</el-button>
          <!-- 取消按钮 -->
          <el-button
            v-show="isBatch"
            type="primary"
            plain
            size="mini"
            @click="cancelBatchOperate"
          >{{$t('member_collection_index_9')}}</el-button>
        </div>
      </div>
      <!-- 功能 + 内容区 结束 -->

      <!-- 分页 开始 -->
      <el-pagination
        v-if="collectList.length !== 0"
        class="page"
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
      <!-- 分页 结束 -->
    </div>
    <!-- 主体区 结束 -->

    <!-- <el-button type="primary" @click="addCollectionFn">{{$t('member_collection_index_10')}}</el-button> -->
  </div>
</template>
<script>
import PageTitle from '@/views/components/pageTitle' // 头部组件

import {
  getCollectionList,
  deleteCollectionContent
} from '@/api/collection'
export default {
  components: {
    PageTitle // 页面标题组件
  },
  data() {
    return {
      // 页面参数
      isBatch: false, // 是否批量
      activeName: 'product', // 高亮哪一个
      selectList: [], // 所选内容id
      allChecked: false, // 是否全选
      // data
      tabList: [], // tab栏数据
      collectList: [], // 收藏列表数据
      // 分页数据
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数

      isLoading: true // loading效果
    }
  },
  created() {
    this.getTabList() // 实例创建完毕, 获取tab栏内容, 并获取第一个tab栏下的内容
  },
  methods: {
    // 获取tab栏
    getTabList() {
      // 1. 请求tab栏数据
      this.tabList = [
        {
          id: 23245,
          userId: 34567,
          collectName: this.$t('member_collection_index_11'),
          collectType: 'product'
        }
      ]
      // 2. 请求第一栏 内容
      this.getCollectList(this.currentPage, this.pageSize)
    },
    // 获取 内容列表
    async getCollectList(currentPage, pageSize) {
      this.isLoading = true
      const data = {
        currentPage: currentPage,
        pageSize: pageSize,
        collectionType: 'product',
        orderByMap: {
          updateDate: 'asc'
        }
      }
      try {
        const { data: res } = await getCollectionList(data)
        console.log(res)
        // if (res.list.length === 0) return
        this.collectList = res.list // 设置列表
        this.total = res.page.totalCount // 收藏总数
        this.currentPage = res.page.currentPage // 当前页码
        this.pageSize = res.page.pageSize // 每页条数

        this.isLoading = false // 取消loading效果
      } catch (error) {
        this.isLoading = false
      }
    },
    // 取消收藏
    async removeCollection(arrId) {
      const data = {
        bizIds: arrId
      }
      try {
        const { status } = await deleteCollectionContent(data)
        if (status !== 200) return
        this.getCollectList(this.currentPage, this.pageSize)
      } catch (error) {
        console.log(error)
      }
    },
    // 监听tab栏切换
    tabClick(tab, event) {
      console.log(tab, event)
    },

    // 监听页码 变化
    handleCurrentChange(val) {
      this.getCollectList(val, this.pageSize)
    },

    // 单独取消
    aloneCancelCollect(id) {
      // 根据id发送 删除请求
      const arrId = [id]
      console.log(arrId)
      this.removeCollection(arrId)
    },

    // 批量操作
    batchOperate() {
      this.isBatch = true // 改变状态, 页面ui结构发生变化
    },
    // 全选
    allCheckedFn() {
      if (!this.allChecked) return (this.selectList = []) // 不是选中状态时, 直接置空
      /**
       * 1. 当 复选框处于选中状态时
       * 2. 遍历当前所有内容, 判断 选中数组中是否存在 选中的id
       * 3. 将没有选中的内容id, 添加到 选中数组中
       */
      this.collectList.map((v, i) => {
        if (this.selectList.indexOf(v.id) === -1) this.selectList.push(v.id)
      })
    },
    // 取消收藏
    async cancelCollect() {
      // 未勾选内容
      if (this.selectList.length === 0) {
        return this.$message({
          message: '请选择内容',
          type: 'warning'
        })
      }
      // 勾选内容
      try {
        const result = await this.$confirm('确认取消所选收藏的商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (result !== 'confirm') return // 不是确认直接返回,一般都是confirm
        this.removeCollection(this.selectList) // 批量删除
        this.removeStatu() // 移除批量操作 所有状态
        this.getCollectList() // 重新获取内容列表
      } catch (error) {
        console.log('取消')
      }
    },
    // 批量选中 单独点击
    addCollect(id) {
      /**
       * 1. 判断 数组中是否有点击的id
       * 2. 如果有, 就找到 点击id 所在位置,从数组中删除
       * 3. 如果没有, 就向数组中添加点击的id
       * */
      if (this.selectList.some((v) => v === id)) {
        this.selectList.map((c, i) => {
          if (c === id) {
            this.selectList.splice(i, 1)
          }
        })
      } else {
        this.selectList.push(id)
      }
      // 判断被选中的 和 总共的 长度是否相同, 来确定是否全选
      if (this.selectList.length === this.collectList.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // 取消操作
    cancelBatchOperate() {
      this.removeStatu()
    },
    // 取消批量选择状态
    removeStatu() {
      this.selectList = [] // 清空选择
      this.allChecked = false // 取消全选状态
      this.isBatch = false // 取消批量
    }

  }
}
</script>
<style  lang="scss">
ul,
li {
  list-style: none;
  margin: 0;
}
ul {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;
}
.dn {
  display: none;
}
.collection {
  .fun-area {
    position: relative;
    overflow: hidden;
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
      height: 40px;
      display: flex;
      align-items: center;
      .cancel-btn {
        margin: 0 25px;
        color: #606266;
        &:hover {
          color: #409eff;
        }
      }
    }
    .no-content-tip {
      min-height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #606266;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      li {
        position: relative;
        width: 20%;
        overflow: hidden;
        padding: 5px;
        &:hover .cancel {
          opacity: 1;
          z-index: 999;
        }

        .mask {
          position: absolute;
          left: 5px;
          top: 5px;
          right: 5px;
          bottom: 5px;
          z-index: 999;
          background-color: rgba(0, 0, 0, 0.3);
          border: 2px solid transparent;
          cursor: pointer;
          .icon-dui {
            position: absolute;
            right: -2px;
            top: -2px;
            display: block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 2px;
            color: #fff;
            background: rgba(102, 102, 102, 1);
            font-size: 18px;
          }
        }
        .mask-light {
          border: 2px solid rgba(64, 158, 255, 1);
          .icon-dui {
            background-color: rgba(64, 158, 255, 1);
          }
        }
        .cancel {
          position: absolute;
          right: 5px;
          top: 5px;
          text-align: center;
          width: 65px;
          height: 25px;
          line-height: 25px;
          font-size: 12px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.5s ease;
        }
        // 状态
        .status {
          position: absolute;
          left: 5px;
          top: 5px;
          right: 5px;
          bottom: 5px;
          z-index: 888;
          z-index: 888;
          overflow: hidden;
          display: flex;
          justify-content: center;
          div {
            margin-top: 25px;
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border-radius: 100%;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
        a {
          display: block;
          border: 1px solid rgba(222, 222, 224, 1);
          padding: 5px;
          .img {
            display: block;
            overflow: hidden;
            height: 150px;
          }
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          p {
            text-align: center;
            .retailPrice {
              font-size: 16px;
            }
            del {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  .page {
    text-align: center;
    margin-top: 30px;
  }
}
</style>

