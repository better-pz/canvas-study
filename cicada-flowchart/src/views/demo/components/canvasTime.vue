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
      medium_step: 2, //定义一大格中间的小格数量
      moveLineH: 60,
      moveTextH: 75,
      yearLists: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
      minutes_per_step: [
        1,
        2,
        5,
        10,
        15,
        20,
        30,
        60,
        120,
        180,
        240,
        360,
        720,
        1440,
      ], // min/格
      graduation_step: 20, //刻度间最小宽度，单位px
      hours_per_ruler: 24, //时间轴显示24小时
      start_timestamp: 20, // 渲染刻度开始时间
      distance_between_gtitle: 80,
      zoom: 2,
      basePx: 1.5, // 每格像素的的距离
      g_isMousedown: false, //拖动mousedown标记
      g_isMousemove: false, //拖动mousemove标记
      g_mousedownCursor: null, //拖动mousedown的位置
      returnTime: null, //mouseup返回时间
    };
  },
  watch: {
      yearWidth(yearWidth){
        // window.console.log(this.isChange,newvalue,+new Date());
      this.$emit('changeWidth',yearWidth)
      }
    },
  mounted() {
    this.canvas = document.getElementById("timeline");
    this.ctx = this.canvas.getContext("2d");
    this.canvansW = this.canvas.width;
    this.canVansH = this.canvas.height;
    // var startTime = new Date("2020-07-02 12:40:30").getTime(); //录像块开始日期
    // var endTime = new Date("2020-07-02 10:10:50").getTime(); //录像块结束日期
    // var num = endTime - startTime; //
    // this.timecell = [
    //   {
    //     beginTime: startTime + num, //通过加上时间差以校准录像块轴中渲染
    //     endTime: endTime + num, //通过加上时间差以校准录像块轴中渲染
    //     style: {
    //       background: this.canvasColors[1],
    //     },
    //   },
    //   {
    //     beginTime: new Date().getTime() - 6 * 3600 * 1000,
    //     endTime: new Date().getTime() - 4 * 3600 * 1000,
    //     style: {
    //       background: this.canvasColors[1],
    //     },
    //   },
    // ];
    this.init(this.start_timestamp);
  },
  methods: {
    // 初始化
    init(start_timestamp) {
      this.drawCellBg();
      this.add_graduations(start_timestamp); // 初始时间轴 刻度
      // this.add_cells(timecell);
      this.drawLine(
        0,
        this.canVansH,
        this.canvansW,
        this.canVansH,
        "transparent",
        1
      ); // 时间轴border-bottom底线
      // this.drawLine(
      //   this.canvansW / 2,
      //   0,
      //   this.canvansW / 2,
      //   this.moveLineH,
      //   this.axisColor,
      //   2
      // ); //中间播放点时间线
      this.add_events();
      // let time = start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2;
      this.ctx.fillStyle = this.axisColor;
      // this.ctx.fillText(
      //   this.changeTime(time),
      //   this.canvansW / 2 - 50,
      //   this.moveTextH
      // );
    },
    // add_cells(cells) {
    //   cells.forEach((cell) => {
    //     this.draw_cell(cell);
    //   });
    // },
    /**
     * 绘制添加刻度
     */
    add_graduations(start_timestamp) {
      let px_per_ms =1 ;
      let px_per_step = this.graduation_step; // px/格 默认最小值20px
      let num_steps = this.medium_step * (this.yearLists.length - 1); //总格数
      let graduation_left;
   
      let lineH; // 刻度线高度
   

      let ms_offset = start_timestamp;
      let px_offset = ms_offset * px_per_ms; //开始的偏移距离 px
      if (px_offset > 20) {
        px_offset = 20;
      }

      // 一年的距离
      this.yearWidth = this.medium_step *  this.graduation_step* this.basePx
      console.log("一年的距离",this.yearWidth);

      for (let i = 0; i < num_steps; i++) {
        // 每十个定义为标记年份节点
        graduation_left = px_offset + i * px_per_step *this.basePx; // 距离=开始的偏移距离+格数*px/格
        if (i % this.medium_step == 0) {
          lineH = 25;
          let time = this.yearLists[i / this.medium_step];
          this.ctx.fillText(time, graduation_left - 10, 50);
        } else {
          lineH = 15;
        }
        this.ctx.fillStyle = this.fontColor; // 除了0点 以外字体的颜色
        this.drawLine(
          graduation_left,
          0,
          graduation_left,
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
     * 绘制录像块背景
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
      console.log('111111111');
      let pos_x = this.get_cursor_x_position(e);
      // let px_per_ms = this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
    
      if (this.g_isMousedown) {
          this.clearCanvas();
        let diff_x = pos_x - this.g_mousedownCursor; // 记录移动的位置
        this.start_timestamp = this.start_timestamp + Math.round(diff_x);
        // console.log('移动的距离',this.start_timestamp)
        this.$emit("changex", this.start_timestamp);
        this.init(this.start_timestamp);
        this.g_isMousemove = true;
        this.g_mousedownCursor = pos_x;
      } 
      // else {
      //   // let time = this.start_timestamp + pos_x / px_per_ms;
      //   this.init(this.start_timestamp);
      //   // this.drawLine(
      //   //   pos_x,
      //   //   0,
      //   //   pos_x,
      //   //   this.moveLineH + 10,
      //   //   this.moveLineColor,
      //   //   1
      //   // ); // 鼠标移动的线
      //   // this.ctx.fillStyle = this.moveLineColor; // 鼠标移动时候的文字
      //   // // console.log(changeTime(time))
      //   // this.ctx.fillText(
      //   //   this.changeTime(time),
      //   //   pos_x - 50,
      //   //   this.moveTextH + 10
      //   // );
      // }
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
          this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2;
      } else {
        // click 事件
        this.g_isMousedown = false;
        let posx = this.get_cursor_x_position(e); //鼠标距离 px
        let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px
        this.returnTime = this.start_timestamp + posx * ms_per_px;
        // this.set_time_to_middle(this.returnTime);
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
      // this.init(this.start_timestamp);
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

      // let middle_time =
      //   this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2; //ms 记住当前中间的时间
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
        this.medium_step = this.zoom;
        this.basePx = 1.5; 

      }
      this.clearCanvas();
      // this.start_timestamp =
      //   middle_time - (this.hours_per_ruler * 3600 * 1000) / 2; //start_timestamp = 当前中间的时间 - zoom/2
      this.init(this.start_timestamp);
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
     * 返回时间轴上刻度的时间
     * @param {*} datetime new Date 格式
     */
    graduation_title(datetime) {
      if (
        datetime.getHours() == 0 &&
        datetime.getMinutes() == 0 &&
        datetime.getMilliseconds() == 0
      ) {
        return (
          ("0" + datetime.getDate().toString()).substr(-2) +
          "." +
          ("0" + (datetime.getMonth() + 1).toString()).substr(-2) +
          "." +
          datetime.getFullYear()
        );
      }
      return (
        datetime.getHours() +
        ":" +
        ("0" + datetime.getMinutes().toString()).substr(-2)
      );
    },
    /**
     * 返回 2018-01-01 10:00:00 格式时间
     * @param {*} time
     */
    changeTime(time) {
      let newTime = new Date(time);
      let year = newTime.getFullYear();
      let month = newTime.getMonth() + 1;
      if (month < 10) {
        let month = "0" + month;
      }
      let date = newTime.getDate();
      if (date < 10) {
        let date = "0" + date;
      }
      let hour = newTime.getHours();
      if (hour < 10) {
        let hour = "0" + hour;
      }
      let minute = newTime.getMinutes();
      if (minute < 10) {
        let minute = "0" + minute;
      }
      let second = newTime.getSeconds();
      if (second < 10) {
        let second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    /**
     * 左侧开始时间的偏移，返回单位ms
     * @param {*} timestamp
     * @param {*} step
     */
    ms_to_next_step(timestamp) {
      // let index = this.yearLists.findIndex(item => item === timestamp) +1
      // console.log(888888888,timestamp,index)

      return timestamp;
      // let remainder = timestamp % step;
      // return remainder ? step - remainder : 0;
    },
    /**
     * 设置时间，让这个时间点跳到中间红线处
     *  @param {*} time 单位ms
     */
    set_time_to_middle(time) {
      this.clearCanvas();
      this.start_timestamp = time - (this.hours_per_ruler * 60 * 60 * 1000) / 2;
      this.init(this.start_timestamp);
    },
    returnMouseupTime() {
      if (this.returnTime != null) {
        return this.returnTime;
      }
    },
    /**
     * 清除canvas 每次重新绘制需要先清除
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, 1000, 90);
    },
    getTimestamp(time) {
      // 把时间日期转成时间戳
      return new Date(time).getTime() / 1000;
    },
  },
};
</script>

<style scoped></style>
