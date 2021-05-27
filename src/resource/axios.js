import Vue from 'vue'
import API from './api'
import axios from 'axios'
import merge from 'webpack-merge'
import { Message } from 'element-ui'

class Axios extends API {
  create({ plugins = [], ...defaultOptions } = {}) {
    let superClass = this
    let instance = axios.create(merge({}, ...plugins))

    return function (key, params = {}) {
      let module = superClass.loader(key)
      let api = module.api
      let config = module.config
      if (config = 'undefine') {
        config = {}
      }
      let isGet = superClass.isGet(api.method)
      let options = merge(defaultOptions, config, api)
      let ISALERTED = false

      options[isGet ? 'params' : 'data'] = params
      return new Promise(function (resolve, reject) {
        instance.request(options).then(function (response) { //200 - 299 成功，400 - 499 业务异常，但是程序处理成功了， 500+是系统异常，一般都是一些堆栈类的错误
          if (response && response.data) {
            if (response.data.status == 200 || response.data.status == 101 || response.data.status == 102) {
              resolve(response.data.data)
            } else if (response.data.status == 999) {
                let locationUrl,isB = false
                //判读是否是B端会员登录
                try{
                    isB = Vue.prototype.$memberInfo.user.traceability == 2 ? true : false
                }catch(e){}
                //判读是否是B端会员登录end
                if(isB){
                    let origin = ''
                    try{
                        origin = '//' + Vue.prototype.$nowSite.productDomain
                    }catch(e){}
                    locationUrl = origin + '/admin'
                }else{
                    let locations = decodeURIComponent(response.data.location)
                    let len = locations.split('?').length
                    let connectSymbol = len > 2 ? '&backurl=' : '?backurl='
                    locationUrl = response.data.location + encodeURIComponent(connectSymbol + encodeURIComponent(window.location.href))
                }
                window.location.href = locationUrl
            } else if (response.data.status >= 400 && response.data.status <= 499) {
              reject(response)
            } else if (response.data.status >= 500 && response.data.status < 999) {
              if (!ISALERTED) {
                Message({
                  showClose: true,
                  message: '系统异常，请稍后重试！',
                  type: 'error',
                });
                ISALERTED = true;
                setTimeout(function () {
                  ISALERTED = false;
                }, 5000);
              }
              reject(response)
            } else {
              reject(response)
            }
          } else {
            reject(response)
          }

        }).catch(function (err) {
          if (!ISALERTED) {
            Message({
              showClose: true,
              message: '网络异常，请稍后重试！',
              type: 'error',
            });
            ISALERTED = true;
            setTimeout(function () {
              ISALERTED = false;
            }, 5000);
          }
          reject(err)
          __ce.debug ? __ce._.loadingBar.error() : setTimeout((v) => {
            __ce._.loadingBar.terminate()
          })
        })
      })
    }
  }
}

export default {
  install: function (Vue, {
    basePath,
    ...options
  } = {}) {
    let create = new Axios(basePath).create(options)
    Vue.prototype.$api = Vue.api = __ce._.api = create
  }
}