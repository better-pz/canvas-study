<template>
  <div class="zrender">
    <div id="zrender-canvas"></div>
  </div>
</template>

<script>
import zrender from 'zrender'
export default {
  name: 'zrender',
  data() {
    return {
      zr: null,
      group: null
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.zr = zrender.init(document.getElementById('zrender-canvas'))
      this.group = new zrender.Group()
      this.drawRect()
      this.zr.add(this.group)
    },
    drawRect() {
      // 创建一个圆circle
      let circle = new zrender.Rect({
        shape: {
          x:100,
          y:100,
          width:400,
          height:10
        },
        style: {
          fill: 'red', // 填充颜色，默认#000
          stroke: 'red', // 描边颜色，默认null
          lineWidth: 1 // 线宽， 默认1
        }
      })

      // 添加圆到group里
      this.group.add(circle)
    }
    
  }
}
</script>

<style>
#zrender-canvas {
  height:700px;
}
</style>
