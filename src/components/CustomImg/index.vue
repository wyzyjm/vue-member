<template>
  <span>
    <el-image
      class="customImg"
      :src="src ? prefix + src : ''"
      fit="cover"
      lazy
    >
      <div slot="error" class="image-slot" style="height: 100%">
        <img class="errorImg" :src="errorImg" />
      </div>
    </el-image>
  </span>
</template>

<script>
import errorImg from '@/assets/images/no-img.svg'
export default {
  data() {
    return {
      errorImg: errorImg,
      isProduction:false,
      prefix:''
    }
  },
  name: 'CustomImg',
  props: ['src', 'alt', 'title'],
  components: {},
  
  
  mounted(){
    let makeDomain = tenantInfo.makeDomain;
    if(makeDomain.indexOf('pre-')>0||makeDomain.indexOf('test-')>0){
      this.isProduction = false
      this.prefix = 'https://pre-omo-oss-image.thefastimg.com/'
    }else{
      this.isProduction = true;
      this.prefix = 'https://omo-oss-image.thefastimg.com/'
    }
  }
}
</script>

<style scoped>
.customImg {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}
.errorImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
