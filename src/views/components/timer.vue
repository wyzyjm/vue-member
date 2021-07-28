<template>
    <span>{{time}}</span>
</template>
<script>
export default {
  data() {
    return {
      time: "",
      flag: false,
      count:0
    };
  },
  mounted() {
    this.count = this.endTime
    console.log('dd',this.endTime)
    let time = setInterval(() => {
      if (this.flag == true) {
        clearInterval(time);
      }
      if(this.count>0){
        this.count -- ;
        this.timeDown(this.count);
      }
    }, 1000);
  },
  props: {
    endTime: {
      type: Number
    }
  },
  methods: {
    timeDown(leftTime) {
      let d = parseInt(leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((leftTime / 60) % 60));
      let s = this.formate(parseInt(leftTime % 60));
      if (leftTime <= 0) {
        this.flag = true;
        this.$emit("timeEnd");
      }
      
      if(d>=1){
        this.time = `${d}天${h}时${m}分${s}秒`; 
      }else if(h>=1){
        this.time = `${h}时${m}分${s}秒`; 
      }else if(m>=1){
        this.time = `${m}分${s}秒`;
      }else if(s>=1){
          this.time = `${s}秒`;
      }
      // this.time = `${h}:${m}:${s}`; // 需要修改时间样式的话 ，比如需要什么30分钟倒计时，就只保留分和秒
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    }
  }
};
</script>
 
<style scoped>
</style>