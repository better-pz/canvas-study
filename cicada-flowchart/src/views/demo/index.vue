<template>
  <div class="zrender">

    <canvasDemo  v-if="value === 'canvas'"/>
    <divDemo v-else/>
  </div>
</template>

<script>

import canvasDemo from "./components/canvasDemo.vue";
import divDemo from "./components/divDemo.vue";
export default {
  
  components: { canvasDemo,divDemo },
  data() {
    return {
      value:'canvas'
    };
  },
  created() {},



};
</script>

<style>
#zrender-canvas {
  height: 700px;
}
</style>
