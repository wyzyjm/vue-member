import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { isDesignMode } from '@/utils/index'

let baseurl = ''
if (process.env.NODE_ENV == 'development') {
  baseurl = 'http://20210622144830.p.make.test-dcloud.portal1.portal.yun300.cn/nportal/';
  // baseurl = 'http://qinhui20210610.p.make.test-dcloud.portal1.portal.yun300.cn/nportal/';
  // baseurl = 'http://172.22.146.56:8888/';
}
else if (process.env.NODE_ENV == 'production') {
  baseurl = '/nportal/';
}


// create an axios instance
const service = axios.create({
  // baseURL: 'http://10.12.68.205:8096/', // url = base url + request url
  baseURL: baseurl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
service.defaults.headers.post['Content-Type'] = 'application/json'
// service.defaults.headers.post['tenantId'] = 1600018169
// service.defaults.headers.get['tenantId'] = 1600018169
// service.defaults.headers.post['instance'] = 'qinhui20210610'
// service.defaults.headers.get['instance'] = 'qinhui20210610'
// service.defaults.headers.post['appId'] = window.appList.member
// service.defaults.headers.post['appId'] = 1

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    if (response.status === 200) {
      if (response.data.data != undefined && response.data.data.code != undefined && response.data.data.code == '401') {
       
        if (!isDesignMode()) {
          window.location = window.location.origin + '/login.html'
        }
      } else {
        console.log("interceptor",response.data)
        return response.data
      }
    }

  },
  error => {
    console.log('err' + error) // for debug

    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
