<template>
  <div class="zrender">
    <div class="btn" @click="goBack">返回上一级</div>
    <div class="mian">
      <transition>
        <div
          v-show="isShow"
          class="root"
          :style="`backgroundColor:${mainRoot.color}`"
        >
          {{ mainRoot.name }}
        </div>
      </transition>

      <div v-show="loading" >
        <img class="loading" src="../../../../static/loading.gif" alt="" />
      </div>
      <div
        v-show="!loading"
        ref="canvas"
        style="width:1000px;margin-left: 20px;"
        id="zrender-canvas"
      ></div>
    </div>

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
      loading: false,
      isShow: true,
      zr: null,
      group: null,
      isChild: false,
      childrenColor: "pink",
      mainRoot: { name: "多益", color: "red", level: 1 },
      root: {
        name: "多益",
        color: "red",
        level: 1,
        children: [
          {
            name: "1",
            x: 20,
            y: 100,
            width: 400,
            height: 20,
            color: "pink",
            level: 2,
            children: [
              {
                name: "1.1",
                x: 20,
                y: 100,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.2",
                x: 120,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.2",
                x: 20,
                y: 160,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.2",
                x: 320,
                y: 190,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
            ],
          },
          {
            name: "2",
            x: 420,
            y: 100,
            width: 400,
            height: 20,
            level: 2,
            color: "yellow",
            children: [
              {
                name: "2.1",
                x: 20,
                y: 100,
                width: 400,
                height: 20,
                color: "green",
                level: 3,
              },
              {
                name: "2.2",
                x: 120,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
            ],
          },
          {
            name: "3",
            x: 220,
            y: 130,
            width: 400,
            level: 2,
            height: 20,
            color: "yellow",
            children: [
              {
                name: "3.1",
                x: 20,
                y: 100,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "3.2",
                x: 120,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
            ],
          },
          {
            name: "4",
            x: 120,
            y: 160,
            width: 800,
            height: 20,
            level: 2,
            color: "yellow",
            children: [
              {
                name: "4.1",
                x: 20,
                y: 100,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "4.2",
                x: 120,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "4.3",
                x: 80,
                y: 160,
                width: 200,
                height: 20,
                color: "yellow",
                level: 3,
              },
            ],
          },
        ],
      },

    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    goBack() {
      console.log("返回上一级");
      let obj = {};
      if (this.mainRoot.level == 2) {
        const props = { name: "多益", color: "red", level: 1 };
        obj = props;
        this.clickDIv(obj);
      } else if (this.mainRoot.level == 3) {
        console.log("层级", this.mainRoot.level);
        for (let item of this.root.children) {
          if (item.children.some((item) => item.name === this.mainRoot.name)) {
            obj = item;
          }
        }
        this.clickDIv(obj);
      }
    },
    init() {
      this.zr = zrender.init(document.getElementById("zrender-canvas"));
      this.group = new zrender.Group();
      this.drawRect();
      this.zr.add(this.group);
    },

    drawRect() {
      // 创建一个目标
      let self = this;
      let arr = [];
      if (this.mainRoot.level == 1) {
        arr = this.root.children;
      } else {
        // (function loop() {
        for (let item of self.root.children) {
     
          if (self.mainRoot.name === item.name) {
            arr = item.children;
          } else {
            // loop();
          }
          console.log(33333, arr);
        }
        // })();
      }
      console.log("渲染的数据", arr);
      if (arr.length === 0) {
        let text = '暂无子级';
        console.log(text);
         let root = new zrender.Rect({
          shape:{
            x:100,
            y:200,
            height:100,
            width:100
          },
           style: {
              fill: '#fff', // 填充颜色，默认#000
              lineWidth: 1, // 线宽， 默认1
            },
         })   .attr({
            style: {
              text: text,
            },
          });
          this.group.add(root);

      } else {
        arr.forEach((item) => {
          const { x, y, width, height, color,name } = item;
          let root = new zrender.Rect({
            data: item,
            shape: {
              x: x + 100,
              y,
              width,
              height,
            },
            style: {
              fill: color, // 填充颜色，默认#000
              stroke: color, // 描边颜色，默认null
              lineWidth: 1, // 线宽， 默认1
            },
          });
          root.attr({
            style: {
              text: name,
            },
          });

          root.on("mousedown", () => this.clickDIv(root.data));
          this.group.add(root);
        });
      }
    },
    changex(data) {
      // console.log("更改时间轴距离", data);
      this.$refs.canvas.style.transform = `translateX(${data}px)`;
    },

    clickDIv(root) {
      console.log("点击", root);
      this.mainRoot = root;
      this.group.removeAll();
      this.init();
      this.isShow = false;
      this.loading = true;
      setTimeout(() => {
        // this.zr.clear();
        this.loading = false;
        this.isShow = true;
        this.drawRect();
      }, 600);
    },
  },
};
</script>

<style>
.mian {
  display: flex;
  margin: 10px;
  height: 700px;
  position: relative;
  overflow: hidden;
}
.root {
  position: absolute;
  top: 100px;
  width: 50px;
  height: 300px;
  z-index: 9999;
}
.loading {
  margin: 100px 200px;
  width: 100px;
  height: 100px;
}
.btn {
  border: 1px solid #1e80ff;
  text-align: center;
  cursor: pointer;
  width: 80px;
  padding: 5px;
  color: #fff;
  background-color: #1e80ff;
  margin: 50px 0 0 100px;
  border-radius: 6px;
}
#zrender-canvas {
  height: 700px;
  /* transition: all 0.1s linear; */
}

@keyframes donghua {
  from {
    width: 100px;
    height: 20px;
    left: 100px;
  }
  to {
    width: 50px;
     height: 300px;
    left: 20px;

  }
}
.v-enter-active {
  animation: donghua 0.2s linear;
}

/* @keyframes donghua {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}
.v-enter-active{
  animation: donghua 1s linear;
}
.v-leave-active {
  animation: donghua 1s linear reverse;
} */
</style>
