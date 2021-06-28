import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function updateMember(data) {
  return request({
    url: '/fwebapi/member/detail/updateMember',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPwd(params) {
  return request({
    url: '/fwebapi/member/detail/resetPwd',
    method: 'get',
    params
  })
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: '/fwebapi/member/detail/updatePwd',
    method: 'post',
    data
  })
}

// 获取验证码
export function generateCode(data) {
  return request({
    url: '/fwebapi/member/detail/generateCode',
    method: 'post',
    data
  })
}

// 获取验证码变量值
export function validateVerifyCode(data) {
  return request({
    url: '/fwebapi/member/detail/validateVerifyCode',
    method: 'post',
    data
  })
}

// 更改/绑定手机、邮箱
export function bingling(data) {
  return request({
    url: '/fwebapi/member/detail/bingling',
    method: 'post',
    data
  })
}

// 解绑手机、邮箱
export function unbundling(data) {
  return request({
    url: '/fwebapi/member/detail/unbundling',
    method: 'post',
    data
  })
}
