<template>
  <span>
    <el-image
      class="customImg"
      :src="src ? 'https://pre-omo-oss-image.site.cn/' + src : ''"
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
      errorImg: errorImg
    }
  },
  name: 'CustomImg',
  props: ['src', 'alt', 'title'],
  components: {}
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
