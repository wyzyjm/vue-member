import request from '@/utils/request'

/**
 * 1. 获取收藏列表
    {
        currentPage: currentPage,            当前页
        pageSize: pageSize,                  条数
        collectionType: "product",           收藏类型
        orderByMap: {
          updateDate: "asc",                 排序方式
        },
    }
 */
const getCollectionList = (data) => {
  return request({
    url: '/fwebapi/member/collection/findPageList?appId=' + window.appMap.member,
    method: 'POST',
    data
  })
}

/**
 * 2. 添加收藏内容
    {
        "collectionType": "product",                // 收藏类型
        "collectionDataId": 855104970223050752,     // 收藏内容ID
    }
 */
const addCollectionContent = (data) => {
  return request({
    url: '/fwebapi/member/collection/insert?appId=' + window.appMap.member,
    method: 'POST',
    data

  })
}

/**
 * 3. 删除收藏内容
    {
      bizIds : [855399389719748608]                 // 收藏内容ID
    }
 */
const deleteCollectionContent = (data) => {
  return request({
    url: '/fwebapi/member/collection/deleteByList?appId=' + window.appMap.member,
    method: 'POST',
    data

  })
}

export {
  getCollectionList, // 获取
  addCollectionContent, // 添加
  deleteCollectionContent // 删除
}
