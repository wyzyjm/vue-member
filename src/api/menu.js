import request from '@/utils/request'

export function getList(data) {
    return request({
      url: '/page-service/sys/list',
      method: 'post',
      data
    })
  }

  