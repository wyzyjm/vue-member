import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import enlocale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '../static/js/environment.js'
// import '@/resource'

import './utils/get-app-id'
import './utils/get-tenent'
import './utils/set-site-css'
import CustomImg from '@/components/CustomImg'
Vue.component('custom-img', CustomImg)

import '@/icons' // icon
import '@/permission' // permission control
import i18n from '@/i18n/index'
Vue.use(ElementUI, { enlocale })

Vue.use(ElementUI)
import SlideVerify from 'vue-monoplasty-slide-verify'
import { isDesignMode } from './utils'
Vue.use(SlideVerify)
// 动态尾部

Vue.config.productionTip = false

// 获取header,footer
router.afterEach((to, from) => {
  if (window.headFooterEdit) {
    window.atferTo = to
    window.headFooterEdit()
  }
})

// 读cookie里的token,判断路由跳转
router.beforeEach((to, from, next) => {
  const reg = new RegExp('(^| )' + 'psession' + '=([^;]*)(;|$)')
  const res = document.cookie.match(reg)
  if (res === null && to.name !== 'forgotpassword') {
    if (!isDesignMode()) {
      window.location.href = window.location.origin + '/login.html'
    } else {
      next()
    }
  } else {
    next()
  }
})
window.pageType = 'vue'//在线客服屏蔽

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
