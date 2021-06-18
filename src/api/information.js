import request from '@/utils/request'

export function memberDetail(params) {
  return request({
    url: '/fwebapi/member/detail/getMemberDetail',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params
  })
}
