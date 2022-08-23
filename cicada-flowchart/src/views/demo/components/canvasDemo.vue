<template>
  <div class="zrender">
    <div class="btn" @click="goBack">返回上一级</div>
    <div class="mian">
      <div style="width:100px;" id="root" ref="root" class="root"></div>

      <div class="right">
        <div v-show="loading">
          <img class="loading" src="../../../../static/loading.gif" alt="" />
        </div>
        <div
          v-show="!loading"
          ref="canvas"
          style="width:1000px;margin-left: 20px;"
          id="zrender-canvas"
        ></div>
      </div>
    </div>

    <canvasTime @changex="changex" ref="time" @changeWidth="changeWidth" />
  </div>
</template>

<script>
import zrender from "zrender";
// import { rotate } from "../../../../../zrender/lib/core/matrix";
import canvasTime from "./canvasTime.vue";
export default {
  name: "zrender",
  components: { canvasTime },
  data() {
    return {
      loading: false,
      isShow: true,
      zr: null,
      rootR: null,
      group: null,
      rootGroup: null,
      isChild: false,
      widthBase: null, // 定义宽度基数
      childrenColor: "pink",
      mainRoot: {
        name: "多益",
        color: "red",
        level: 1,
        width: 50,
        height: 300,
        y: 100,
        x: 0,
      },
      root: {
        name: "多益",
        color: "red",
        level: 1,
        width: 50,
        height: 300,
        y: 100,
        x: 0,
        children: [
          {
            name: "1",
            x: 20,
            y: 100,
            width: 400,
            time: 2,
            startTime: 1,
            height: 20,
            color: "pink",
            level: 2,
            children: [
              {
                name: "1.1",
                x: 20,
                time: 2,
                startTime: 2,
                y: 100,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.2",
                x: 120,
                time: 2,
                startTime: 4,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.32",
                x: 20,
                time: 2,
                startTime: 3,
                y: 160,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "1.4",
                x: 320,
                time: 2,
                startTime: 1,
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
            time: 2,
            startTime: 5,
            level: 2,
            color: "yellow",
            children: [
              {
                name: "2.1",
                time: 2,
                startTime: 1,
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
                time: 2,
                startTime: 1,
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
            time: 2,
            startTime: 6,
            height: 20,
            color: "yellow",
            children: [
              {
                name: "3.1",
                time: 2,
                startTime: 1,
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
                time: 2,
                startTime: 1,
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
            time: 2,
            startTime: 3,
            width: 800,
            height: 20,
            level: 2,
            color: "yellow",
            children: [
              {
                name: "4.1",
                x: 20,
                y: 100,
                time: 2,
                startTime: 1,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "4.2",
                x: 120,
                time: 2,
                startTime: 1,
                y: 130,
                width: 400,
                height: 20,
                color: "yellow",
                level: 3,
              },
              {
                name: "4.3",
                x: 80,
                time: 2,
                startTime: 1,
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
  computed: {
    dynamicWidth() {
      return function(val) {
        return val * this.widthBase;
      };
    },
  },
  mounted() {
    this.init();
    console.log(111, this.mainRoot);
    this.initRoot(this.mainRoot);
  },
  methods: {
    goBack() {
      console.log("返回上一级", this.mainRoot.level);
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
        this.clickDIv(obj, "back");
      }
    },
    initRoot(mainRoot) {
      this.rootR = zrender.init(document.getElementById("root"));
      this.rootGroup = new zrender.Group();
      console.log(111, mainRoot);

      this.drawRoot(mainRoot);
      this.rootR.add(this.rootGroup);
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
        for (let item of self.root.children) {
          if (self.mainRoot.name === item.name) {
            arr = item.children;
          }
        }
        // })();
      }
      if (arr.length === 0) {
        const props = {
          x: 100,
          y: 200,
          height: 100,
          width: 100,
          color: "#fff",
          name: "暂无子级",
        };
        let root = this.creatRoot(props);
        this.group.add(root);
      } else {
        arr.forEach((item) => {
          let root = this.creatRoot(item);
          root.on("mousedown", () => this.clickDIv(root.data));
          this.group.add(root);
        });
      }
    },
    // 创建一个canvas元素
    creatRoot(data) {
      const { startTime, y, height, color, name, time } = data;
      console.log;
      return new zrender.Rect({
        data: data,
        shape: {
          x: this.widthBase * startTime,
          y,
          width: this.widthBase * time,
          height,
        },
        style: {
          fill: color, // 填充颜色，默认#000
          stroke: color, // 描边颜色，默认null
          lineWidth: 1, // 线宽， 默认1
        },
      }).attr({
        style: {
          text: name,
        },
      });
    },
    drawRoot(rootData, type) {
      console.log("root", rootData, type);
      let root = this.creatRoot(rootData);
      root.animateTo(
        {
          shape: {
            width: 50,
            height: 300,
            y: 100,
            x: 0,
          },
        },
        function() {
          // done
        }
      );
      this.rootGroup.add(root);
    },
    changex(data) {
      console.log("更改时间轴距离", data);
      if (data < 0) this.$refs.canvas.style.transform = `translateX(${data}px)`;
    },
    changeWidth(data) {
      this.widthBase = data;
      console.log(222222222,data)

      this.group._children.forEach((val) => {
        val.animateTo(
          {
            shape: {
              x: this.widthBase * val.data.startTime,
              width: this.widthBase * val.data.time,
            },
          },
          function() {
            // done
          }
        );
      });
    },
    clickDIv(root, type) {
      this.rootGroup.removeAll();
      // 更改根节点的canvas节点的宽度
      this.$refs.root.style.width = "1000px";
      var newRoot = JSON.parse(JSON.stringify(root));
      // 返回上一级的处理
      if (type === "back") {
        newRoot.x = 0;
        newRoot.y = 100;
        newRoot.width = 50;
        newRoot.height = 300;
      }
      // 更新绘制根节点(在点击的元素的地方先绘制一个元素,在动画移动到根节点的估计位置)
      this.initRoot(newRoot, type);
      //更改当前主节点
      this.mainRoot = root;
      // 移除现有的节点元素
      this.group.removeAll();

      this.loading = true;
      setTimeout(() => {
        // this.zr.clear();
        // 更新完之后将左边canvas的宽度更改为原来大小,避免遮挡右边的canvas
        this.$refs.root.style.width = "100px";
        this.rootR.resize({
          with: 100,
        });
        this.loading = false;
        // this.isShow = true;
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
  width: 1000px;
  position: relative;
  overflow: hidden;
}
.root {
  position: absolute;
  /* top: 100px; */
  left: 0;
  width: 50px;
  height: 700px;

  z-index: 9999;

  /* transition: all 0.3s linear; */
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
  z-index: 88;
  /* transition: all 0.1s linear; */
}

@keyframes donghua {
  from {
    width: 400px;
    height: 20px;
    left: 120px;
  }
  to {
    width: 50px;
    height: 300px;
    left: 20px;
  }
}
.v-enter-active {
  animation: donghua 0.4s linear;
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
