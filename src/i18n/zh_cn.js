// 引入对应模块文件
let settlement = require('./i18nkeys/zh_cn/settlement') ;
let payment = require('./i18nkeys/zh_cn/payment') ; 
let allKeys = {}
//合并使用
Object.assign(allKeys,settlement,payment);
module.exports = allKeys;
