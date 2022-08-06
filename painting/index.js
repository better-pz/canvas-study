// document.body.ontouchstart =function(xxx){
//   xxx.preventDefault()
// } //固定屏幕

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let lineWidth = 8


autoSetCanvasSize(canvas)
listenToMouse(canvas)

let eraserEnable = false    //橡皮擦画笔切换
eraser.onclick = function () {
  eraserEnable = true
  eraser.classList.add('active')
  brush.classList.remove('active')
}
brush.onclick = function () {
  eraserEnable = false
  brush.classList.add('active')
  eraser.classList.remove('active')
}

black.onclick = function () {
  ctx.fillStyle = 'black'
  ctx.strokeStyle = 'black'
  black.classList.add('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
red.onclick = function () {
  ctx.fillStyle = 'red'
  ctx.strokeStyle = 'red'
  black.classList.remove('active')
  red.classList.add('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
yellow.onclick = function () {
  ctx.fillStyle = 'yellow'
  ctx.strokeStyle = 'yellow'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
green.onclick = function () {
  ctx.fillStyle = 'green'
  ctx.strokeStyle = 'green'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.add('active')
  blue.classList.remove('active')
}
blue.onclick = function () {
  ctx.fillStyle = 'blue'
  ctx.strokeStyle = 'blue'
  black.classList.remove('active')
  red.classList.remove('active')
  yellow.classList.remove('active')
  green.classList.remove('active')
  blue.classList.add('active')
}
clear.onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

big.onclick = function () {
  lineWidth = 8
  big.classList.add('active')
  middle.classList.remove('active')
  small.classList.remove('active')
}
middle.onclick = function () {
  lineWidth = 5
  big.classList.remove('active')
  middle.classList.add('active')
  small.classList.remove('active')
}
small.onclick = function () {
  lineWidth = 2
  big.classList.remove('active')
  middle.classList.remove('active')
  small.classList.add('active')
}

download.onclick = function () {
  let url = canvas.toDataURL("image/png")
  console.log(url)
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'canvas画板.png'
  a.target = '_blank'
  a.click()
}

function listenToMouse(canvas) {
  let usingMouse = false  //鼠标触发时间默认设置false
  let lastPoint = {'x': undefined, 'y': undefined} //鼠标最后点击的点坐标初始化

  if (document.body.ontouchstart !== undefined) {  //判断设备是否支持touch事件

    canvas.ontouchstart = function (a) { //touch开始
      console.log(a)
      let x = a.touches[0].clientX
      let y = a.touches[0].clientY
      usingMouse = true
      if (eraserEnable) {
        ctx.clearRect(x - 25, y - 25, 50, 50);
      } else {
        lastPoint = {'x': x, 'y': y}
      }
    }
    canvas.ontouchmove = function (a) {  //touch移动
      let x = a.touches[0].clientX
      let y = a.touches[0].clientY
      if(!usingMouse) return
      if (eraserEnable) {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        let newPoint = {'x': x, 'y': y}
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function () {  //touch结束
      usingMouse = false
    }
  } else {                                 //如果不支持touch事件，则执行鼠标事件
    canvas.onmousedown = function (a) { //鼠标按下事件
      let x = a.clientX
      let y = a.clientY
      usingMouse = true
      if (eraserEnable) {
        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        lastPoint = {'x': x, 'y': y}
         drawPoint(x,y,1)
      }
    }
    canvas.onmousemove = function (a) {  //鼠标移动事件
      let x = a.clientX
      let y = a.clientY
      if (!usingMouse) return
      if (eraserEnable) {

        ctx.clearRect(x - 10, y - 10, 20, 20);
      } else {
        let newPoint = {'x': x, 'y': y}
        // drawPoint(x,y,1)
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.onmouseup = function () {  //鼠标松开事件
      usingMouse = false
    }
  }
}

function drawPoint(x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineCap = "round";
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineWidth = lineWidth
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
  ctx.lineCap = "round";
}

function autoSetCanvasSize(canvas) { //全屏函数
  resize()
  window.onresize = function () {
    resize()
  }

  function resize() {
    let

      pageWidth = document.documentElement.clientWidth
    let

      pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}