var stepIndex = 0
var stepInfo = [
  {
    name: '创建背景',
    src: './step01.js'
  },
  {
    name: '绘制一个点',
    src: './step02.js'
  },
  {
    name: '在JS中绘制一个点',
    src: './step03.js'
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
