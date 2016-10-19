var stepIndex = 0
var stepInfo = [
  {
    name: '创建背景',
    src: './step01.js'
  },
  {
    name: '绘制三个点',
    src: './step02.js'
  },
  {
    name: '绘制三角形',
    src: './step03.js'
  },
  {
    name: '绘制正方形',
    src: './step04.js'
  },
  {
    name: '平移三角形',
    src: './step05.js'
  },
  {
    name: '旋转三角形180度',
    src: './step06.js'
  },
  {
    name: '通过矩阵实现图形变换',
    src: './step07.js'
  }
]
function appendStep() {
  var st = document.createElement('script')
  st.src = stepInfo[stepIndex].src
  var s = document.getElementsByTagName('body')[0]
  s.appendChild(st)
}
function nextStep(){
  document.getElementById('name').innerHTML = stepInfo[stepIndex].name
  appendStep()
  stepIndex ++;
}

document.getElementById('nextStep').addEventListener('click',nextStep)
