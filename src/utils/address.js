import addressData from '@/views/components/resource/locList_zh_CN'

/**
 * 1. 输入 国家,省市区编码, 获取对应名称
 * @param {String | country}   国家code
 * @param {String | province}  省code
 * @param {String | city}   市code
 * @param {String | county}   区县code
 * @param {Boolean | isJoin}   结果是否拼接
 *
 * 1. @return  {Object | a + ' - ' + b + c + d}  分别对应: 国家, 省, 市, 区
 * 2. @return  {String | b + c + d + ' - ' + a} 分别对应: 省, 市, 区, - 国家
 */
const getAddressName = (country, province, city, county, reverseFlag) => {
  if (!country) return // 没有国家编码不执行
  let a = '' // 国家
  let b = '' // 省
  let c = '' // 市
  let d = '' // 区
  addressData.Location.CountryRegion.map(item => {
    if (item['-Code'] !== country) return
    a = item['-Name'] // 获取国家
    if (!item.State) return // 只有国家
    if (Array.isArray(item.State)) {
      item.State.map(i => {
        if (i['-Code'] !== province) return
        b = i['-Name'] // 获取省
        if (!i.City) return
        i.City.map(v => {
          if (v['-Code'] !== city) return
          c = v['-Name'] // 获取市
          if (!v.Region) return // 不存在区
          if (Array.isArray(v.Region)) {
            v.Region.map((c) => {
              if (c['-Code'] !== county) return
              d = c['-Name'] // 获取区
            })
          } else {
            if (v.Region['-Code'] !== county) return
            d = v.Region['-Name']
          }
        })
      })
    } else {
      item.State.City.map((i) => {
        if (i['-Code'] !== province) return
        b = i['-Name'] // 获取省
      })
    }
  })

  if (reverseFlag) {
    return b + c + d + ' - ' + a
  } else {
    return a + ' - ' + b + c + d
  }
}

/**
 * 2. 输入 国家code, 返回当前省市区数据
 * @param {String | country} 国家code
 *
 * @return {Array} 当前省市区数据
 */
const getCurrentData = (country) => {
  let currentAreaData = []
  addressData.Location.CountryRegion.map(item => {
    if (item['-Code'] !== country) return
    if (!item.State) return // 没有省市区数据
    if (Array.isArray(item.State)) {
      currentAreaData = item.State
    } else {
      currentAreaData = item.State.City
    }
  })
  return currentAreaData
}

/**
 * 3. 格式化省市区 数据
 * @param {Array | state} 当前省市区数据
 *
 * @return {Array | [{name:"", code:"", children:[] }]}
 */
const addressFormateData = (state) => {
  if (!state) return
  const area = []
  state.map((item) => {
    const a = {
      name: item['-Name'],
      code: item['-Code']
    }
    // city 省
    if (item.City) {
      a.children = []
      if (Array.isArray(item.City)) {
        item.City.map((i) => {
          const b = {
            name: i['-Name'],
            code: i['-Code']
          }
          // Region 市
          if (i.Region) {
            b.children = []
            if (Array.isArray(i.Region)) {
              i.Region.map((val) => {
                b.children.push({
                  name: val['-Name'],
                  code: val['-Code']
                })
              })
            } else {
              b.children.push({
                name: i.Region['-Name'],
                code: i.Region['-Code']
              })
            }
          }
          a.children.push(b)
        })
      }
    }
    area.push(a)
  })
  return area
}

/**
 * 4. 直接获取国家格式化的数据
 * @param {String | country } 国家code
 *
 * @return {Array} 国家下拉数据
 */
const getCountryData = (country) => {
  const countryData = []
  addressData.Location.CountryRegion.map((item) => {
    countryData.push({
      name: item['-Name'],
      code: item['-Code']
    })
  })
  return countryData
}

export {
  getCurrentData, // 根据国家code, 获取当前省市区数据
  getAddressName, // 根据code 获取 name
  addressFormateData, // 格式化当前省市区数据
  getCountryData // 获取格式化后的 国家下拉数据
}
