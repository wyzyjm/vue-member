import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/vue-admin-template/detail/data',
    method: 'get',
    params
  })
}

export function getInformation(params) {
  return request({
    url: '/vue-admin-template/information/data',
    method: 'get',
    params
  })
}
export function memberDetail(params) {
  return request({
    url: '/fwebapi/member/detail/getMemberDetail',
    method: 'get',
    params
  })
}
