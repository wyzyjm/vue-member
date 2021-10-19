<template>
  <div>
    <span v-for="(item, index) in list" :key="index" class="act_item">
      <svg-icon name="icon-shijian" />{{$t('member_order_components_count_down_1', [ item.djs ])}}</span>
  </div>
</template>

<script>
function InitTime(endtime) {
  var dd, hh, mm, ss = null
  var time = parseInt(endtime)
  if (time <= 0) {
    return this.$t('member_order_components_count_down_2')
  } else {
    dd = Math.floor(time / 60 / 60 / 24)
    hh = Math.floor((time / 60 / 60) % 24)
    mm = Math.floor((time / 60) % 60)
    ss = Math.floor(time % 60)
    var str = ''
    if (dd >= 1) {
      str = dd + this.$t('member_order_components_count_down_3') + hh + this.$t('member_order_components_count_down_4') + mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
    } else if (hh >= 1) {
      str = hh + this.$t('member_order_components_count_down_4') + mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
    } else if (mm >= 1) {
      str = mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
    } else if (ss >= 1) {
      str = ss + this.$t('member_order_components_count_down_6')
    }
    return str
  }
}
export default {
  props: {
    counttime: {
      type: String,
      default: ''
    },
    createtime: {
      type: String,
      default: ''
    },
    systemtime: {
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
        time: (Number(this.createtime) / 1000) + Number(this.counttime) - Number(this.systemtime) / 1000
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
            this.list[key]['djs'] = dd + this.$t('member_order_components_count_down_3') + hh + this.$t('member_order_components_count_down_4') + mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
          } else if (hh >= 1) {
            this.list[key]['djs'] = hh + this.$t('member_order_components_count_down_4') + mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
          } else if (mm >= 1) {
            this.list[key]['djs'] = mm + this.$t('member_order_components_count_down_5') + ss + this.$t('member_order_components_count_down_6')
          } else if (ss >= 1) {
            this.list[key]['djs'] = ss + this.$t('member_order_components_count_down_6')
          }
        } else {
          this.list[key]['djs'] = this.$t('member_order_components_count_down_2')
        }
        this.list[key]['time'] = rightTime
      }
    }, 1000)
  }
}
</script>
