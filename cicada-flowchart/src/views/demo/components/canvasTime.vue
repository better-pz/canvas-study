<template>
  <div>
     <canvas id="timeline" width="1000" height="90"
            style="cursor: pointer;border:1px solid #EBEEF5;background-color: #fafafa;"
            ondragstart="return false;"></canvas>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    created(){
      this.inint()
    },
    methods: {
      init(start_timestamp, timecell) {
  this.drawCellBg();
  this.add_graduations(start_timestamp); // 初始时间轴 刻度
  this.add_cells(timecell);
 this. drawLine(0, canVansH, canvansW, canVansH, "transparent", 1); // 时间轴border-bottom底线
  this.drawLine(canvansW / 2, 0, canvansW / 2, moveLineH, axisColor, 2); //中间播放点时间线
  this.add_events();
  var time = start_timestamp + (hours_per_ruler * 3600 * 1000) / 2;
  ctx.fillStyle = axisColor;
  ctx.fillText(this.changeTime(time), canvansW / 2 - 50, moveTextH);
},
add_graduations(start_timestamp) {
  var px_per_min = canvansW / (hours_per_ruler * 60); // px/min
  var px_per_ms = canvansW / (hours_per_ruler * 60 * 60 * 1000); // px/ms
  var px_per_step = graduation_step; // px/格 默认最小值20px
  var min_per_step = px_per_step / px_per_min; // min/格
  for (var i = 0; i < minutes_per_step.length; i++) {
    if (min_per_step <= minutes_per_step[i]) {
      //让每格时间在minutes_per_step规定的范围内
      min_per_step = minutes_per_step[i];
      px_per_step = px_per_min * min_per_step;
      break;
    }
  }

  var medium_step = 30;
  for (var i = 0; i < minutes_per_step.length; i++) {
    if (distance_between_gtitle / px_per_min <= minutes_per_step[i]) {
      medium_step = minutes_per_step[i];
      break;
    }
  }

  var num_steps = canvansW / px_per_step; //总格数
  var graduation_left;
  var graduation_time;
  var caret_class;
  var lineH; // 刻度线高度
  var ms_offset = this.ms_to_next_step(start_timestamp, min_per_step * 60 * 1000); //开始的偏移时间 ms
  var px_offset = ms_offset * px_per_ms; //开始的偏移距离 px
  var ms_per_step = px_per_step / px_per_ms; // ms/step
  for (var i = 0; i < num_steps; i++) {
    graduation_left = px_offset + i * px_per_step; // 距离=开始的偏移距离+格数*px/格
    graduation_time = start_timestamp + ms_offset + i * ms_per_step; //时间=左侧开始时间+偏移时间+格数*ms/格
    var date = new Date(graduation_time);
    if (date.getHours() == 0 && date.getMinutes() == 0) {//判断零点
      caret_class = "big";
      lineH = 35;
      var big_date = "00:00";
      ctx.fillStyle = fontColor; //  0点 特殊 字体样式
      ctx.fillText(big_date, graduation_left, 50);
    } else if ((graduation_time / (60 * 1000)) % medium_step == 0) {
      caret_class = "middle";
      lineH = 25;
      var middle_date = this.graduation_title(date);
      ctx.fillText(middle_date, graduation_left - 10, 50);
    } else {
      lineH = 15;
    }
    ctx.fillStyle = fontColor; // 除了0点 以外字体的颜色
    this.drawLine(
      graduation_left,
      0,
      graduation_left,
      lineH,
      scaleLineCorols, // 刻度线颜色
      1
    );
  }
},
drawLine(beginX, beginY, endX, endY, color, width) {
  ctx.beginPath();
  ctx.moveTo(beginX, beginY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
},
draw_cell(cell) {
  var px_per_ms = canvansW / (hours_per_ruler * 60 * 60 * 1000); // px/ms
  var beginX = (cell.beginTime - start_timestamp) * px_per_ms;
  var cell_width = (cell.beginTime - cell.endTime) * px_per_ms;
  ctx.fillStyle = cell.style.background;
  ctx.fillRect(beginX, 0, cell_width, scaleH);
},
drawCellBg() {
  ctx.fillStyle = canvasColors[0]; // 刻度背景颜色
  ctx.fillRect(0, 0, canvansW, scaleH);
},
add_events() {
  canvas.addEventListener("mousewheel", mousewheelFunc); // 鼠标滚动放大缩小
  canvas.addEventListener("mousedown", mousedownFunc); // 拖动时间轴事件
  canvas.addEventListener("mousemove", mousemoveFunc);
  canvas.addEventListener("mouseup", mouseupFunc);
  canvas.addEventListener("mouseout", mouseoutFunc);
},
mousedownFunc(e) {
  g_isMousedown = true;
  g_mousedownCursor = get_cursor_x_position(e); //记住mousedown的位置
},
mousemoveFunc(e) {
  var pos_x = get_cursor_x_position(e);
  var px_per_ms = canvansW / (hours_per_ruler * 60 * 60 * 1000); // px/ms
  clearCanvas();
  if (g_isMousedown) {
    var diff_x = pos_x - g_mousedownCursor;
    start_timestamp = start_timestamp - Math.round(diff_x / px_per_ms);
    init(start_timestamp, timecell);
    g_isMousemove = true;
    g_mousedownCursor = pos_x;
  } else {
    var time = start_timestamp + pos_x / px_per_ms;
    init(start_timestamp, timecell);
    drawLine(pos_x, 0, pos_x, moveLineH + 10, moveLineColor, 1); // 鼠标移动的线
    ctx.fillStyle = moveLineColor; // 鼠标移动时候的文字
    // console.log(changeTime(time))
    ctx.fillText(changeTime(time), pos_x - 50, moveTextH + 10);
  }
},
mouseupFunc(e) {
  if (g_isMousemove) {
    //拖动 事件
    g_isMousemove = false;
    g_isMousedown = false;
    returnTime = start_timestamp + (hours_per_ruler * 3600 * 1000) / 2;
  } else {
    // click 事件
    g_isMousedown = false;
    var posx = get_cursor_x_position(e); //鼠标距离 px
    var ms_per_px = (zoom * 3600 * 1000) / canvansW; // ms/px
    returnTime = start_timestamp + posx * ms_per_px;
    set_time_to_middle(returnTime);
  }
},
mouseoutFunc(e) {
  clearCanvas();
  init(start_timestamp, timecell);
},
mousewheelFunc() {
  if (event && event.preventDefault) {
    event.preventDefault();
  } else {
    window.event.returnValue = false;
    return false;
  }

  var e = window.event || event;
  var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
  var middle_time = start_timestamp + (hours_per_ruler * 3600 * 1000) / 2; //ms 记住当前中间的时间
  if (delta < 0) {
    zoom = zoom + 4;
    if (zoom >= 24) {
      zoom = 24; //放大最大24小时
    }
    hours_per_ruler = zoom;
  } else if (delta > 0) {
    // 放大
    zoom = zoom - 4;
    if (zoom <= 1) {
      zoom = 1; //缩小最小1小时
    }
    hours_per_ruler = zoom;
  }

  clearCanvas();
  start_timestamp = middle_time - (hours_per_ruler * 3600 * 1000) / 2; //start_timestamp = 当前中间的时间 - zoom/2
  init(start_timestamp, timecell);
},
get_cursor_x_position(e) {
    var posx = 0;

    if (!e) {
        e = window.event;
    }
    if (e.offsetX || e.offsetY) {//相对于事件的XY轴
        posx = e.offsetX
    }
    // if (e.pageX || e.pageY) {//相对于浏览器滚动区域
    //     posx = e.pageX;
    // } else if (e.clientX || e.clientY) {//相对于浏览器不滚动屏幕
    //     posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    // }
    return posx;
},
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
changeTime(time) {
  var newTime = new Date(time);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1;
  if (month < 10) {
    var month = "0" + month;
  }
  var date = newTime.getDate();
  if (date < 10) {
    var date = "0" + date;
  }
  var hour = newTime.getHours();
  if (hour < 10) {
    var hour = "0" + hour;
  }
  var minute = newTime.getMinutes();
  if (minute < 10) {
    var minute = "0" + minute;
  }
  var second = newTime.getSeconds();
  if (second < 10) {
    var second = "0" + second;
  }
  return (
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  );
},
ms_to_next_step(timestamp, step) {
  var remainder = timestamp % step;
  return remainder ? step - remainder : 0;
},
set_time_to_middle(time) {
  this.clearCanvas();
  start_timestamp = time - (hours_per_ruler * 60 * 60 * 1000) / 2;
  this.init(start_timestamp, timecell);
},
returnMouseupTime() {
  if (returnTime != null) {
    return returnTime;
  }
},
clearCanvas() {
  ctx.clearRect(0, 0, 1000, 90);
},
getTimestamp(time) {
  // 把时间日期转成时间戳
  return new Date(time).getTime() / 1000;
}


    },
  }
</script>

<style scoped>

</style>