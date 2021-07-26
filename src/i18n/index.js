import Vue from 'vue'
import VueI18n from 'vue-i18n'
let zhLocal =require('@/i18n/zh_cn.js')
let enLocal = require('@/i18n/en.js')
Vue.use(VueI18n)
// let lang = this.$tenantInfo.lang;
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh': zhLocal,
    'en': enLocal
  }
});

export default i18n
