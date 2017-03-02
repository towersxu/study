const run = require('./run.js').run

function ajax0() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0)
    }, 3000)
  })
}

function ajax1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 3000)
  })
}
function ajax2(r) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2 + r)
    }, 3000)
  })
}
function *foo() {
  var r1 = yield ajax1()
  var r2 = yield ajax2(r1)
  return r2
}
function *bar() {
  var r0 = yield ajax0()
  var r3 = yield *foo()
  console.log(r3)
}
run(bar)
