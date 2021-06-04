const Mock = require('mockjs')

const data = Mock.mock({
    data: {
        user: {
            "userId": "@id",
            "levelId": 34,
            "levelName": "黄金会员",
            "userName": "用户名",
            "nickName": "昵称",
             "name": "姓名",
            "avatar": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            "phone": "手机",
            "email": "zhongqi@300.cn",
            "qq": "1423568976",
            "weChat": "微信",
            "weibo": "微博",
            "pwd": "密码"
        },
        "customList": [{
            "attrId": "@id",
            "attrName": "自定义属性名称",
            "attrValue": "属性值", 
            "attrDetailType": 0,
            "attrDetailType": "text",
            "description": "提示语",
            "optionsData": "篮球,乒乓球,羽毛球,各种球", 
            "unit": "kg",
            "required": true
        }]
    }
})

module.exports = [
  {
    url: '/vue-admin-template/information/data',
    type: 'get',
    response: config => {
      const list = data.data
      return {
        code: 20000,
        data: list
      }
    }
  }
]
