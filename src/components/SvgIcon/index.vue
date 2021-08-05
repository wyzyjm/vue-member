<template>
  <span>
    <!-- {{ setsize }} -->
    <svg class="icon" aria-hidden="true" :style="'font-size:' + setsize + 'px'">
      <use :xlink:href="'#' + name" />
    </svg>
  </span>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: ['name', 'setsize']
}
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  transform: scale(1.6);
}
</style>
