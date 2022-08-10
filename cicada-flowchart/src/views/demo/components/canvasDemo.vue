<template>
  <div class="zrender">
    <div style="width:1000px;margin-left: 20px;" id="zrender-canvas"></div>
    <canvasTime @changex="changex" ref="time" />
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
      childrenColor: "pink",
      circle4: "",
      circle3: "",
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
          x: 20,
          y: 100,
          width: 400,
          height: 20,
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
          x: 420,
          y: 100,
          width: 400,
          height: 20,
        },
        style: {
          fill: "yellow", // 填充颜色，默认#000
          stroke: "yellow", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      let circle3 = new zrender.Rect({
        shape: {
          text: "zrender",
          x: 220,
          y: 130,
          width: 400,
          height: 20,
        },
        style: {
          fill: "yellow", // 填充颜色，默认#000
          stroke: "yellow", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      this.circle3 = circle3
      let circle4 = new zrender.Rect({
        shape: {
          text: "zrender",
          x: 120,
          y: 160,
          width: 800,
          height: 20,
        },
        style: {
          fill: "yellow", // 填充颜色，默认#000
          stroke: "yellow", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      this.circle4 = circle4
      let root = new zrender.Rect({
        shape: {
          x: 0,
          y: 100,
          width: 20,
          height: 300,
        },
        style: {
          fill: "red", // 填充颜色，默认#000
          stroke: "red", // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      });
      // 添加圆到group里
      this.group.add(circle);
      this.group.add(root);
      this.group.add(circle2);
      this.group.add(circle4);
      this.group.add(circle3);
      this.circle2 = circle2;
      circle.on("mousedown", () => this.clickDIv(circle, root));
      circle2.on("mousedown", () => this.clickDIv(circle2, root));
      circle3.on("mousedown", () => this.clickDIv(circle3, root));
      circle4.on("mousedown", () => this.clickDIv(circle4, root));
    },
    changex(data) {
      console.log('更改时间轴距离',data)
 
      this.circle3
        .animate("shape", false)
        .when(0.1, {
          x: this.circle3.shape.x + data,
          y: 130,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();
      this.circle4
        .animate("shape", false)
        .when(0.1, {
          x: this.circle4.shape.x + data,
          y: 160,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();
      this.circle2
        .animate("shape", false)
        .when(0.1, {
          x: this.circle2.shape.x + data,
          y: 100,
        })
        .done(function() {
          // Animation done
          console.log("动画结束", this.group);
        })
        .start();
      this.circle
        .animate("shape", false)
        .when(0.1, {
          x: this.circle.shape.x + data,
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
          width: 20,
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
