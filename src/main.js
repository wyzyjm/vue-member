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

import CustomImg from '@/components/CustomImg'
Vue.component('custom-img', CustomImg)

  
import '@/icons' // icon
import '@/permission' // permission control
import i18n from '@/i18n/index'
Vue.use(ElementUI, { enlocale })

Vue.use(ElementUI)
import SlideVerify from 'vue-monoplasty-slide-verify';

Vue.use(SlideVerify);
//动态尾部

Vue.config.productionTip = false

//获取header,footer
 router.afterEach((to, from) => {
  if(window.headFooterEdit){
   window.atferTo = to
    window.headFooterEdit()
  }
  
})
//读cookie里的token,判断路由跳转
router.beforeEach((to,from,next)=>{
  // let psession = ''
  // console.log(document.cookie)
  // let reg = new RegExp("(^| )"+"psession"+"=([^;]*)(;|$)")
  // let res = document.cookie.match(reg)
   
  //  if(res===null){
  //   // if(psession==''){
  //     // psession = unescape(res[2])
  //     // window.location.href = window.location.origin+'/sys/forgotpassword'
      
  //     next({path:'/forgotpassword'});
    
  //  }else{
  //    next(to)
  //  }
   
  next()
  
})



fetch(window.location.origin + '/css/site.css').then(function (res) {
  // console.log(res.text())
  return res.text()
}).then(function (result) {
  // console.log(result.replace(/[\r\n ]/g,""))
  let cssStr = result.replace(/[\r\n ]/g, "")
  console.log(cssStr)
  let resCss = cssToObject(cssStr)
  let bgColor = ''
  let textColor = ''
  for (let i = 0; i < resCss.length; i++) {
    if (resCss[i].selector === '.s_button1') {
      bgColor = resCss[i].props['background-color']
      textColor = resCss[i].props['color']
    }
  }
  let style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = `.s_sys_bgcolor{\r\nbackground-color:${bgColor} !important}\n.s_sys_textcolor{color:${bgColor}}
  .cestep .is-finish .el-step__icon, .cestep .is-process .el-step__icon{background-color:${bgColor}}
  .cestep .is-finish .el-step__line{background:${bgColor}}
  .cestep .hasIcon .is-finish .el-step__icon, .cestep .hasIcon .is-process .el-step__icon{color:${bgColor}}
  .el-step__head.is-finish{color:${bgColor};border-color:${bgColor}}
  .cestep .hasIcon .is-finish .el-step__icon, .cestep .hasIcon .is-process .el-step__icon{color:${bgColor}}
  .menu .item:hover, .menu .item.active{color:${bgColor};border-left: 5px solid ${bgColor};}
  .el-pagination.is-background .el-pager li:not(.disabled).active{background-color:${bgColor}}
  .el-tabs__item.is-active{color:${bgColor}}
  .el-tabs__active-bar{background-color:${bgColor}}
  .el-tabs__item:hover{color:${bgColor}}
  .icon{color:${bgColor}}
  .el-radio__input.is-checked+.el-radio__label{color:${bgColor}}
  .wrapper .is-checked::after{background-color:${bgColor}}
  .wrapper .is-checked{border: 1px solid ${bgColor};}
  .el-button--primary.is-plain{color:${bgColor};border-color:${bgColor};color:${textColor}}
  .el-button--text{color:${bgColor}}
  .el-button--primary{background-color:${bgColor};border-color:${bgColor};color:${textColor}}
  .el-button--primary:focus, .el-button--primary:hover,.el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover{background:${bgColor};border-color:${bgColor}}

  `
  document.head.appendChild(style)
  
}) 

function removeComments(css) {
  let start;
  while ((start = css.indexOf('/*')) !== -1 && (end = css.indexOf('*/')) !== -1) {
    css = css.slice(0, start) + css.slice(end + 2)
  }

  return css
}

function cssToObject(css) {
  // 去除css注释
  css = removeComments(css)


  let cssArr = []

  while (css.length > 1) {
    // 获取到大括号的前后索引
    let lIndex = css.indexOf('{')
    let rIndex = css.indexOf('}')

    if (rIndex === -1) break

    // 获取css选择器
    let selector = css.slice(0, lIndex).replace(/;/g, '').trim()

    // 大括号内全部css规则字符串
    let cssProps = css.slice(lIndex + 1, rIndex)
    // css数组转换成css对象
    let cssRules = cssPorpsToObject(cssProps);

    cssArr.push({
      selector,
      props: cssRules
    })

    // 去掉处理后的css部分用新的css继续循环
    css = css.slice(rIndex + 1).trim()
  }

  return cssArr
}
// 属性字符串转对象
function cssPorpsToObject(cssProps) {
  // css字符串转换成css属性值数组
  let cssRules = cssProps.split(';').map(el => el.trim()).filter(el => el.length > 0)
  let obj = {}

  cssRules.forEach(el => {
    const middleIndex = el.indexOf(':')
    const prop = el.slice(0, middleIndex).trim()
    const value = el.slice(middleIndex + 1).trim()

    obj[prop] = value
  })

  return obj
}




new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
