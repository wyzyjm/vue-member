import request from '@/utils/request'

/**
 * 1. 获取收藏列表
    {
        currentPage: currentPage,            当前页
        pageSize: pageSize,                  条数
        memberBizId: "854299120902660096",   会员业务ID
        collectionType: "product",           收藏类型
        orderByMap: {
          updateDate: "asc",                 排序方式
        },
    }
 */
const getCollectionList = (data) => {
  return request({
    url: '/fwebapi/member/collection/findPageList?appId='+window.appMap.member,
    method: 'POST',
    data,
  })
}

/**
 * 2. 添加收藏内容
    852945602618646528
    852953242098786304
    852968746842644480
    854294742711721984
    854336192438657024
    854345646085300224
    854399327782625280
    854400995769245696
    854401691063214080
    854402193578582016
    {
        "memberBizId": 854299120902660096,          // 会员业务id
        "collectionType": "product",                // 收藏类型
        "collectionDataId": 855104970223050752,     // 收藏内容ID
    }
 */
const addCollectionContent = (data) => {
  return request({
    url: '/fwebapi/member/collection/insert',
    method: 'POST',
    data,
 
  })
}

/**
 * 3. 删除收藏内容
    {
      memberBizId:"854299120902660096",             // 会员业务ID
      bizIds : [855399389719748608]                 // 收藏内容ID
    }
 */
const deleteCollectionContent = (data) => {
  return request({
    url: '/fwebapi/member/collection/deleteByList',
    method: 'POST',
    data,
  
  })
}

export {
  getCollectionList, // 获取
  addCollectionContent, // 添加
  deleteCollectionContent // 删除
}
