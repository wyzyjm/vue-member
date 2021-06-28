/**
 * Created by PanJiaChen on 16/11/18.
 */
import address from "@/views/components/resource/locList_zh_CN.js" // 国家josn

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
export function telValidate(inputVal) {
  var telReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!telReg.test(inputVal)) {
    return false;
  } else {
    return true;
  }
}
export function emailValidate(val) {
  var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
  if (!reg.test(val)) {
    return false;
  } else {
    return true;
  }
}

/**
 * @param {string}  province 省code
 * @param {string}  city 市code
 * @param {string}   detail 详细地址code
 * @param {number}   reverseFlag 是否倒排
 * @param {boolean}   isJoin 是否拼接
 * 
 */
export const getAddressName = (country, province, city, area) => {
  if (!country) return; // 没有国家 返回
  var _country = "", _a = "", _b = "", _c = ""; // 省市区
  address.Location.CountryRegion.map(item => {
    if (item['-Code'] !== country) return;
    _country = item['-Name'] // 获取国家名称
    if (!item.State) return _country; //  只返回一个国家
    if (Array.isArray(item.State)) {
      item.State.map(i => {
        if (i['-Code'] !== province) return;
        _a = i['-Name'] // 获取省
        if (!i.City) return; // 不存在市

        i.City.map(v => {
          if (v['-Code'] !== city) return;
          _b = v['-Name']

          if (!v.Region) return; // 不存在区 

          if (Array.isArray(v.Region)) {
            v.Region.map(c => {
              if (c['-Code'] !== area) return; // 不存在区
              _c = c['-Name']
            })
          } else {
            if (v.Region['-Code'] !== area) return;
            _c = v.Region['-Name']
          }
        })

      })
    } else {
      item.State.City.map(i => {
        if (i['-Code'] !== province) return;
        _a = i['-Name']
      })
    }
  })
  return _a + _b + _c
}