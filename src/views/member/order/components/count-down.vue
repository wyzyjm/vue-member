<template>
  <div>
    <span v-for="(item, index) in list" :key="index" class="act_item">
      <svg-icon name="icon-shijian" />剩余{{ item.djs }}
    </span>
  </div>
</template>

<script>
function InitTime(endtime) {
  var dd, hh, mm, ss = null
  var time = parseInt(endtime)
  if (time <= 0) {
    return '0'
  } else {
    dd = Math.floor(time / 60 / 60 / 24)
    hh = Math.floor((time / 60 / 60) % 24)
    mm = Math.floor((time / 60) % 60)
    ss = Math.floor(time % 60)
    var str = ''
    if (dd >= 1) {
      str = dd + '天' + hh + '小时' + mm + '分' + ss + '秒'
    } else if (hh >= 1) {
      str = hh + '小时' + mm + '分' + ss + '秒'
    } else if (mm >= 1) {
      str = mm + '分' + ss + '秒'
    } else if (ss >= 1) {
      str = ss + '秒'
    }
    return str
  }
}
export default {
  props: {
    counttime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      time: '',
      list: []
    }
  },
  created() {
    var ssss = [
      {
        time: this.counttime
      }
    ]
    ssss.map((obj) => {
      this.$set(obj, 'djs', InitTime(obj.time))
    })
    this.list = ssss
  },
  mounted() {
    setInterval(() => {
      for (var key in this.list) {
        var aaa = parseInt(this.list[key]['time'])
        var rightTime = aaa - 1
        if (rightTime > 0) {
          var dd = Math.floor(rightTime / 60 / 60 / 24)
          var hh = Math.floor((rightTime / 60 / 60) % 24)
          var mm = Math.floor((rightTime / 60) % 60)
          var ss = Math.floor(rightTime % 60)
          if (dd >= 1) {
            this.list[key]['djs'] = dd + '天' + hh + '小时' + mm + '分' + ss + '秒'
          } else if (hh >= 1) {
            this.list[key]['djs'] = hh + '小时' + mm + '分' + ss + '秒'
          } else if (mm >= 1) {
            this.list[key]['djs'] = mm + '分' + ss + '秒'
          } else if (ss >= 1) {
            this.list[key]['djs'] = ss + '秒'
          }
        }
        this.list[key]['time'] = rightTime
      }
    }, 1000)
  }
}
</script>
