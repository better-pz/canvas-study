<template>
  <div class="zrender">
    <div id="zrender-canvas"></div>
    <canvasTime @changex="changex" />
  </div>
</template>

<script>
import zrender from "zrender";
import canvasTime from "./canvasTime.vue";
export default {
  name: "zrender",
  components: { canvasTime },
  data() {
    return {
      zr: null,
      group: null,
      circle2: "",
      circle: "",
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
          text: "zrender",
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
      this.circle = circle;
      let circle2 = new zrender.Rect({
        shape: {
          text: "zrender",
          x: 280,
          y: 100,
          width: 400,
          height: 40,
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
          width: 50,
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
          width: 50,
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
          width: 50,
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
      this.circle2 = circle2;
      circle.on("mousedown", () => this.clickDIv(circle, root));
      root2.on("mousedown", () => this.clickDIv(root2, root));
      root3.on("mousedown", () => this.clickDIv(root3, root));
      circle2.on("mousedown", () => this.clickDIv(circle2, root));
    },
    changex(data) {
      console.log("移动量", data, this.circle2);
  
      this.circle2
        .animate("shape", false)
        .when(1, {
          x: this.circle2.shape.x - Math.abs(data),
          y: 100,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();

      this.circle
        .animate("shape", false)
        .when(1, {
          x: this.circle.shape.x -  Math.abs(data),
          y: 100,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();
    },
    clickDIv(circle, root) {
      circle
        .animate("shape", false)
        .when(300, {
          x: 10,
          y: 100,
          width: 50,
          height: 400,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();

      this.group.remove(root);
    },
  },
};
</script>

<style>
#zrender-canvas {
  height: 700px;
}
</style>
