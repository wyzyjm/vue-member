import Vue from 'vue'
import VueI18n from 'vue-i18n'
let zhLocal = require('@/i18n/zh_cn.js')
let enLocal = require('@/i18n/en.js')
let jaLocal = require('@/i18n/ja.js')
Vue.use(VueI18n)
let i18n
export default (async function main(){
 i18n = await fetch(window.location.origin + '/tenant.json', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      window.tenantInfo = result;
      Vue.prototype.$tenantInfo = result;
      let lang = result.language;
      let i18nIn = new VueI18n({
        locale: lang,
        messages: {
          'zh_CN': zhLocal,
          'en': enLocal,
          'ja':jaLocal,
        }
      });
      console.log('inside',i18nIn)
      return i18nIn;
    });
    return i18n;
  
})()