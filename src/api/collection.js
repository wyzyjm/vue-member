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
        url: "/fwebapi/member/collection/findPageList",
        method: "POST",
        data,
        params: {
            tenantId: 1600018169,
            instance: "qinhui20210610",
            appId: 143150160001
        }
    })
}

/**
 * 2. 添加收藏内容
    {
        "memberBizId": 854299120902660096,          // 会员业务id
        "collectionType": "product",                // 收藏类型
        "collectionDataId": 855104970223050752,     // 收藏内容ID
    }
 */
const addCollectionContent = (data) => {
    return request({
        url: "/fwebapi/member/collection/insert",
        method: "POST",
        data,
        params: {
            tenantId: 1600018169,
            instance: "qinhui20210610",
            appId: 143150160001
        }
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
        url: "/fwebapi/member/collection/deleteByList",
        method: "POST",
        data,
        params: {
            tenantId: 1600018169,
            instance: "qinhui20210610",
            appId: 143150160001
        }
    })
}

export {
    getCollectionList, // 获取
    addCollectionContent, // 添加
    deleteCollectionContent // 删除
}