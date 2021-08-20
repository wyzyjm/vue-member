
import request from '@/utils/request'
//获取随机验证码数字
export function getRandomCaptcha(params) {
  return request({
    url: '/fwebapi/member/getRandomCaptcha',
    method: 'get',
    params
  })
}
//查询账号是否存在
export function getByAccountRSA(data) {
  return request({
    url: '/fwebapi/member/getByAccountRSA',
    method: 'post',
    data
  })
}
//保存密码
export function saveLoginPwdRSA(data) {
  return request({
    url: '/fwebapi/member/saveLoginPwdRSA',
    method: 'post',
    data
  })
}
//获取手机验证码
export function generateCode(data) {
  return request({
    url: '/fwebapi/member/detail/generateCaptcha?appId=' + window.appMap.member,
    method: 'post',
    data
  })
}
//检查是否可以修改密码
export function checkForgetPwdRSA(data) {
  return request({
    url: '/fwebapi/member/checkForgetPwdRSA',
    method: 'post',
    data
  })
}

