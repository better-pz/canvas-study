<template>
  <div>
    <canvas
      id="timeline"
      width="1000"
      height="90"
      style="cursor: pointer;border:1px solid #EBEEF5;background-color: #fafafa;margin-left: 20px;"
      ondragstart="return false;"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "canvasdemo",
  data() {
    return {
      canvas: "",
      ctx: "",
      canvansW: "",
      canvansH: "",
      timecell: [],
      yearWidth:0,// 每一年的宽度
      canvasColors: ["rgba(249,97,89,1)", "rgba(55,202,65,0.8)"],
      scaleLineCorols: "#E6E6E6", // 刻度线颜色
      fontColor: "#5C5C5C", // 字体颜色
      axisColor: "#1989FA", // 中轴线
      moveLineColor: "#000000",
      scaleH: 35,
      months: 2, //定义一大格中间的小格数量
      yearLists: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      graduation_step: 20, //刻度间最小宽度，单位px
      hours_per_ruler: 24, //时间轴显示24小时
      startTimestamp: 20, // 渲染刻度开始时间
      distance_between_gtitle: 80,
      zoom: 2,//放大系数
      basePx: 1.5, // 每格像素的的距离
      g_isMousedown: false, //拖动mousedown标记
      g_isMousemove: false, //拖动mousemove标记
      g_mousedownCursor: null, //拖动mousedown的位置
      returnTime: null, //mouseup返回时间
    };
  },
  watch: {
      yearWidth(yearWidth){
      this.$emit('changeWidth',yearWidth)
      }
    },
  mounted() {
    this.canvas = document.getElementById("timeline");
    this.ctx = this.canvas.getContext("2d");
    this.canvansW = this.canvas.width;
    this.canVansH = this.canvas.height;
    
    this.init(this.startTimestamp);
  },
  methods: {
    // 初始化
    init(startTimestamp) {
      this.drawCellBg();
      this.addGraduations(startTimestamp); // 初始时间轴 刻度
      this.drawLine(
        0,
        this.canVansH,
        this.canvansW,
        this.canVansH,
        "transparent",
        1
      ); 

      this.add_events();

      this.ctx.fillStyle = this.axisColor;

    },
 
    /**
     * 绘制添加刻度
     */
    addGraduations(startTimestamp) {
      let pxPerStep = this.graduation_step; // px/格 默认最小值20px
      let numSteps = this.months * (this.yearLists.length - 1); //总格数
      let graduationLeft;
      let lineH; // 刻度线高度
      let px_offset = startTimestamp; //开始的偏移距离 px
      // 左边临界值
      if (px_offset > 20) {
        px_offset = 20;
      }
      // 一年的距离
      this.yearWidth = this.months *  this.graduation_step* this.basePx
      console.log("一年的距离",this.yearWidth);

      for (let i = 0; i < numSteps; i++) {
        // 每十个定义为标记年份节点
        graduationLeft = px_offset + i * pxPerStep *this.basePx; // 距离=开始的偏移距离+格数*px/格
        if (i % this.months == 0) {
          lineH = 25;
          let time = this.yearLists[i / this.months];
          this.ctx.fillText(time, graduationLeft - 10, 50);
        } else {
          lineH = 15;
        }
        this.ctx.fillStyle = this.fontColor; // 除了0点 以外字体的颜色
        this.drawLine(
          graduationLeft,
          0,
          graduationLeft,
          lineH,
          this.scaleLineCorols, // 刻度线颜色
          1
        );
      }
    },
    /**
     * 绘制线
     * @param {*} beginX
     * @param {*} beginY
     * @param {*} endX
     * @param {*} endY
     * @param {*} color
     * @param {*} width
     */
    drawLine(beginX, beginY, endX, endY, color, width) {
      this.ctx.beginPath();
      this.ctx.moveTo(beginX, beginY);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = width;
      this.ctx.stroke();
    },

    /**
     * 绘制背景
     */
    drawCellBg() {
      this.ctx.fillStyle = this.canvasColors[0]; // 刻度背景颜色
      this.ctx.fillRect(0, 0, this.canvansW, this.scaleH);
    },
    /**
     * 时间轴事件
     */
    add_events() {
      const canvas = document.getElementById("timeline");
      canvas.addEventListener("mousewheel", this.mousewheelFunc); // 鼠标滚动放大缩小
      canvas.addEventListener("mousedown", this.mousedownFunc); // 拖动时间轴事件
      canvas.addEventListener("mousemove", this.mousemoveFunc);
      canvas.addEventListener("mouseup", this.mouseupFunc);
      canvas.addEventListener("mouseout", this.mouseoutFunc);
    },

    /**
     * 拖动/点击 mousedown事件
     */
    mousedownFunc(e) {
      this.g_isMousedown = true;
      this.g_mousedownCursor = this.get_cursor_x_position(e); //记住mousedown的位置
    },
    /**
     * 拖动/鼠标hover显示 mousemove事件
     */
    mousemoveFunc(e) {
      let pos_x = this.get_cursor_x_position(e);
      if (this.g_isMousedown) {
          this.clearCanvas();
        let diff_x = pos_x - this.g_mousedownCursor; // 记录移动的位置
        this.startTimestamp = this.startTimestamp + Math.round(diff_x);
        this.$emit("changex", this.startTimestamp);
        this.init(this.startTimestamp);
        this.g_isMousemove = true;
        this.g_mousedownCursor = pos_x;
      } 
    },
    /**
     * 拖动/点击 mouseup事件
     */
    mouseupFunc(e) {
      if (this.g_isMousemove) {
        //拖动 事件
        this.g_isMousemove = false;
        this.g_isMousedown = false;
        this.returnTime =
          this.startTimestamp + (this.hours_per_ruler * 3600 * 1000) / 2;
      } else {
        // click 事件
        this.g_isMousedown = false;
        let posx = this.get_cursor_x_position(e); //鼠标距离 px
        let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px
        this.returnTime = this.startTimestamp + posx * ms_per_px;

      }
    },
    /**
     * 鼠标移出隐藏时间 mouseout事件
     * @param {*} e
     */
    mouseoutFunc() {
      // this.g_isMousemove = false;
      // this.g_isMousedown = false;
      // this.clearCanvas();
      // this.init(this.startTimestamp);
    },

    /**
     * 滚轮放大缩小，以时间轴中心为准 mousewheel事件
     */
    mousewheelFunc() {
      if (event && event.preventDefault) {
        event.preventDefault();
      } else {
        window.event.returnValue = false;
        return false;
      }

      let e = window.event || event;
      let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

     
      if (delta > 0) {
        // 缩小
        this.basePx = this.basePx + 0.2;
        this.zoom++;
        if (this.zoom >= 12) {
          this.zoom = 12; //放大最大12个月
        }
      } else if (delta < 0) {
        // 放大
        this.zoom--;
        this.basePx = this.basePx - 0.2;
        if (this.zoom <= 2) {
          this.zoom = 2; //缩小最小2个月
        }
    
      }

      if (this.zoom % 2 === 0) {
        this.months = this.zoom;
        this.basePx = 1.5; 

      }
      this.clearCanvas();
      
      this.init(this.startTimestamp);
    },
    /**
     * 获取鼠标posx
     * @param {*} e
     */
    get_cursor_x_position(e) {
      let posx = 0;

      if (!e) {
        e = window.event;
      }
      if (e.offsetX || e.offsetY) {
        //相对于事件的XY轴
        posx = e.offsetX;
      }
      // if (e.pageX || e.pageY) {//相对于浏览器滚动区域
      //     posx = e.pageX;
      // } else if (e.clientX || e.clientY) {//相对于浏览器不滚动屏幕
      //     posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      // }
      return posx;
    },
    /**
     * 清除canvas 每次重新绘制需要先清除
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, 1000, 90);
    },
  },
};
</script>

<style scoped></style>
