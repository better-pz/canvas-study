<template>
  <div class="zrender">
    <div id="zrender-canvas"></div>
    <times />
  </div>
</template>

<script>
import zrender from "zrender";
import times from "./components/time.vue";
export default {
  name: "zrender",

  components: { times },
  data() {
    return {
      zr: null,
      group: null,
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.zr = zrender.init(document.getElementById("zrender-canvas"));
      this.group = new zrender.Group();
      this.drawRect();
      this.zr.add(this.group);
    },
    drawRect() {
      // 创建一个目标
      let circle = new zrender.Rect({
        shape: {
           text: 'zrender',
          x: 100,
          y: 100,
          width: 200,
          height: 40,
        },
        style: {
          fill: "pink", // 填充颜色，默认#000
          stroke: "pink", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      let circle2 = new zrender.Rect({
        shape: {
           text: 'zrender',
          x: 280,
          y: 100,
          width: 400,
          height:40,
        },
        style: {
          fill: "yellow", // 填充颜色，默认#000
          stroke: "yellow", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      let root = new zrender.Rect({
        shape: {
            x: 10,
            y: 100,
            width:50,
            height: 400,
        },
        style: {
          fill: "red", // 填充颜色，默认#000
          stroke: "red", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
            let root2 = new zrender.Rect({
        shape: {
            x: 60,
            y: 100,
            width:50,
            height: 200,
        },
        style: {
          fill: "green", // 填充颜色，默认#000
          stroke: "green", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
            let root3 = new zrender.Rect({
        shape: {
            x: 60,
            y: 300,
            width:50,
            height: 200,
        },
        style: {
          fill: "#000", // 填充颜色，默认#000
          stroke: "green", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      // 添加圆到group里
      this.group.add(circle);
      this.group.add(root);
      this.group.add(root2);
      this.group.add(root3);
      this.group.add(circle2);
      circle.on("mousedown",()=>this.clickDIv(circle,root));
      root2.on("mousedown",()=>this.clickDIv(root2,root));
      root3.on("mousedown",()=>this.clickDIv(root3,root));
      circle2.on("mousedown",()=>this.clickDIv(circle2,root));
    },
    clickDIv (circle,root) {
       circle.animate('shape', false)
          .when(500,  {
            x: 10,
            y: 100,
            width:50,
            height: 400,
        })
        .done(function () {
              // Animation done
              console.log('动画结束',this.group)
          })
    .start()
    
      this.group.remove(root);
    }
  },
};
</script>

<style>
#zrender-canvas {
  height: 700px;
}
</style>
